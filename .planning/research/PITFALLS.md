# Domain Pitfalls

**Domain:** Next.js 15 portfolio site refactoring, Vercel optimization, email subscriptions
**Researched:** 2026-02-23
**Overall Confidence:** MEDIUM (training data only -- no web search available to verify latest Next.js 15 / React 19 edge cases)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deployments, or legal exposure.

---

### Pitfall 1: Particle Component Refactor Breaks Animation Loop

**What goes wrong:** The `particles.tsx` component uses a `requestAnimationFrame` loop that never cancels (line 233: `window.requestAnimationFrame(animate)`). During refactoring, if you extract or restructure this component, the animation frame callback captures stale closure state. The `circles.current` ref is typed as `any[]` (line 24), so TypeScript cannot catch misuse. Splicing the array during iteration (line 214: `circles.current.splice(i, 1)`) is already a bug -- it skips elements when removing from inside a `forEach`. Refactoring this to fix the `any` type or restructure the loop can silently break particle spawning behavior.

**Why it happens:** The component mixes mutable refs, closure-captured state, and imperative canvas drawing in ways that are fragile but "work." Any structural change (extracting the animation to a custom hook, splitting draw functions, adding cleanup) risks disrupting the timing.

**Consequences:** Particles stop appearing, memory leaks from uncancelled animation frames, or infinite re-renders if state is accidentally introduced where refs currently live.

**Prevention:**

1. Add a visual regression test (screenshot comparison) BEFORE touching particles.tsx
2. Fix the animation frame leak first: store the frame ID in a ref and cancel in the useEffect cleanup
3. Fix the splice-during-iteration bug by iterating in reverse or filtering to a new array
4. Replace `any[]` with `Circle[]` only AFTER the animation logic is stabilized
5. Do NOT convert refs to state -- the animation loop depends on mutable refs for performance

**Detection:** Particles visually disappear or flicker. Browser DevTools Performance tab shows mounting animation frame callbacks. Memory usage climbs steadily.

**Phase:** Codebase cleanup (Phase 1) -- must be addressed before optimization work begins.

---

### Pitfall 2: Next.js 15 Caching Defaults Changed -- Silent Data Staleness or Over-Fetching

**What goes wrong:** Next.js 15 changed the default `fetch` caching behavior. In Next.js 14, `fetch()` was cached by default (`force-cache`). In Next.js 15, `fetch()` is NOT cached by default (`no-store`). The GitHub API call in `github.ts` explicitly sets `next: { revalidate: 86400 }` which is correct, but any NEW fetch calls added during the email subscription work will default to no-store, meaning they hit the network on every request unless explicitly configured.

**Why it happens:** Developers coming from Next.js 14 habits assume fetch caching is automatic. The Next.js 15 migration changed this default, and the codebase was likely created on or migrated to 15 without revisiting all fetch patterns.

**Consequences:** New API routes (email service calls, subscriber lookups) hit third-party APIs on every single request, burning through free-tier rate limits. Or conversely, adding `force-cache` where dynamic data is needed causes stale subscription confirmations.

**Prevention:**

1. Every `fetch()` call must have an explicit `cache` or `next.revalidate` option -- never rely on defaults
2. Document the caching strategy per-endpoint in a comment: `// Cache: 24h ISR -- GitHub data changes rarely`
3. For email service API calls (subscribe/unsubscribe), use `cache: 'no-store'` explicitly since these are mutations
4. Add a lint rule or code review checklist item: "Does every fetch have an explicit cache strategy?"

**Detection:** Vercel dashboard shows unexpected function invocations. Free-tier API limits hit earlier than expected. Stale data persists after subscriber actions.

**Phase:** Vercel optimization (Phase 2) -- audit all existing fetches and establish the pattern before adding new ones in email phase.

---

### Pitfall 3: Email Without Unsubscribe = GDPR/CAN-SPAM Violation

**What goes wrong:** Developers build the "subscribe" flow first and defer unsubscribe as a "nice to have." Under GDPR (applies to Belgian site owner and any EU visitors) and CAN-SPAM (applies if any US visitors receive emails), every marketing email MUST include a working one-click unsubscribe mechanism. Missing this is not a quality issue -- it is a legal violation with fines.

