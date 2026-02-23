# Lighthouse Results -- Phase 2 Performance Optimization

**Measured:** 2026-02-23
**Baseline:** Pre-Phase 2 (from BASELINE.md, same day)
**Final:** Post-Phase 2 (all optimizations applied: Plans 01 + 02)
**Tool:** Lighthouse 13.0.3 via Microsoft Edge (headless)
**Method:** Single run per page/preset against local production server (localhost:3000)

## Performance Scores

| Page | Mobile Before | Mobile After | Delta | Desktop Before | Desktop After | Delta |
|------|--------------|-------------|-------|----------------|--------------|-------|
| Home | 98 | 98 | 0 | 100 | 100 | 0 |
| Projects | 97 | 97 | 0 | 100 | 100 | 0 |
| Blog | 99 | 99 | 0 | 100 | 100 | 0 |
| About Me | 97 | 97 | 0 | 100 | 100 | 0 |
| Contact | 99 | 99 | 0 | 100 | 100 | 0 |

**All scores >= 90 on both mobile and desktop.**

## Core Web Vitals (Mobile)

| Page | LCP Before | LCP After | Delta | CLS Before | CLS After | TBT Before | TBT After |
|------|-----------|----------|-------|-----------|---------|-----------|---------|
| Home | 2.3s | 2.3s | -15ms | 0.000 | 0.000 | 20ms | 37ms |
| Projects | 2.6s | 2.5s | -77ms | 0.000 | 0.000 | 49ms | 35ms |
| Blog | 2.2s | 2.1s | -47ms | 0.000 | 0.000 | 35ms | 34ms |
| About Me | 2.5s | 2.5s | -1ms | 0.000 | 0.000 | 23ms | 20ms |
| Contact | 2.1s | 2.1s | +2ms | 0.000 | 0.000 | 41ms | 42ms |

**LCP:** All pages within "Good" threshold (< 2.5s), with minor improvements on Projects (-77ms) and Blog (-47ms)
**CLS:** Perfect 0.000 across all pages -- no layout shift
**TBT:** All well below 200ms threshold; Projects improved by 14ms (49ms -> 35ms)
**INP:** N/A -- pages are static with minimal client-side interactivity (Lighthouse cannot measure a real interaction)

## Core Web Vitals (Desktop)

| Page | LCP Before | LCP After | Delta | CLS Before | CLS After | TBT Before | TBT After |
|------|-----------|----------|-------|-----------|---------|-----------|---------|
| Home | 0.53s | 0.51s | -16ms | 0.000 | 0.000 | 0ms | 0ms |
| Projects | 0.61s | 0.57s | -45ms | 0.000 | 0.000 | 0ms | 0ms |
| Blog | 0.53s | 0.55s | +24ms | 0.000 | 0.000 | 0ms | 0ms |
| About Me | 0.62s | 0.62s | -3ms | 0.000 | 0.000 | 0ms | 0ms |
| Contact | 0.53s | 0.53s | -1ms | 0.000 | 0.000 | 0ms | 0ms |

**All desktop metrics excellent.** Perfect 100 scores maintained across all pages.

## Additional Metrics (Mobile)

| Page | FCP Before | FCP After | SI Before | SI After |
|------|-----------|----------|----------|---------|
| Home | 1.2s | 1.2s | 1.2s | 1.2s |
| Projects | 1.2s | 1.2s | 1.2s | 1.2s |
| Blog | 1.2s | 1.2s | 1.2s | 1.2s |
| About Me | 1.2s | 1.2s | 1.2s | 1.2s |
| Contact | 1.2s | 1.2s | 1.2s | 1.2s |

FCP and Speed Index remain consistent -- no regressions.

## Target Verification

- [x] All mobile Performance scores >= 90 (range: 97-99)
- [x] All desktop Performance scores >= 90 (all 100)
- [x] LCP within "Good" threshold (< 2.5s) on all pages
- [x] CLS within "Good" threshold (< 0.1) on all pages
- [x] TBT within acceptable range (< 200ms) on all pages

## Analysis

The site was already well-optimized before Phase 2 began (mobile 97-99, desktop all 100). The Phase 2 optimizations focused on correctness and maintainability rather than dramatic score improvements:

**Score stability:** Performance scores are identical before and after, confirming the optimizations did not introduce any regressions while providing structural benefits.

**Measurable improvements:**
- Projects mobile LCP improved by 77ms (2.56s -> 2.48s) -- likely from correct `sizes` props reducing image download sizes
- Projects mobile TBT improved by 14ms (49ms -> 35ms) -- likely from Suspense streaming reducing main-thread blocking
- Blog mobile LCP improved by 47ms (2.16s -> 2.11s) -- from image sizes optimization

**Structural benefits not captured by Lighthouse local testing:**
- ISR revalidation (5 min) -- reduces server load and improves TTFB under real traffic (not testable locally)
- Immutable cache headers for static assets -- improves repeat visit performance (not testable in single-run Lighthouse)
- Suspense streaming on projects page -- provides immediate shell render even when GitHub API is slow (not testable against localhost with fast responses)

## Changes Applied (Phase 2)

### Plan 01: Baseline and Cleanup
- Removed framer-motion dependency (0KB impact -- was already tree-shaken, never imported)
- Deleted dead code: particles.tsx, mouse.ts, 4.3MB unused Montserrat fonts from public/
- Cleaned tailwind.config.ts (removed --font-calsans, removed util/ content path)
- Removed @next/swc workaround from optionalDependencies
- Pinned next dependency to ^15.5.11

### Plan 02: Image, Suspense, and Cache Optimization
- Fixed next/image `sizes` props on 4 files (reduced image download sizes)
- Restructured projects page with Suspense streaming (faster initial render shell)
- Added error boundary with retry for GitHub fetch failures
- Set ISR revalidation to 5 minutes on projects route (route + fetch aligned)
- Added immutable cache headers for /icons/ and /projects/ static assets

## Raw Reports

Final JSON and HTML reports stored in this directory:
- `final-{page}-{preset}.report.json` -- machine-readable
- `final-{page}-{preset}.report.html` -- visual report for human review

Baseline reports also available for reference:
- `baseline-{page}-{preset}.report.json`
- `baseline-{page}-{preset}.report.html`
