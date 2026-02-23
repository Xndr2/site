---
phase: 01-codebase-cleanup
plan: 04
subsystem: ui
tags: [nextjs, react, tailwind, error-boundary, loading-skeleton, suspense]

# Dependency graph
requires:
  - phase: 01-03
    provides: github.ts and blog.ts throw errors on failure, enabling error boundary capture
provides:
  - app/projects/error.tsx: Client Component error boundary for /projects — shows "Couldn't reach GitHub" on GitHub API failure
  - app/projects/loading.tsx: Loading skeleton for /projects — featured cards + GitHub repo grid with animate-pulse
  - app/blog/error.tsx: Client Component error boundary for /blog — shows "Couldn't load posts" on unexpected runtime errors
  - app/blog/loading.tsx: Loading skeleton for /blog — timeline dot + post card rows with animate-pulse
  - app/loading.tsx: Updated root global fallback with three-dot pulse animation
affects:
  - 02-optimization
  - 03-email

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js error.tsx must use 'use client' directive — required by framework for error boundaries"
    - "Next.js loading.tsx is shown automatically while page.tsx streams in via Suspense"
    - "Skeletons match actual page layout classes exactly (same max-width, padding, bg) for smooth transition"
    - "animate-pulse (Tailwind opacity fade) used consistently — no shimmer or custom keyframes"
    - "Unused error boundary props prefixed with _ (_error, _reset) to satisfy TypeScript"
    - "Error messages use casual tone with cat-pink accent dot — 'Couldn't reach GitHub' style"

key-files:
  created:
    - app/projects/error.tsx
    - app/projects/loading.tsx
    - app/blog/error.tsx
    - app/blog/loading.tsx
  modified:
    - app/loading.tsx
    - app/blog/[slug]/page.tsx

key-decisions:
  - "Loading skeletons mirror the full page structure (header + sections) not just the dynamic data section — smoother perceived transition"
  - "Blog loading.tsx includes timeline line placeholder (w-px bg-slate-200) to match the real gradient line in blog/page.tsx"
  - "Root loading.tsx updated from broken 'b' class placeholder to a clean three-dot animate-pulse with cat-pink/cat-sky brand colors"

patterns-established:
  - "Error boundary pattern: 'use client', accept _error/_reset props, minimal inline notice matching page shell background and padding"
  - "Loading skeleton pattern: match exact layout wrapper classes (bg, max-width, padding) from corresponding page.tsx"

requirements-completed: [CLEAN-07, CLEAN-08]

# Metrics
duration: 7min
completed: 2026-02-23
---

# Phase 1 Plan 4: Error Boundaries and Loading Skeletons Summary