**Why it happens:** Subscription is the exciting feature; unsubscribe is boring plumbing. The PROJECT.md mentions "Add email subscribe form" but does not explicitly mention unsubscribe, which could lead to it being deprioritized.

**Consequences:** GDPR fines (up to 4% of annual turnover, though enforcement against small sites is rare, the risk is nonzero). CAN-SPAM fines ($50,120 per email). More practically: email providers like Gmail will flag emails without unsubscribe headers as spam, destroying deliverability.

**Prevention:**

1. Unsubscribe is NOT optional -- it ships in the same phase as subscribe, or subscribe does not ship
2. Implement RFC 8058 `List-Unsubscribe` and `List-Unsubscribe-Post` headers in every email
3. Include a visible unsubscribe link in the email footer
4. Unsubscribe must work with a single click (no login, no "are you sure" forms)
5. Process unsubscribe requests within 10 business days (CAN-SPAM) -- ideally instant
6. Store consent timestamp and IP for GDPR audit trail

**Detection:** Test emails land in spam folder. No unsubscribe link visible in email body or headers.

**Phase:** Email subscriptions (Phase 3) -- unsubscribe is a hard requirement of the subscribe feature, not a separate task.

---

### Pitfall 4: Free-Tier Email Limits Hit During Blog Burst

**What goes wrong:** Free tiers have strict monthly limits. Resend free tier: 100 emails/day, 3,000/month. Brevo free tier: 300 emails/day. If you have 200 subscribers and publish 2 posts in a month, that is 400 emails -- already 13% of Resend's monthly limit. Growth to 500 subscribers makes 2 posts per month = 1,000 emails, consuming a third of the monthly quota. A burst of 3 posts in one week can hit the daily limit and silently fail for remaining subscribers.

**Why it happens:** Free tiers seem generous when you have 0 subscribers. The math changes fast, and most services do not gracefully queue excess -- they just reject.

**Consequences:** Some subscribers never receive notifications. No error surfaced to the site owner. Trust erodes as subscribers see inconsistent delivery.

**Prevention:**

1. Choose the provider with the highest free-tier daily limit (Brevo at 300/day beats Resend at 100/day for this use case)
2. Implement batch sending with delays to stay under daily limits: if 200 subscribers, send in batches of 50 with 1-hour delays
3. Track send counts and alert (log to Vercel, or simple webhook) when approaching 80% of daily/monthly limits
4. Design the system so switching email providers later requires changing only one module (adapter pattern)
5. Consider a digest approach: weekly summary email instead of per-post, cutting email volume dramatically

**Detection:** Check email provider dashboard for bounced/rejected sends. Add logging around each send batch to track success/failure counts.

**Phase:** Email subscriptions (Phase 3) -- capacity planning must happen during architecture, not after launch.

---

### Pitfall 5: Removing "Dead Code" That Is Actually Used at Build Time

**What goes wrong:** `util/performance.ts` is correctly identified as dead code (no imports found). But the `public/abandoned/` directory and other assets might be referenced by MDX blog posts, OpenGraph images, or external links. Deleting files from `public/` that are referenced in blog content or social media cards causes 404s that are invisible until someone shares a link.

**Why it happens:** Static analysis tools and grep searches miss references inside MDX content, hardcoded URLs in social media posts, and bookmarked links. The `public/projects/abandoned/` directory IS actively used -- it is imported in `projects/page.tsx` line 7.

**Consequences:** Broken images on the projects page. Broken OpenGraph previews when links are shared. 404 errors for any bookmarked or cached URLs.

**Prevention:**

