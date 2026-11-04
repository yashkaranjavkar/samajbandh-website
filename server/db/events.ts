import { randomBytes } from 'crypto';
import { db, type EventRecord, type EventType } from './database.js';
import { ensureEventRegistrationTable, pgPool } from './postgres.js';
import { EVENTS_DATA } from '../../src/data/mockData.js';

export const EVENT_TYPES: EventType[] = [
  'Workshop',
  'Fellowship Camp',
  'Webinar',
  'Awareness Drive',
  'Fundraiser',
];

const DEFAULT_EVENT_IMAGE = '/images/fellowship/menstrual-health-awareness.jpg';

// --------------------------------------------------
// Validation
// --------------------------------------------------

export interface EventInput {
  title?: unknown;
  type?: unknown;
  eventDate?: unknown;
  time?: unknown;
  location?: unknown;
  isVirtual?: unknown;
  registrationOpen?: unknown;
  totalSeats?: unknown;
  eligibility?: unknown;
  description?: unknown;
  image?: unknown;
}

type EventFields = Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt'>;

const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * Validates an admin payload. For creates every required field must be present;
 * for updates (`partial`) only the fields that were sent are checked.
 */
export function validateEventInput(
  input: EventInput,
  partial = false
): { errors: string[]; value: Partial<EventFields> } {
  const errors: string[] = [];
  const value: Partial<EventFields> = {};
  const has = (key: keyof EventInput) => !partial || input[key] !== undefined;

  if (has('title')) {
    const title = str(input.title);
    if (title.length < 3) errors.push('Title is required (min 3 characters).');
    else if (title.length > 200) errors.push('Title must be 200 characters or fewer.');
    else value.title = title;
  }

  if (has('type')) {
    const type = str(input.type) as EventType;
    if (!EVENT_TYPES.includes(type)) errors.push(`Type must be one of: ${EVENT_TYPES.join(', ')}.`);
    else value.type = type;
  }

  if (has('eventDate')) {
    const eventDate = str(input.eventDate);
    if (!isValidIsoDate(eventDate)) errors.push('A valid event date is required.');
    else {
      value.eventDate = eventDate;
      value.date = formatEventDate(eventDate);
    }
  }

  if (has('time')) {
    const time = str(input.time);
    if (!time) errors.push('Event time is required (e.g. 10:00 AM – 4:00 PM IST).');
    else if (time.length > 100) errors.push('Time must be 100 characters or fewer.');
    else value.time = time;
  }

  if (has('location')) {
    const location = str(input.location);
    if (!location) errors.push('Location is required.');
    else if (location.length > 200) errors.push('Location must be 200 characters or fewer.');
    else value.location = location;
  }

  if (has('totalSeats')) {
    const seats = Number(input.totalSeats);
    if (!Number.isInteger(seats) || seats < 1 || seats > 100000) {
      errors.push('Total seats must be a whole number between 1 and 100000.');
    } else value.totalSeats = seats;
  }

  if (has('eligibility')) {
    const eligibility = str(input.eligibility);
    if (!eligibility) errors.push('Eligibility is required.');
    else if (eligibility.length > 300) errors.push('Eligibility must be 300 characters or fewer.');
    else value.eligibility = eligibility;
  }

  if (has('description')) {
    const description = str(input.description);
    if (description.length < 10) errors.push('Description is required (min 10 characters).');
    else if (description.length > 3000) errors.push('Description must be 3000 characters or fewer.');
    else value.description = description;
  }

  if (input.isVirtual !== undefined) value.isVirtual = input.isVirtual === true || input.isVirtual === 'true';
  else if (!partial) value.isVirtual = false;

  if (input.registrationOpen !== undefined) {
    value.registrationOpen = input.registrationOpen === true || input.registrationOpen === 'true';
  } else if (!partial) value.registrationOpen = true;

  if (input.image !== undefined || !partial) {
    const image = str(input.image);
    if (!image) value.image = DEFAULT_EVENT_IMAGE;
    else if (!/^(\/(?!\/)|https?:\/\/)/i.test(image)) {
      errors.push('Image must be a site path (/images/...) or an http(s) URL.');
    } else value.image = image;
  }

  return { errors, value };
}

// --------------------------------------------------
// PostgreSQL
// --------------------------------------------------

