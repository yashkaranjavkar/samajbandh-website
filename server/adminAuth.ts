import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

const COOKIE_NAME = 'samajbandh_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  console.log(secret)
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be set to a random value of at least 32 characters.');
  return createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyAdminCredentials(username: unknown, password: unknown): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || typeof username !== 'string' || typeof password !== 'string') return false;
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}

export function createAdminSession(): { token: string; maxAge: number } {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin:${expires}`;
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

export function isAdminSessionValid(token?: string): boolean {
  if (!token) return false;
  const splitAt = token.lastIndexOf('.');
  if (splitAt < 0) return false;
  const payload = token.slice(0, splitAt);
  const signature = token.slice(splitAt + 1);
  const match = /^admin:(\d+)$/.exec(payload);
  if (!match || Number(match[1]) <= Math.floor(Date.now() / 1000)) return false;
  try { return safeEqual(signature, sign(payload)); } catch { return false; }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE_NAME}=`));
  const token = cookie ? decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1)) : undefined;
  if (!isAdminSessionValid(token)) {
    return res.status(401).json({ success: false, message: 'Admin authentication required. Please sign in.' });
  }
  next();
}

export function setAdminCookie(res: Response, token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`);
}

export function clearAdminCookie(res: Response) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}