1. BEFORE deleting any file from `public/`, grep for the filename across: all `.tsx`/`.ts` files, all `.mdx` content files, `next.config.js`, and any Vercel configuration
2. Check Vercel Analytics for any traffic to the file path in the last 90 days
3. The `public/abandoned/` directory in PROJECT.md likely refers to truly abandoned assets WITHIN that folder, not the project images -- verify each file individually
4. Distinguish between `public/abandoned/` (legacy dead assets) and `public/projects/abandoned/` (active project images). The naming is confusingly similar
5. After deletion, run a full build (`next build`) and verify no import errors
6. Set up redirects in `next.config.js` for any removed public paths that might have external links

**Detection:** `next build` fails with import errors. Lighthouse flags broken images. Manual check of all pages after cleanup.

**Phase:** Codebase cleanup (Phase 1) -- do a dry run of deletion with full build verification before committing.

---

## Moderate Pitfalls

Mistakes that cause performance regressions, wasted effort, or subtle bugs.

---

### Pitfall 6: Mouse Event Handler Causes Excessive Re-renders on Every Pixel

**What goes wrong:** The `useMousePosition` hook (util/mouse.ts) calls `setMousePosition` on every `mousemove` event with no throttling or debouncing. Every pixel of mouse movement triggers a state update, which triggers a re-render of the Particles component and any other consumer. On the Particles component this re-renders React but the actual drawing happens via refs/canvas -- so the React re-renders are pure waste.

**Why it happens:** The hook was written simply and the canvas-based particle drawing masks the performance cost since it uses refs, not state, for the actual animation. The wasted re-renders are invisible unless you profile.

**Consequences:** On low-powered devices (phones, old laptops), excessive re-renders degrade scroll performance and increase battery drain. Lighthouse "Total Blocking Time" metric suffers. React DevTools profiler shows constant unnecessary renders.

**Prevention:**

1. Throttle the mousemove handler to ~60fps (16ms) using requestAnimationFrame or a simple throttle
2. Consider moving mouse tracking into the Particles component itself rather than a shared hook, since it is the only consumer
3. Use `useRef` instead of `useState` for mouse position in the animation context -- the canvas reads it imperatively, not reactively

**Detection:** React DevTools Profiler shows Particles re-rendering 60+ times per second during mouse movement. Lighthouse TBT is elevated.

**Phase:** Codebase cleanup (Phase 1) or Vercel optimization (Phase 2) -- depends on whether it is categorized as code quality or performance.

---

### Pitfall 7: Turbopack Dev vs Webpack Production Behavior Differences

**What goes wrong:** The project uses `next dev --turbopack` (package.json line 11) but `next build` uses Webpack. Turbopack and Webpack have subtle differences in module resolution, CSS processing, and error handling. Code that works in `dev` may fail in `build`. Specifically: Turbopack handles CSS imports differently, has different tree-shaking behavior, and may resolve module paths differently.

**Why it happens:** Turbopack is the dev-mode bundler in Next.js 15, but production builds still use Webpack. The two bundlers are not 100% compatible in edge cases.

**Consequences:** "Works on my machine" during development, breaks on Vercel deployment. Build errors that do not reproduce locally in dev mode.

**Prevention:**

1. Run `next build` locally before every PR merge -- do not rely solely on `next dev` working
2. Add `npm run build` to CI/pre-commit hooks
3. When refactoring imports or adding new packages, test with both `next dev` and `next build`
4. The webpack config in `next.config.js` (bundle analyzer plugin) only runs in webpack -- any webpack-specific configuration does not apply in dev mode

**Detection:** Vercel deployment fails with errors not seen locally. Bundle analyzer reports differ from expected.

**Phase:** All phases -- this is a continuous discipline, not a one-time fix.

---

### Pitfall 8: ISR Revalidation Misunderstood -- Blog Pages Are Fully Static, Not ISR

**What goes wrong:** Blog pages use `generateStaticParams` and read from the filesystem at build time. This is Static Site Generation (SSG), not ISR. New blog posts require a full redeploy to appear. Developers might assume adding `revalidate` to the blog page makes new posts appear automatically -- it does not, because the blog reads from the local filesystem, not a remote API. The filesystem on Vercel's build environment is immutable after deploy.

**Why it happens:** Confusion between ISR (works with fetch/remote data) and SSG (works with build-time filesystem reads). The GitHub repos page IS using ISR correctly (24h revalidation via fetch). The blog is NOT -- it is pure SSG.

