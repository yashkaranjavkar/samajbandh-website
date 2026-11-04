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
  updateBulkOrderStatusInPostgres,
  getEventRegistrationsFromPostgres,
  getEventRegistrationStatsFromPostgres,
  persistEventRegistrationToPostgres,
  updateEventRegistrationStatusInPostgres
} from '../db/postgres.js';
import type { EventRegistrationRecord, NewsletterAttachment } from '../db/database.js';
import { createEvent, deleteEvent, getEventById, listEvents, updateEvent, validateEventInput } from '../db/events.js';
import {
  cancelCampaign,
  getCampaign,
  listCampaigns,
  listSubscribers,
  saveCampaign,
  subscribeEmail,
  unsubscribeByToken,
} from '../db/newsletter.js';
import { isMailConfigured, startCampaign } from '../newsletter.js';
import { resolveAttachments, saveUpload, UploadError } from '../uploads.js';
import { sendVolunteerApplicationEmails, sendAdminEmail, sendEventRegistrationEmail, sendContactEmail } from '../email.js';
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

apiRouter.post('/send-email',requireAdmin, async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        message: 'Recipient email and message are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(to.trim())) {
      return res.status(400).json({
        message: 'Invalid recipient email address.',
      });
    }

    const sent = await sendAdminEmail(
      to.trim(),
      message.trim()
    );

    if (!sent) {
      return res.status(503).json({
        message: 'Email service is disabled or SMTP is not configured.',
      });
    }

    return res.json({
      success: true,
      message: 'Email sent successfully.',
    });
  } catch (error) {
    console.error('Admin email route error:', error);

    return res.status(500).json({
      message: 'Failed to send email.',
    });
  }
});

