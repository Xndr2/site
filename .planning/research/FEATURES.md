# Feature Landscape

**Domain:** Developer portfolio site with blog, email subscriptions, and Vercel-optimized performance
**Researched:** 2026-02-23
**Overall confidence:** MEDIUM (based on training data; web search unavailable for live verification)

---

## 1. Email Subscription System

### Table Stakes

Features subscribers expect from any email subscription on a developer blog. Missing any of these and the system feels broken or untrustworthy.

| Feature                                          | Why Expected                                                                                       | Complexity | Free-Tier Impact                              | Notes                                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Subscribe form with email input                  | Without it there is no subscription system                                                         | Low        | None                                          | Single field + submit button. Place in blog sidebar/footer or end-of-post. Keep it minimal -- name field is unnecessary for a dev blog. |
| Email validation (client + server)               | Prevents garbage submissions and wasted sends                                                      | Low        | Reduces wasted quota                          | HTML5 `type="email"` plus server-side regex/library check. Block obviously invalid addresses before they hit the provider.              |
| Double opt-in (confirmation email)               | Required by GDPR, CAN-SPAM best practices. Prevents abuse. Single opt-in leads to spam complaints. | Medium     | Costs 1 email per signup but prevents bounces | Send a confirmation link email. Only activate subscriber after click. Non-negotiable for a public-facing form.                          |
| Unsubscribe link in every email                  | Legally required (CAN-SPAM, GDPR). Email providers will flag you without it.                       | Low        | None                                          | One-click unsubscribe. Every email must have it in the footer. Most email APIs handle this automatically.                               |
| Confirmation/success feedback                    | Users need to know their action worked                                                             | Low        | None                                          | "Check your email to confirm" message after form submission. Inline, not a redirect.                                                    |
| Rate limiting on subscribe endpoint              | Without it, bots exhaust your free tier quota in minutes                                           | Medium     | Critical -- protects email quota              | Rate limit by IP. 3-5 attempts per hour is reasonable. Use Vercel Edge Middleware or in-route checks.                                   |
| Basic notification email when new post published | This is the entire point of the subscription                                                       | Medium     | Main quota consumer                           | Trigger manually or via webhook/build hook. Send to all confirmed subscribers.                                                          |

### Differentiators

Features that make the subscription feel polished but are not expected on a solo dev blog.

| Feature                                         | Value Proposition                                           | Complexity | Free-Tier Impact             | Notes                                                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------- | ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Honeypot field for bot protection               | Catches simple bots without CAPTCHA friction                | Low        | Saves quota from bot signups | Hidden form field; if filled, reject silently. Better UX than CAPTCHA for a low-traffic blog. Worth doing.                                       |
| Styled HTML notification emails                 | Makes emails look professional rather than plain text dumps | Medium     | None (same send cost)        | Use a simple responsive email template. Keep it lightweight -- 1 column, blog title, excerpt, read link. Heavy templates break in email clients. |
| Post excerpt/preview in notification            | Gives subscribers a reason to click through                 | Low        | None                         | Include first 150-200 chars of the post or the frontmatter description.                                                                          |
| Subscriber count (internal)                     | Know if the system is working                               | Low        | None                         | Track count in your datastore. Display only to yourself.                                                                                         |
| Toast/animation on subscribe success            | Polished UX feel                                            | Low        | None                         | Subtle. A checkmark transition or toast notification. Don't overdo it.                                                                           |
| Graceful degradation when email service is down | Shows the form still works but explains the issue           | Low        | None                         | Catch API errors. Show "try again later" rather than crashing.                                                                                   |

### Anti-Features

Features to deliberately NOT build for a free-tier developer portfolio.

