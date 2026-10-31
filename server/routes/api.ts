import express, { Request, Response } from 'express';
import { db } from '../db/database.js';
import {
  persistBulkOrdersToPostgres,
  persistVolunteerToPostgres,
  pgPool,
  getVolunteersFromPostgres,
  updateVolunteerInPostgres,
  deleteVolunteerFromPostgres,
  getVolunteerOverviewStatsFromPostgres,
  getBulkOrdersFromPostgres,
  updateBulkOrderStatusInPostgres
  
} from '../db/postgres.js';
import { sendVolunteerApplicationEmails } from '../email.js';
import { clearAdminCookie, createAdminSession, requireAdmin, setAdminCookie, verifyAdminCredentials } from '../adminAuth.js';

export const apiRouter = express.Router();

// 1. Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Samajbandh API Backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Admin sign-in/out endpoints. Credentials are read only from server environment variables.
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  if (!verifyAdminCredentials(req.body?.username, req.body?.password)) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }
  try {
    const session = createAdminSession();
    setAdminCookie(res, session.token, session.maxAge);
    return res.json({ success: true, message: 'Signed in successfully.' });
  } catch (error: any) {
    console.error('[Admin auth] Configuration error:', error.message);
    return res.status(503).json({ success: false, message: 'Admin login is not configured on this server.'});
  }
});

apiRouter.post('/admin/logout', (_req: Request, res: Response) => {
  clearAdminCookie(res);
  res.json({ success: true });
});

apiRouter.get('/admin/session', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, authenticated: true });
});

// Guard every admin data endpoint at the API layer; hiding the UI alone is not security.
apiRouter.use((req: Request, res: Response, next) => {
  const path = req.path;
  const protectedPaths = [
    '/stats/overview', '/volunteers', '/donations', '/contacts', '/get-bulk-orders',
    '/events/registrations', '/media', '/admin/backup'
  ];
  const protectedPath = protectedPaths.some(p => path === p || path.startsWith(`${p}/`));
  if (protectedPath) 
    return requireAdmin(req, res, next);
  next();
});