**Consequences:** After adding the email notification system, publishing a new blog post requires: (1) commit the MDX file, (2) push to trigger Vercel deploy, (3) only THEN can you send the notification email. If the email is sent before the deploy completes, subscribers click through to a 404.

**Prevention:**

1. Document clearly: "New blog posts require a git push and Vercel deploy before they are live"
2. The email notification trigger should be tied to successful Vercel deployment, not to the MDX file being committed
3. Consider using Vercel Deploy Hooks as the trigger for email notifications -- deploy success webhook fires, then send emails
4. Do NOT try to convert the blog to ISR with filesystem reads -- it will not work on Vercel's serverless functions (read-only filesystem)

**Detection:** New blog post URLs return 404 immediately after pushing but before Vercel finishes building. Email subscribers receive links to non-existent pages.

**Phase:** Email subscriptions (Phase 3) -- the notification trigger architecture must account for this.

---

### Pitfall 9: TypeScript Strict Mode With `exactOptionalPropertyTypes` Causes Unexpected Errors

**What goes wrong:** The tsconfig has `exactOptionalPropertyTypes: true` (line 19), which is stricter than standard `strict: true`. This means you cannot assign `undefined` to an optional property -- you must omit the property entirely. During refactoring, replacing `any` with proper types will surface these errors. For example, `image?: string` in `BlogPostMeta` means the `image` key must either be absent or a `string` -- you cannot set `image: undefined`.

**Why it happens:** `exactOptionalPropertyTypes` is an uncommon strictness setting that most TypeScript developers are not used to. Libraries and even some Next.js patterns assume `optional = can be undefined`, which is not true with this flag.

**Consequences:** Type errors proliferate when replacing `any`. Developer frustration leads to adding more `any` to "fix" the types, making the codebase worse.

**Prevention:**

1. Understand the rule before starting: `property?: T` means "property may be missing" not "property may be undefined"
2. Use the `Partial<>` utility type carefully -- it makes properties optional, not undefined-able
3. When fixing `any` types in particles.tsx, test compile frequently -- do not batch 20 type fixes into one commit
4. For properties that genuinely can be undefined, type them as `property: T | undefined` (required but nullable) instead of `property?: T` (optional)

**Detection:** `npm run type-check` fails after refactoring. Errors specifically mention `Type 'undefined' is not assignable to type 'string'` on optional properties.

**Phase:** Codebase cleanup (Phase 1) -- the TypeScript fixes phase will hit this immediately.

---

### Pitfall 10: Framer Motion Bundle Size Bloat Negates Optimization Gains

**What goes wrong:** `framer-motion` (v11) is one of the largest dependencies in the bundle. It ships ~30-50KB gzipped depending on usage. During the Vercel optimization phase, developers focus on tree-shaking small utilities while ignoring the elephant in the room. Framer Motion's tree-shaking has improved but still ships significant code for basic animations.

**Why it happens:** Framer Motion is already installed and used. Removing it requires rewriting animations. The cost-benefit is not obvious until you run the bundle analyzer.

**Consequences:** Lighthouse Performance score does not improve despite other optimizations. LCP and TBT remain elevated due to JavaScript parse time.

**Prevention:**

1. Run `ANALYZE=true next build` FIRST to identify actual bundle size contributors before optimizing
2. Evaluate whether Framer Motion animations can be replaced with CSS `@keyframes` animations or the Web Animations API -- for simple fade-ins and slides, CSS is sufficient and zero-JS
3. If keeping Framer Motion, use the `m` component instead of `motion` for reduced bundle, and import from `framer-motion/m`
4. Use dynamic imports: `const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div))` for non-critical animations
5. Do NOT remove Framer Motion in the cleanup phase -- evaluate during optimization phase when you have bundle data

**Detection:** Bundle analyzer shows framer-motion as a top-3 dependency by size. Lighthouse flags "Reduce unused JavaScript."

**Phase:** Vercel optimization (Phase 2) -- data-driven decision after bundle analysis.

