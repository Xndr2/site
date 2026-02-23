# Codebase Concerns

**Analyzed:** 2026-02-23
**Codebase:** Next.js 15 Portfolio Site

## Tech Debt

| Area             | Issue                                   | File                                                     | Severity |
| ---------------- | --------------------------------------- | -------------------------------------------------------- | -------- |
| Type safety      | `any` type assertions                   | `app/components/particles.tsx:24`, `util/performance.ts` | Medium   |
| Lint suppression | ESLint rules suppressed without fixes   | `app/components/particles.tsx`, blog page                | Low      |
| Dead code        | Unused performance monitoring utilities | `util/performance.ts`                                    | Low      |

## Known Bugs / Issues

- GitHub API integration silently returns empty array on failures — errors are swallowed, making debugging difficult
- Blog metadata parsing relies on `gray-matter` with silent defaults — malformed frontmatter fails quietly

## Security

| Concern                               | Location                      | Risk                               |
| ------------------------------------- | ----------------------------- | ---------------------------------- |
| No rate limiting on GitHub API        | `app/lib/github.ts` (assumed) | Medium — could exhaust API quota   |
| Console logging exposed in production | Various                       | Low — leaks implementation details |
| Missing ARIA labels                   | UI components                 | Low — accessibility gap            |

## Performance

| Bottleneck                               | Location                       | Impact                          |
| ---------------------------------------- | ------------------------------ | ------------------------------- |
| Particles animation loop — no throttling | `app/components/particles.tsx` | Medium — continuous CPU usage   |
| Mouse tracking hook — no debouncing      | Mouse hook                     | Medium — frequent re-renders    |
| File system reads on every request       | `app/lib/blog.ts`              | Medium — no caching             |
| GitHub API fetches 100 repos unfiltered  | GitHub lib                     | Low — unnecessary data transfer |

## Fragile Areas

- **Particle component** — complex ref management with multiple `eslint-disable` comments; high risk of breakage on refactor
- **Blog pipeline** — gray-matter parsing with silent defaults; bad frontmatter won't surface errors
- **GitHub integration** — silent failure pattern means API issues are invisible to users

## Scaling Limits

- Blog posts loaded from filesystem on each request — will not scale with large post count
- No pagination on GitHub repo fetch (fetches 100 at once)

## Dependencies at Risk

- No known deprecated dependencies identified — verify with `npm audit`

## Missing Features / Coverage Gaps

- No test coverage for: particles component, blog generation pipeline, GitHub integration
- No error boundaries around data-fetching components
- No loading states documented for async data (GitHub repos, blog posts)

---

_Generated: 2026-02-23_
