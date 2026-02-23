# Phase 1: Codebase Cleanup - Research

**Researched:** 2026-02-23
**Domain:** Next.js 15 App Router codebase hygiene — dead code removal, TypeScript strictness, ESLint/Prettier enforcement, error boundaries, and loading skeletons
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Error state UI**

- Minimal inline notice across all routes — no retry button, no full-page takeover
- Consistent treatment everywhere (projects page, blog page, all async routes)
- Tone: casual/light — "Couldn't reach GitHub" style, not "Error 503"
- Slightly visually distinct — muted accent color or small icon to signal something's off, without being alarming

**Loading skeleton style**

- Content-shaped skeletons — placeholder blocks that mirror the shape of what's loading
- Animation: subtle pulse (opacity fade in/out), not shimmer
- Projects page: 3 skeleton cards while loading
- Blog page: post-shaped rows — title line, 2-3 excerpt lines, meta line — mirroring real list items

**Dead code scope**

- Full audit — systematically check all exports for usage, not just the named files
- Named files explicitly targeted: `util/performance.ts`, `public/abandoned/`
- Uncertain cases (dynamically imported, hard to trace): leave a TODO comment, do not delete
- Audit includes npm packages — remove unused packages from package.json as well

**TypeScript scope**

- Fix `any` types project-wide, not limited to the particle animation component
- Particle animation component: zero `any` types and zero `eslint-disable` comments
- ESLint: fix all violations project-wide, not just the named eslint-disable removals
- Fix Prettier violations on every source file

### Claude's Discretion

- Hard-to-type cases (complex third-party data shapes): Claude picks appropriate approach (unknown, loose interface, or TODO)
- tsconfig strictness: Claude checks current config and tightens if the delta is small
- Exact wording of inline error notices
- Exact color/icon for error state styling (should complement existing design)
- Skeleton color and precise sizing

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID       | Description                                                                                                                    | Research Support                                                                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLEAN-01 | Dead code deleted — `util/performance.ts`, `public/abandoned/`, all unused exports removed                                     | Dead code audit findings: `util/performance.ts` confirmed unused, `public/abandoned/` confirmed deletable, `app/components/progressBar.tsx`, `app/components/whoarewe.tsx`, `app/footer.tsx`, `app/components/alert.tsx` all have zero import consumers found in codebase |
| CLEAN-02 | `any` type eliminated from `particles.tsx` — canvas refs and particle arrays properly typed                                    | `circles.current` is `useRef<any[]>` — must become `useRef<Circle[]>` using the locally-defined `Circle` type that already exists in the file; `eslint-disable` comments are the remaining blocker                                                                        |
| CLEAN-03 | All `eslint-disable` comments removed by fixing the underlying issues                                                          | 4 comments found: 3 in `particles.tsx` (react-hooks/exhaustive-deps), 1 in `blog/[slug]/page.tsx` (@next/next/no-img-element); each requires fixing the root cause                                                                                                        |
| CLEAN-04 | Prettier applied consistently across all source files                                                                          | 32 files have Prettier violations; `npm run format` (already scripted) will fix all at once                                                                                                                                                                               |
| CLEAN-05 | Silent failures in `blog.ts` and `github.ts` replaced — errors thrown and caught at component boundaries with visible error UI | `github.ts` catches errors and returns `[]`; `blog.ts` has try/catch that returns `[]`; both must throw instead; consuming components need error.tsx boundaries                                                                                                           |
| CLEAN-06 | `console.error` removed from production code paths                                                                             | 2 in `github.ts` (lines 60, 101), 1 `console.log` in `util/performance.ts` (line 67); `performance.ts` is dead code being deleted anyway                                                                                                                                  |
| CLEAN-07 | `error.tsx` added per route segment with fallback UI                                                                           | Currently only `app/loading.tsx` exists at root level; need `error.tsx` at minimum for `/projects` and `/blog` route segments; `error.tsx` must be a Client Component                                                                                                     |
| CLEAN-08 | `loading.tsx` added for routes with async data (`/blog`, `/projects`) with skeleton UI                                         | `app/loading.tsx` exists but is root-level placeholder text; route-specific `loading.tsx` files needed in `app/projects/` and `app/blog/`                                                                                                                                 |

