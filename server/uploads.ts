import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import type { NewsletterAttachment } from './db/database.js';

export class UploadError extends Error {}

// Event images are public (shown on the website). Newsletter attachments stay private
// (not under /public) and are only ever read by the mail sender.
export const EVENT_IMAGE_DIR = path.join(process.cwd(), 'public', 'uploads', 'events');
export const ATTACHMENT_DIR = path.join(process.cwd(), 'data', 'uploads', 'newsletter');

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_TOTAL_BYTES = 10 * 1024 * 1024;

const startsWith = (buf: Buffer, bytes: number[], offset = 0) =>
  bytes.every((b, i) => buf[offset + i] === b);

const IMAGE_TYPES: Record<string, { mime: string; check: (b: Buffer) => boolean }> = {
  png: { mime: 'image/png', check: b => startsWith(b, [0x89, 0x50, 0x4e, 0x47]) },
  jpg: { mime: 'image/jpeg', check: b => startsWith(b, [0xff, 0xd8, 0xff]) },
  jpeg: { mime: 'image/jpeg', check: b => startsWith(b, [0xff, 0xd8, 0xff]) },
  gif: { mime: 'image/gif', check: b => startsWith(b, [0x47, 0x49, 0x46, 0x38]) },
  webp: { mime: 'image/webp', check: b => startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8) },
};

const zip = (b: Buffer) => startsWith(b, [0x50, 0x4b, 0x03, 0x04]);
const ole = (b: Buffer) => startsWith(b, [0xd0, 0xcf, 0x11, 0xe0]);
const plainText = (b: Buffer) => !b.subarray(0, 4096).includes(0);

// SVG and HTML are deliberately not allowed (script injection risk).
const ATTACHMENT_TYPES: Record<string, { mime: string; check: (b: Buffer) => boolean }> = {
  ...IMAGE_TYPES,
  pdf: { mime: 'application/pdf', check: b => startsWith(b, [0x25, 0x50, 0x44, 0x46]) },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', check: zip },
  xlsx: { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', check: zip },
  pptx: { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', check: zip },
  doc: { mime: 'application/msword', check: ole },
  xls: { mime: 'application/vnd.ms-excel', check: ole },
  ppt: { mime: 'application/vnd.ms-powerpoint', check: ole },
  csv: { mime: 'text/csv', check: plainText },
  txt: { mime: 'text/plain', check: plainText },
};

// 24 hex chars + extension. Anything else is rejected, which rules out path traversal.
const STORED_NAME = /^[a-f0-9]{24}\.[a-z0-9]{2,4}$/;

const cleanFilename = (name: unknown): string =>
  String(name || 'file')
    .split(/[\\/]/).pop()!
    .replace(/[\u0000-\u001f"<>:*?|]/g, '')
    .trim()
    .slice(0, 120) || 'file';

export type UploadKind = 'event-image' | 'newsletter-attachment';

export function saveUpload(kind: UploadKind, filename: unknown, base64: unknown) {
  if (typeof base64 !== 'string' || !base64) throw new UploadError('No file data received.');

  const display = cleanFilename(filename);
  const ext = (display.split('.').pop() || '').toLowerCase();
  const types = kind === 'event-image' ? IMAGE_TYPES : ATTACHMENT_TYPES;
  const type = types[ext];
  if (!type) {
    throw new UploadError(
      kind === 'event-image'
        ? 'Image must be a PNG, JPG, WebP or GIF file.'
        : `Unsupported file type. Allowed: ${Object.keys(ATTACHMENT_TYPES).join(', ')}.`
    );
  }

  const buffer = Buffer.from(base64.replace(/^data:[^,]*,/, ''), 'base64');
  const limit = kind === 'event-image' ? MAX_IMAGE_BYTES : MAX_ATTACHMENT_BYTES;
  if (buffer.length === 0) throw new UploadError('The file is empty.');
  if (buffer.length > limit) throw new UploadError(`File is too large (max ${Math.round(limit / 1024 / 1024)} MB).`);
  if (!type.check(buffer)) throw new UploadError('File content does not match its type.');

  const storedName = `${randomBytes(12).toString('hex')}.${ext}`;
  const dir = kind === 'event-image' ? EVENT_IMAGE_DIR : ATTACHMENT_DIR;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, storedName), buffer);

  return {
    storedName,
    filename: display,
    size: buffer.length,
    mimeType: type.mime,
    ...(kind === 'event-image' ? { url: `/public/uploads/events/${storedName}` } : {}),
  };
}

/** Validates attachment references sent by the admin UI against files actually on disk. */
export function resolveAttachments(input: unknown): { attachments: NewsletterAttachment[]; error?: string } {
  if (input === undefined || input === null) return { attachments: [] };
  if (!Array.isArray(input)) return { attachments: [], error: 'Attachments must be a list.' };
  if (input.length > MAX_ATTACHMENTS) return { attachments: [], error: `You can attach at most ${MAX_ATTACHMENTS} files.` };

  const attachments: NewsletterAttachment[] = [];
  let total = 0;
  for (const ref of input) {
    const storedName = String(ref?.storedName || '');
    if (!STORED_NAME.test(storedName)) return { attachments: [], error: 'Invalid attachment reference.' };
    const full = path.join(ATTACHMENT_DIR, storedName);
    if (!fs.existsSync(full)) return { attachments: [], error: 'An attached file is no longer available. Please upload it again.' };
    const size = fs.statSync(full).size;
    total += size;
    const ext = storedName.split('.').pop()!;
    attachments.push({
      storedName,
      filename: cleanFilename(ref?.filename || storedName),
      size,
      mimeType: ATTACHMENT_TYPES[ext]?.mime || 'application/octet-stream',
    });
  }
  if (total > MAX_ATTACHMENT_TOTAL_BYTES) {
    return { attachments: [], error: `Attachments must total ${MAX_ATTACHMENT_TOTAL_BYTES / 1024 / 1024} MB or less.` };
  }
  return { attachments };
}

/** Reads the files once so the sender can reuse the same buffers for every recipient. */
export function loadAttachmentContents(attachments: NewsletterAttachment[]) {
  return attachments.map(a => {
    if (!STORED_NAME.test(a.storedName)) throw new UploadError('Invalid attachment reference.');
    const full = path.join(ATTACHMENT_DIR, a.storedName);
    if (!fs.existsSync(full)) throw new UploadError(`Attachment "${a.filename}" is missing on the server.`);
    return { filename: a.filename, content: fs.readFileSync(full), contentType: a.mimeType };
  });
}
