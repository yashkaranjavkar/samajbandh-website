import nodemailer from 'nodemailer';
import type { VolunteerRecord } from './db/database.js';


const mailEnabled = process.env.MAIL_ENABLED === 'true';

export async function sendVolunteerApplicationEmails(record: VolunteerRecord): Promise<boolean> {
  if (!mailEnabled) {
    console.log('[Email] Email sending is disabled. Skipping emails.');
    return false;
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, APPLICATION_NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    console.warn('[Email] SMTP settings are incomplete; application emails were not sent.');
    return false;
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const details = `Name: ${record.name}\nEmail: ${record.email}\nPhone: ${record.phone}\nLocation: ${record.city}\nRole: ${record.roleType}\nDuration: ${record.duration}\nStart date: ${record.startDate || 'Not specified'}\nEnd date: ${record.endDate || 'Not specified'}\nMode: ${record.mode || 'Not specified'}\nOrganization: ${record.collegeOrOrg || 'Not specified'}\nDomains: ${(record.domains || []).join(', ')}\nMessage: ${record.message || 'None'}`;

  const sends = [transporter.sendMail({ from: MAIL_FROM, to: record.email, subject: 'Samajbandh application received', text: `Hello ${record.name},\n\nThank you for applying to Samajbandh. We have received your ${record.roleType} application. Our team will review it and contact you.\n\nApplication reference: ${record.id}\n\nSamajbandh Team` })];

  if (APPLICATION_NOTIFY_EMAIL) 
    sends.push(transporter.sendMail({ from: MAIL_FROM, to: APPLICATION_NOTIFY_EMAIL, replyTo: record.email, subject: `New ${record.roleType} application: ${record.name}`, text: details }));
  await Promise.all(sends);
  return true;
}
