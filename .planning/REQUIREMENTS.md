# Requirements: Xndr Portfolio Site

**Defined:** 2026-02-23
**Core Value:** Visitors can discover who Xander is and what he's built — the site must load fast, look clean, and work reliably.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Cleanup

- [ ] **CLEAN-01**: Dead code deleted — `util/performance.ts`, `public/abandoned/`, all unused exports removed
- [x] **CLEAN-02**: `any` type eliminated from `particles.tsx` — canvas refs and particle arrays properly typed
- [x] **CLEAN-03**: All `eslint-disable` comments removed by fixing the underlying issues (not by deleting rules)
- [x] **CLEAN-04**: Prettier applied consistently across all source files with no formatting inconsistencies
- [x] **CLEAN-05**: Silent failures in `blog.ts` and `github.ts` replaced — errors thrown and caught at component boundaries with visible error UI
- [x] **CLEAN-06**: `console.error` removed from production code paths
- [x] **CLEAN-07**: `error.tsx` added per route segment (App Router error boundary pages with fallback UI)
- [x] **CLEAN-08**: `loading.tsx` added for routes with async data (`/blog`, `/projects`) with skeleton UI

### Optimization

- [x] **OPT-01**: Lighthouse / Core Web Vitals baseline measured and documented (LCP, CLS, INP scores before optimization)
- [x] **OPT-02**: All identified Core Web Vitals issues resolved to achieve Lighthouse Performance score ≥ 90
- [x] **OPT-03**: All `next/image` usages audited — `sizes` prop set correctly, `priority` on above-fold images only
- [x] **OPT-04**: Caching headers verified and corrected — ISR revalidation, static asset `Cache-Control: immutable`
- [x] **OPT-05**: Bundle analyzer run and all identified quick-win bundle reductions implemented
- [x] **OPT-06**: Framer Motion tree-shaken via `LazyMotion` + `domAnimation` (reduce ~30KB to ~5KB)
- [x] **OPT-07**: Particle component loaded via `next/dynamic` with `ssr: false` to defer heavy canvas code
- [x] **OPT-08**: Projects page GitHub data wrapped in `<Suspense>` boundary so page shell renders immediately

### Email Subscription

- [x] **EMAIL-01**: Subscribe form in blog page — email input, hidden honeypot field, client-side email validation
- [x] **EMAIL-02**: `POST /api/subscribe` route — validates email server-side, rate-limits by IP, adds unconfirmed contact to Resend Audiences, sends double opt-in confirmation email
- [x] **EMAIL-03**: Confirmation link (`GET /api/confirm?token=...`) — activates subscriber status in Resend Audiences
- [x] **EMAIL-04**: Every outgoing email includes a working one-click unsubscribe link (Resend Audiences handles this)
- [x] **EMAIL-05**: `POST /api/notify` route (secret-protected) — fetches all confirmed subscribers, sends notification email to each via Resend
- [x] **EMAIL-06**: Notification email uses styled HTML template — post title (subject line), excerpt (150 chars), reading time, prominent "Read post" link, unsubscribe footer
- [x] **EMAIL-07**: Subscribe form shows inline success message after submit ("Check your email to confirm your subscription")
- [x] **EMAIL-08**: DNS records configured on `xndr.site` — SPF + DKIM set up via Resend dashboard for email deliverability

## v2 Requirements

Deferred to a future milestone.

### Email Automation

- **AUTO-01**: Vercel deploy hook triggers notification automatically when a new blog post deploys (replaces manual curl)
- **AUTO-02**: Subscriber count exposed via Resend Audiences API for internal visibility

### Polish

- **POLISH-01**: Toast/animation on subscribe form success instead of inline text
- **POLISH-02**: JSDoc comments on public utility functions (`getAllPosts`, `fetchGitHubRepos`, `getPostBySlug`)

## Out of Scope

| Feature                               | Reason                                                           |
| ------------------------------------- | ---------------------------------------------------------------- |
| Newsletter management dashboard       | Resend's built-in UI is sufficient for low subscriber counts     |
| Email open/click tracking             | Privacy-invasive; contradicts developer-respects-privacy brand   |
| Multiple email lists / segmentation   | One content type, one list, one notification                     |
| Testing suite                         | Separate concern, not part of this milestone                     |
| Service worker / PWA                  | Added complexity, portfolio doesn't need offline mode            |
| External CDN (Cloudflare, Cloudinary) | Vercel is the CDN; adding external CDN creates conflicts         |
| Paid email services                   | $0 hard constraint                                               |
| RSS-to-email automation               | Free tier doesn't support it reliably; manual trigger is simpler |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| CLEAN-01    | Phase 1 | Pending  |
| CLEAN-02    | Phase 1 | Complete |
| CLEAN-03    | Phase 1 | Complete |
| CLEAN-04    | Phase 1 | Complete |
| CLEAN-05    | Phase 1 | Complete |
| CLEAN-06    | Phase 1 | Complete |
| CLEAN-07    | Phase 1 | Complete |
| CLEAN-08    | Phase 1 | Complete |
| OPT-01      | Phase 2 | Complete |
| OPT-02      | Phase 2 | Complete |
| OPT-03      | Phase 2 | Complete |
| OPT-04      | Phase 2 | Complete |
| OPT-05      | Phase 2 | Complete |
| OPT-06      | Phase 2 | Complete |
| OPT-07      | Phase 2 | Complete |
| OPT-08      | Phase 2 | Complete |
| EMAIL-01    | Phase 3 | Complete |
| EMAIL-02    | Phase 3 | Complete |
| EMAIL-03    | Phase 3 | Complete |
| EMAIL-04    | Phase 3 | Complete |
| EMAIL-05    | Phase 3 | Complete |
| EMAIL-06    | Phase 3 | Complete |
| EMAIL-07    | Phase 3 | Complete |
| EMAIL-08    | Phase 3 | Complete |

**Coverage:**

- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---

_Requirements defined: 2026-02-23_
_Last updated: 2026-02-23 after initial definition_
