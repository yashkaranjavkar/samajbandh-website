import express, { Request, Response } from 'express';
import { db } from '../db/database.js';

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

// 2. Overview Stats (Dashboard)
apiRouter.get('/stats/overview', (_req: Request, res: Response) => {
  try {
    const stats = db.getOverviewStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Volunteer & Internship API
apiRouter.get('/volunteers', (req: Request, res: Response) => {
  try {
    const roleType = req.query.roleType as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const list = db.getVolunteers({ roleType, status, search });
    res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Volunteer / Intern Submission endpoint (used by Join Us / Volunteer forms)
apiRouter.post('/join-us', (req: Request, res: Response) => {
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

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are mandatory.' });
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

    res.status(201).json({
      success: true,
      message: `Registration received! Welcome to Samajbandh's ${newRecord.roleType.toUpperCase()} cohort for ${newRecord.duration}.`,
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
apiRouter.patch('/volunteers/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, roleType, duration, mode } = req.body;
    const updated = db.updateVolunteer(id, { status, adminNotes, roleType, duration, mode });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found' });
    }

    res.json({ success: true, message: 'Record updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Volunteer Record
apiRouter.delete('/volunteers/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteVolunteer(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Volunteer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export Volunteers to CSV for Non-Technical Admin
apiRouter.get('/volunteers/export', (_req: Request, res: Response) => {
  try {
    const list = db.getVolunteers();
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
apiRouter.get('/bulk-orders', (_req: Request, res: Response) => {
  try {
    const orders = db.getBulkOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/bulk-orders', (req: Request, res: Response) => {
  try {
    const { product, quantity, name, organization, email, phone, deliveryAddress, notes } = req.body;
    if (!name || !email || !product || !quantity) {
      return res.status(400).json({ success: false, message: 'Product, quantity, name, and email are required.' });
    }

    const record = db.addBulkOrder({
      product,
      quantity: Number(quantity),
      name,
      organization: organization || 'Individual / Institution',
      email,
      phone: phone || '',
      deliveryAddress: deliveryAddress || '',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Bulk inquiry received! Our logistics team will share the institutional quote & timeline.',
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
