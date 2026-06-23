/**
 * Auth — local implementation (reverted from @hannocoetzee/micro-saas-shared)
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

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

interface TokenPayload extends JWTPayload {
  sub?: string;
  email?: string;
  userId?: string;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/token=([^;]+)/);
  if (!match) return null;
  const payload = await verifyToken(decodeURIComponent(match[1]));
  if (!payload) return null;
  const userId = payload.sub || payload.userId;
  if (!userId) return null;
  return { userId, email: payload.email ?? "", token: "" };
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
