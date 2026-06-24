# Product Requirements Document (PRD): CanaryLog

## Overview
Publish a cryptographically signed warrant canary and transparency log for your service. Services that handle sensitive data need a way to prove they haven't been served with secret warrants. A warrant canary is a regularly-published signed statement; CanaryLog provides signed canary statements and an append-only transparency log that anyone can verify.

## Product Information
- **Product Name**: CanaryLog
- **Product Slug**: canary-log
- **Primary Domain**: https://canary-log.uncomfortablebudget.com
- **Status**: Live
- **Category**: Security & Privacy
- **Launch Date**: 2026-05-31

## Problem Statement
Services that handle sensitive data need a way to prove they haven't been served with secret warrants. A warrant canary is a regularly-published signed statement; CanaryLog provides signed canary statements and an append-only transparency log that anyone can verify.

## Target Audience
Privacy-focused service operators, VPN providers, encrypted messaging apps, and any organization that wants to demonstrate transparency to users.

## Core Features

### Primary Functionality
- Create canary statements with name, statement text, and frequency (weekly/monthly)
- Cryptographically sign canary entries (publicKey/signature stored on the Canary)
- Append-only CanaryEntry log for transparency
- Public canary page at /c/[slug] for verification
- Sign and verify endpoints per canary

### Secondary Features
- Stripe subscriptions with checkout and webhook handling
- Hub SSO plan sync
- JWT cookie-based cross-subdomain auth
- Logout endpoint

## Technical Requirements

### Frontend
- Built with Next.js 14+ (App Router)
- Responsive design (mobile-first)
- Dark theme with burnt orange accent color (#c75b39)
- Cross-subdomain JWT authentication

### Backend
- Prisma ORM with PostgreSQL (Neon)
- REST API with Next.js Route Handlers
- Stripe integration for subscriptions
- Resend for transactional email

### Authentication
- JWT cookie-based auth (cross-subdomain)
- Hub SSO integration via /api/hub-plan

## Plans
Plan limits defined via Hub SSO fleet plan (no local plans.ts).
- **Free**: $0/mo
- **Starter**: $9/mo
- **Pro**: $29/mo

## Success Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Conversion rate (Free → Starter → Pro)
- Feature adoption rate
- Uptime (99.9% target)
- Page load time (< 2s)
