# Software Requirements Specification (SRS): CanaryLog

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for CanaryLog, a micro-SaaS product in the Uncomfortable Budget fleet. It defines the functional and non-functional requirements, data model, API specification, and dependencies.

### 1.2 Scope
CanaryLog is a Next.js 14+ full-stack application deployed at https://canary-log.uncomfortablebudget.com. Publish a cryptographically signed warrant canary and transparency log for your service.

### 1.3 Definitions and Acronyms
- **JWT**: JSON Web Token (cross-subdomain cookie-based session)
- **Hub SSO**: Central authentication at hub.uncomfortablebudget.com
- **Fleet**: The Uncomfortable Budget micro-SaaS product suite
- **Prisma**: TypeScript ORM for PostgreSQL
- **Route Handler**: Next.js App Router API endpoint

## 2. System Overview

### 2.1 System Architecture
- Next.js 14+ full-stack application (App Router)
- PostgreSQL database via Prisma ORM (Neon)
- Vercel deployment with edge runtime support
- Cross-subdomain JWT authentication via Hub SSO
- Stripe for subscription billing
- Resend for transactional email

### 2.2 Technology Stack
- Next.js 14+ (App Router, Route Handlers)
- TypeScript
- Tailwind CSS (dark theme, accent #c75b39)
- Prisma ORM + PostgreSQL (Neon)
- JWT cookie-based auth (cross-subdomain)
- Stripe for billing
- Resend for email
- Vercel for hosting

## 3. Functional Requirements

### 3.1 Authentication
- POST /api/auth/signup — User registration (email, password)
- POST /api/auth/login — User login, sets JWT cookie
- GET /api/auth/me — Get current authenticated user
- JWT cookie-based session (cross-subdomain .uncomfortablebudget.com)
- Hub SSO integration via /api/hub-plan to sync fleet plan

### 3.2 Canary Management
- GET /api/canary — list the current user's canaries
- POST /api/canary — create a canary (name, statement, frequency)
- POST /api/canary/[id]/sign — sign the canary (generates publicKey + signature)
- GET /api/canary/[id]/verify — verify a canary's signature and freshness
- Public canary page at /c/[slug]

### 3.3 Billing
- Stripe checkout session creation
- Stripe webhook handler for subscription events
- Stripe subscription management
- Plan enforcement based on user's fleet plan

## 4. Data Model

#### User
- id (cuid), email (unique), password, stripeCustomerId (unique?), subscriptionStatus, plan, createdAt, updatedAt, canaries (relation)

#### Canary
- id (cuid), slug (unique), name, statement, publicKey, signature, frequency (default 'weekly'), status (default 'active'), lastSigned (DateTime?), userId (FK→User, cascade), createdAt, updatedAt, entries (relation)

#### CanaryEntry
- id (cuid), canaryId (FK→Canary, cascade), message, signature, createdAt


## 5. API Specification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | Logout / clear session |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/hub-plan` | Sync plan from Hub SSO |
| GET | `/api/canary` | List current user's canaries |
| POST | `/api/canary` | Create a canary (name, statement, frequency) |
| POST | `/api/canary/[id]/sign` | Sign the canary |
| GET | `/api/canary/[id]/verify` | Verify canary signature and freshness |
| POST | `/api/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| GET/POST | `/api/stripe/subscription` | Manage subscription |

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time < 2 seconds (LCP)
- API response time < 500ms for authenticated routes
- Public endpoints cached where possible

### 6.2 Security
- JWT cookies with HttpOnly, Secure, SameSite attributes
- Password hashing (bcrypt)
- Rate limiting on public endpoints
- Input validation on all API routes
- CORS restricted to *.uncomfortablebudget.com

### 6.3 Reliability
- 99.9% uptime target
- Graceful error handling with error boundaries
- Database connection pooling via Prisma
- Automatic Vercel deployments on push to main

## 7. Dependencies
- @hannocoetzee/micro-saas-shared (shared auth/rate-limit utilities, where applicable)
- Stripe for billing
- Resend for transactional email (where applicable)
- Prisma for database ORM
- Neon for PostgreSQL hosting
- Vercel for deployment
