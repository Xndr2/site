---
phase: 01-codebase-cleanup
plan: 03
subsystem: api
tags: [github, blog, error-handling, typescript, next.js]

# Dependency graph
requires: []
provides:
  - 'github.ts throws on non-200 API responses and network errors'
  - 'blog.ts lets I/O errors propagate; returns [] for valid empty posts dir'
  - 'Zero console statements in production lib files'
affects:
  - '01-04 (error.tsx boundaries) — errors now propagate for boundaries to catch'
  - 'app/projects/page.tsx — GitHub API failures will now hit error.tsx'
  - 'app/blog/page.tsx — blog I/O errors will propagate to error boundaries'

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Throw-on-failure: API clients throw on non-200 rather than returning empty state'
    - 'Valid empty state vs error: empty posts dir returns [] (correct), I/O errors throw (correct)'

key-files:
  created: []
  modified:
    - app/lib/github.ts
    - app/lib/blog.ts

key-decisions:
  - 'github.ts: removed outer try/catch entirely, changed !response.ok to throw new Error with HTTP status'
  - 'blog.ts: removed try/catch in getAllPostSlugs() since ensurePostsDir() already guarantees the dir exists; only real I/O errors (permissions/disk) can now occur and they propagate'
  - 'blog.ts: getPostBySlug() was already correct (no try/catch, returns null for missing files, lets parse errors throw) — no changes needed'

patterns-established:
  - 'No silent failures: API and I/O errors throw rather than returning empty state'
  - 'Distinguish valid empty state (no posts) from error state (I/O failure)'

requirements-completed: [CLEAN-05, CLEAN-06]

# Metrics
duration: 25min
completed: 2026-02-23
---

# Phase 1 Plan 03: Error Propagation Cleanup Summary

**Replaced silent error swallowing in github.ts and blog.ts with proper throw-on-failure patterns, enabling error.tsx boundaries to handle failures visibly**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-02-23T00:41:31Z
- **Completed:** 2026-02-23T01:06:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- github.ts: removed outer try/catch, changed `!response.ok` from `console.error + return []` to `throw new Error('GitHub API returned ${status}')` — GitHub API failures now propagate to error.tsx
- blog.ts: removed try/catch in `getAllPostSlugs()` that was swallowing I/O errors — real disk/permission errors now propagate naturally
- Removed 2 console.error calls from github.ts (1 in the catch block, 1 in the !response.ok branch)
- blog.ts had zero console statements — no removals needed
- Build passes: all 3 existing MDX blog posts (FrontierNetwork, ListeningStats, welcome) compile correctly

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix github.ts — remove silent catch blocks and console.error calls** - `a85f3a2` (fix)
2. **Task 2: Fix blog.ts — distinguish empty-state from I/O errors, remove console statements** - `53d69c8` (fix)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `app/lib/github.ts` - Removed try/catch; `!response.ok` now throws; network errors propagate
- `app/lib/blog.ts` - Removed try/catch in `getAllPostSlugs()`; I/O errors now propagate

## Decisions Made

- **github.ts console.error removals:** 2 console.error calls removed. One was inside the catch block (`console.error('Failed to fetch GitHub repos:', error)`) and one was inside the `!response.ok` branch (`console.error('GitHub API error:', response.status)`). The `!response.ok` branch was changed to throw, the catch was removed entirely.
- **blog.ts approach:** `getAllPostSlugs()` had a try/catch that caught ALL errors and returned `[]`. Since `ensurePostsDir()` already creates the directory if missing, the catch could only ever fire for real I/O errors (permission denied, disk failure) — which should propagate. The try/catch was removed without any other changes needed.
- **blog.ts getPostBySlug() unchanged:** It was already clean — no try/catch, `fs.existsSync` check returns `null` for missing files (correct), and parse errors naturally propagate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed npm dependencies (node_modules missing)**

- **Found during:** Task 1 (TypeScript verification step)
- **Issue:** `node_modules/` directory did not exist; `npx tsc --noEmit` failed with "not the tsc command" error
- **Fix:** Ran `npm install` — installed 708 packages
- **Files modified:** package-lock.json (lock file updated)
- **Verification:** `npx tsc --noEmit` exits 0 after install
- **Committed in:** Not committed (package-lock.json was already tracked; node_modules in .gitignore)

---

**Total deviations:** 1 auto-fixed (1 blocking — missing node_modules)
**Impact on plan:** Install was required to run verification. No scope creep.

## Issues Encountered

- `npx tsc --noEmit` initially returned a false TypeScript error about `string | Blob` in `app/blog/[slug]/page.tsx` during a `git stash` / `git stash pop` cycle. After restoring the stash, the error disappeared and TypeScript passed cleanly. The error was a transient state issue during the stash operation, not related to our changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 04 (error.tsx boundaries) can now be executed — errors from GitHub API and blog I/O propagate correctly to where error boundaries will catch them
- Projects page `/projects` will show an error boundary instead of empty state when GitHub API fails
- Blog route `/blog` and `/blog/[slug]` will show error boundaries on I/O failures

## Self-Check: PASSED

- app/lib/github.ts: FOUND
- app/lib/blog.ts: FOUND
- .planning/phases/01-codebase-cleanup/01-03-SUMMARY.md: FOUND
- Commit a85f3a2 (github.ts fix): FOUND
- Commit 53d69c8 (blog.ts fix): FOUND

---

_Phase: 01-codebase-cleanup_
_Completed: 2026-02-23_