---

### Pitfall 11: Email Deliverability Destroyed by Missing DNS Records

**What goes wrong:** Sending emails from a custom domain (xndr.site) without proper DNS authentication means emails go straight to spam. Required records: SPF, DKIM, and DMARC. Most free-tier email services provide the DKIM keys, but the developer must add TXT records to their DNS. Missing any one of SPF/DKIM/DMARC causes major deliverability issues.

**Why it happens:** DNS records are outside the application code. They are easy to forget, and the email "works" in testing (delivered to your own inbox) but fails for Gmail/Outlook recipients who have stricter spam filtering.

**Consequences:** 80%+ of subscription emails land in spam. Subscribers think the feature is broken. Unsubscribe rates spike because people find old emails in spam folders weeks later.

**Prevention:**

1. Set up DNS records BEFORE sending the first test email: SPF record allowing the email service's sending IPs, DKIM key provided by the service, DMARC policy (start with `p=none` for monitoring)
2. Use the email service's domain verification tool -- all providers (Resend, Brevo, etc.) have one
3. Test deliverability with mail-tester.com or a similar tool before going live
4. Send from a subdomain like `mail.xndr.site` to protect the main domain's reputation
5. Start with the email service's shared domain for initial testing, then move to custom domain

**Detection:** Test emails land in spam for Gmail accounts. SPF/DKIM checks fail (visible in email headers: "Authentication-Results" header).

**Phase:** Email subscriptions (Phase 3) -- DNS setup must be the FIRST task before any email sending code.

---

### Pitfall 12: Silent Error Handling Makes Debugging Impossible After Refactoring

**What goes wrong:** The current codebase pattern of `catch { return []; }` (blog.ts line 38, github.ts line 101) means errors are invisible. During refactoring, if you accidentally break the blog parser or GitHub integration, the page renders with no data and no error message. You might not notice for days. This pattern is already documented as tech debt, but the danger is that fixing it INCORRECTLY (e.g., throwing errors from server components) can crash the entire page.

**Why it happens:** The original developer chose graceful degradation over error surfacing. This was reasonable for a portfolio site (show empty state vs. crash), but it makes refactoring dangerous because you have no feedback when something breaks.

**Consequences:** Refactored code silently fails. Blog page shows "no posts" when the real problem is a broken MDX parser. Projects page shows no repos when the GitHub API format changed. The site appears "working" but is degraded.

**Prevention:**

1. Add error boundaries around data-dependent sections (blog list, GitHub repos) BEFORE refactoring the data layer
2. Replace `console.error` with structured error logging that Vercel can capture (Vercel automatically captures `console.error` in Functions logs, but only if the function is server-rendered -- SSG pages swallow errors at build time)
3. For server components, use Next.js `error.tsx` convention to catch rendering errors per-route
4. During refactoring, temporarily add visible error states: `if (posts.length === 0) return <p>No posts found (check build logs)</p>`
5. After refactoring is complete, replace debug messages with polished empty states

**Detection:** Deploy to Vercel preview, check every page renders data. Check Vercel function logs for errors. A page that renders but shows no content is a red flag.

**Phase:** Codebase cleanup (Phase 1) -- error handling improvement should happen BEFORE other refactoring, not after, because it provides the safety net for all subsequent changes.

---

## Minor Pitfalls

Issues that cause friction or minor quality problems.

---

### Pitfall 13: CLS From Font Loading Despite `display: swap`

**What goes wrong:** The site uses `Inter` with `display: 'swap'` (layout.tsx line 9). Font swap causes a brief Content Layout Shift as text reflows from the fallback font to Inter. On slow connections, this CLS is visible and penalizes Core Web Vitals scores.

**Prevention:**

1. Use `next/font`'s built-in font optimization (already in use -- good)
2. Add `adjustFontFallback: true` to the Inter configuration to generate a fallback font with matching metrics
3. Preload the font by ensuring it is in the initial HTML response (Next.js does this automatically with `next/font`)
4. Test CLS on throttled connections (Chrome DevTools Network throttling to "Slow 3G")

