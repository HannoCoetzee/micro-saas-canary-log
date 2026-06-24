# CanaryLog

Publish a cryptographically signed warrant canary and transparency log for your service.

## Features
- Create warrant canary statements with signing frequency
- Cryptographic signing with stored public key and signature
- Append-only transparency log (CanaryEntry)
- Public canary page at /c/[slug] for third-party verification
- Sign and verify endpoints per canary
- Stripe billing and Hub SSO

## Tech Stack
- Next.js 14 + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (Neon)
- JWT cookie auth via Hub SSO
- Stripe billing
- Vercel deployment

## API
- POST /api/auth/signup — register
- POST /api/auth/login — login
- POST /api/auth/logout — logout
- GET /api/auth/me — current user
- GET /api/canary — list your canaries
- POST /api/canary — create canary (name, statement, frequency)
- POST /api/canary/:id/sign — sign canary
- GET /api/canary/:id/verify — verify signature

## Getting Started
```bash
cp .env.example .env.local
# Set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
npm run dev
```

## Plans
- **Free** — Plan limits defined via Hub SSO fleet plan (no local plans
- **Starter** — $9/mo
- **Pro** — $29/mo

## Deploy
Live at https://canary-log.uncomfortablebudget.com
