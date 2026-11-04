import nodemailer from 'nodemailer';
import type { NewsletterCampaignRecord, NewsletterSubscriberRecord } from './db/database.js';
import { loadAttachmentContents, UploadError } from './uploads.js';
import {
  claimCampaign,
  getCampaign,
  listActiveSubscribers,
  listDueScheduledCampaignIds,
  recoverInterruptedCampaigns,
  updateCampaignProgress,
} from './db/newsletter.js';

// --------------------------------------------------
// Configuration
// --------------------------------------------------

export function isMailConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  return process.env.MAIL_ENABLED === 'true' && Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && MAIL_FROM);
}

function baseUrl(): string {
  return (process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, '');
}

export function unsubscribeUrl(token: string): string {
  return `${baseUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

// --------------------------------------------------
// Rendering (admin text is escaped - never injected as raw HTML)
// --------------------------------------------------

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function contentToHtml(content: string): string {
  return content
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map(paragraph => `<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(paragraph).replace(/\r?\n/g, '<br>')}</p>`)
    .join('');
}

export function renderNewsletter(campaign: Pick<NewsletterCampaignRecord, 'subject' | 'content'>, unsubscribeLink: string) {
  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#FBF9F5;font-family:Arial,Helvetica,sans-serif;color:#1F2421;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #E5DFC5;border-radius:12px;overflow:hidden;">
    <div style="background:#143D2B;color:#ffffff;padding:20px 28px;font-size:20px;font-weight:bold;">Samajbandh</div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 20px;font-size:22px;color:#143D2B;">${escapeHtml(campaign.subject)}</h1>
      ${contentToHtml(campaign.content)}
    </div>
    <div style="padding:16px 28px;background:#FBF9F5;border-top:1px solid #E5DFC5;font-size:12px;color:#5C6760;">
      You are receiving this because you subscribed to Samajbandh updates.
      <a href="${escapeHtml(unsubscribeLink)}" style="color:#143D2B;">Unsubscribe</a>
    </div>
  </div>
</body></html>`;

  const text = `${campaign.content.trim()}\n\n--\nYou are receiving this because you subscribed to Samajbandh updates.\nUnsubscribe: ${unsubscribeLink}`;
  return { html, text };
}

// --------------------------------------------------
// Sending
// --------------------------------------------------

const CONCURRENCY = Math.max(1, Number(process.env.NEWSLETTER_CONCURRENCY) || 5);
const runningCampaigns = new Set<string>();

/**
 * Sends a claimed campaign to every active subscriber over one pooled SMTP connection.
 * Each recipient gets their own message, so addresses are never exposed to each other and every
 * email carries a personal unsubscribe link.
 */
async function deliver(
  campaign: NewsletterCampaignRecord,
  recipients: NewsletterSubscriberRecord[],
  attachments: ReturnType<typeof loadAttachmentContents>
): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  const port = Number(SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: CONCURRENCY,
    maxMessages: 100,
  });

  let sent = 0;
  let failed = 0;

  try {
    for (let i = 0; i < recipients.length; i += CONCURRENCY) {
      const batch = recipients.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(recipient => {
          const link = unsubscribeUrl(recipient.unsubscribeToken);
          const { html, text } = renderNewsletter(campaign, link);
          return transporter.sendMail({
            from: MAIL_FROM,
            to: recipient.email,
            subject: campaign.subject,
            text,
            html,
            attachments,
            headers: {
              'List-Unsubscribe': `<${link}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          });
        })
      );

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') sent++;
        else {
          failed++;
          console.error(`[Newsletter] Failed for ${batch[idx].email}:`, result.reason?.message || result.reason);
        }
      });

      // Persist progress after each batch so the admin sees live counts.
      await updateCampaignProgress(campaign.id, { sentCount: sent, failedCount: failed });
    }
  } finally {
    transporter.close();
  }

  await updateCampaignProgress(campaign.id, {
    status: failed === 0 ? 'sent' : sent === 0 ? 'failed' : 'partially_sent',
    sentCount: sent,
    failedCount: failed,
    sentAt: new Date().toISOString(),
  });
}

export type StartResult =
  | { ok: true; campaign: NewsletterCampaignRecord; recipients: number }
  | { ok: false; reason: 'mail_not_configured' | 'no_subscribers' | 'already_claimed' | 'attachment_missing'; detail?: string };

/**
 * Claims the campaign and starts delivery in the background.
 * Returns immediately so the admin request does not hang for the whole send.
 */
export async function startCampaign(campaignId: string): Promise<StartResult> {
  if (!isMailConfigured()) return { ok: false, reason: 'mail_not_configured' };

  const recipients = await listActiveSubscribers();
  if (recipients.length === 0) return { ok: false, reason: 'no_subscribers' };

  if (runningCampaigns.has(campaignId)) return { ok: false, reason: 'already_claimed' };

  // Read attachments before claiming, so a missing file cannot leave a campaign stuck in 'processing'.
  const existing = await getCampaign(campaignId);
  if (!existing) return { ok: false, reason: 'already_claimed' };
  let attachments: ReturnType<typeof loadAttachmentContents>;
  try {
    attachments = loadAttachmentContents(existing.attachments ?? []);
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, reason: 'attachment_missing', detail: err.message };
    throw err;
  }

  const claimed = await claimCampaign(campaignId);
  if (!claimed) return { ok: false, reason: 'already_claimed' };

  runningCampaigns.add(campaignId);
  await updateCampaignProgress(campaignId, { recipientCount: recipients.length, sentCount: 0, failedCount: 0 });

  void deliver(claimed, recipients, attachments)
    .catch(async err => {
      console.error('[Newsletter] Delivery crashed:', err);
      await updateCampaignProgress(campaignId, { status: 'failed' }).catch(() => undefined);
    })
    .finally(() => runningCampaigns.delete(campaignId));

  return { ok: true, campaign: { ...claimed, recipientCount: recipients.length }, recipients: recipients.length };
}

// --------------------------------------------------
// Scheduler (sends campaigns whose scheduled time has arrived)
// --------------------------------------------------

let schedulerTimer: NodeJS.Timeout | null = null;

async function processDueCampaigns(): Promise<void> {
  if (!isMailConfigured()) return; // leave them scheduled until SMTP is available
  try {
    for (const id of await listDueScheduledCampaignIds()) {
      const result = await startCampaign(id);
      if (result.ok) console.log(`[Newsletter] Scheduled campaign ${id} started for ${result.recipients} subscribers.`);
    }
  } catch (err) {
    console.error('[Newsletter] Scheduler error:', err);
  }
}

export async function startNewsletterScheduler(): Promise<void> {
  if (schedulerTimer) return;
  try {
    await recoverInterruptedCampaigns();
  } catch (err) {
    console.error('[Newsletter] Could not recover interrupted campaigns:', err);
  }
  void processDueCampaigns(); // catch anything that came due while the server was down
  schedulerTimer = setInterval(() => void processDueCampaigns(), 60_000);
  schedulerTimer.unref();
}