// 2. Overview Stats (Dashboard)
apiRouter.get('/stats/overview', async(_req: Request, res: Response) => {
  try {
    const stats = db.getOverviewStats();

    if (pgPool){
      const volunteerStats = await getVolunteerOverviewStatsFromPostgres();
      Object.assign(stats,volunteerStats);
    }

    res.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('[Admin stats] Failed to load overview stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Volunteer & Internship API
apiRouter.get('/volunteers', async(req: Request, res: Response) => {
  try {
    const roleType = req.query.roleType as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    
    // PostgreSQL is the source of truth when configured; otherwise use the JSON store.
    const list = pgPool
      ? await getVolunteersFromPostgres({ roleType, status, search })
      : db.getVolunteers({ roleType, status, search });
    res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Volunteer / Intern Submission endpoint (used by Join Us / Volunteer forms)
apiRouter.post('/join-us', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      city,
      roleType = 'volunteer',
      duration = '1 Month Structured Immersion',
      startDate,
      endDate,
      mode = 'on-ground',
      collegeOrOrg,
      domains = ['School & Community Workshops'],
      commitmentHours = 'part-time',
      message
    } = req.body;

    // console.log(req.body)

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are mandatory.' });
    }
    if (String(name).trim().split(/\s+/).filter(Boolean).length < 2) {
      return res.status(400).json({ success: false, message: 'Please enter both first and last name.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const newRecord = db.addVolunteer({
      name,
      email,
      phone,
      city: city || 'Maharashtra',
      collegeOrOrg: collegeOrOrg || '',
      roleType: roleType as any,
      duration: duration || '1 Month',
      startDate,
      endDate,
      mode: mode as any,
      commitmentHours,
      domains: Array.isArray(domains) ? domains : [domains],
      message: message || ''
    });

    let postgresSaved = false;
    let emailSent = false;
    try { postgresSaved = await persistVolunteerToPostgres(newRecord); } catch (err) { console.error('[PostgreSQL] Could not save volunteer application:', err); }
    try { emailSent = await sendVolunteerApplicationEmails(newRecord); } catch (err) { console.error('[Email] Could not send application email:', err); }

    res.status(201).json({
      success: true,
      emailSent,
      postgresSaved,
      message: `Registration received! Welcome to Samajbandh's ${newRecord.roleType.toUpperCase()} cohort for ${newRecord.duration}.${emailSent ? ' A confirmation email has been sent.' : ' Your application is saved; email confirmation is temporarily unavailable.'}`, 
      data: newRecord
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/volunteer', (req: Request, res: Response) => {
  // Alias to /join-us for backwards compatibility
  try {
    const { name, email, phone, location, skills, whyJoin, duration, mode, collegeOrOrg, commitmentHours } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are mandatory.' });
    }
    if (String(name).trim().split(/\s+/).filter(Boolean).length < 2) {
      return res.status(400).json({ success: false, message: 'Please enter both first and last name.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const newRecord = db.addVolunteer({
      name,
      email,
      phone,
      city: location || 'Pune',
      collegeOrOrg,
      roleType: 'volunteer',
      duration: duration || 'Flexible',
      mode: (mode as any) || 'on-ground',
      commitmentHours: commitmentHours || 'weekend',
      domains: Array.isArray(skills) ? skills : ['School & Community Workshops'],
      message: whyJoin || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for stepping forward to volunteer. Our coordinator will connect with you.',
      data: newRecord
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Volunteer Status / Admin Notes
apiRouter.patch('/volunteers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, roleType, duration, mode } = req.body ?? {};
    const updates = Object.fromEntries(
      Object.entries({ status, adminNotes, roleType, duration, mode })
        .filter(([, value]) => value !== undefined)
    );

    // When PostgreSQL is configured, write there first so the admin sees the persisted record.
    // JSON remains the fallback only when DATABASE_URL / pgPool is not configured.
    const updated = pgPool
      ? await updateVolunteerInPostgres(id, updates)
      : db.updateVolunteer(id, updates);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found' });
    }

    // Keep the JSON copy in sync when it already contains this record, without relying on it
    // as the source of truth when PostgreSQL is enabled.
    if (pgPool) db.updateVolunteer(id, updates);

    return res.json({ success: true, message: 'Record updated successfully', data: updated });
  } catch (error: any) {
    console.error('[Volunteers] Could not update record:', error);
    return res.status(500).json({ success: false, message: 'Failed to update volunteer record.' });
  }
});

// Delete Volunteer Record
apiRouter.delete('/volunteers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = pgPool
      ? await deleteVolunteerFromPostgres(id)
      : db.deleteVolunteer(id);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    if (pgPool) db.deleteVolunteer(id);
    return res.json({ success: true, message: 'Volunteer deleted successfully' });
  } catch (error: any) {
    console.error('[Volunteers] Could not delete record:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete volunteer record.' });
  }
});

// Export Volunteers to CSV for Non-Technical Admin
apiRouter.get('/volunteers/export', async (_req: Request, res: Response) => {
  try {
    const list = pgPool ? await getVolunteersFromPostgres() : db.getVolunteers();
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'City',
      'Role Type',
      'Duration',
      'Start Date',
      'End Date',
      'Mode',
      'College / Org',
      'Domains',
      'Status',
      'Applied Date',
      'Admin Notes'
    ];

    const rows = list.map(v => [
      `"${v.id}"`,
      `"${(v.name || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.city || '').replace(/"/g, '""')}"`,
      `"${v.roleType}"`,
      `"${v.duration}"`,
      `"${v.startDate || ''}"`,
      `"${v.endDate || ''}"`,
      `"${v.mode || ''}"`,
      `"${(v.collegeOrOrg || '').replace(/"/g, '""')}"`,
      `"${(v.domains || []).join('; ')}"`,
      `"${v.status}"`,
      `"${new Date(v.createdAt).toLocaleDateString()}"`,
      `"${(v.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=samajbandh_volunteers_${new Date().toISOString().slice(0, 10)}.csv`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Donations API
apiRouter.get('/donations', (_req: Request, res: Response) => {
  try {
    const donations = db.getDonations();
    res.json({ success: true, count: donations.length, data: donations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// `/donate` is the path used by the frontend DonateModal
apiRouter.post(['/donations', '/donate'], (req: Request, res: Response) => {
  try {
    const { amount, type = 'one-time', fullName, email, phone, panNumber, address, is80GRequired, purpose } = req.body;
    
    if (!amount || !fullName || !email) {
      return res.status(400).json({ success: false, message: 'Amount, Full Name, and Email are required.' });
    }

    const donation = db.addDonation({
      amount: Number(amount),
      type,
      fullName,
      email,
      phone: phone || '',
      panNumber,
      address,
      is80GRequired: Boolean(is80GRequired),
      purpose: purpose || 'Menstrual Dignity & Asha Pad Sponsorship'
    });

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully. 80G tax receipt generated.',
      receiptNumber: donation.receiptNumber,
      transactionId: donation.transactionId,
      data: donation
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Contact Inquiries API
apiRouter.get('/contacts', (_req: Request, res: Response) => {
  try {
    const contacts = db.getContacts();
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// `/contact` is the path used by the frontend Contact page
apiRouter.post(['/contacts', '/contact'], (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, organization, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const record = db.addContact({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      organization,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Samajbandh. Our team will contact you within 24-48 hours.',
      data: record
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Bulk Pad Orders API
// apiRouter.get('/get-bulk-orders', async(_req: Request, res: Response) => {
//   try {
//     const orders = db.getBulkOrders();
//     res.json({ success: true, count: orders.length, data: orders });
//   } catch (error: any) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

apiRouter.get(['/bulk-orders', '/get-bulk-orders'], async (_req, res) => {
  try {
    const orders = pgPool
      ? await getBulkOrdersFromPostgres()
      : db.getBulkOrders();

    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error: any) {
    console.error('[Bulk Orders] Failed to fetch:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bulk orders'
    });
  }
});

apiRouter.patch('/bulk-orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'inquiry',
      'quoted',
      'confirmed',
      'dispatched',
      'fulfilled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk order status'
      });
    }

    const updated = pgPool
      ? await updateBulkOrderStatusInPostgres(id, status)
      : db.updateBulkOrderStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found'
      });
    }

    // Keep JSON synchronized when PostgreSQL is the primary store.
    if (pgPool) {
      db.updateBulkOrderStatus(id, status);
    }

    return res.json({
      success: true,
      message: 'Bulk order status updated successfully',
      data: updated
    });
  } catch (error: any) {
    console.error('[Bulk Orders] Status update failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update bulk order status'
    });
  }
});

apiRouter.post('/bulk-orders', async (req: Request, res: Response) => {

  try {
    const { product, quantity, name, role, organization, email, phone, notes} = req.body;
     
    if (!name || !email || !product || !quantity) {
      return res.status(400).json({ success: false, message: 'Product, quantity, name, and email are required.' });
    }

    const record = db.addBulkOrder({
      product,
      quantity: Number(quantity),
      name,
      role,
      organization: organization || 'Individual / Institution',
      email,
      phone: phone || '',
      notes
    });

    let postgresSaved = false

    try { postgresSaved = await persistBulkOrdersToPostgres(record); } catch (err) { console.error('[PostgreSQL] Could not save volunteer application:', err); }

    res.status(201).json({
      success: true,
      message: `Bulk inquiry received for order id: ${record.id}! Our logistics team will share the institutional quote & timeline.`,
      postgresSaved,
      data: record
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6b. Event Registrations API
apiRouter.get('/events/registrations', (_req: Request, res: Response) => {
  try {
    const registrations = db.getEventRegistrations();
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/events/register', (req: Request, res: Response) => {
  try {
    const { eventId, eventTitle, name, email, phone, organization, notes } = req.body;
    if (!eventId || !name || !email) {
      return res.status(400).json({ success: false, message: 'Event, name, and email are required.' });
    }

    const record = db.addEventRegistration({
      eventId,
      eventTitle: eventTitle || '',
      name,
      email,
      phone: phone || '',
      organization,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Registration confirmed! A confirmation pass will be emailed to you.',
      data: record
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Media & Documents Configuration API
apiRouter.get('/media', (_req: Request, res: Response) => {
  try {
    const assets = db.getMediaAssets();
    res.json({ success: true, data: assets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/media', (req: Request, res: Response) => {
  try {
    const asset = req.body;
    if (!asset.key || !asset.url) {
      return res.status(400).json({ success: false, message: 'Asset key and URL are required.' });
    }
    const saved = db.upsertMediaAsset(asset);
    res.json({ success: true, message: 'Media asset saved', data: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Newsletter
apiRouter.post('/newsletter', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    db.addNewsletter(email);
    res.json({ success: true, message: 'Subscribed to Samajbandh updates successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Admin Full Database Backup
apiRouter.get('/admin/backup', (_req: Request, res: Response) => {
  try {
    const backup = db.getFullBackup();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=samajbandh_db_backup_${new Date().toISOString().slice(0, 10)}.json`);
    res.json(backup);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unknown API routes return JSON 404 instead of falling through to the SPA HTML
apiRouter.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
});
