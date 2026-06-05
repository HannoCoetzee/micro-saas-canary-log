import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-do-not-use-in-production"
);

export async function signToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as JWTPayload & { userId: string; email: string };
}

export async function getUserFromRequest(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  try {
    return await verifyToken(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

const UB_COOKIE =
  process.env.VERCEL_ENV === "production"
    ? "; Domain=.uncomfortablebudget.com; Path=/; Secure; SameSite=Lax"
    : "; Path=/; SameSite=Lax";

export function authCookieHeader(token: string) {
  return `token=${token}; Max-Age=${7 * 86400}${UB_COOKIE}`;
}

export function clearCookieHeader() {
  return `token=; Max-Age=0${UB_COOKIE}`;
}
