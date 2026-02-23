# Lighthouse Baseline -- Pre-Phase 2

**Measured:** 2026-02-23
**Server:** localhost:3000 (production build, Next.js 15.5.11)
**Tool:** Lighthouse 13.0.3 via Microsoft Edge (headless)
**Method:** Single run per page/preset against local production server

## Performance Scores

| Page | Mobile Perf | Desktop Perf | Mobile LCP | Mobile CLS | Mobile TBT |
|------|-------------|--------------|------------|------------|------------|
| Home | 98 | 100 | 2.3s | 0.000 | 20ms |
| Projects | 97 | 100 | 2.6s | 0.000 | 49ms |
| Blog | 99 | 100 | 2.2s | 0.000 | 35ms |
| About Me | 97 | 100 | 2.5s | 0.000 | 23ms |
| Contact | 99 | 100 | 2.1s | 0.000 | 41ms |

## Additional Metrics

| Page | Mobile FCP | Mobile SI | Desktop LCP | Desktop FCP | Desktop SI |
|------|------------|-----------|-------------|-------------|------------|
| Home | 1.2s | 1.2s | 0.5s | 0.3s | 0.3s |
| Projects | 1.2s | 1.2s | 0.6s | 0.3s | 0.4s |
| Blog | 1.2s | 1.2s | 0.5s | 0.3s | 0.3s |
| About Me | 1.2s | 1.2s | 0.6s | 0.3s | 0.3s |
| Contact | 1.2s | 1.2s | 0.5s | 0.3s | 0.3s |

## Notes

- INP (Interaction to Next Paint) reported as N/A -- all pages are static with minimal client-side interactivity, so Lighthouse cannot measure a real interaction
- TBT (Total Blocking Time) used as the interactivity proxy metric instead
- CLS is 0.000 across all pages -- no layout shift detected
- Desktop scores are all perfect 100 -- site is well-optimized for fast connections
- Mobile LCP ranges 2.1-2.6s -- within "Good" threshold (< 2.5s) for most pages
- All mobile Performance scores already exceed the >= 90 target

## Raw Reports

JSON and HTML reports stored in this directory:
- `baseline-{page}-{preset}.report.json` -- machine-readable
- `baseline-{page}-{preset}.report.html` -- visual report for human review
