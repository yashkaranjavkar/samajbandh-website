import { Pool } from 'pg';
import type { VolunteerRecord, BulkOrderRecord } from './database.js';

const connectionString = process.env.DATABASE_URL;
export const pgPool = connectionString ? new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 5,
  idleTimeoutMillis: 30000,
}) : null;

export async function persistVolunteerToPostgres(record: VolunteerRecord): Promise<boolean> {
  if (!pgPool) {
    console.warn('[PostgreSQL] DATABASE_URL is not configured; record remains in the local JSON store only.');
    return false;
  }
  await pgPool.query(`CREATE TABLE IF NOT EXISTS volunteer_applications (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    city TEXT NOT NULL, college_or_org TEXT, role_type TEXT NOT NULL, duration TEXT NOT NULL,
    start_date DATE, end_date DATE, mode TEXT, commitment_hours TEXT, domains JSONB NOT NULL DEFAULT '[]'::jsonb,
    message TEXT, status TEXT NOT NULL DEFAULT 'pending', admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL
  )`);
  await pgPool.query(`INSERT INTO volunteer_applications
    (id,name,email,phone,city,college_or_org,role_type,duration,start_date,end_date,mode,commitment_hours,domains,message,status,admin_notes,created_at,updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18)
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,phone=EXCLUDED.phone,city=EXCLUDED.city,
    college_or_org=EXCLUDED.college_or_org,role_type=EXCLUDED.role_type,duration=EXCLUDED.duration,
    start_date=EXCLUDED.start_date,end_date=EXCLUDED.end_date,mode=EXCLUDED.mode,commitment_hours=EXCLUDED.commitment_hours,
    domains=EXCLUDED.domains,message=EXCLUDED.message,status=EXCLUDED.status,admin_notes=EXCLUDED.admin_notes,updated_at=EXCLUDED.updated_at`,
    [record.id,record.name,record.email,record.phone,record.city,record.collegeOrOrg || null,record.roleType,record.duration,
     record.startDate || null,record.endDate || null,record.mode || null,record.commitmentHours || null,JSON.stringify(record.domains || []),
     record.message || null,record.status,record.adminNotes || null,record.createdAt,record.updatedAt]);
  return true;
}

export async function persistBulkOrdersToPostgres(
  record: BulkOrderRecord
): Promise<boolean> {

  if (!pgPool) {
    console.warn(
      '[PostgreSQL] DATABASE_URL is not configured; record remains in the local JSON store only.'
    );
    return false;
  }

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS bulk_order_inquiries (
      id TEXT PRIMARY KEY,
      organization_name VARCHAR(255) NOT NULL,
      contact_person VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      item_type VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      notes TEXT NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pgPool.query(
    `INSERT INTO bulk_order_inquiries (
      id,
      organization_name,
      contact_person,
      designation,
      email,
      phone,
      item_type,
      quantity,
      notes,
      status,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    )
    ON CONFLICT (id) DO UPDATE SET
      organization_name = EXCLUDED.organization_name,
      contact_person = EXCLUDED.contact_person,
      designation = EXCLUDED.designation,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      quantity = EXCLUDED.quantity,
      notes = EXCLUDED.notes,
      status = EXCLUDED.status,
      updated_at = EXCLUDED.updated_at`,
    [
      record.id,
      record.organization,
      record.name,
      record.role,
      record.email,
      record.phone,
      record.product,
      record.quantity,
      record.notes,
      record.status || 'pending',
      record.createdAt || new Date(),
      record.updatedAt || new Date(),
    ]
  );

  return true;
}