</phase_requirements>

---

## Summary

This is a codebase hygiene phase on an existing Next.js 15 portfolio site. The codebase is small (19 source files), uses React 19, TypeScript with `strict: true` (plus several strict extras), Tailwind CSS with a custom `cat-` color palette, and the App Router. No new features are added — only cleanup, type fixing, error visibility, and formatting.

Dead code is concentrated in specific files: `util/performance.ts` (confirmed zero imports in the app), `public/abandoned/` (3 image files not referenced by any app code), and several `app/components/` files (`progressBar.tsx`, `whoarewe.tsx`, `alert.tsx`, and `footer.tsx`) that appear to have zero import consumers in the current codebase. The particle animation component has one `any` type (`circles.current: any[]`) that blocks the requirement — the `Circle` type is already defined in that same file, making the fix straightforward. Three `eslint-disable-next-line react-hooks/exhaustive-deps` comments in `particles.tsx` are the primary ESLint work; they exist because `initCanvas` and `animate` are declared inside the component without `useCallback`, which causes dependency instability.

Error handling is the substantive new work. Both `github.ts` and `blog.ts` swallow errors silently (return `[]` from catch blocks). The fix requires: (1) remove the try/catch from both libs and let them throw, (2) add `error.tsx` Client Components in `app/projects/` and `app/blog/` directories, and (3) add route-specific `loading.tsx` skeleton files in the same directories. The existing `app/loading.tsx` is a root-level placeholder ("Loading...") that should be replaced with a proper skeleton or kept as a fallback.

**Primary recommendation:** Work in this order — (1) delete dead code and unused packages, (2) run `npm run format` for Prettier, (3) fix TypeScript `any` types, (4) fix ESLint violations to remove `eslint-disable` comments, (5) fix error handling in lib files and add `error.tsx` + `loading.tsx` per route.

---

## Standard Stack

### Core (already in project — no new installs needed)

| Library      | Version                                   | Purpose                                          | Why Standard                                                         |
| ------------ | ----------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| Next.js      | ^15.1.0                                   | App Router, file-based error/loading conventions | Already in project                                                   |
| TypeScript   | ^5.7.0                                    | Type checking                                    | Already in project; `strict: true` + extras already set              |
| ESLint       | ^9.17.0 with `eslint-config-next` ^15.1.0 | Linting                                          | Already configured via `eslint.config.mjs` flat config               |
| Prettier     | ^3.4.0                                    | Formatting                                       | Already configured via `.prettierrc`; `npm run format` script exists |
| Tailwind CSS | ^3.4.17                                   | Styling skeletons and error states               | Already in project with `cat-` color palette                         |

### No New Packages Required

All tooling for this phase is already installed. The cleanup work is purely code changes.

**Potential removals from package.json** (requires audit):

- `tailwindcss-debug-screens` — dev-only debugging utility; confirm it's not needed in production builds
- `cssnano` — PostCSS minifier; verify it's being used in `postcss.config.js`
- `postcss-preset-env` — Check if used in PostCSS config
- `webpack-bundle-analyzer` — dev tool, low risk but verify necessity
- Any packages not imported anywhere in source

### Alternatives Considered

Not applicable — this phase uses existing tooling only.

---

## Architecture Patterns

### Next.js App Router Error Boundary Pattern

**What:** Each route segment with async data gets a co-located `error.tsx` that catches rendering errors and displays fallback UI.

**Critical constraint:** `error.tsx` MUST be a Client Component (`'use client'`). It receives `error: Error & { digest?: string }` and `reset: () => void` props.

**When to use:** Any route segment where the page component can throw during server rendering.

**Example:**

```typescript
// app/projects/error.tsx
// Source: https://nextjs.org/docs/app/getting-started/error-handling
'use client';

export default function ProjectsError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-sm text-slate-500 flex items-center gap-2 py-4">
      <span className="text-cat-pink">!</span>
      <span>Couldn't reach GitHub right now.</span>
    </div>
  );
}
```