| Anti-Feature                                        | Why Avoid                                                                                                                           | What to Do Instead                                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Newsletter management dashboard                     | You have 0-100 subscribers. A dashboard is over-engineering. Use the email provider's built-in dashboard or a DB query.             | Check subscriber count via provider API or direct DB query when curious.                                    |
| Rich email editor / template builder                | Massive complexity for a single-person blog. You'll send the same format every time.                                                | Hardcode one email template. Change it in code if needed.                                                   |
| Multiple email lists / segmentation                 | Solo dev blog with one content type. Segmentation is meaningless.                                                                   | One list. One notification type. Done.                                                                      |
| Frequency preferences (daily/weekly digest)         | You post monthly at most. Digest logic is complexity with zero value.                                                               | Send on publish. That's it.                                                                                 |
| Analytics in emails (open tracking, click tracking) | Invasive, adds complexity, most email clients block tracking pixels anyway. Contradicts the "developer who respects privacy" brand. | Check subscriber count growth. If people unsubscribe, you'll know.                                          |
| CAPTCHA on subscribe form                           | Friction that kills conversion on a low-traffic blog. Honeypot + rate limiting is sufficient.                                       | Honeypot field + rate limiting.                                                                             |
| RSS-to-email automation                             | Requires paid tiers on most platforms. Over-engineering for manual publish cadence.                                                 | Trigger notification manually or via a build/deploy hook when new MDX file is committed.                    |
| Subscriber import/export                            | You don't have subscribers to import. Build it if you ever need to migrate (you won't for a long time).                             | Store emails in a standard format (simple DB table) so export is a trivial query if ever needed.            |
| Welcome email series / drip campaigns               | Marketing automation for a personal blog is absurd.                                                                                 | Single confirmation email. Optionally mention what they'll get ("new post notifications, roughly monthly"). |

### Feature Dependencies

```
Email validation --> Subscribe endpoint --> Double opt-in flow --> Subscriber stored as confirmed
                                                                          |
New blog post published --> Notification trigger --> Fetch confirmed subscribers --> Send emails
                                                                                         |
                                                                              Unsubscribe link --> Mark unsubscribed
```

---

## 2. Blog Notification Email Content

### Table Stakes

| Feature                          | Why Expected                                                      | Complexity | Notes                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Post title in subject line       | People need to know what the email is about to open it            | Low        | Subject: "New post: [Title]" or "[Blog Name]: [Title]". Keep under 60 chars.                                         |
| Post title + link in body        | The core purpose of the notification                              | Low        | Direct link to the blog post.                                                                                        |
| Unsubscribe link in footer       | Legally required                                                  | Low        | One-click. "Unsubscribe from these notifications" text + link.                                                       |
| From address matches your domain | Emails from random domains get flagged as spam                    | Medium     | Requires DNS setup (SPF, DKIM). Use `noreply@xndr.site` or `blog@xndr.site`. Most email APIs guide you through this. |
| Plain text fallback              | Some email clients, accessibility tools, and spam filters need it | Low        | Every HTML email should have a plain text `multipart/alternative`. Most email APIs support this natively.            |

### Differentiators

| Feature                            | Value Proposition                           | Complexity | Notes                                                                                                                                               |
| ---------------------------------- | ------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Post excerpt (150-200 chars)       | Entices the click-through                   | Low        | Pull from frontmatter description or auto-truncate content.                                                                                         |
| Post metadata (reading time, tags) | Developer audience appreciates this context | Low        | Already computed in blog.ts -- reuse `readingTime` and `tags`.                                                                                      |
| Minimal branded header             | Looks professional                          | Low        | Blog name + small logo/icon. Don't overdesign.                                                                                                      |
| Responsive single-column layout    | Readable on mobile                          | Medium     | Use table-based email layout (yes, tables -- email HTML is stuck in 2005). Or use a utility like `react-email` for component-based email templates. |

### Anti-Features for Email Content

| Anti-Feature               | Why Avoid                                                                    | What to Do Instead                      |
| -------------------------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| Full post content in email | Defeats the purpose of driving traffic to your site. Also makes emails huge. | Excerpt + "Read more" link.             |
| Images/media in email body | Email clients block images by default. Adds complexity. Bloats email size.   | Text-focused email. Maybe a small logo. |
| Social sharing buttons     | Nobody clicks these. They add clutter and tracking complexity.               | Clean, focused email.                   |
| Multiple CTAs              | Confuse the reader. One email, one action: read the post.                    | Single "Read post" link/button.         |

---

## 3. Vercel Optimization (Next.js 15)

### Table Stakes

Features/optimizations that a well-deployed Vercel site must have. Without these, Lighthouse scores will be mediocre and the site will feel sluggish.

