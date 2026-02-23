---
phase: 01-codebase-cleanup
plan: 02
decisions:
  - useCallback with empty deps for canvas functions that read only refs
  - next/image width=800 height=400 defaults for MDX images with unknown dimensions
  - util/performance.ts any types deferred -- dead code removed in Plan 01-01
metrics:
  duration: 7 minutes
  completed: 2026-02-23
---

# Phase 1 Plan 02: TypeScript any Fixes, ESLint Violations, Prettier Formatting

TypeScript any types eliminated from particles.tsx using Circle[] typing and useCallback; blog page raw img replaced with next/image; Prettier applied to 27 source files.

## Task 1: particles.tsx (commits: 6117806, 3fcba11)

- Changed `useRef<any[]>` to `useRef<Circle[]>`
- Moved `Circle` type from component body to module scope
- Removed 3 `eslint-disable` comments by wrapping canvas functions with `useCallback`
- Empty deps used for canvas functions that read only from refs (refs are always current)
- Props (quantity, staticity, ease) included in deps for functions that use them

Project-wide sweep: `util/performance.ts` had 3 any usages -- deferred (dead code, Plan 01-01 deletes it).

## Task 2: blog slug page and Prettier (commit: 064250c)

- Replaced raw `img` with `next/image` Image in mdxComponents map
- Defaults `width={800} height={400}` for MDX images where dimensions are unknown
- Prettier applied to 27 files: single quotes, 80-char line wrap, trailing commas
- MDX frontmatter normalized. Blog content unaffected.

## Deviations from Plan

None -- plan executed exactly as written.

## Self-Check: PASSED

- commit 6117806: particles.tsx any fix and useCallback -- confirmed
- commit 064250c: blog page Image and Prettier 27 files -- confirmed
- commit 3fcba11: particles.tsx Prettier formatting -- confirmed
- zero eslint-disable in app/ and util/ -- confirmed
- zero any types in app/ -- confirmed
- ESLint passes: no warnings or errors -- confirmed
- Prettier passes: all files clean -- confirmed