// Guard every admin data endpoint at the API layer; hiding the UI alone is not security.
apiRouter.use((req: Request, res: Response, next) => {
  const path = req.path;
  const protectedPaths = [
    '/stats/overview', '/volunteers', '/donations', '/contacts', '/get-bulk-orders',
    '/events/registrations', '/media', '/admin/backup', '/admin/events', '/admin/newsletter', '/admin/uploads'
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

// Legacy: stores an inquiry in the database (kept for any other caller of /contacts).
apiRouter.post('/contacts', (req: Request, res: Response) => {
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

// Contact page: the message is emailed straight to the receiver and is NOT stored anywhere.
const CONTACT_TOPICS = [
  'General Inquiry', 'CSR Partnership', 'School Workshop Request',
  'Bulk Pad Order', 'Volunteering Inquiry', 'Media & Press',
];
const CONTACT_NAME = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const CONTACT_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

// Simple per-IP limit (5 messages / 10 minutes) so the public form cannot be used to flood the inbox.
const contactHits = new Map<string, number[]>();
function isContactRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (contactHits.get(ip) || []).filter(t => now - t < 10 * 60_000);
  if (recent.length >= 5) { contactHits.set(ip, recent); return true; }
  recent.push(now);
  contactHits.set(ip, recent);
  if (contactHits.size > 5000) {
    for (const [key, times] of contactHits) if (!times.some(t => now - t < 10 * 60_000)) contactHits.delete(key);
  }
  return false;
}

export function validateContactInput(body: any) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const phoneRaw = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : 'General Inquiry';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const phone = phoneRaw.replace(/[\s()-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Name must contain at least 2 characters.';
  else if (name.length > 100 || !CONTACT_NAME.test(name)) errors.name = 'Enter a valid name.';
  if (!email) errors.email = 'Email is required.';
  else if (email.length > 254 || !CONTACT_EMAIL.test(email)) errors.email = 'Enter a valid email address.';
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!CONTACT_TOPICS.includes(subject)) errors.subject = 'Choose a valid inquiry topic.';
  const words = message.split(/\s+/).filter(Boolean).length;
  if (!message) errors.message = 'Message is required.';
  else if (words < 5) errors.message = 'Please enter at least 5 words.';
  else if (message.length > 3000) errors.message = 'Message must be 3000 characters or fewer.';

  return { errors, value: { name, email, phone: phoneRaw ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : '', subject, message } };
}

apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const { errors, value } = validateContactInput(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, message: Object.values(errors).join(' '), errors });
    }

    // Only messages that would actually send an email count towards the limit.
    if (isContactRateLimited(req.ip || 'unknown')) {
      return res.status(429).json({ success: false, message: 'Too many messages. Please try again in a few minutes.' });
    }

    const sent = await sendContactEmail(value);
    if (!sent) {
      return res.status(503).json({
        success: false,
        message: 'Messaging is temporarily unavailable. Please email us directly or try again later.',
      });
    }

    return res.json({
      success: true,
      message: 'Thank you for reaching out to Samajbandh. Our team will reply within 24 business hours.',
    });
  } catch (error: any) {
    console.error('[Contact] Email delivery failed:', error);
    return res.status(502).json({ success: false, message: 'We could not send your message right now. Please try again shortly.' });
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
// GET ALL EVENT REGISTRATIONS
apiRouter.get('/events/registrations', async (_req: Request, res: Response) => {
  try {
    const registrations = pgPool
      ? await getEventRegistrationsFromPostgres()
      : db.getEventRegistrations();

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
      storage: pgPool ? 'postgresql' : 'json',
    });
  } catch (error: any) {
    console.error('[Event Registrations] Fetch error:', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET EVENT REGISTRATION STATISTICS
apiRouter.get('/events/registrations/stats', async (_req: Request, res: Response) => {
  try {
    if (pgPool) {
      const stats = await getEventRegistrationStatsFromPostgres();

      return res.json({
        success: true,
        data: stats,
      });
    }

    const registrations = db.getEventRegistrations();

    const eventWise = Object.values(
      registrations.reduce((acc: Record<string, any>, item) => {
        if (!acc[item.eventId]) {
          acc[item.eventId] = {
            eventId: item.eventId,
            eventTitle: item.eventTitle,
            total: 0,
          };
        }

        acc[item.eventId].total++;
        return acc;
      }, {})
    );

    return res.json({
      success: true,
      data: {
        totalRegistrations: registrations.length,
        eventWise,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Registrations that still hold a seat (cancelled ones free their seat).
async function loadRegistrations(): Promise<EventRegistrationRecord[]> {
  return pgPool ? await getEventRegistrationsFromPostgres() : db.getEventRegistrations();
}

const countSeatsByEvent = (registrations: EventRegistrationRecord[]) =>
  registrations.reduce((acc: Record<string, number>, item) => {
    if (item.status !== 'cancelled') acc[item.eventId] = (acc[item.eventId] || 0) + 1;
    return acc;
  }, {});

// Public: the events shown on the website. Admin-created events appear here immediately.
apiRouter.get('/events', async (_req: Request, res: Response) => {
  try {
    const events = await listEvents();
    res.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    console.error('[Events] Failed to list events:', error);
    res.status(500).json({ success: false, message: 'Failed to load events.' });
  }
});

apiRouter.get('/events/availability', async (_req: Request, res: Response) => {
  try {
    const [events, registrations] = await Promise.all([listEvents(), loadRegistrations()]);
    const registrationCounts = countSeatsByEvent(registrations);

    const availability: Record<string, any> = {};

    events.forEach((event) => {
      const totalSeats = Number(event.totalSeats) || 0;
      const registered = registrationCounts[event.id] || 0;
      const seatsLeft = Math.max(totalSeats - registered, 0);

      availability[event.id] = {
        eventId: event.id,
        eventTitle: event.title,
        totalSeats,
        registered,
        seatsLeft,
        isFull: seatsLeft === 0,
      };
    });

    return res.json({
      success: true,
      data: availability,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE A REGISTRATION'S STATUS (admin dropdown)
const REGISTRATION_STATUSES: EventRegistrationRecord['status'][] = ['registered', 'attended', 'absent', 'cancelled'];

apiRouter.patch('/events/registrations/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const status = req.body?.status;

    if (!REGISTRATION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${REGISTRATION_STATUSES.join(', ')}.`,
      });
    }

    // PostgreSQL is the source of truth when configured; JSON is mirrored.
    const updated = pgPool
      ? await updateEventRegistrationStatusInPostgres(id, status)
      : db.updateEventRegistrationStatus(id, status);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    if (pgPool) db.updateEventRegistrationStatus(id, status);

    return res.json({ success: true, message: 'Registration status updated.', data: updated });
  } catch (error: any) {
    console.error('[Event Registrations] Status update failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to update registration status.' });
  }
});

// ADMIN: FILE UPLOADS (event images, newsletter attachments). Body: { kind, filename, data: base64 }
apiRouter.post('/admin/uploads', (req: Request, res: Response) => {
  try {
    const { kind, filename, data } = req.body ?? {};
    if (kind !== 'event-image' && kind !== 'newsletter-attachment') {
      return res.status(400).json({ success: false, message: 'Unknown upload type.' });
    }
    const saved = saveUpload(kind, filename, data);
    return res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    if (error instanceof UploadError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('[Uploads] Failed:', error);
    return res.status(500).json({ success: false, message: 'Upload failed.' });
  }
});

// ADMIN: CREATE / UPDATE EVENTS
apiRouter.post('/admin/events', async (req: Request, res: Response) => {
  try {
    const { errors, value } = validateEventInput(req.body ?? {}, false);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' '), errors });
    }

    const event = await createEvent(value as Parameters<typeof createEvent>[0]);
    return res.status(201).json({ success: true, message: 'Event created.', data: event });
  } catch (error: any) {
    console.error('[Events] Create failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
});

apiRouter.patch('/admin/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { errors, value } = validateEventInput(req.body ?? {}, true);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' '), errors });
    }

    if (value.totalSeats !== undefined) {
      const held = countSeatsByEvent(await loadRegistrations())[id] || 0;
      if (value.totalSeats < held) {
        return res.status(400).json({
          success: false,
          message: `Total seats cannot be lower than the ${held} seat(s) already registered.`,
        });
      }
    }

    const updated = await updateEvent(id, value);
    if (!updated) return res.status(404).json({ success: false, message: 'Event not found.' });
    return res.json({ success: true, message: 'Event updated.', data: updated });
  } catch (error: any) {
    console.error('[Events] Update failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
});


// REGISTER FOR EVENT
apiRouter.post('/events/register', async (req: Request, res: Response) => {
  try {
    const {
      eventId,
      name,
      email,
      phone,
      organization,
      notes
    } = req.body;

    if (!eventId || !name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Event, name, and email are required.',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Always trust the stored event, not the client, for title / capacity / open state.
    const event = await getEventById(String(eventId));
    if (!event) {
      return res.status(404).json({ success: false, message: 'This event no longer exists.' });
    }
    if (!event.registrationOpen) {
      return res.status(409).json({ success: false, message: 'Registration for this event is closed.' });
    }

    const existing = (await loadRegistrations()).filter(r => r.eventId === event.id && r.status !== 'cancelled');
    if (existing.length >= event.totalSeats) {
      return res.status(409).json({ success: false, message: 'Sorry, this event is fully booked.' });
    }
    if (existing.some(r => r.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.status(409).json({ success: false, message: 'This email is already registered for the event.' });
    }

    // Generate one ID and timestamp for both storage systems.
    const registrationData = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      eventId: event.id,
      eventTitle: event.title,
      name: name.trim(),
      email: email.trim(),
      phone: phone || '',
      organization: organization || '',
      notes: notes || '',
      status: 'registered' as const,
      createdAt: new Date().toISOString(),
    };

    // Save to JSON store (same approach as volunteer registration).
    const record = db.addEventRegistration(registrationData);

    // Persist to PostgreSQL when configured.
    let postgresSaved = false;

    try {
      postgresSaved = await persistEventRegistrationToPostgres(record);
    } catch (err) {
      console.error(
        '[PostgreSQL] Could not save event registration:',
        err
      );
    }

    const emailSent = await sendEventRegistrationEmail(record);

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed!',
      postgresSaved,
      emailSent,
      data: record,
    });
  } catch (error: any) {
    console.error('[Event Registration] Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to complete event registration.',
    });
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

// ADMIN: DELETE AN EVENT (also removes its registrations)
apiRouter.delete('/admin/events/:id', async (req: Request, res: Response) => {
  try {
    const result = await deleteEvent(req.params.id);
    if (!result.deleted) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.json({
      success: true,
      message: 'Event deleted.',
      data: { id: req.params.id, registrationsRemoved: result.registrationsRemoved },
    });
  } catch (error: any) {
    console.error('[Events] Delete failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
});

// 8. Newsletter
apiRouter.post('/newsletter', async (req: Request, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const { created } = await subscribeEmail(email);
    res.json({
      success: true,
      message: created
        ? 'Subscribed to Samajbandh updates successfully!'
        : 'You are already subscribed to Samajbandh updates.',
    });
  } catch (error: any) {
    console.error('[Newsletter] Subscribe failed:', error);
    res.status(500).json({ success: false, message: 'Could not subscribe right now. Please try again.' });
  }
});

// Public unsubscribe. GET shows a confirmation page (so mail scanners that prefetch links do not
// unsubscribe anyone); POST performs it and also serves RFC 8058 one-click unsubscribe.
const unsubscribePage = (body: string) => `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Samajbandh newsletter</title></head>
<body style="font-family:Arial,sans-serif;background:#FBF9F5;color:#1F2421;display:flex;justify-content:center;padding:48px 16px;">
<div style="max-width:440px;background:#fff;border:1px solid #E5DFC5;border-radius:12px;padding:28px;text-align:center;">
<h2 style="color:#143D2B;margin-top:0;">Samajbandh</h2>${body}</div></body></html>`;

apiRouter.get('/newsletter/unsubscribe', (req: Request, res: Response) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const safeToken = token.replace(/[^a-zA-Z0-9]/g, '');
  res.type('html').send(unsubscribePage(
    `<p>Do you want to stop receiving Samajbandh newsletters?</p>
     <form method="POST" action="/api/newsletter/unsubscribe">
       <input type="hidden" name="token" value="${safeToken}">
       <button type="submit" style="background:#143D2B;color:#fff;border:0;border-radius:8px;padding:10px 20px;font-weight:bold;cursor:pointer;">Confirm unsubscribe</button>
     </form>`
  ));
});

apiRouter.post('/newsletter/unsubscribe', async (req: Request, res: Response) => {
  try {
    const token = String(req.body?.token || req.query.token || '');
    const found = await unsubscribeByToken(token);
    if (!found) {
      return res.status(404).type('html').send(unsubscribePage('<p>This unsubscribe link is not valid.</p>'));
    }
    return res.type('html').send(unsubscribePage('<p>You have been unsubscribed. You will no longer receive our newsletters.</p>'));
  } catch (error) {
    console.error('[Newsletter] Unsubscribe failed:', error);
    return res.status(500).type('html').send(unsubscribePage('<p>Something went wrong. Please try again later.</p>'));
  }
});

// Admin: subscribers
apiRouter.get('/admin/newsletter/subscribers', async (_req: Request, res: Response) => {
  try {
    const subscribers = await listSubscribers();
    res.json({
      success: true,
      stats: {
        total: subscribers.length,
        active: subscribers.filter(s => s.status === 'active').length,
      },
      // The unsubscribe token is a credential for that user; never send it to the browser.
      data: subscribers.map(({ unsubscribeToken: _token, ...rest }) => rest),
    });
  } catch (error) {
    console.error('[Newsletter] Failed to list subscribers:', error);
    res.status(500).json({ success: false, message: 'Failed to load subscribers.' });
  }
});

// Admin: campaigns
apiRouter.get('/admin/newsletter/campaigns', async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await listCampaigns() });
  } catch (error) {
    console.error('[Newsletter] Failed to list campaigns:', error);
    res.status(500).json({ success: false, message: 'Failed to load campaigns.' });
  }
});

function parseCampaignBody(body: any): { error?: string; subject: string; content: string; id?: string; attachments: NewsletterAttachment[] } {
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  const id = typeof body?.id === 'string' && body.id ? body.id : undefined;
  const { attachments, error: attachmentError } = resolveAttachments(body?.attachments);
  const fail = (error: string) => ({ error, subject, content, id, attachments });

  if (!subject || !content) return fail('Subject and content are required.');
  if (subject.length > 180) return fail('Subject must be 180 characters or fewer.');
  if (content.length > 30000) return fail('Content must be 30,000 characters or fewer.');
  if (/[\r\n]/.test(subject)) return fail('Subject must be a single line.');
  if (attachmentError) return fail(attachmentError);
  return { subject, content, id, attachments };
}

apiRouter.post('/admin/newsletter/campaigns/draft', async (req: Request, res: Response) => {
  try {
    const parsed = parseCampaignBody(req.body);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const saved = await saveCampaign({ ...parsed, status: 'draft', scheduledAt: null });
    if (!saved) return res.status(409).json({ success: false, message: 'This campaign can no longer be edited.' });
    res.json({ success: true, message: 'Draft saved.', data: saved });
  } catch (error) {
    console.error('[Newsletter] Draft failed:', error);
    res.status(500).json({ success: false, message: 'Failed to save draft.' });
  }
});

apiRouter.post('/admin/newsletter/campaigns/schedule', async (req: Request, res: Response) => {
  try {
    const parsed = parseCampaignBody(req.body);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const when = new Date(req.body?.scheduledAt);
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
      return res.status(400).json({ success: false, message: 'Choose a future date and time for scheduling.' });
    }

    const saved = await saveCampaign({ ...parsed, status: 'scheduled', scheduledAt: when.toISOString() });
    if (!saved) return res.status(409).json({ success: false, message: 'This campaign can no longer be edited.' });
    res.json({ success: true, message: 'Campaign scheduled.', data: saved });
  } catch (error) {
    console.error('[Newsletter] Schedule failed:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule campaign.' });
  }
});

apiRouter.post('/admin/newsletter/campaigns/send', async (req: Request, res: Response) => {
  try {
    const parsed = parseCampaignBody(req.body);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    if (!isMailConfigured()) {
      return res.status(503).json({ success: false, message: 'Email service is disabled or SMTP is not configured.' });
    }

    const saved = await saveCampaign({ ...parsed, status: 'draft', scheduledAt: null });
    if (!saved) return res.status(409).json({ success: false, message: 'This campaign can no longer be edited.' });

    const result = await startCampaign(saved.id);
    if (!result.ok) {
      const message =
        result.reason === 'no_subscribers' ? 'There are no active subscribers to send to.'
        : result.reason === 'mail_not_configured' ? 'Email service is disabled or SMTP is not configured.'
        : result.reason === 'attachment_missing' ? (result.detail || 'An attachment is missing. Please upload it again.')
        : 'This campaign is already being sent.';
      return res.status(result.reason === 'no_subscribers' ? 400 : 409).json({ success: false, message });
    }

    // Delivery continues in the background; progress is visible in the campaign list.
    res.status(202).json({
      success: true,
      message: `Sending to ${result.recipients} subscriber(s).`,
      data: result.campaign,
    });
  } catch (error) {
    console.error('[Newsletter] Send failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send campaign.' });
  }
});

apiRouter.patch('/admin/newsletter/campaigns/:id/cancel', async (req: Request, res: Response) => {
  try {
    const existing = await getCampaign(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Campaign not found.' });

    const cancelled = await cancelCampaign(req.params.id);
    if (!cancelled) {
      return res.status(409).json({ success: false, message: 'Only draft or scheduled campaigns can be cancelled.' });
    }
    res.json({ success: true, message: 'Campaign cancelled.', data: cancelled });
  } catch (error) {
    console.error('[Newsletter] Cancel failed:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel campaign.' });
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
