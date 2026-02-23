---
phase: 03-email-subscription
plan: 01
subsystem: email
tags: [resend, react-email, hmac, rate-limit, tailwind-email]

# Dependency graph
requires:
  - phase: 02-performance-optimization
    provides: "Optimized site with ISR, Suspense, cache headers"
provides:
  - "Resend client singleton (app/lib/resend.ts)"
  - "HMAC token creation/verification (app/lib/tokens.ts)"
  - "In-memory IP rate limiter (app/lib/rate-limit.ts)"
  - "Branded email base layout (app/emails/base-layout.tsx)"
  - "Confirmation email template (app/emails/confirmation-email.tsx)"
  - "Notification email template (app/emails/notification-email.tsx)"
  - "Subscription confirmed landing page (/confirm)"
  - "Unsubscribed landing page (/unsubscribe)"
affects: [03-02-PLAN, 03-03-PLAN]

# Tech tracking
tech-stack:
  added: [resend@6.9.2, "@react-email/components@1.0.8", "@react-email/tailwind@2.0.5"]
  patterns: [react-email-templates, hmac-token-flow, in-memory-rate-limit]

key-files:
  created:
    - app/lib/resend.ts
    - app/lib/tokens.ts
    - app/lib/rate-limit.ts
    - app/emails/base-layout.tsx
    - app/emails/confirmation-email.tsx
    - app/emails/notification-email.tsx
    - app/confirm/page.tsx
    - app/unsubscribe/page.tsx
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Used inline hex colors in email Tailwind classes (email clients ignore custom theme)"
  - "Notification email is title + link only per user decision (overrides EMAIL-06 excerpt/reading-time)"
  - "Token buffer length check before timingSafeEqual to prevent length-mismatch throws"

patterns-established:
  - "React Email template pattern: BaseLayout wrapper with branded header/footer"
  - "HMAC-SHA256 stateless token pattern: email:timestamp:signature in base64url"
  - "Landing page pattern: Server Component with Navbar, centered content, brand colors"

requirements-completed: [EMAIL-04, EMAIL-06]

# Metrics
duration: 3min
completed: 2026-02-23
---

# Phase 3 Plan 1: Email Foundation Summary

**Resend client, HMAC token helpers, rate limiter, branded React Email templates, and confirm/unsubscribe landing pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-23T20:51:07Z
- **Completed:** 2026-02-23T20:54:16Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Installed resend, @react-email/components, and @react-email/tailwind as email stack
- Created three lib utilities: Resend client singleton, HMAC-SHA256 token creation/verification with timingSafeEqual, and in-memory IP rate limiter
- Built three branded email templates sharing a base layout with site avatar, social links footer, and optional unsubscribe link
- Created /confirm and /unsubscribe landing pages following existing site patterns

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create lib utilities** - `582330a` (feat)
2. **Task 2: Create branded email templates with shared layout** - `13d5c8d` (feat)
3. **Task 3: Create confirm and unsubscribe landing pages** - `9a5af39` (feat)

## Files Created/Modified
- `package.json` - Added resend, @react-email/components, @react-email/tailwind
- `app/lib/resend.ts` - Resend client singleton, AUDIENCE_ID, AUDIENCE_FROM exports
- `app/lib/tokens.ts` - createToken and verifyToken with HMAC-SHA256 and timingSafeEqual
- `app/lib/rate-limit.ts` - In-memory Map rate limiter with configurable window
- `app/emails/base-layout.tsx` - Shared branded email layout with avatar, social links, unsubscribe
- `app/emails/confirmation-email.tsx` - Double opt-in confirmation email with CTA button
- `app/emails/notification-email.tsx` - New post notification email with title + link only
- `app/confirm/page.tsx` - "You're subscribed!" landing page with success icon
- `app/unsubscribe/page.tsx` - "You've been unsubscribed" landing page with re-subscribe prompt

## Decisions Made
- Used inline hex colors in email Tailwind classes (`text-[#4da6db]`) because email clients do not support custom theme colors from tailwind.config.ts
- Notification email renders title + link only, per user decision in CONTEXT.md (overrides EMAIL-06 generic requirement for excerpt/reading-time)
- Added buffer length check before timingSafeEqual in token verification to prevent throws on mismatched buffer lengths
- Used Unicode middle dot (`\u00B7`) as separator in email footer social links for cross-client compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript strict-mode errors in tokens.ts destructuring**
- **Found during:** Task 1 (lib utilities)
- **Issue:** Array destructuring from `split(':')` produced `string | undefined` types, failing strict TypeScript checks
- **Fix:** Used explicit index access with `as string` assertions after length guard
- **Files modified:** app/lib/tokens.ts
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** 582330a (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor TypeScript strictness fix. No scope creep.

## Issues Encountered
None - all three tasks executed cleanly after the TypeScript fix.

## User Setup Required

This plan creates the lib utilities and templates but does not yet call the Resend API at runtime. However, the following environment variables must be configured before plans 02 and 03 can function:

- `RESEND_API_KEY` - From Resend Dashboard > API Keys
- `SUBSCRIBE_SECRET` - Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NOTIFY_SECRET` - Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `RESEND_AUDIENCE_ID` - From Resend Dashboard > Audiences
- `NEXT_PUBLIC_SITE_URL` - Set to `https://xndr.site` (or `http://localhost:3000` for dev)

## Next Phase Readiness
- All lib utilities are importable and ready for API route handlers in plan 02
- Email templates are ready to be rendered via `resend.emails.send({ react: ... })`
- Landing pages at /confirm and /unsubscribe are deployed and ready to receive redirects
- Plan 02 (subscribe + confirm API routes, subscribe form) can proceed immediately

## Self-Check: PASSED

All 8 created files verified on disk. All 3 task commits verified in git log.

---
*Phase: 03-email-subscription*
*Completed: 2026-02-23*