**Scope rule:** `error.tsx` catches errors from its `page.tsx` sibling and all children below — but NOT from its own `layout.tsx`. To catch layout errors, place `error.tsx` in the parent segment.

### Next.js App Router Loading Pattern

**What:** `loading.tsx` wraps the page in a `<Suspense>` boundary automatically. Shows while the async Server Component streams in.

**When to use:** Any route with `async` data fetching in the page component.

**Example structure for projects page:**

```typescript
// app/projects/loading.tsx
export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#fafbfc]/90 border-b border-slate-200/50" />
      <main className="max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16">
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-full mb-1" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

**Pulse animation:** Tailwind's `animate-pulse` is an opacity fade (0.5 → 1 → 0.5), which matches the "subtle pulse" decision. No custom keyframes needed.

### Error Propagation Fix Pattern

**What:** Remove try/catch from library functions so errors bubble up to the `error.tsx` boundary.

**Current (broken) pattern in `github.ts`:**

```typescript
// Returns [] on error — page renders empty, user sees nothing
export async function fetchGitHubRepos(): Promise<ProcessedRepo[]> {
  try {
    const response = await fetch(...);
    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return [];  // SILENT FAILURE
    }
    ...
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];  // SILENT FAILURE
  }
}
```

**Corrected pattern:**

```typescript
// Throws on error — error.tsx boundary catches and shows fallback UI
export async function fetchGitHubRepos(): Promise<ProcessedRepo[]> {
  const response = await fetch(...);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  const repos: GitHubRepo[] = await response.json();
  // ... process and return
}
```

### The `particles.tsx` ESLint Fix Pattern

**Problem:** Three `// eslint-disable-next-line react-hooks/exhaustive-deps` comments suppress warnings about missing dependencies in `useEffect` hooks. The root cause: `initCanvas` and `animate` are functions declared inside the component body without `useCallback`, so they're recreated every render and can't be listed as stable deps.

**Fix strategy (two options):**

Option A — `useCallback` (correct but more verbose):

```typescript
const initCanvas = useCallback(() => {
  resizeCanvas();
  drawParticles();
}, []); // stable reference — safe to list as dep

useEffect(() => {
  // ...
  window.addEventListener('resize', initCanvas);
  return () => window.removeEventListener('resize', initCanvas);
}, [initCanvas]); // no eslint-disable needed
```

Option B — move functions outside component or use `useRef` to store latest callback. Given animation complexity, `useCallback` with empty deps (`[]`) on stable functions is cleanest.

**The `any[]` fix in `particles.tsx`:**

```typescript
// Before:
const circles = useRef<any[]>([]);

// After (Circle type already defined in same file):
const circles = useRef<Circle[]>([]);
```

The `Circle` type is a local `type` alias defined inside the component function body (lines 73–84). Move it above the component declaration so `useRef<Circle[]>` can reference it.

### Recommended File Structure After Phase 1

```
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx        (unchanged)
│   ├── error.tsx            (NEW — Client Component, inline error notice)
│   ├── loading.tsx          (NEW — post-shaped skeleton rows)
│   └── page.tsx            (unchanged structure, blog.ts now throws)
├── projects/
│   ├── error.tsx            (NEW — Client Component, GitHub error notice)
│   ├── loading.tsx          (NEW — 3 skeleton cards)
│   └── page.tsx            (unchanged structure, github.ts now throws)
├── loading.tsx              (REPLACE — root level, keep as minimal fallback)
└── (all other files)

util/
├── mouse.ts                 (keep — imported by particles.tsx)
└── performance.ts           (DELETE — zero imports found)

public/
├── abandoned/               (DELETE — 3 image files, not referenced)
├── fonts/
├── icons/
└── projects/

app/components/
├── particles.tsx            (fix any[], fix eslint-disable comments)
├── tech-stack.tsx           (keep — imported by app/page.tsx)
├── alert.tsx                (DELETE — zero imports found)
├── progressBar.tsx          (DELETE — zero imports found)
└── whoarewe.tsx             (DELETE — zero imports found)

app/
└── footer.tsx               (DELETE — zero imports found)
```