| Feature                          | Why Expected                                                                                  | Complexity | Current Status                          | Notes                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Core Web Vitals passing (green)  | Google ranking factor. Professional credibility. LCP < 2.5s, FID/INP < 200ms, CLS < 0.1.      | Medium     | Unknown -- needs measurement            | Measure first, optimize second. Don't guess at problems.                                                                                    |
| `next/image` with proper sizing  | Without explicit width/height or `sizes`, images cause layout shift (CLS) and are unoptimized | Low        | Partially done (per architecture)       | Verify every `<Image>` has `sizes` prop or explicit dimensions. Use `priority` for above-the-fold images only.                              |
| Metadata on all pages            | SEO table stakes. Missing titles/descriptions tank discoverability.                           | Low        | Done (per architecture)                 | Already using Next.js metadata API. Verify OG images render correctly.                                                                      |
| Static generation where possible | SSG pages are fastest. No server computation at request time.                                 | Low        | Blog done, others need verification     | Blog uses `generateStaticParams`. Home, About, Contact should be fully static. Projects uses ISR (24h revalidation) which is correct.       |
| Proper caching headers           | Browser caching for static assets. CDN caching for pages.                                     | Medium     | Partially done (24h GitHub, 30d images) | Verify `Cache-Control` headers on Vercel. Static assets should be `immutable`. ISR pages should have `s-maxage` + `stale-while-revalidate`. |
| Minimal client-side JavaScript   | Server Components by default. Only `"use client"` where interactivity is needed.              | Medium     | Mostly done but particles.tsx is heavy  | Audit the bundle. The particle component is the main JS cost. Navbar is correctly client-side.                                              |
| Font optimization                | Unoptimized fonts cause layout shift and slow LCP                                             | Low        | Using `next/font` with Inter            | Verify `display: swap` is set. Subset fonts if possible.                                                                                    |
| No render-blocking resources     | CSS/JS that blocks first paint kills LCP                                                      | Low        | Likely fine with Next.js defaults       | Tailwind CSS is purged at build. Verify no external stylesheets or scripts block rendering.                                                 |
| Error boundaries                 | Unhandled errors crash the page. Error boundaries show fallback UI.                           | Medium     | Missing (per CONCERNS.md)               | Add `error.tsx` and `not-found.tsx` files in route segments. Next.js App Router supports these natively.                                    |
| Loading states                   | Async data without loading states shows blank/janky content                                   | Low        | Missing (per CONCERNS.md)               | Add `loading.tsx` for routes with async data (blog listing, projects). Skeleton UI or simple spinner.                                       |

### Differentiators

Optimizations that take a site from "fine" to "fast" but aren't required for passing scores.

| Feature                                  | Value Proposition                                                               | Complexity | Notes                                                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bundle analysis + tree shaking audit     | Know exactly what's in your JS bundle. Remove what's unnecessary.               | Low        | Run `@next/bundle-analyzer`. Check if `framer-motion` is tree-shaken properly. May find easy wins.                                                    |
| Preconnect/prefetch for external origins | Saves 100-300ms on GitHub API, external font/CDN connections                    | Low        | Add `<link rel="preconnect">` for `api.github.com` and any CDN origins.                                                                               |
| Image format optimization (AVIF/WebP)    | 30-50% smaller than JPEG/PNG                                                    | Low        | Next.js Image does this by default. Verify `formats: ['image/avif', 'image/webp']` in next.config.                                                    |
| Route-based code splitting verification  | Ensure each page only loads its own code                                        | Low        | Next.js does this by default but shared components can bloat chunks. Verify with bundle analyzer.                                                     |
| `Suspense` boundaries for streaming      | Show page shell immediately, stream in data                                     | Medium     | Useful for projects page (GitHub API fetch). Wrap async components in `<Suspense>` with fallback.                                                     |
| Prerender static pages at edge           | Deploy static pages to edge network for lowest latency                          | Low        | Vercel does this by default for SSG pages. Verify with `vercel inspect`.                                                                              |
| Security headers tuned                   | Already have some headers (per PROJECT.md). Verify they don't hurt performance. | Low        | `X-Frame-Options`, CSP etc. should already be in `next.config.js`. Verify `Content-Security-Policy` doesn't block inline scripts needed by analytics. |

### Anti-Features for Optimization

