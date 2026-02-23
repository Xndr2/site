# Project Research Summary

**Project:** Xndr Portfolio Site -- Newsletter + Optimization Milestone
**Domain:** Developer portfolio site with blog, email subscriptions, and Vercel performance optimization
**Researched:** 2026-02-23
**Confidence:** MEDIUM

## Executive Summary

This project adds two capabilities to an existing Next.js 15 portfolio site deployed on Vercel: an email subscription/notification system for the blog, and a performance optimization pass across the codebase. The existing site is well-structured (React 19, TypeScript, Tailwind, MDX blog, GitHub API integration) but carries technical debt in the particle animation component, silent error handling, and unaudited bundle size. Research confirms this is a straightforward enhancement of a working site, not a greenfield build -- the key is to avoid over-engineering what is fundamentally a single-author blog with fewer than 100 expected subscribers.

The recommended approach is a three-phase build: (1) clean up the codebase to establish error handling patterns and fix known tech debt, (2) optimize Vercel/Next.js performance using data from bundle analysis and Lighthouse baselines, and (3) add the email subscription system using Resend for sending and Resend Audiences for subscriber storage -- eliminating the need for any separate database. The most important architectural insight from research is that Resend Audiences can serve as both the email provider and the subscriber store, collapsing what was originally planned as two infrastructure dependencies (email API + database) into one. The notification trigger should be manual (a curl command after deploy), not automated, given the site's infrequent posting cadence.

The primary risks are legal (shipping subscribe without unsubscribe violates GDPR/CAN-SPAM), operational (free-tier email limits require capacity planning), and technical (the particle component is fragile and must be stabilized before other work proceeds). All three are well-understood and preventable with the right phase ordering: error boundaries first, then optimization, then email features with unsubscribe as a hard requirement of the subscribe feature.

## Key Findings

### Recommended Stack

The stack additions are minimal. Only three production dependencies are needed, and the architecture research argues convincingly that even the originally planned subscriber database (Vercel KV) is unnecessary. See `.planning/research/STACK.md` for full details.

**Core technologies:**

- **Resend** (email sending) -- developer-first API, ex-Vercel team, first-class Next.js alignment, free tier of ~3,000 emails/month (VERIFY current limits)
- **Resend Audiences** (subscriber storage) -- built-in contact list management eliminates need for Vercel KV, Supabase, or any separate database. Single source of truth.
- **React Email** (`@react-email/components`) -- write email templates as React components using the same JSX/TypeScript as the rest of the app
- **Raw `fetch()`** (Resend API calls) -- the architecture research recommends using fetch directly instead of the `resend` npm SDK, keeping the bundle lean for what amounts to two HTTP calls

**Critical version note:** Verify Resend free tier limits at resend.com/pricing before committing. The 3,000 emails/month figure is from early 2025 training data.

**Stack divergence between researchers:** STACK.md recommended Vercel KV for subscriber storage; ARCHITECTURE.md recommends Resend Audiences instead. The architecture recommendation is stronger -- it eliminates an entire infrastructure dependency and avoids the dual-source-of-truth problem. Adopt the Resend Audiences approach.

### Expected Features

See `.planning/research/FEATURES.md` for full landscape.

**Must have (table stakes):**