**Phase:** Vercel optimization (Phase 2).

---

### Pitfall 14: Image Optimization Config May Be Over-Specified

**What goes wrong:** `next.config.js` specifies custom `deviceSizes` and `imageSizes` (lines 6-7) that override Next.js defaults. These are the same as the defaults. If Next.js changes its defaults in a minor version, this config will prevent the improvement from applying.

**Prevention:**

1. Remove `deviceSizes` and `imageSizes` if they match the defaults -- let Next.js manage these
2. Keep only non-default values: `formats`, `minimumCacheTTL`, and `remotePatterns`
3. The `minimumCacheTTL: 2592000` (30 days) is good for a portfolio site with infrequent image changes

**Phase:** Vercel optimization (Phase 2).

---

### Pitfall 15: Subscriber Email Storage -- Using External DB When Provider Has Built-in Lists

**What goes wrong:** Developers reach for a separate database (Vercel KV, Supabase, Neon) to store subscriber emails, when most email services (Resend, Brevo, Buttondown, ConvertKit) have built-in contact/subscriber list management. Running a separate database adds complexity, requires syncing between two sources of truth, and introduces a new free-tier limit to worry about.

**Prevention:**

1. Use the email provider's built-in subscriber list management if available
2. Only add a separate database if the email provider's free tier has subscriber list limitations
3. If an external DB is needed, prefer the simplest option (Vercel KV or a JSON file in the repo for very small scale)
4. Never store subscriber data in two places -- pick one source of truth

**Phase:** Email subscriptions (Phase 3) -- architecture decision before implementation.

---

### Pitfall 16: React 19 Concurrent Features Break Imperative Canvas Code

**What goes wrong:** React 19 can render components concurrently, meaning the Particles component's `useEffect` callbacks may fire in unexpected orders. The current code assumes effects run synchronously after mount. With React 19's concurrent rendering, the canvas initialization (`initCanvas`) and animation start (`animate`) could execute before the canvas element is fully mounted, especially if the parent suspends.

**Prevention:**

1. Ensure the Particles component is wrapped in a client boundary with `"use client"` (already done)
2. Add null checks before every canvas operation (partially done, but not consistently)
3. Do NOT wrap the Particles component in Suspense boundaries -- it does not fetch data and does not need them
4. If issues arise, add `useLayoutEffect` for canvas initialization (runs synchronously after DOM mutations) instead of `useEffect`

**Phase:** Codebase cleanup (Phase 1) -- relevant when refactoring the particle component.

---

### Pitfall 17: `next-mdx-remote/rsc` Server Component Compilation Costs

**What goes wrong:** `MDXRemote` from `next-mdx-remote/rsc` compiles MDX on every request in development and at build time in production. It includes `remark-gfm`, `rehype-highlight`, and `rehype-slug` plugins. The `rehype-highlight` plugin bundles highlight.js language definitions, which can add significant weight to the server bundle. In SSG this only matters at build time, but if the blog is ever converted to ISR, compilation happens on each revalidation.

**Prevention:**

1. Keep blog pages as SSG (generateStaticParams) -- compilation cost is only at build time
2. If build times become slow with many posts, consider pre-compiling MDX to a cache
3. For `rehype-highlight`, specify only needed languages instead of loading all: `rehype-highlight({ subset: ['typescript', 'javascript', 'bash', 'css'] })`

**Phase:** Vercel optimization (Phase 2) -- only if build times or bundle size are problematic.

---

## Phase-Specific Warnings