### Anti-Patterns to Avoid

- **Deleting uncertain dead code without a TODO:** Components/files that might be dynamically imported or referenced from config should get a `// TODO: confirm unused before deleting` comment, not deletion.
- **Using `error.tsx` as a Server Component:** It must have `'use client'` or React will throw.
- **`loading.tsx` at root level only:** The root `app/loading.tsx` covers all routes but shows for any navigation — route-specific files are needed for the granular skeletons.
- **Suppressing ESLint with comments instead of fixing:** The requirement says fix the underlying issue, not delete the rule.
- **Adding `console.error` to the new error state:** The error state is UI-only; no logging in production paths.

---

## Don't Hand-Roll

| Problem                             | Don't Build                | Use Instead                         | Why                                                        |
| ----------------------------------- | -------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| Suspense/loading fallback           | Custom loading state logic | `loading.tsx` convention            | Next.js wraps page in `<Suspense>` automatically           |
| Error catching in Server Components | Custom try/catch in page   | `error.tsx` boundary                | Next.js error boundaries handle this correctly             |
| Pulse animation                     | Custom CSS keyframes       | Tailwind `animate-pulse`            | Built-in, matches "opacity fade" decision, zero code       |
| Formatting                          | Manual formatting          | `npm run format` (already scripted) | Runs `prettier --write .` — fixes all 32 files at once     |
| TypeScript strict checks            | Adding inline `@ts-ignore` | Fix the type properly               | tsconfig already has `strict: true`; suppressions are debt |

**Key insight:** Every tool needed for this phase is already installed and configured. The work is executing the tools and fixing what they surface — not building new infrastructure.

---

## Common Pitfalls

### Pitfall 1: Deleting `app/footer.tsx` / `app/components/alert.tsx` Without Confirming

**What goes wrong:** These components exist with no import found in the current grep — but they could be referenced from a config file, via string concatenation, or in a future planned route.
**Why it happens:** Dead code audits via grep can miss dynamic imports.
**How to avoid:** Check `git log` to understand why they exist; if they were recently in use, leave a `// TODO: unused — safe to delete after Phase 2` comment rather than deleting blindly.
**Warning signs:** If build throws "cannot find module" after deletion — means something imports them that grep didn't catch.

### Pitfall 2: `blog.ts` Error Handling — `blog.ts` is Server-Side Filesystem Code

**What goes wrong:** `blog.ts` reads the filesystem (`fs.readFileSync`). Its current try/catch swallows I/O errors. Unlike `github.ts`, the failure mode is different: a missing `content/posts/` directory doesn't throw, it returns `[]` (the `ensurePostsDir()` call auto-creates it). So the "silent failure" concern for blog is less about API errors and more about MDX parse errors.
**Why it happens:** The current code always ensures the directory exists, so `getAllPosts()` returning `[]` means "no posts" — which is valid, not an error. However, `getPostBySlug` can throw if MDX is malformed.
**How to avoid:** Distinguish between "no posts" (valid empty state) and "I/O error" (actual failure). The blog `error.tsx` should target the `[slug]/page.tsx` path where MDX parsing can fail, not the list page.
**Warning signs:** Blog list page showing error state when there are simply no posts — would be incorrect behavior.

### Pitfall 3: `react-hooks/exhaustive-deps` Fix Breaking Animation