- Subscribe form with email input (single field, blog page placement)
- Client + server email validation
- Double opt-in (confirmation email) -- GDPR/CAN-SPAM compliance
- Unsubscribe link in every email -- legally required, ships WITH subscribe
- Rate limiting on subscribe endpoint -- protects free-tier quota
- Blog notification email on new post publish
- Error boundaries (`error.tsx`) and loading states (`loading.tsx`) for async routes
- Core Web Vitals passing (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Proper `next/image` sizing (`sizes` prop, `priority` for above-fold)

**Should have (differentiators):**

- Honeypot field for bot protection (better UX than CAPTCHA)
- Styled HTML notification email (simple responsive template)
- Post excerpt and metadata in notification
- Bundle analysis and Framer Motion tree-shaking
- `Suspense` boundaries for streaming on projects page

**Defer (v2+):**

- Newsletter management dashboard
- Multiple email lists / segmentation
- Frequency preferences (digest mode)
- Email open/click tracking
- RSS-to-email automation
- Service worker / PWA
- Dynamic OG images (`@vercel/og`)

### Architecture Approach

The architecture follows a clean two-flow model: a subscribe flow (visitor submits email via client component, API route stores in Resend Audiences) and a notify flow (developer triggers manual API call after deploy, route handler fetches subscribers from Resend and sends batch email). The subscribe form is a self-contained `"use client"` component imported into the Server Component blog page, preserving the zero-JS nature of the blog listing. API routes use the default Node.js runtime (NOT Edge) because the notify route reads blog posts from the filesystem via `getAllPosts()`. See `.planning/research/ARCHITECTURE.md` for full details.

**Major components:**

1. **`SubscribeForm`** (client component) -- email input, validation, submit state, success/error feedback
2. **`POST /api/subscribe`** (route handler) -- validates email, adds contact to Resend Audience
3. **`POST /api/notify`** (route handler) -- fetches subscribers from Resend, sends batch notification email, protected by shared secret
4. **`blog.ts`** (existing, unchanged) -- provides post data to the notify route

**Key architectural decisions:**

- No separate database -- Resend Audiences IS the subscriber store
- Manual notification trigger (curl command), not automated post detection
- No new npm dependencies beyond `@react-email/components` for templates (Resend API called via raw fetch)
- Three environment variables: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NOTIFY_SECRET`

### Critical Pitfalls

Top 5 pitfalls from `.planning/research/PITFALLS.md`, ordered by priority:

1. **Unsubscribe is legally required, not optional** -- GDPR and CAN-SPAM mandate one-click unsubscribe in every email. Ship it in the same phase as subscribe or do not ship subscribe at all. Include `List-Unsubscribe` headers. Store consent timestamps.

2. **Error handling must be fixed BEFORE refactoring** -- The current `catch { return []; }` pattern makes all other work dangerous. Add `error.tsx` boundaries first to create a safety net, then refactor the data layer. Without this, broken code produces silent empty states indistinguishable from working code.

3. **Particle component is fragile** -- `any[]` types, uncancelled animation frames, splice-during-iteration bug. Must be stabilized carefully: fix animation frame leak first, then the iteration bug, then types last. Do NOT convert refs to state.

4. **DNS records required for email deliverability** -- SPF, DKIM, DMARC must be configured on xndr.site BEFORE sending any emails. Without these, 80%+ of emails land in spam. This is the first task in the email phase, not an afterthought.

5. **Blog is SSG, not ISR -- timing matters for notifications** -- New posts require a Vercel deploy before they are live. Email notifications must be sent AFTER deploy completes, not after git push. Otherwise subscribers click through to 404s.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Codebase Cleanup

**Rationale:** Establishes the safety net (error boundaries) and clean patterns that all subsequent work depends on. Research unanimously places this first because silent error handling makes optimization measurement unreliable and new feature code quality will follow existing patterns.

**Delivers:** Clean, type-safe codebase with visible error states, no dead code, and a stable particle component.

**Addresses:** Error boundaries, loading states, dead code removal, TypeScript `any` fixes, eslint-disable cleanup, Prettier formatting pass.

**Avoids:** Pitfall #12 (silent errors masking breakage), Pitfall #1 (particle refactor), Pitfall #5 (deleting used files), Pitfall #9 (`exactOptionalPropertyTypes` surprises).

**Key tasks:**

1. Add `error.tsx` and `loading.tsx` to all route segments (safety net first)
2. Fix particle component: cancel animation frames, fix splice-during-iteration, type refs
3. Delete verified dead code (`util/performance.ts`, confirmed unused assets)
4. Replace `catch { return []; }` with proper error throwing + boundary catching
5. Run Prettier across codebase

### Phase 2: Vercel Optimization

**Rationale:** Must measure on the cleaned-up baseline, not the messy one. Bundle analysis and Lighthouse scores are only meaningful after dead code is removed and error boundaries are in place. This phase is data-driven: measure first, then act on the measurements.

**Delivers:** Passing Core Web Vitals, optimized bundle size, verified caching strategy.

**Uses:** Existing `@next/bundle-analyzer`, `next/image` optimization, Framer Motion tree-shaking.

**Implements:** Cache-Control headers, `priority` props on hero images, `sizes` props, `optimizePackageImports`, potential Framer Motion `LazyMotion` migration.

**Avoids:** Pitfall #10 (Framer Motion is the actual bundle cost, not small utilities), Pitfall #2 (Next.js 15 caching defaults), Pitfall #13 (font CLS).

**Key tasks:**

1. Run Lighthouse and record baseline scores
2. Run `ANALYZE=true next build` and identify top bundle contributors
3. Add `sizes` and `priority` to all `<Image>` components
4. Evaluate Framer Motion: replace with CSS animations where possible, use `LazyMotion` for the rest
5. Add explicit `cache` option to every `fetch()` call
6. Verify caching headers on Vercel deployment

### Phase 3: Email Subscription System

**Rationale:** Builds on the clean codebase and optimized site. This is the main new feature. Dependencies: Resend account + DNS setup must happen before any code. Subscribe flow must ship with unsubscribe (legal requirement). Notification flow depends on subscribers existing.

**Delivers:** Working email subscription with double opt-in, blog notification emails, one-click unsubscribe, proper deliverability.

**Uses:** Resend (email API), Resend Audiences (subscriber storage), React Email (templates).

**Implements:** `SubscribeForm` client component, `/api/subscribe` route, `/api/notify` route, email templates.

**Avoids:** Pitfall #3 (unsubscribe is legally required), Pitfall #4 (free-tier limits), Pitfall #8 (SSG timing vs notifications), Pitfall #11 (DNS records), Pitfall #15 (no separate database).

**Key tasks:**

1. Create Resend account, verify xndr.site domain (SPF/DKIM/DMARC)
2. Create Audience in Resend, set environment variables
3. Build subscribe form + `/api/subscribe` route
4. Build double opt-in confirmation flow
5. Build `/api/notify` route with batch sending
6. Build email template with unsubscribe link
7. Test end-to-end: subscribe, confirm, trigger notification, unsubscribe

### Phase Ordering Rationale

- **Cleanup before optimization:** You cannot measure performance on a codebase with silent errors and dead code. Error boundaries created in Phase 1 provide the safety net for Phase 2's refactoring (e.g., Framer Motion changes).
- **Optimization before email:** The email system adds new client components and API routes. Optimizing first means the email feature is built on an already-fast site and does not introduce regressions.
- **Subscribe before notify within Phase 3:** The notify flow is useless without subscribers. Building subscribe first allows testing the full flow incrementally.
- **DNS/Resend setup is the first task of Phase 3:** No code can be tested without the API key and verified domain. This is a blocking dependency.
- **Unsubscribe ships with subscribe, not after:** Legal requirement. The research is unambiguous on this point.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3 (Email):** Resend Audiences API specifics (contact management endpoints, free tier limits on Audiences feature, batch send API limits). The architecture depends on Audiences being available on the free tier -- this MUST be verified at resend.com before implementation begins.
- **Phase 2 (Optimization):** Framer Motion tree-shaking specifics -- the `framer-motion/m` import path and `LazyMotion` API should be verified against the installed version (v11).

Phases with standard patterns (skip research-phase):

- **Phase 1 (Cleanup):** All patterns are well-established (error boundaries, TypeScript strictness, Prettier). No research needed -- just execution.
- **Phase 3 subscribe form UX:** Standard email form patterns. No research needed.

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                                                                                                                                 |
| ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | MEDIUM      | Core recommendations (Resend, React Email) are sound but free-tier limits need live verification. No web search was available during research.                                                        |
| Features     | HIGH        | Email subscription patterns, CAN-SPAM/GDPR requirements, and Next.js optimization best practices are well-established and stable.                                                                     |
| Architecture | MEDIUM-HIGH | Route Handler patterns verified against Next.js 16.1.6 docs (fetched live). Resend Audiences as subscriber store is architecturally sound but depends on free-tier feature availability (unverified). |
| Pitfalls     | HIGH        | Pitfalls are grounded in direct codebase analysis (particles.tsx line numbers, tsconfig flags, blog.ts error patterns). Legal requirements are stable law.                                            |

**Overall confidence:** MEDIUM -- the technical patterns are solid, but the free-tier pricing and feature availability of Resend (the linchpin of the email architecture) must be verified before committing to implementation.

### Gaps to Address

- **Resend Audiences free tier:** The entire email architecture assumes Resend Audiences are available on the free plan. If they are not, fall back to Vercel KV as described in STACK.md. Verify at resend.com/pricing before Phase 3 planning.
- **Resend batch send API limits:** The notify flow sends to all subscribers in one batch call. Verify the batch API is available on the free tier and check per-call limits.
- **Framer Motion v11 tree-shaking:** The `framer-motion/m` import path and `LazyMotion` API need to be verified against the exact installed version. These APIs have changed between major versions.
- **Vercel Hobby plan limits:** Verify serverless function execution limits, KV storage (if needed as fallback), and cron job availability on the current plan.
- **Double opt-in implementation with Resend:** The exact mechanism for marking contacts as confirmed in Resend Audiences needs investigation. Resend may or may not support a "pending" contact state natively.

## Sources

### Primary (HIGH confidence)

- Next.js Route Handlers documentation (v16.1.6, fetched 2026-02-23) -- route handler patterns, runtime defaults
- Direct codebase analysis -- `particles.tsx`, `blog.ts`, `github.ts`, `layout.tsx`, `next.config.js`, `tsconfig.json`, `package.json`
- GDPR Article 7/17, CAN-SPAM Act -- legal requirements for email consent and unsubscribe
- TypeScript `exactOptionalPropertyTypes` documentation -- strict mode behavior
- Email deliverability standards (SPF/DKIM/DMARC) -- established DNS authentication protocols

### Secondary (MEDIUM confidence)

- Resend API patterns and free tier limits -- training data (early 2025), needs verification
- Vercel KV free tier limits (256MB, 30K req/day) -- training data, needs verification
- Framer Motion tree-shaking patterns (`LazyMotion`, `domAnimation`) -- training data, verify against v11
- Next.js 15 caching default change (no-store) -- well-documented migration change

### Tertiary (LOW confidence)

- Resend Audiences availability on free tier -- inferred from training data, critical to verify
- Vercel Cron Jobs on Hobby plan -- unverified, relevant only if manual trigger is replaced later

---

_Research completed: 2026-02-23_
_Ready for roadmap: yes_
