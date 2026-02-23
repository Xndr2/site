---
phase: 02-performance-optimization
plan: 01
subsystem: infra
tags: [lighthouse, bundle-analysis, next-image, tailwind, cleanup]

# Dependency graph
requires:
  - phase: 01-codebase-cleanup
    provides: Clean codebase with error boundaries, loading skeletons, consistent patterns
provides:
  - Lighthouse baseline reports (JSON + HTML) for 5 pages x 2 presets in .planning/lighthouse/
  - Bundle analysis documented in .planning/lighthouse/BUNDLE-ANALYSIS.md
  - Clean package.json without framer-motion or @next/swc workaround
  - Clean tailwind.config.ts without dead --font-calsans reference
  - 4.3MB dead font assets removed from public/
affects: [02-02, 02-03]

# Tech tracking
tech-stack:
  added: [lighthouse (npx, not installed)]
  patterns: [lighthouse-cli-with-edge-headless, analyze-true-bundle-analysis]

key-files:
  created:
    - .planning/lighthouse/BASELINE.md
    - .planning/lighthouse/BUNDLE-ANALYSIS.md
    - .planning/lighthouse/baseline-*-*.report.json (10 files)
    - .planning/lighthouse/baseline-*-*.report.html (10 files)
  modified:
    - package.json
    - package-lock.json
    - tailwind.config.ts

key-decisions:
  - "framer-motion removed entirely (was never imported, 0KB in bundle) -- OPT-06 satisfied as no-op"
  - "particles.tsx + mouse.ts deleted as dead code (never imported) -- OPT-07 satisfied by removal"
  - "Montserrat fonts deleted (4.3MB, never loaded) -- served by next/font/google for Inter only"
  - "@next/swc version mismatch is upstream Next.js bug (15.5.11 declares dependency on SWC 15.5.7) -- cannot fix from our side"
  - "next dependency pinned from ^15.1.0 to ^15.5.11 to match installed version"

patterns-established:
  - "Lighthouse CLI via Edge headless: CHROME_PATH pointing to msedge.exe with --headless=new flag"
  - "Bundle analysis via ANALYZE=true npm run build with webpack-bundle-analyzer static output"

requirements-completed: [OPT-01, OPT-05, OPT-06, OPT-07]

# Metrics
duration: 13min
completed: 2026-02-23
---

# Phase 2 Plan 1: Baseline and Cleanup Summary

**Lighthouse baselines captured for all 5 pages (97-100 scores), dead weight removed: framer-motion dep, 4.3MB unused fonts, dead particles component, stale config references**

## Performance

- **Duration:** 13 min
- **Started:** 2026-02-23T18:28:30Z
- **Completed:** 2026-02-23T18:41:37Z
- **Tasks:** 2
- **Files modified:** 28

## Accomplishments
- Lighthouse performance baselines documented for all 5 pages on both mobile (97-99) and desktop (all 100) -- site already exceeds >= 90 target
- framer-motion removed from dependencies -- was never imported, contributed 0KB to bundle, all animations use Tailwind CSS keyframes
- 4.3MB of unused Montserrat font files deleted from public/fonts/
- Dead code removed: particles.tsx canvas component and mouse.ts utility (neither was imported by any page)
- Stale --font-calsans reference removed from tailwind.config.ts
- @next/swc-linux-x64-gnu workaround removed from optionalDependencies
- Bundle analyzer run and documented -- shared JS is 102KB gzipped, no remaining quick-win reductions
- Build passes clean, all pages load, hero animations confirmed working via animation class verification

## Task Commits

Each task was committed atomically:

1. **Task 1: Capture Lighthouse performance baselines** - `da2e70e` (docs)
2. **Task 2: Remove dead dependencies, unused assets, and stale config** - `191e5f4` (chore)