| Phase                        | Likely Pitfall                                                        | Mitigation                                                          |
| ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Phase 1: Codebase Cleanup    | Removing files that are actually used (Pitfall 5)                     | Grep all references, full build test after each deletion            |
| Phase 1: Codebase Cleanup    | Particle component refactor breaks animation (Pitfall 1)              | Visual regression test before/after, fix animation frame leak first |
| Phase 1: Codebase Cleanup    | `exactOptionalPropertyTypes` surprises when fixing `any` (Pitfall 9)  | Small commits, frequent type-check runs                             |
| Phase 1: Codebase Cleanup    | Silent errors mask refactoring breakage (Pitfall 12)                  | Add error boundaries FIRST, then refactor data layer                |
| Phase 2: Vercel Optimization | Optimizing wrong things -- framer-motion is the big cost (Pitfall 10) | Run bundle analyzer first, then prioritize by actual impact         |
| Phase 2: Vercel Optimization | Caching strategy misapplied to new fetch calls (Pitfall 2)            | Explicit cache config on every fetch, document strategy             |
| Phase 2: Vercel Optimization | CLS from font loading (Pitfall 13)                                    | Add adjustFontFallback, test on slow connections                    |
| Phase 3: Email Subscriptions | No unsubscribe = legal violation (Pitfall 3)                          | Ship unsubscribe with subscribe, not after                          |
| Phase 3: Email Subscriptions | Free-tier limits hit during blog burst (Pitfall 4)                    | Batch sending, monitor quotas, consider weekly digest               |
| Phase 3: Email Subscriptions | Emails land in spam without DNS records (Pitfall 11)                  | Set up SPF/DKIM/DMARC before writing any sending code               |
| Phase 3: Email Subscriptions | Blog deploy timing vs email notification (Pitfall 8)                  | Trigger emails from Vercel deploy webhook, not from git push        |
| All Phases                   | Turbopack dev vs Webpack build differences (Pitfall 7)                | Always run `next build` locally before merging                      |

---

## Pitfall Priority Matrix

| Priority      | Pitfall                            | Impact if Ignored                  |
| ------------- | ---------------------------------- | ---------------------------------- |
| P0 (do first) | #3 Unsubscribe/GDPR                | Legal exposure                     |
| P0 (do first) | #12 Error handling before refactor | Safety net for all other work      |
| P1 (high)     | #1 Particle component fragility    | Broken UI, memory leaks            |
| P1 (high)     | #11 DNS/email deliverability       | Feature completely fails           |
| P1 (high)     | #5 Dead code deletion verification | Broken images/pages                |
| P2 (medium)   | #2 Caching defaults changed        | Burned API quotas                  |
| P2 (medium)   | #4 Free-tier email limits          | Partial delivery failure           |
| P2 (medium)   | #8 SSG vs ISR confusion for blog   | 404s for subscribers               |
| P2 (medium)   | #9 exactOptionalPropertyTypes      | Developer frustration, wasted time |
| P3 (low)      | #6 Mouse handler re-renders        | Performance on weak devices        |
| P3 (low)      | #10 Framer Motion bundle size      | Lighthouse score ceiling           |
| P3 (low)      | #7 Turbopack/Webpack differences   | Occasional deploy failures         |

---

## Sources

- Direct codebase analysis: `particles.tsx`, `blog.ts`, `github.ts`, `layout.tsx`, `next.config.js`, `tsconfig.json`, `package.json`
- `.planning/codebase/CONCERNS.md` and `.planning/codebase/CONVENTIONS.md` -- existing tech debt documentation
- `.planning/PROJECT.md` -- project requirements and constraints
- Next.js 15 release notes (training data, MEDIUM confidence) -- caching default changes
- GDPR Article 7 (consent), Article 17 (right to erasure), CAN-SPAM Act requirements (training data, HIGH confidence -- well-established law)
- React 19 concurrent rendering behavior (training data, MEDIUM confidence)
- TypeScript `exactOptionalPropertyTypes` documentation (training data, HIGH confidence)
- Email deliverability best practices: SPF/DKIM/DMARC (training data, HIGH confidence -- well-established standards)

**Confidence note:** Web search was unavailable during this research. All findings about Next.js 15 specific behaviors and React 19 concurrent features are based on training data (cutoff: May 2025). The Next.js 15 caching change is well-documented and HIGH confidence. React 19 concurrent edge cases with imperative canvas code are MEDIUM confidence -- behavior may have evolved. GDPR/CAN-SPAM requirements are HIGH confidence -- these are stable legal requirements.

---

_Generated: 2026-02-23_
