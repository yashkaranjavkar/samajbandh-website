import { randomBytes } from 'crypto';
import {
  db,
  type NewsletterSubscriberRecord,
  type NewsletterCampaignRecord,
  type NewsletterCampaignStatus,
  type NewsletterAttachment,
} from './database.js';
import { pgPool } from './postgres.js';

// --------------------------------------------------
// Schema
// --------------------------------------------------

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!pgPool) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      await pgPool!.query(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          unsubscribe_token TEXT NOT NULL,
          subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          unsubscribed_at TIMESTAMPTZ
        )
      `);
      await pgPool!.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS uq_newsletter_subscribers_email
        ON newsletter_subscribers (LOWER(email))
      `);
      await pgPool!.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS uq_newsletter_subscribers_token
        ON newsletter_subscribers (unsubscribe_token)
      `);
      await pgPool!.query(`
        CREATE TABLE IF NOT EXISTS newsletter_campaigns (
          id TEXT PRIMARY KEY,
          subject TEXT NOT NULL,
          content TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          scheduled_at TIMESTAMPTZ,
          recipient_count INTEGER NOT NULL DEFAULT 0,
          sent_count INTEGER NOT NULL DEFAULT 0,
          failed_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          sent_at TIMESTAMPTZ
        )
      `);

      await pgPool!.query(`
        ALTER TABLE newsletter_campaigns
        ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb
      `);

      // One-time backfill: subscribers that so far only lived in the JSON store.
      for (const sub of db.getNewsletterSubscribers()) {
        await pgPool!.query(
          `INSERT INTO newsletter_subscribers (id,email,status,unsubscribe_token,subscribed_at,unsubscribed_at)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT DO NOTHING`,
          [sub.id, sub.email.toLowerCase(), sub.status, sub.unsubscribeToken, sub.subscribedAt, sub.unsubscribedAt || null]
        );
      }
    })().catch(err => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

const iso = (v: any): string => (v instanceof Date ? v.toISOString() : new Date(v).toISOString());
const isoOrNull = (v: any): string | null => (v ? iso(v) : null);

function mapSubscriber(row: any): NewsletterSubscriberRecord {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    unsubscribeToken: row.unsubscribe_token,
    subscribedAt: iso(row.subscribed_at),
    unsubscribedAt: isoOrNull(row.unsubscribed_at),
  };
}

function mapCampaign(row: any): NewsletterCampaignRecord {
  return {
    id: row.id,
    subject: row.subject,
    content: row.content,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    status: row.status,
    scheduledAt: isoOrNull(row.scheduled_at),
    recipientCount: Number(row.recipient_count),
    sentCount: Number(row.sent_count),
    failedCount: Number(row.failed_count),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    sentAt: isoOrNull(row.sent_at),
  };
}

// --------------------------------------------------
// Subscribers
// --------------------------------------------------

export async function subscribeEmail(email: string): Promise<{ created: boolean }> {
  const normalized = email.trim().toLowerCase();

  if (!pgPool) {
    return { created: db.addNewsletter(normalized).changed };
  }

  await ensureSchema();
  const token = randomBytes(24).toString('hex');
  const { rows } = await pgPool.query(
    `INSERT INTO newsletter_subscribers (id,email,status,unsubscribe_token,subscribed_at)
     VALUES ($1,$2,'active',$3,NOW())
     ON CONFLICT (LOWER(email)) DO UPDATE
       SET status = 'active', unsubscribed_at = NULL
       WHERE newsletter_subscribers.status <> 'active'
     RETURNING *`,
    [`nl-${Date.now()}-${randomBytes(3).toString('hex')}`, normalized, token]
  );

  // RETURNING is empty when the address was already active.
  const created = rows.length > 0;
  const stored = rows[0]
    ? mapSubscriber(rows[0])
    : mapSubscriber((await pgPool.query('SELECT * FROM newsletter_subscribers WHERE LOWER(email) = $1', [normalized])).rows[0]);

  // Mirror to the JSON store so both copies stay aligned.
  db.upsertNewsletterSubscriber(stored);
  return { created };
}

export async function listSubscribers(): Promise<NewsletterSubscriberRecord[]> {
  if (!pgPool) return db.getNewsletterSubscribers();
  await ensureSchema();
  const { rows } = await pgPool.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
  return rows.map(mapSubscriber);
}

export async function listActiveSubscribers(): Promise<NewsletterSubscriberRecord[]> {
  return (await listSubscribers()).filter(s => s.status === 'active');
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  if (!token || token.length > 128) return false;
  if (!pgPool) return db.unsubscribeNewsletter(token);

  await ensureSchema();
  const { rowCount } = await pgPool.query(
    `UPDATE newsletter_subscribers
     SET status = 'unsubscribed', unsubscribed_at = COALESCE(unsubscribed_at, NOW())
     WHERE unsubscribe_token = $1`,
    [token]
  );
  db.unsubscribeNewsletter(token);
  return (rowCount ?? 0) > 0;
}

// --------------------------------------------------
// Campaigns
// --------------------------------------------------

export async function listCampaigns(): Promise<NewsletterCampaignRecord[]> {
  if (!pgPool) return db.getNewsletterCampaigns().map(c => ({ ...c, attachments: c.attachments ?? [] }));
  await ensureSchema();
  const { rows } = await pgPool.query('SELECT * FROM newsletter_campaigns ORDER BY created_at DESC');
  return rows.map(mapCampaign);
}

export async function getCampaign(id: string): Promise<NewsletterCampaignRecord | null> {
  if (!pgPool) return db.getNewsletterCampaigns().find(c => c.id === id) || null;
  await ensureSchema();
  const { rows } = await pgPool.query('SELECT * FROM newsletter_campaigns WHERE id = $1', [id]);
  return rows[0] ? mapCampaign(rows[0]) : null;
}

/** Creates a campaign, or updates an existing draft/scheduled one when `id` is given. */
export async function saveCampaign(input: {
  id?: string;
  subject: string;
  content: string;
  attachments?: NewsletterAttachment[];
  status: Extract<NewsletterCampaignStatus, 'draft' | 'scheduled'>;
  scheduledAt: string | null;
}): Promise<NewsletterCampaignRecord | null> {
  const now = new Date().toISOString();

  if (input.id) {
    const existing = await getCampaign(input.id);
    if (!existing || !['draft', 'scheduled'].includes(existing.status)) return null;
    const updated: NewsletterCampaignRecord = {
      ...existing,
      subject: input.subject,
      content: input.content,
      attachments: input.attachments ?? [],
      status: input.status,
      scheduledAt: input.scheduledAt,
      updatedAt: now,
    };
    await writeCampaign(updated);
    return updated;
  }

  const record: NewsletterCampaignRecord = {
    id: `cmp-${Date.now()}-${randomBytes(3).toString('hex')}`,
    subject: input.subject,
    content: input.content,
    attachments: input.attachments ?? [],
    status: input.status,
    scheduledAt: input.scheduledAt,
    recipientCount: 0,
    sentCount: 0,
    failedCount: 0,
    createdAt: now,
    updatedAt: now,
    sentAt: null,
  };
  await writeCampaign(record);
  return record;
}

async function writeCampaign(c: NewsletterCampaignRecord): Promise<void> {
  if (!pgPool) {
    db.saveNewsletterCampaign(c);
    return;
  }
  await ensureSchema();
  await pgPool.query(
    `INSERT INTO newsletter_campaigns
       (id,subject,content,attachments,status,scheduled_at,recipient_count,sent_count,failed_count,created_at,updated_at,sent_at)
     VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (id) DO UPDATE SET
       subject=EXCLUDED.subject, content=EXCLUDED.content, attachments=EXCLUDED.attachments, status=EXCLUDED.status,
       scheduled_at=EXCLUDED.scheduled_at, recipient_count=EXCLUDED.recipient_count,
       sent_count=EXCLUDED.sent_count, failed_count=EXCLUDED.failed_count,
       updated_at=EXCLUDED.updated_at, sent_at=EXCLUDED.sent_at`,
    [c.id, c.subject, c.content, JSON.stringify(c.attachments || []), c.status, c.scheduledAt, c.recipientCount, c.sentCount,
     c.failedCount, c.createdAt, c.updatedAt, c.sentAt || null]
  );
}

/**
 * Atomically moves a draft/scheduled campaign to 'processing'.
 * Returns null if someone else already claimed it, which prevents double sends.
 */
export async function claimCampaign(id: string): Promise<NewsletterCampaignRecord | null> {
  if (!pgPool) {
    const c = db.getNewsletterCampaigns().find(x => x.id === id);
    if (!c || !['draft', 'scheduled'].includes(c.status)) return null;
    const claimed = { ...c, status: 'processing' as const, updatedAt: new Date().toISOString() };
    db.saveNewsletterCampaign(claimed);
    return claimed;
  }
  await ensureSchema();
  const { rows } = await pgPool.query(
    `UPDATE newsletter_campaigns SET status='processing', updated_at=NOW()
     WHERE id=$1 AND status IN ('draft','scheduled') RETURNING *`,
    [id]
  );
  return rows[0] ? mapCampaign(rows[0]) : null;
}

export async function listDueScheduledCampaignIds(): Promise<string[]> {
  const now = Date.now();
  if (!pgPool) {
    return db.getNewsletterCampaigns()
      .filter(c => c.status === 'scheduled' && c.scheduledAt && new Date(c.scheduledAt).getTime() <= now)
      .map(c => c.id);
  }
  await ensureSchema();
  const { rows } = await pgPool.query(
    `SELECT id FROM newsletter_campaigns WHERE status='scheduled' AND scheduled_at <= NOW() ORDER BY scheduled_at`
  );
  return rows.map(r => r.id);
}

export async function updateCampaignProgress(
  id: string,
  patch: Partial<Pick<NewsletterCampaignRecord, 'status' | 'recipientCount' | 'sentCount' | 'failedCount' | 'sentAt'>>
): Promise<void> {
  const current = await getCampaign(id);
  if (!current) return;
  await writeCampaign({ ...current, ...patch, updatedAt: new Date().toISOString() });
}

export async function cancelCampaign(id: string): Promise<NewsletterCampaignRecord | null> {
  const current = await getCampaign(id);
  if (!current || !['draft', 'scheduled'].includes(current.status)) return null;
  const cancelled: NewsletterCampaignRecord = { ...current, status: 'cancelled', updatedAt: new Date().toISOString() };
  await writeCampaign(cancelled);
  return cancelled;
}

/** Any campaign left in 'processing' after a crash/restart is flagged so it is not silently stuck. */
export async function recoverInterruptedCampaigns(): Promise<void> {
  const stuck = (await listCampaigns()).filter(c => c.status === 'processing');
  for (const c of stuck) {
    await updateCampaignProgress(c.id, {
      status: c.sentCount > 0 ? 'partially_sent' : 'failed',
    });
  }
}
