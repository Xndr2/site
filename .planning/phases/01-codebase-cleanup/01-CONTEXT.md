# Phase 1: Codebase Cleanup - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Eliminate tech debt, fix error handling, and establish clean patterns across the codebase. This phase covers: removing dead code, fixing TypeScript types, enforcing consistent formatting, and making async data failures visible to users. No new features or capabilities.

</domain>

<decisions>
## Implementation Decisions

### Error state UI

- Minimal inline notice across all routes — no retry button, no full-page takeover
- Consistent treatment everywhere (projects page, blog page, all async routes)
- Tone: casual/light — "Couldn't reach GitHub" style, not "Error 503"
- Slightly visually distinct — muted accent color or small icon to signal something's off, without being alarming

### Loading skeleton style

- Content-shaped skeletons — placeholder blocks that mirror the shape of what's loading
- Animation: subtle pulse (opacity fade in/out), not shimmer
- Projects page: 3 skeleton cards while loading
- Blog page: post-shaped rows — title line, 2-3 excerpt lines, meta line — mirroring real list items

### Dead code scope

- Full audit — systematically check all exports for usage, not just the named files
- Named files explicitly targeted: `util/performance.ts`, `public/abandoned/`
- Uncertain cases (dynamically imported, hard to trace): leave a TODO comment, do not delete
- Audit includes npm packages — remove unused packages from package.json as well

### TypeScript scope

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

</decisions>

<specifics>
## Specific Ideas

No specific references or "I want it like X" moments — open to standard approaches that fit the portfolio site aesthetic.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 01-codebase-cleanup_
_Context gathered: 2026-02-23_
