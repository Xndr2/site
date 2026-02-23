# Roadmap: Xndr Portfolio Site

## Overview

This milestone takes an existing, working Next.js portfolio site and makes it better in three ways: clean up accumulated tech debt so the codebase is trustworthy, optimize performance so Lighthouse scores reflect a professional site, and add an email subscription system so blog readers can get notified of new posts. Each phase builds on the previous -- error boundaries create a safety net for optimization work, and optimization ensures the email feature ships on an already-fast site.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Codebase Cleanup** - Eliminate tech debt, fix error handling, and establish clean patterns across the codebase (completed 2026-02-23)
- [x] **Phase 2: Performance Optimization** - Measure and improve Core Web Vitals, bundle size, and caching to achieve Lighthouse >= 90 (completed 2026-02-23)
- [x] **Phase 3: Email Subscription** - Add blog subscribe form, double opt-in confirmation, notification emails, and one-click unsubscribe (completed 2026-02-23)

## Phase Details

### Phase 1: Codebase Cleanup

**Goal**: The codebase is free of dead code, properly typed, consistently formatted, and surfaces errors visibly instead of silently swallowing them
**Depends on**: Nothing (first phase)
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04, CLEAN-05, CLEAN-06, CLEAN-07, CLEAN-08
**Success Criteria** (what must be TRUE):

1. No dead code exists -- `util/performance.ts` is gone, `public/abandoned/` is gone, no unused exports remain
2. The particle animation component has zero `any` types and zero `eslint-disable` comments, and the animation still renders correctly
3. Every source file passes Prettier with no formatting changes needed
4. When the GitHub API or blog data fetch fails, the user sees a visible error state (not an empty page or empty list)
5. Every route with async data has both an `error.tsx` boundary (with fallback UI) and a `loading.tsx` skeleton
   **Plans**: 4 plans

Plans:

- [ ] 01-01-PLAN.md — Dead code deletion and unused npm package removal
- [ ] 01-02-PLAN.md — Prettier formatting, TypeScript any fixes, ESLint violation removal
- [x] 01-03-PLAN.md — Fix silent failures in github.ts and blog.ts, remove console statements
- [ ] 01-04-PLAN.md — Add error.tsx and loading.tsx per route segment (/projects, /blog)

### Phase 2: Performance Optimization

**Goal**: The site achieves measurably excellent performance with passing Core Web Vitals, optimized images, correct caching, and a lean JS bundle
**Depends on**: Phase 1
**Requirements**: OPT-01, OPT-02, OPT-03, OPT-04, OPT-05, OPT-06, OPT-07, OPT-08
**Success Criteria** (what must be TRUE):

1. Lighthouse Performance score is >= 90 on all pages, with documented before/after scores
2. Every `next/image` usage has a correct `sizes` prop, and only above-fold images have `priority`
3. Framer Motion contributes <= 10KB to the client bundle (down from ~30KB) via LazyMotion or equivalent tree-shaking
4. The projects page renders its shell immediately while GitHub data streams in via a Suspense boundary
5. Static assets serve with `Cache-Control: immutable` headers and ISR revalidation is explicitly configured
   **Plans**: 3 plans

Plans:

- [x] 02-01-PLAN.md — Lighthouse baseline measurement and bundle/dead-code cleanup
- [x] 02-02-PLAN.md — Image sizes audit, Suspense streaming, ISR and cache headers
- [x] 02-03-PLAN.md — Final Lighthouse verification and before/after documentation

### Phase 3: Email Subscription

**Goal**: Blog visitors can subscribe to email notifications, confirm via double opt-in, receive styled notification emails when new posts are published, and unsubscribe with one click
**Depends on**: Phase 2
**Requirements**: EMAIL-01, EMAIL-02, EMAIL-03, EMAIL-04, EMAIL-05, EMAIL-06, EMAIL-07, EMAIL-08
**Success Criteria** (what must be TRUE):

1. A visitor on the blog page can enter their email, submit the form, and see a success message telling them to check their email
2. The visitor receives a confirmation email with a link that, when clicked, activates their subscription
3. When the developer triggers the notify endpoint (with the correct secret), all confirmed subscribers receive a styled email with the latest post title, excerpt, reading time, and a "Read post" link
4. Every outgoing email contains a working one-click unsubscribe link, and clicking it removes the subscriber
5. Emails sent from xndr.site pass SPF and DKIM checks (DNS records configured for deliverability)
   **Plans**: 3 plans

Plans:

- [x] 03-01-PLAN.md — Foundation: install deps, lib utilities (Resend client, tokens, rate limiter), email templates, landing pages
- [x] 03-02-PLAN.md — Subscribe flow: subscribe + confirm API routes, subscribe form component, blog page integration
- [x] 03-03-PLAN.md — Notify + unsubscribe: notify + unsubscribe API routes, DNS configuration checkpoint

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase                       | Plans Complete | Status      | Completed |
| --------------------------- | -------------- | ----------- | --------- |
| 1. Codebase Cleanup         | 4/4 | Complete   | 2026-02-23 |
| 2. Performance Optimization | 3/3            | Complete    | 2026-02-23 |
| 3. Email Subscription       | 3/3            | Complete    | 2026-02-23 |