async function ensureEventsTable(): Promise<void> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      event_date DATE,
      date_label TEXT NOT NULL,
      time_label TEXT NOT NULL,
      location TEXT NOT NULL,
      is_virtual BOOLEAN NOT NULL DEFAULT FALSE,
      registration_open BOOLEAN NOT NULL DEFAULT TRUE,
      total_seats INTEGER NOT NULL CHECK (total_seats > 0),
      eligibility TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function mapEventRow(row: any): EventRecord {
  const toIso = (v: any) => (v instanceof Date ? v.toISOString() : new Date(v).toISOString());
  let eventDate: string | undefined;
  if (row.event_date) {
    const d = row.event_date instanceof Date ? row.event_date : new Date(row.event_date);
    // DATE columns are parsed at local midnight by node-postgres; format from local parts.
    eventDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    date: row.date_label,
    eventDate,
    time: row.time_label,
    location: row.location,
    isVirtual: row.is_virtual,
    registrationOpen: row.registration_open,
    totalSeats: Number(row.total_seats),
    eligibility: row.eligibility,
    description: row.description,
    image: row.image || DEFAULT_EVENT_IMAGE,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

async function upsertEventInPostgres(e: EventRecord): Promise<void> {
  await ensureEventsTable();
  await pgPool!.query(
    `INSERT INTO events
      (id,title,type,event_date,date_label,time_label,location,is_virtual,registration_open,
       total_seats,eligibility,description,image,created_at,updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     ON CONFLICT (id) DO UPDATE SET
       title=EXCLUDED.title, type=EXCLUDED.type, event_date=EXCLUDED.event_date,
       date_label=EXCLUDED.date_label, time_label=EXCLUDED.time_label, location=EXCLUDED.location,
       is_virtual=EXCLUDED.is_virtual, registration_open=EXCLUDED.registration_open,
       total_seats=EXCLUDED.total_seats, eligibility=EXCLUDED.eligibility,
       description=EXCLUDED.description, image=EXCLUDED.image, updated_at=EXCLUDED.updated_at`,
    [
      e.id, e.title, e.type, e.eventDate || null, e.date, e.time, e.location, e.isVirtual,
      e.registrationOpen, e.totalSeats, e.eligibility, e.description, e.image,
      e.createdAt, e.updatedAt,
    ]
  );
}

// --------------------------------------------------
// Seeding (one time) - moves the original hard-coded events into the stores
// --------------------------------------------------

function seedRecords(): EventRecord[] {
  const now = new Date().toISOString();
  return EVENTS_DATA.map((e, index) => {
    // "May 28, 2026 (Menstrual Hygiene Day)" -> "May 28, 2026"
    const parsed = new Date(`${e.date.split('(')[0].trim()} UTC`);
    const eventDate = Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
    return {
      id: e.id,
      title: e.title,
      type: e.type,
      date: e.date,
      eventDate,
      time: e.time,
      location: e.location,
      isVirtual: e.isVirtual,
      registrationOpen: e.registrationOpen,
      totalSeats: e.totalSeats,
      eligibility: e.eligibility,
      description: e.description,
      image: e.image,
      // Keep the original display order stable.
      createdAt: new Date(Date.parse(now) - (EVENTS_DATA.length - index) * 1000).toISOString(),
      updatedAt: now,
    };
  });
}

let seedPromise: Promise<void> | null = null;

export function ensureEventsSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      if (pgPool) {
        // The bundled sample events are copied only when the events table is created for the
        // first time. After that PostgreSQL is authoritative, so a deleted event can never
        // come back (not even if every event was deleted, or the JSON file was reset).
        const { rows } = await pgPool.query("SELECT to_regclass('public.events') AS t");
        const existed = rows[0].t !== null;
        await ensureEventsTable();
        if (!existed) {
          if (!db.isEventsSeeded() && db.getEvents().length === 0) {
            for (const record of seedRecords()) db.upsertEvent(record);
          }
          for (const record of db.getEvents()) await upsertEventInPostgres(record);
        }
        db.markEventsSeeded();
        return;
      }

      if (!db.isEventsSeeded() && db.getEvents().length === 0) {
        for (const record of seedRecords()) db.upsertEvent(record);
      }
      db.markEventsSeeded();
    })().catch(err => {
      seedPromise = null; // retry on next request
      throw err;
    });
  }
  return seedPromise;
}

// --------------------------------------------------
// Public API
// --------------------------------------------------

const sortEvents = (list: EventRecord[]) =>
  [...list].sort((a, b) => {
    if (a.eventDate && b.eventDate && a.eventDate !== b.eventDate) return a.eventDate < b.eventDate ? -1 : 1;
    if (a.eventDate && !b.eventDate) return -1;
    if (!a.eventDate && b.eventDate) return 1;
    return a.createdAt < b.createdAt ? -1 : 1;
  });

export async function listEvents(): Promise<EventRecord[]> {
  await ensureEventsSeeded();
  if (pgPool) {
    const { rows } = await pgPool.query('SELECT * FROM events');
    return sortEvents(rows.map(mapEventRow));
  }
  return sortEvents(db.getEvents());
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const events = await listEvents();
  return events.find(e => e.id === id) || null;
}

export async function createEvent(fields: EventFields): Promise<EventRecord> {
  await ensureEventsSeeded();
  const now = new Date().toISOString();
  const record: EventRecord = {
    ...fields,
    id: `ev-${Date.now()}-${randomBytes(3).toString('hex')}`,
    createdAt: now,
    updatedAt: now,
  };

  // PostgreSQL first (source of truth when configured); the JSON store mirrors it.
  if (pgPool) await upsertEventInPostgres(record);
  db.upsertEvent(record);
  return record;
}

export async function updateEvent(id: string, patch: Partial<EventFields>): Promise<EventRecord | null> {
  const current = await getEventById(id);
  if (!current) return null;
  const updated: EventRecord = { ...current, ...patch, updatedAt: new Date().toISOString() };
  if (pgPool) await upsertEventInPostgres(updated);
  db.upsertEvent(updated);
  return updated;
}

/**
 * Permanently deletes an event and all registrations made for it, from PostgreSQL
 * (in one transaction) and from the JSON store.
 */
export async function deleteEvent(id: string): Promise<{ deleted: boolean; registrationsRemoved: number }> {
  await ensureEventsSeeded();
  let registrationsRemoved = 0;
  let deleted = false;

  if (pgPool) {
    await ensureEventRegistrationTable();
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      const regs = await client.query('DELETE FROM event_registrations WHERE event_id = $1', [id]);
      const ev = await client.query('DELETE FROM events WHERE id = $1', [id]);
      await client.query('COMMIT');
      registrationsRemoved = regs.rowCount ?? 0;
      deleted = (ev.rowCount ?? 0) > 0;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
    db.deleteEvent(id); // keep the JSON mirror in sync
  } else {
    const result = db.deleteEvent(id);
    deleted = result.removed;
    registrationsRemoved = result.registrations;
  }

  return { deleted, registrationsRemoved };
}