## Files Created/Modified
- `.planning/lighthouse/BASELINE.md` - Lighthouse score summary table for all pages
- `.planning/lighthouse/BUNDLE-ANALYSIS.md` - Bundle composition analysis and quick-win assessment
- `.planning/lighthouse/baseline-*-*.report.json` (10 files) - Raw Lighthouse JSON reports
- `.planning/lighthouse/baseline-*-*.report.html` (10 files) - Visual Lighthouse HTML reports
- `package.json` - Removed framer-motion, removed optionalDependencies, pinned next to ^15.5.11
- `package-lock.json` - Updated after dependency changes
- `tailwind.config.ts` - Removed display font family (--font-calsans), removed util/ from content paths
- `app/components/particles.tsx` - Deleted (dead code)
- `util/mouse.ts` - Deleted (dead code, only used by particles.tsx)
- `public/fonts/` - Deleted entire directory (4.3MB unused Montserrat fonts)

## Decisions Made
- **framer-motion removal strategy:** Removed entirely rather than migrating to LazyMotion, because it was never imported by any file. OPT-06 satisfied as a no-op -- the dependency contributed 0 bytes to the bundle. All site animations use Tailwind CSS keyframes (animate-fade-in, etc.)
- **Particles component:** Deleted as dead code rather than wrapping with next/dynamic. It was never imported by any page, and the hero animations use Tailwind keyframes, not canvas particles. Available in git history if needed
- **@next/swc warning:** Determined this is an upstream Next.js bug -- their published next@15.5.11 package declares a dependency on @next/swc-*@15.5.7. Not fixable from our side. Build compiles and works correctly despite the warning
- **next version pin:** Updated from ^15.1.0 to ^15.5.11 to reflect actual installed version

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Lighthouse Chrome not found -- used Microsoft Edge**
- **Found during:** Task 1 (Lighthouse baseline capture)
- **Issue:** Chrome not installed on the machine; Lighthouse CLI errored with "No Chrome installations found"
- **Fix:** Set CHROME_PATH to Microsoft Edge (Chromium-based) at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`
- **Files modified:** None (runtime environment variable)
- **Verification:** All 10 Lighthouse reports generated successfully
- **Committed in:** da2e70e (Task 1 commit)

**2. [Rule 2 - Missing Critical] Removed util/ from tailwind content paths**
- **Found during:** Task 2 (dead code removal)
- **Issue:** After deleting util/mouse.ts, tailwind.config.ts still referenced `'./util/**/*.{js,ts,jsx,tsx,mdx}'` in content paths
- **Fix:** Removed the util content path entry from tailwind.config.ts
- **Files modified:** tailwind.config.ts
- **Verification:** Build succeeds, no Tailwind scanning errors
- **Committed in:** 191e5f4 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both auto-fixes necessary for correctness. No scope creep.

## Issues Encountered
- **@next/swc version mismatch warning persists** despite removing optionalDependencies: This is because next@15.5.11 itself declares @next/swc-*@15.5.7 as optional dependencies. The mismatch is in the published Next.js package metadata, not in our config. Non-blocking -- build compiles and runs correctly.
- **Lighthouse EPERM on temp directory cleanup** (Windows): Lighthouse reports are generated successfully but cleanup of temp Chrome profile directory throws EPERM on Windows. Non-blocking -- reports are complete.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Baseline performance documented -- ready for before/after comparison after Plans 02 and 03
- Bundle is clean with no remaining quick-win dependency removals
- Image `sizes` prop optimization (Plan 02) and ISR/Suspense restructuring (Plan 03) are the remaining optimization levers
- Two oversized source images identified (HeadshotInteractive 6MB, jitsemoerman.be 1MB) -- these are optimized by next/image at serve time but source compression would reduce build time

## Self-Check: PASSED

- FOUND: .planning/lighthouse/BASELINE.md
- FOUND: .planning/lighthouse/BUNDLE-ANALYSIS.md
- FOUND: .planning/phases/02-performance-optimization/02-01-SUMMARY.md
- FOUND: commit da2e70e (Task 1)
- FOUND: commit 191e5f4 (Task 2)

---
*Phase: 02-performance-optimization*
*Completed: 2026-02-23*