| Anti-Feature                                       | Why Avoid                                                                                                               | What to Do Instead                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Lazy loading everything                            | Over-lazy-loading increases interaction-to-paint time. Above-fold content should load eagerly.                          | `priority` on hero images. Lazy load below-fold only.                                 |
| Third-party performance monitoring (beyond Vercel) | Vercel Analytics + Speed Insights already cover this. Adding Datadog/Sentry for a portfolio is overkill.                | Use what's built in. Check Vercel dashboard.                                          |
| Service worker / PWA                               | Adds offline support nobody needs for a portfolio site. Increases complexity. Can cause stale content bugs.             | Skip entirely.                                                                        |
| AMP pages                                          | Dead technology for this use case. Adds huge maintenance burden.                                                        | Standard Next.js pages.                                                               |
| CDN for static assets (external)                   | Vercel IS the CDN. Adding Cloudflare or similar creates complexity and potential cache conflicts.                       | Let Vercel handle it.                                                                 |
| Aggressive prefetching of all routes               | Wastes bandwidth. Next.js prefetches visible links by default which is sufficient.                                      | Default `<Link>` prefetch behavior. Don't add custom `prefetch` calls.                |
| Custom image CDN (Cloudinary, imgix)               | `next/image` with Vercel's built-in image optimization is free and handles this. External CDN adds cost and complexity. | Use `next/image`. If you have many large images, optimize source files before commit. |

### Metrics That Actually Matter

| Metric                              | Target          | Why It Matters                                | What Moves It                                                                                                                  |
| ----------------------------------- | --------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **LCP** (Largest Contentful Paint)  | < 2.5s          | Perceived load speed. Google ranking.         | Hero image size, font loading, server response time. For this site: likely hero text/particle canvas.                          |
| **INP** (Interaction to Next Paint) | < 200ms         | Responsiveness. Replaced FID in 2024.         | Event handler efficiency. For this site: particle mouse tracking, navbar toggle.                                               |
| **CLS** (Cumulative Layout Shift)   | < 0.1           | Visual stability. Jarring shifts feel broken. | Image dimensions, font swap, dynamic content insertion. For this site: blog post loading, GitHub repo cards.                   |
| **TTFB** (Time to First Byte)       | < 800ms         | Server responsiveness.                        | SSG/ISR. Already good on Vercel for static pages.                                                                              |
| **Total JS bundle size**            | < 200KB gzipped | Affects parse time, especially on mobile.     | Tree shaking, code splitting, `"use client"` boundary audit. Particle component + Framer Motion are likely the biggest chunks. |
| **Lighthouse Performance score**    | > 90            | Professional credibility for a dev portfolio  | Composite of above metrics.                                                                                                    |

### Cargo-Cult Optimizations (Do NOT Waste Time On)

These are frequently recommended but provide negligible or zero benefit for this specific site.

| "Optimization"             | Why It's Cargo Cult Here                                                                   | Reality                                      |
| -------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Minifying HTML             | Next.js does this automatically. Manual minification adds nothing.                         | Already handled.                             |
| Reducing DNS lookups       | You have 1-2 external domains max (GitHub API, maybe analytics). Not a bottleneck.         | Ignore unless you add many external scripts. |
| HTTP/2 server push         | Vercel handles protocol-level optimizations. You can't configure this and don't need to.   | Managed by platform.                         |
| Inlining critical CSS      | Tailwind CSS is already small after purging. Next.js handles CSS extraction well.          | Marginal at best. Not worth the effort.      |
| Deferring non-critical CSS | All your CSS is Tailwind utility classes needed for first paint. There's nothing to defer. | N/A for this stack.                          |

---

## 4. Codebase Cleanup

### Table Stakes

What makes a "clean" Next.js codebase. If these aren't addressed, the codebase feels unprofessional and hinders future development.

