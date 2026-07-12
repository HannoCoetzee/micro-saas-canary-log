/**
 * Auth — delegates verifyToken to @hannocoetzee/micro-saas-shared.
 * signToken, cookie helpers, and getUserFromRequest stay local.
 */
import { SignJWT, type JWTPayload } from "jose";
import { verifyHubToken, readHubCookie, type HubJWTPayload } from "./hub-auth";

// Local user type — maps shared HubJWTPayload (sub/email/plan) to legacy field names
export interface LocalUser {
  userId: string;
  email: string;
  token: string;
}

let _secret: Uint8Array | null = null;
function getSecret(): Uint8Array {
  if (_secret) return _secret;
  const rawSecret = process.env.JWT_SECRET;
  if (!rawSecret || rawSecret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set to a strong secret (≥32 chars) in production");
    }
    console.warn("WARNING: JWT_SECRET not set or too short. Using insecure fallback — only for development.");
  }
  _secret = new TextEncoder().encode(rawSecret || "dev-secret-change-me-immediately");
  return _secret;
}

export async function signToken(payload: object) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<HubJWTPayload | null> {
  return verifyHubToken(token);
}

export async function getUserFromRequest(req: Request): Promise<LocalUser | null> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const token = readHubCookie(cookieHeader, "token") ?? readHubCookie(cookieHeader, "hub_session");
  if (!token) return null;
  const payload = await verifyHubToken(token);
  if (!payload) return null;
  const userId = payload.sub;
  if (!userId) return null;
  return { userId, email: payload.email ?? "", token };
}

// Cookie helpers
const UB_COOKIE = process.env.VERCEL_ENV === "production"
  ? "; Domain=.uncomfortablebudget.com; Path=/; Secure; SameSite=Lax"
  : "; Path=/; SameSite=Lax";

export function authCookieHeader(token: string) {
  return `token=${token}; Max-Age=${7 * 86400}${UB_COOKIE}`;
}

export function clearCookieHeader() {
  return `token=; Max-Age=0${UB_COOKIE}`;
}