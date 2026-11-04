import nodemailer from 'nodemailer';
import type { VolunteerRecord } from './db/database.js';

const mailEnabled = process.env.MAIL_ENABLED === 'true';
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, APPLICATION_NOTIFY_EMAIL } = process.env;

export async function sendVolunteerApplicationEmails(record: VolunteerRecord): Promise<boolean> {
  if (!mailEnabled) {
    console.log('[Email] Email sending is disabled. Skipping emails.');
    return false;
  }

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

  const sends = [transporter.sendMail({ from: MAIL_FROM, to: record.email, subject: 'Samajbandh application received', text: `Hello ${record.name},\n\nThank you for applying to Samajbandh. We have received your ${record.roleType} application. Our team will review it and contact you.\n\nApplication reference: ${record.id}\n\nTeam Samajbandh` })];

  if (APPLICATION_NOTIFY_EMAIL) 
    sends.push(transporter.sendMail({ from: MAIL_FROM, to: APPLICATION_NOTIFY_EMAIL, replyTo: record.email, subject: `New ${record.roleType} application: ${record.name}`, text: details }));
  await Promise.all(sends);
  return true;
}

export async function sendAdminEmail(
  to: string,
  message: string
): Promise<boolean> {
  if (!mailEnabled) {
    console.log('[Email] Email sending is disabled.');
    return false;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    console.warn('[Email] SMTP settings are incomplete.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT || 587) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject: 'Message from Samajbandh',
      text: message,
    });

    return true;
  } catch (error) {
    console.error('[Email] Admin email failed:', error);
    throw error;
  }
}


export interface EventRegistrationEmailRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  notes?: string;
}

export async function sendEventRegistrationEmail(
  record: EventRegistrationEmailRecord
): Promise<boolean> {
  if (process.env.MAIL_ENABLED !== 'true') {
    console.log('[Email] Event registration email is disabled.');
    return false;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
    APPLICATION_NOTIFY_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    console.warn('[Email] SMTP settings are incomplete.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT || 587) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const participantEmail = transporter.sendMail({
      from: MAIL_FROM,
      to: record.email,
      subject: `Registration Confirmed: ${record.eventTitle}`,
      text: `Hello ${record.name},

      Thank you for registering with Samajbandh!

      Your registration has been successfully received.

      Event: ${record.eventTitle}
      Registration ID: ${record.id}
      Event Reference: ${record.eventId}

      We look forward to your participation.

      For further information, please contact the Samajbandh team.

      Regards,
      Samajbandh Team`,
    });

    const notificationEmail = APPLICATION_NOTIFY_EMAIL
      ? transporter.sendMail({
          from: MAIL_FROM,
          to: APPLICATION_NOTIFY_EMAIL,
          replyTo: record.email,
          subject: `New Event Registration: ${record.eventTitle}`,
          text: `A new event registration has been received.

              Event: ${record.eventTitle}
              Event ID: ${record.eventId}
              Registration ID: ${record.id}

              Name: ${record.name}
              Email: ${record.email}
              Phone: ${record.phone || 'Not provided'}
              Organization: ${record.organization || 'Not provided'}
              Notes: ${record.notes || 'None'}`,
        })
      : Promise.resolve();

    await Promise.all([participantEmail, notificationEmail]);

    return true;
  } catch (error) {
    console.error('[Email] Event registration email failed:', error);
    return false;
  }
}

// --------------------------------------------------
// Contact form: delivered straight to the receiver's inbox, never stored.
// --------------------------------------------------

export interface ContactEmailInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

/**
 * Emails a contact-form message to CONTACT_RECEIVER_EMAIL (falls back to APPLICATION_NOTIFY_EMAIL).
 * The visitor's address is set as Reply-To, so replying goes straight to them.
 * Returns false when mail is not configured; throws if the SMTP server rejects the message.
 */
export async function sendContactEmail(input: ContactEmailInput): Promise<boolean> {
  const { MAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.APPLICATION_NOTIFY_EMAIL;

  if (MAIL_ENABLED !== 'true' || !SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM || !receiver) {
    console.warn('[Email] Contact email is not configured (MAIL_ENABLED, SMTP_*, MAIL_FROM, CONTACT_RECEIVER_EMAIL).');
    return false;
  }

  const name = singleLine(input.name);
  const subject = singleLine(input.subject);
  const port = Number(SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const text = [
    'New message from the Samajbandh website contact form',
    '',
    `Name: ${name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || 'Not provided'}`,
    `Topic: ${subject}`,
    '',
    'Message:',
    input.message,
  ].join('\n');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#5C6760;vertical-align:top;">${label}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1F2421;max-width:600px;">
  <h2 style="color:#143D2B;margin:0 0 12px;">New website contact message</h2>
  <table style="font-size:14px;border-collapse:collapse;">
    ${row('Name', name)}${row('Email', input.email)}${row('Phone', input.phone || 'Not provided')}${row('Topic', subject)}
  </table>
  <p style="margin:16px 0 4px;color:#5C6760;font-size:13px;">Message</p>
  <div style="white-space:pre-wrap;border:1px solid #E5DFC5;border-radius:8px;padding:12px;font-size:14px;line-height:1.5;">${escapeHtml(input.message)}</div>
  <p style="margin-top:16px;font-size:12px;color:#879086;">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
</div>`;

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: receiver,
      replyTo: { name, address: input.email },
      subject: `[Contact] ${subject} - ${name}`,
      text,
      html,
    });
    return true;
  } finally {
    transporter.close();
  }
}