| Feature                                          | Why Expected                                             | Complexity | Current Status                                                       | Notes                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------- | ---------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| No dead code                                     | Dead code confuses future-you and signals neglect        | Low        | `util/performance.ts` is dead, `public/abandoned/` has legacy assets | Delete them. Run `tsc --noUnusedLocals --noUnusedParameters` to find more.                         |
| No `any` types in strict TypeScript              | Defeats the purpose of TypeScript. Hides bugs.           | Medium     | `particles.tsx` has `any[]` refs                                     | Type the canvas refs properly: `useRef<HTMLCanvasElement>(null)`, particle arrays as typed arrays. |
| No eslint-disable without justification          | Suppressed linting hides real issues                     | Low        | `particles.tsx` has multiple suppressions                            | Fix the underlying issues. If a disable is truly needed, add a comment explaining why.             |
| Consistent code formatting                       | Mixed formatting is distracting and causes noisy diffs   | Low        | Needs audit                                                          | Run Prettier across the codebase. Set a `.prettierrc`. Enforce in CI or editor config.             |
| Meaningful error handling                        | Silent failures make debugging impossible                | Medium     | GitHub API and blog silently return `[]`                             | Throw errors in utility functions. Catch in components. Show error UI or log to Vercel.            |
| Proper TypeScript interfaces for all data shapes | Ensures type safety across the system                    | Low        | Mostly done, gaps in GitHub API types                                | Verify GitHub API response types match actual API shape. No `as any` casting.                      |
| Consistent file/folder naming                    | Convention reduces cognitive load                        | Low        | Needs audit                                                          | kebab-case for files (Next.js convention). Verify no mixed conventions.                            |
| No console.log/error in production code          | Leaks implementation details. Not a real error strategy. | Low        | `console.error` used in github.ts                                    | Replace with proper error handling (throw + catch at boundary, or Vercel logging).                 |

### Differentiators

Cleanup that goes beyond "not messy" into "well-engineered."

| Feature                                    | Value Proposition                                                       | Complexity | Notes                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| Error boundary components per route        | Graceful degradation with helpful error UI instead of blank pages       | Medium     | Add `error.tsx` files in each route directory. Show "Something went wrong" with retry button.       |
| Loading skeletons for async routes         | Professional UX during data fetching                                    | Medium     | Add `loading.tsx` with skeleton matching the final layout shape. Blog list, projects page.          |
| Centralized error logging utility          | One place to control error behavior (log, report, display)              | Low        | Simple utility: in dev `console.error`, in prod could log to Vercel's runtime logs or just `throw`. |
| JSDoc comments on public utility functions | Self-documenting code for future maintenance                            | Low        | `getAllPosts()`, `getGithubRepos()`, `getPostBySlug()` should have param/return docs.               |
| Barrel exports for clean imports           | `import { getAllPosts, getPostBySlug } from '@/lib/blog'` reads cleaner | Low        | Only if the project grows. For current size this is optional.                                       |
| Path aliases (`@/`) configured             | Cleaner imports, no `../../..` chains                                   | Low        | Likely already configured in `tsconfig.json`. Verify.                                               |

### Anti-Features for Cleanup

| Anti-Feature                                         | Why Avoid                                                                                        | What to Do Instead                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Adding a full testing suite during cleanup           | Testing is a separate concern. Mixing it into cleanup makes the cleanup PR huge and unfocused.   | Cleanup first. Tests in a separate milestone if ever needed.                             |
| Refactoring architecture during cleanup              | Cleanup means removing debt, not redesigning. Architecture changes are scope creep.              | Fix types, remove dead code, surface errors. Don't move files around or change patterns. |
| Adding ESLint rules beyond what's already configured | New rules surface new violations. Focus on fixing current suppressions first.                    | Fix existing eslint-disable comments. Consider stricter rules in a future pass.          |
| Over-documenting with JSDoc on every function        | Internal single-dev project. Over-documentation becomes stale faster than it helps.              | Document non-obvious public functions. Skip obvious ones.                                |
| Adopting a new formatter/linter (Biome, dprint)      | Prettier + ESLint is the established Next.js ecosystem standard. Switching tools is yak-shaving. | Use Prettier. It works. Move on.                                                         |

---

## Feature Dependencies (Cross-Cutting)

```
Codebase Cleanup (error handling, type safety)
    |
    +--> Vercel Optimization (error boundaries need clean error patterns)
    |        |
    |        +--> Lighthouse measurement (measure AFTER cleanup, not before)
    |
    +--> Email Subscription (new code should follow cleaned-up patterns)
              |
              +--> Double opt-in flow (requires working email sending)
              |
              +--> Blog notification (requires subscriber storage + email sending)
              |
              +--> Unsubscribe (requires subscriber storage)
```

