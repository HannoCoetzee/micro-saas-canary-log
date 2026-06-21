/**
 * Auth — thin wrapper around @hannocoetzee/micro-saas-shared
 * Keeps backwards-compatible exports for existing code.
 */
export {{ signToken, verifyHubToken as verifyToken, readHubCookie, hubAuth, resetSecretCache, planIncludesProduct }} from '@hannocoetzee/micro-saas-shared/auth'

// Backwards-compatible getUserFromRequest using shared auth
import { hubAuth } from '@hannocoetzee/micro-saas-shared/auth'

export async function getUserFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') ?? ''
  const { valid, payload } = await hubAuth(cookie, 'token')
  if (!valid || !payload) return null
  return { userId: payload.sub, email: payload.email, token: '' }
}

// Cookie helpers preserved for backwards compat
const UB_COOKIE = process.env.VERCEL_ENV === 'production'
  ? '; Domain=.uncomfortablebudget.com; Path=/; Secure; SameSite=Lax'
  : '; Path=/; SameSite=Lax'

export function authCookieHeader(token: string) {
  return `token=${token}; Max-Age=${7 * 86400}${UB_COOKIE}`
}

export function clearCookieHeader() {
  return `token=; Max-Age=0${UB_COOKIE}`
}
