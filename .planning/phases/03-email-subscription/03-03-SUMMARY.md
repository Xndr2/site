---
phase: 03-email-subscription
plan: 03
subsystem: api
tags: [resend, notify-api, unsubscribe-api, batch-send, list-unsubscribe, rfc-8058, dns-spf-dkim]

# Dependency graph
requires:
  - phase: 03-email-subscription
    plan: 01
    provides: "Resend client, HMAC tokens, email templates, landing pages"
  - phase: 03-email-subscription
    plan: 02
    provides: "Subscribe + confirm API routes, subscribe form, blog integration"
provides:
  - "POST /api/notify route (secret-protected, paginated contact fetch, batch send with unsubscribe headers)"
  - "GET+POST /api/unsubscribe route (HMAC token verification, contact update, RFC 8058 compliance)"
  - "SPF + DKIM DNS records verified for xndr.site domain"
  - "Complete end-to-end email lifecycle: subscribe -> confirm -> notify -> unsubscribe"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [resend-batch-send, list-unsubscribe-headers, rfc-8058-one-click, paginated-contact-fetch]

key-files:
  created:
    - app/api/notify/route.ts
    - app/api/unsubscribe/route.ts
  modified: []

key-decisions:
  - "Paginated contact fetch with while loop and after cursor to handle audiences exceeding 100 contacts"
  - "Batch send in groups of 100 via resend.batch.send() to stay within Resend API limits"
  - "Shared handleUnsubscribe helper for both GET and POST to support RFC 8058 one-click and link-click unsubscribe"
  - "Fail-silent unsubscribe: redirect to /unsubscribe landing page on any error (benefit of the doubt)"

patterns-established:
  - "Secret-protected API route pattern: Bearer token comparison against env var"
  - "Paginated Resend Audiences pattern: while loop with has_more + after cursor"
  - "RFC 8058 compliance pattern: both GET and POST handlers with List-Unsubscribe + List-Unsubscribe-Post headers"

requirements-completed: [EMAIL-04, EMAIL-05, EMAIL-08]

# Metrics
duration: 5min
completed: 2026-02-23
---

# Phase 3 Plan 3: Notify and Unsubscribe Summary

**Secret-protected notify route with paginated batch sending and RFC 8058-compliant one-click unsubscribe, plus verified SPF/DKIM DNS for xndr.site**

## Performance

- **Duration:** 5 min (includes checkpoint pause for user DNS/secrets configuration)
- **Started:** 2026-02-23T21:38:00Z
- **Completed:** 2026-02-23T21:45:40Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created POST /api/notify with Bearer token auth, paginated Resend Audiences contact fetch, batch send of 100, and List-Unsubscribe + List-Unsubscribe-Post headers on every email
- Created GET+POST /api/unsubscribe with HMAC token verification, contact lookup by email, contacts.update to mark unsubscribed, and redirect to /unsubscribe landing page
- User configured Resend account, API key, audience, secrets, and verified SPF + DKIM DNS records for xndr.site
- End-to-end email flow verified locally: subscribe -> confirm -> notify -> unsubscribe all working

## Task Commits

Each task was committed atomically:

1. **Task 1: Create notify and unsubscribe API routes** - `916337f` (feat)
2. **Task 2: Configure DNS records for email deliverability** - (user action: Resend account, API key, audience, secrets, DNS)

## Files Created/Modified
- `app/api/notify/route.ts` - POST handler: Bearer auth, getAllPosts for latest post, paginated contact fetch, batch send with List-Unsubscribe headers
- `app/api/unsubscribe/route.ts` - GET+POST handlers: HMAC token verification, contact lookup, contacts.update(unsubscribed: true), redirect to /unsubscribe

## Decisions Made
- Paginated contact fetch using while loop with `has_more` and `after` cursor to correctly handle audiences beyond the 100-contact API limit
- Batch send in groups of 100 via `resend.batch.send()` to comply with Resend API batch size limits (2 req/sec rate limit)
- Shared `handleUnsubscribe` helper function handles both GET (email link click) and POST (RFC 8058 native email client button) to avoid code duplication
- Fail-silent unsubscribe design: any error (invalid token, missing contact, API failure) redirects to /unsubscribe landing page rather than showing an error -- benefit of the doubt for the user

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

All user setup was completed during Task 2 (checkpoint:human-action):
- Resend account created with full-access API key
- RESEND_AUDIENCE_ID configured in .env.local
- SUBSCRIBE_SECRET and NOTIFY_SECRET generated and added to .env.local
- NEXT_PUBLIC_SITE_URL set in .env.local
- SPF + DKIM DNS records configured for xndr.site
- Email flow verified end-to-end locally

## Next Phase Readiness
- Phase 3 (Email Subscription) is fully complete -- all 3 plans executed
- All 8 EMAIL requirements satisfied
- The entire milestone (3 phases, 10 plans) is complete
- No blockers or concerns remain

## Self-Check: PASSED

All 2 created files verified on disk. Task 1 commit verified in git log (916337f).

---
*Phase: 03-email-subscription*
*Completed: 2026-02-23*
