import { Pool } from 'pg';
import type { VolunteerRecord, BulkOrderRecord } from './database.js';

const connectionString = process.env.DATABASE_URL;
export const pgPool = connectionString ? new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 5,
  idleTimeoutMillis: 30000,
}) : null;



async function ensureVolunteerTable(): Promise<void> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');
  await pgPool.query(`CREATE TABLE IF NOT EXISTS volunteer_applications (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    city TEXT NOT NULL, college_or_org TEXT, role_type TEXT NOT NULL, duration TEXT NOT NULL,
    start_date DATE, end_date DATE, mode TEXT, commitment_hours TEXT,
    domains JSONB NOT NULL DEFAULT '[]'::jsonb, message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL
  )`);
}

export async function getVolunteersFromPostgres(
  filter?: {
    roleType?: string;
    status?: string;
    search?: string;
  }
): Promise<VolunteerRecord[]> {
  if (pgPool === null) {
    throw new Error(
      'PostgreSQL is not configured. Use the JSON fallback instead.'
    );
  }

  await ensureVolunteerTable();
  const conditions: string[] = [];
  const values: string[] = [];

  if (filter?.roleType && filter.roleType !== 'all') {
    values.push(filter.roleType);
    conditions.push(`role_type = $${values.length}`);
  }

  if (filter?.status && filter.status !== 'all') {
    values.push(filter.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filter?.search?.trim()) {
    values.push(`%${filter.search.trim()}%`);
    const index = values.length;

    conditions.push(`
      (
        name ILIKE $${index}
        OR email ILIKE $${index}
        OR city ILIKE $${index}
        OR college_or_org ILIKE $${index}
      )
    `);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const result = await pgPool.query(
    `SELECT *
     FROM volunteer_applications
     ${whereClause}
     ORDER BY created_at DESC`,
    values
  );


  return result.rows.map((row) => ({
    ...row,
    roleType: row.role_type,
    collegeOrOrg: row.college_or_org,
    startDate: row.start_date ? new Date(row.start_date).toISOString().slice(0, 10) : undefined,
    endDate: row.end_date ? new Date(row.end_date).toISOString().slice(0, 10) : undefined,
    commitmentHours: row.commitment_hours,
    adminNotes: row.admin_notes,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    domains: Array.isArray(row.domains) ? row.domains : (typeof row.domains === 'string' ? JSON.parse(row.domains) : []),
  })) as VolunteerRecord[];
}

export async function getVolunteerOverviewStatsFromPostgres(): Promise<{
  totalVolunteers: number;
  pendingVolunteers: number;
  activeInterns: number;
}> {
  if (!pgPool) {
    throw new Error('PostgreSQL is not configured.');
  }

  await ensureVolunteerTable();

  const result = await pgPool.query(`
    SELECT
      COUNT(*)::int AS total_volunteers,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_volunteers,
      COUNT(*) FILTER (WHERE role_type = 'intern')::int AS active_interns
    FROM volunteer_applications
  `);

  const row = result.rows[0] || {};

  return {
    totalVolunteers: Number(row.total_volunteers || 0),
    pendingVolunteers: Number(row.pending_volunteers || 0),
    activeInterns: Number(row.active_interns || 0),
  };
}

export async function updateVolunteerInPostgres(
  id: string,
  updates: Partial<VolunteerRecord>
): Promise<VolunteerRecord | null> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');

  await ensureVolunteerTable();
  // Only allow fields that the admin endpoint is intended to edit.
  const allowed: Record<string, string> = {
    status: 'status',
    adminNotes: 'admin_notes',
    roleType: 'role_type',
    duration: 'duration',
    mode: 'mode',
  };
  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [key, column] of Object.entries(allowed)) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      values.push((updates as Record<string, unknown>)[key]);
      sets.push(`${column} = $${values.length}`);
    }
  }
  if (sets.length === 0) {
    const current = await pgPool.query(
      'SELECT * FROM volunteer_applications WHERE id = $1',
      [id]
    );
    return current.rows[0] ? mapVolunteerRow(current.rows[0]) : null;
  }

  sets.push('updated_at = NOW()');
  values.push(id);
  const result = await pgPool.query(
    `UPDATE volunteer_applications SET ${sets.join(', ')}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );
  return result.rows[0] ? mapVolunteerRow(result.rows[0]) : null;
}

export async function deleteVolunteerFromPostgres(id: string): Promise<boolean> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');
  await ensureVolunteerTable();
  const result = await pgPool.query(
    'DELETE FROM volunteer_applications WHERE id = $1',
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

function mapVolunteerRow(row: any): VolunteerRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    collegeOrOrg: row.college_or_org || undefined,
    roleType: row.role_type,
    duration: row.duration,
    startDate: row.start_date ? new Date(row.start_date).toISOString().slice(0, 10) : undefined,
    endDate: row.end_date ? new Date(row.end_date).toISOString().slice(0, 10) : undefined,
    mode: row.mode || undefined,
    commitmentHours: row.commitment_hours || undefined,
    domains: Array.isArray(row.domains)
      ? row.domains
      : typeof row.domains === 'string'
        ? JSON.parse(row.domains)
        : [],
    message: row.message || undefined,
    status: row.status,
    adminNotes: row.admin_notes || undefined,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : new Date(row.updated_at).toISOString(),
  };
}


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
async function ensureBulkOrderTable(): Promise<void> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS bulk_order_inquiries (
      id TEXT PRIMARY KEY,
      organization_name VARCHAR(255) NOT NULL,
      contact_person VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL DEFAULT '',
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL DEFAULT '',
      item_type VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      notes TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'inquiry',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function getBulkOrdersFromPostgres(): Promise<BulkOrderRecord[]> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');

  await ensureBulkOrderTable();

  const result = await pgPool.query(`
    SELECT * FROM bulk_order_inquiries
    ORDER BY created_at DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    product: row.item_type,
    quantity: Number(row.quantity),
    name: row.contact_person,
    role: row.designation || '',
    organization: row.organization_name,
    email: row.email,
    phone: row.phone || '',
    notes: row.notes || '',
    status: row.status || 'inquiry',
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : row.created_at,
    updatedAt: row.updated_at instanceof Date
      ? row.updated_at.toISOString()
      : row.updated_at,
  }));
}

export async function updateBulkOrderStatusInPostgres(
  id: string,
  status: BulkOrderRecord['status']
): Promise<BulkOrderRecord | null> {
  if (!pgPool) throw new Error('PostgreSQL is not configured.');

  await ensureBulkOrderTable();

  const result = await pgPool.query(`
    UPDATE bulk_order_inquiries
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `, [status, id]);

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    product: row.item_type,
    quantity: Number(row.quantity),
    name: row.contact_person,
    role: row.designation || '',
    organization: row.organization_name,
    email: row.email,
    phone: row.phone || '',
    notes: row.notes || '',
    status: row.status,
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : row.created_at,
    updatedAt: row.updated_at instanceof Date
      ? row.updated_at.toISOString()
      : row.updated_at,
  };
}