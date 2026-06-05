import { cookies } from 'next/headers'

const HUB_COOKIE = 'hub_session'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const buf = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    return JSON.parse(buf.toString('utf8'))
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(HUB_COOKIE)?.value
    if (!token) return Response.json({ plan: null })
    const payload = decodeJwtPayload(token)
    const plan = payload?.plan as string | undefined
    return Response.json({ plan: plan ?? null })
  } catch {
    return Response.json({ plan: null })
  }
}