**What goes wrong:** If `initCanvas` and `animate` are wrapped in `useCallback` carelessly, stale closures over `dpr`, `canvasSize`, `circles` etc. can break the animation loop.
**Why it happens:** The animation uses refs (not state), so values are always current — but if `useCallback` has wrong deps, the ref values would still be latest (refs don't cause stale closures). The real risk is if any state value is captured.
**How to avoid:** `initCanvas` and `animate` only read from refs (not state), so `useCallback(() => ..., [])` with empty deps is correct — refs are always current. Test animation renders after the change.
**Warning signs:** Particles freeze or don't respond to mouse after the fix.

### Pitfall 4: Prettier Overwriting Intentional Formatting

**What goes wrong:** Running `npm run format` changes formatting in `.prettierrc` itself, `content/posts/*.mdx`, and config files. Some may have intentional structure.
**Why it happens:** Prettier formats everything including MDX and JSON.
**How to avoid:** Review the diff carefully after running format. The `.prettierignore` exists but only excludes specific patterns — verify it covers `content/posts/` MDX files if they should not be reformatted.
**Warning signs:** Blog post MDX content reformatted in ways that break rendering.

### Pitfall 5: `error.tsx` Not Catching Server-Side Errors Due to Placement

**What goes wrong:** An `error.tsx` placed in `app/` only catches errors from root layout children. An `error.tsx` in `app/projects/` catches errors from `app/projects/page.tsx` — which is correct.
**Why it happens:** Error boundaries catch errors from their segment's `page.tsx` and children, but NOT from their own `layout.tsx`.
**How to avoid:** Place `error.tsx` alongside the `page.tsx` that contains the async data fetch. For `/projects`, that's `app/projects/error.tsx`. For `/blog`, that's `app/blog/error.tsx`.
**Warning signs:** Error state never showing even when GitHub API fails.

---

## Code Examples

Verified patterns from official sources:

### `error.tsx` — Minimal Inline Error Notice (Projects Route)

```typescript
// app/projects/error.tsx
// Source: https://nextjs.org/docs/app/getting-started/error-handling
'use client';

export default function ProjectsError({
  error: _error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Keep page shell visible — just replace the GitHub section */}
      <main className="max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16">
        <p className="text-sm text-slate-400 flex items-center gap-1.5 py-8">
          <span className="text-cat-pink text-base leading-none">·</span>
          Couldn't reach GitHub right now.
        </p>
      </main>
    </div>
  );
}
```

### `loading.tsx` — Skeleton Cards (Projects Route)

```typescript
// app/projects/loading.tsx
// Pattern: Tailwind animate-pulse for opacity fade
export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <main className="max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16">
        <div className="h-8 bg-slate-200 rounded w-32 mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 bg-white animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4 mb-4" />
              <div className="flex gap-3">
                <div className="h-3 bg-slate-100 rounded w-16" />
                <div className="h-3 bg-slate-100 rounded w-10" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

### `loading.tsx` — Skeleton Post Rows (Blog Route)

```typescript
// app/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <main className="max-w-screen-md mx-auto px-6 pt-28 md:pt-36 pb-16">
        <div className="h-10 bg-slate-200 rounded w-24 mb-12 animate-pulse" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6">
              {/* Timeline dot */}
              <div className="w-4 h-4 rounded-full bg-slate-200 mt-1 flex-shrink-0 animate-pulse" />
              {/* Post card skeleton */}
              <div className="flex-1 p-4 rounded-lg border border-slate-200 bg-white animate-pulse">
                {/* Meta line */}
                <div className="h-3 bg-slate-100 rounded w-24 mb-3" />
                {/* Title */}
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                {/* Excerpt lines */}
                <div className="h-3 bg-slate-100 rounded w-full mb-1.5" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

### Fixing `particles.tsx` — Move `Circle` Type and Replace `any[]`

```typescript
// Move the Circle type ABOVE the component function:
type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

// Inside the component, change:
// const circles = useRef<any[]>([]);
// To:
const circles = useRef<Circle[]>([]);
```

### Fixing ESLint exhaustive-deps in `particles.tsx`

```typescript
// Wrap stable internal functions with useCallback:
import React, { useRef, useEffect, useCallback } from 'react';

// Then wrap initCanvas, animate (and their sub-functions) with useCallback(() => ..., [])
// Remove the three eslint-disable-next-line comments
// The deps arrays become [initCanvas] and [mousePosition.x, mousePosition.y]
```

### Fixing Silent Failures in `github.ts`

```typescript
// Remove the outer try/catch. Let fetch errors bubble up.
export async function fetchGitHubRepos(): Promise<ProcessedRepo[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 86400 },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  const repos: GitHubRepo[] = await response.json();
  // ... rest of processing unchanged
}
```

---

## State of the Art

| Old Approach                                          | Current Approach                                    | Impact                                                        |
| ----------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `pages/` directory with `getServerSideProps`          | App Router with `async` Server Components           | error.tsx + loading.tsx replace custom error/loading patterns |
| `eslint-disable` to suppress hook dependency warnings | Fix deps properly with `useCallback`                | Correct behavior, no suppressions                             |
| Silent catch-and-return-empty in lib functions        | Throw errors, catch at boundary                     | User sees error state instead of empty page                   |
| Global loading.tsx only                               | Per-route loading.tsx with content-shaped skeletons | Better perceived performance, accurate visual                 |

**Deprecated/outdated:**

- Root `app/loading.tsx` as the only loading state: Valid as global fallback, but route-specific files take precedence for their segments.

---

## Open Questions

1. **`app/footer.tsx` and `app/components/alert.tsx` — were these previously used?**
   - What we know: No import found via grep in any current `.tsx`/`.ts` file
   - What's unclear: `alert.tsx` has a `useState` and commented-out close button — looks recently active. `footer.tsx` has actual content. Could be in a recently-removed route.
   - Recommendation: Check `git log --follow app/footer.tsx` before deleting. If recently removed from a page, delete. If added and never used, delete.

2. **`app/components/progressBar.tsx` and `app/components/whoarewe.tsx` — dead or planned?**
   - What we know: Both have zero import consumers in current codebase
   - What's unclear: `whoarewe.tsx` has a `CarouselProps` interface suggesting it was a planned component
   - Recommendation: Leave `// TODO: unused — delete if not needed in Phase 3+` comment per the "uncertain cases" decision, or delete if git log confirms they've never been imported.

3. **`blog.ts` error handling — should the list page show an error state?**
   - What we know: `getAllPosts()` returns `[]` for empty posts dir (valid) and for I/O errors (silent failure)
   - What's unclear: Is an I/O error possible in production? Vercel deployment should always have `content/posts/` present.
   - Recommendation: Add `error.tsx` to `app/blog/` anyway per CLEAN-07 requirement (it will catch any unexpected errors), but leave `getAllPosts()` returning `[]` for the "no posts" case — that's the existing empty state UI in the page.

4. **tsconfig strictness delta — any safe tightening?**
   - What we know: `strict: true` is already set, plus `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess` — this is already maximally strict
   - What's unclear: nothing; the config is comprehensive
   - Recommendation: No changes needed to tsconfig. It is already at maximum strictness for this project's target.

5. **Unused npm packages — what can be removed?**
   - What we know: `tailwindcss-debug-screens` is in plugins (loaded in production builds), `cssnano` is in devDependencies
   - What's unclear: whether `postcss.config.js` actively uses `cssnano` and `postcss-preset-env`
   - Recommendation: Read `postcss.config.js` during planning/execution and remove packages not referenced there.

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection — all findings based on reading actual source files
- https://nextjs.org/docs/app/getting-started/error-handling — error.tsx Client Component requirement, error/reset props, boundary placement rules
- https://nextjs.org/docs/app/api-reference/file-conventions/loading — loading.tsx Suspense wrapping behavior
- Prettier check run via `npx prettier --check .` — confirmed 32 files with violations (output captured above)

### Secondary (MEDIUM confidence)

- WebSearch: Next.js App Router file conventions 2025 — confirmed error.tsx must be Client Component, loading.tsx wraps page in Suspense automatically
- Tailwind `animate-pulse` confirmed via project's tailwind.config.ts — the keyframe is built-in and produces opacity fade, matching the "subtle pulse" decision

### Tertiary (LOW confidence)

- None — all claims verified against source code or official docs

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all tools already installed, versions confirmed from package.json
- Architecture: HIGH — error.tsx/loading.tsx patterns from official Next.js docs; particles fix from direct code reading
- Pitfalls: HIGH — identified from actual code inspection, not speculation
- Dead code findings: HIGH for `util/performance.ts` and `public/abandoned/`; MEDIUM for component files (grep may miss dynamic imports)

**Research date:** 2026-02-23
**Valid until:** 2026-03-25 (stable APIs — Next.js App Router conventions rarely change)
