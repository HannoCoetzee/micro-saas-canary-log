/**
 * Hub authentication — read and verify the cross-subdomain JWT cookie.
 * Inlined from @hannocoetzee/micro-saas-shared to avoid GitHub Packages auth.
 */
import { jwtVerify, type JWTPayload } from "jose";

/** Default cookie name used by the hub — products can override */
const DEFAULT_COOKIE_NAME = "hub_session";

/** Typed payload returned by verifyHubToken */
export type HubJWTPayload = JWTPayload & {
  sub?: string;
  email?: string;
};

// Lazy-init secret — read on first use, not at module load
let _secret: Uint8Array | null = null;

function getSecret(): Uint8Array {
  if (_secret) return _secret;
  const secret = process.env.JWT_SECRET ?? process.env.HUB_JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET (or HUB_JWT_SECRET) is not set — refusing to verify in production");
    }
    _secret = new TextEncoder().encode("dev-secret-change-in-production");
  } else {
    _secret = new TextEncoder().encode(secret);
  }
  return _secret;
}

/** Reset cached secret — useful for tests that change env vars */
export function resetSecretCache() {
  _secret = null;
}

/**
 * Verify a JWT token string and return the typed payload.
 */
export async function verifyHubToken(token: string): Promise<HubJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as HubJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Read a named cookie from a cookie string (document.cookie or req headers).
 * Returns the raw token string or null if not present.
 */
export function readHubCookie(cookieHeader: string, cookieName: string = DEFAULT_COOKIE_NAME): string | null {
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const c of cookies) {
    const [name, ...valueParts] = c.split("=");
    if (name === cookieName) {
      return valueParts.join("=");
    }
  }
  return null;
}

/**
 * Full auth flow: read cookie from header, verify JWT, return result.
 */
export async function hubAuth(cookieHeader: string, cookieName: string = DEFAULT_COOKIE_NAME) {
  const token = readHubCookie(cookieHeader, cookieName);
  if (!token) {
    return { valid: false, payload: null };
  }
  const payload = await verifyHubToken(token);
  if (!payload) {
    return { valid: false, payload: null };
  }
  return { valid: true, payload };
}

/**
 * Check if a user's plan includes a specific product.
 */
export function planIncludesProduct(plan: string, product: string, tierProducts: Record<string, string[]>): boolean {
  const tier = plan.toLowerCase();
  return tierProducts[tier]?.includes(product) ?? false;
}