**Next.js error.tsx Client Components and animate-pulse loading skeletons added for /projects and /blog, plus root loading.tsx polished from broken placeholder to branded three-dot animation**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-02-23T09:43:59Z
- **Completed:** 2026-02-23T09:51:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Error boundary for /projects shows friendly "Couldn't reach GitHub right now." with cat-pink accent dot when GitHub API is unavailable
- Error boundary for /blog handles unexpected runtime errors (MDX parse failures, I/O errors) without alarming the user
- Loading skeletons for both routes mirror actual page structure including header, featured sections, and content lists — animate-pulse only
- Root loading.tsx replaced broken broken placeholder (`b` class typo) with clean branded three-dot pulse animation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create error.tsx and loading.tsx for /projects route** - `75426ad` (feat)
2. **Task 2: Create error.tsx and loading.tsx for /blog route, update root loading.tsx** - `05dbcca` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `app/projects/error.tsx` - Client Component error boundary: "Couldn't reach GitHub right now." with cat-pink dot, matches page shell (bg-[#fafbfc], max-w-screen-lg, pt-28 md:pt-36)
- `app/projects/loading.tsx` - Full-page skeleton: header text blocks + featured card grid (5 cards with image area) + GitHub repo grid (3 cards with name/description/stats rows)
- `app/blog/error.tsx` - Client Component error boundary: "Couldn't load posts right now." with cat-pink dot, matches blog shell (bg-[#fafbfc], max-w-screen-md)
- `app/blog/loading.tsx` - Timeline skeleton: header + tags row + 3 post rows each with dot + card (date/title/description/tags skeleton blocks)
- `app/loading.tsx` - Updated from broken `fixed inset-0 b` placeholder to clean three-dot animate-pulse using cat-pink and cat-sky brand colors
- `app/blog/[slug]/page.tsx` - Fixed pre-existing type error: cast `props.src` to `string` in MDX Image component (Blob vs StaticImport mismatch)

## Layout Classes Used

**Projects pages** (`max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16`):
- Background: `bg-[#fafbfc]`
- Card grid: `grid grid-cols-1 md:grid-cols-2 gap-4` (GitHub repos), `gap-5` (featured)
- GitHub repo cards: `p-5 rounded-xl border border-slate-200 bg-white`
- Featured cards: `p-4 rounded-xl border border-slate-200 bg-white` with 160px image area

**Blog pages** (`max-w-screen-md mx-auto px-6 pt-28 md:pt-36 pb-16`):
- Background: `bg-[#fafbfc]`
- Timeline: `space-y-6` with `absolute left-[7px] w-px` line, `w-4 h-4 rounded-full` dots
- Post cards: `p-4 rounded-lg border border-slate-200 bg-white` (flex-1)
- Post structure: date+readingtime row → title → description (2 lines) → tags

## Decisions Made

- Loading skeletons include the full page structure (header skeleton, section label skeletons) not just the async data sections — provides a smoother visual transition as real content replaces the skeleton
- Blog loading.tsx includes a static `w-px bg-slate-200` timeline line to match the gradient line in the real blog page
- Root loading.tsx: three-dot animation chosen as a minimal branded fallback (uses site's cat-pink and cat-sky accent colors) — this is the global catch-all for any route without its own loading.tsx

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TypeScript error in app/blog/[slug]/page.tsx**
- **Found during:** Task 1 (build verification)
- **Issue:** `props.src` typed as `string | Blob | undefined` (React.ImgHTMLAttributes) but `next/image` expects `string | StaticImport` — TypeScript error prevented build from passing
- **Fix:** Cast `props.src` to `string` via `(props.src as string) ?? ''` since in MDX context image src is always a URL string
- **Files modified:** `app/blog/[slug]/page.tsx`
- **Verification:** `npm run build` exits 0 after fix
- **Committed in:** 75426ad (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug fix)
**Impact on plan:** Pre-existing type error blocked build verification; fix is minimal and correct since MDX images are always URL strings in practice.

## Issues Encountered

- Pre-existing TypeScript error in `app/blog/[slug]/page.tsx` prevented `npm run build` from passing. Fixed via Rule 1 auto-fix (type cast). Error was introduced by plan 01-02's next/image migration and was not previously caught.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four route-specific error/loading files in place; Next.js will automatically use them
- Error boundaries in /projects will catch throws from `fetchGitHubRepos()` (cleaned up in 01-03)
- Phase 1 codebase cleanup is complete — all 4 plans executed
- Ready for Phase 2: Performance Optimization (Framer Motion tree-shaking, image optimization, etc.)
- Pre-existing @next/swc version mismatch warning (15.5.7 vs 15.5.11) noted but non-blocking — may be addressed in Phase 2

## Self-Check: PASSED

- FOUND: app/projects/error.tsx
- FOUND: app/projects/loading.tsx
- FOUND: app/blog/error.tsx
- FOUND: app/blog/loading.tsx
- FOUND: app/loading.tsx
- FOUND: .planning/phases/01-codebase-cleanup/01-04-SUMMARY.md
- FOUND commit: 75426ad (Task 1)
- FOUND commit: 05dbcca (Task 2)

---
*Phase: 01-codebase-cleanup*
*Completed: 2026-02-23*