**Ordering rationale:** Cleanup first establishes patterns and removes noise. Optimization second measures and improves on the clean baseline. Email third builds new functionality on the solid foundation.

---

## MVP Recommendation

### Phase 1: Codebase Cleanup

Prioritize:

1. Delete dead code (`util/performance.ts`, `public/abandoned/`)
2. Fix `any` types in `particles.tsx`
3. Remove `eslint-disable` comments by fixing underlying issues
4. Replace silent error returns with thrown errors + error boundaries
5. Run Prettier across codebase

Defer: JSDoc comments, barrel exports (nice but not critical)

### Phase 2: Vercel Optimization

Prioritize:

1. Measure current Lighthouse scores (you need a baseline before optimizing)
2. Add `loading.tsx` and `error.tsx` for async routes
3. Audit bundle size with `@next/bundle-analyzer`
4. Verify `next/image` sizing and `priority` props
5. Verify caching headers (ISR revalidation, static asset immutability)

Defer: Preconnect hints, Suspense streaming (measure first, only add if scores need it)

### Phase 3: Email Subscriptions

Prioritize:

1. Subscribe form (single email field + honeypot + rate limiting)
2. API route for subscription (validate, store, trigger double opt-in)
3. Double opt-in confirmation email
4. Subscriber storage (confirmed/unconfirmed/unsubscribed status)
5. Notification email on new post (trigger mechanism + email template + send to all confirmed)
6. Unsubscribe endpoint

Defer: Styled HTML emails (start with simple but clean HTML), subscriber analytics

---

## Free-Tier Constraint Summary

The $0 budget constraint shapes every feature decision. Key limits to design around:

| Service Area                                     | Free Tier Reality                           | Design Implication                                                                                                                                                                     |
| ------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email sending (Resend)                           | ~100 emails/day, 3,000/month on free tier   | Double opt-in costs 1 email per signup. Batch notifications count per recipient. At 100 subscribers, one blog post = 100+ emails. Sustainable for a personal blog's posting frequency. |
| Subscriber storage (Vercel KV / Supabase / Neon) | Varies: ~256MB storage, limited requests    | A subscriber table with email + status + dates is tiny. Any free DB handles this for thousands of subscribers.                                                                         |
| Vercel hosting                                   | 100GB bandwidth, serverless function limits | Portfolio site with blog is well within limits. Email API routes add minimal serverless invocations.                                                                                   |
| DNS/domain                                       | Already owned (xndr.site)                   | Need to configure SPF/DKIM records for email deliverability. This is free but requires DNS access.                                                                                     |

**Critical constraint:** If subscriber count ever exceeds ~100, you cannot send all notifications in one day on Resend free tier. Mitigation: batch sends across multiple days, or switch to a provider with higher free limits (Brevo: 300 emails/day). This is a problem for future-you, not now.

---

## Confidence Assessment

| Area                           | Confidence | Notes                                                                                                                                                                                               |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email subscription UX patterns | HIGH       | Well-established patterns. Double opt-in, unsubscribe, rate limiting are industry standard and stable.                                                                                              |
| Email notification content     | HIGH       | Standard practices. Subject lines, plain text fallback, unsubscribe links are legally and technically well-documented.                                                                              |
| Vercel/Next.js optimization    | MEDIUM     | Core Web Vitals targets and Next.js optimization patterns are well-established. Specific Vercel configuration details may have changed -- verify against current Vercel docs during implementation. |
| Free tier limits               | LOW        | Specific numbers (100 emails/day for Resend, etc.) are from training data and may have changed. Verify current pricing pages before committing to a provider.                                       |
| Codebase cleanup patterns      | HIGH       | TypeScript strict mode, Prettier, error boundaries are stable Next.js/React patterns.                                                                                                               |

---

## Sources

- Training data knowledge (Next.js App Router patterns, email subscription best practices, Core Web Vitals metrics)
- Project context: `.planning/PROJECT.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`
- **Note:** Web search and external documentation fetch were unavailable during this research. Free tier limits and specific Vercel configuration details should be verified against current official documentation before implementation decisions are finalized.

---

_Generated: 2026-02-23_
