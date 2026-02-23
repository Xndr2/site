# Testing

**Analyzed:** 2026-02-23
**Codebase:** Next.js 15 Portfolio Site

## Current State

**No test suite exists.**

There are no test files, no testing framework installed, and no test scripts configured.

| Check                       | Status           |
| --------------------------- | ---------------- |
| Test framework              | ✗ None installed |
| Test files                  | ✗ None found     |
| Test script in package.json | ✗ Not present    |
| CI test pipeline            | ✗ Unknown        |
| Coverage tooling            | ✗ None           |

## What Exists Instead

The project relies on:

- **TypeScript** (`npm run type-check`) for type safety
- **ESLint** (`npm run lint`) for code quality
- **Prettier** (`npm run format:check`) for formatting
- **Next.js build** (`npm run build`) as integration check — catches broken imports, type errors, missing pages

## Coverage Gaps

If tests were added, these areas would need coverage:

### High Priority

| Area                | Why                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------- |
| `app/lib/blog.ts`   | File I/O with silent fallbacks — test `getAllPosts()`, `getPostBySlug()` edge cases |
| `app/lib/github.ts` | External API — mock responses, test error handling, filtering logic                 |
| Blog `[slug]` page  | Dynamic routing — test valid slug, invalid slug, unpublished post                   |

### Medium Priority

| Area                             | Why                                        |
| -------------------------------- | ------------------------------------------ |
| `app/data/skills.ts`             | Static data — validate shape               |
| `app/components/progressBar.tsx` | Visual component — snapshot or render test |
| `app/components/tech-stack.tsx`  | Renders skill icons — test data mapping    |

### Low Priority

| Area                           | Why                                             |
| ------------------------------ | ----------------------------------------------- |
| `app/components/particles.tsx` | Canvas-based — hard to test, low business value |
| Navigation components          | Simple layout — low ROI                         |

## Recommended Testing Setup

If tests are added in future:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest
```

Or with Vitest (faster for Next.js projects):

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
```

**Test location convention (standard):**

```
app/lib/__tests__/blog.test.ts
app/lib/__tests__/github.test.ts
app/components/__tests__/progressBar.test.tsx
```

## Notes

- The `npm run type-check` script (`tsc --noEmit`) serves as a partial correctness check
- Build-time errors in Next.js catch broken page routes and invalid server component usage
- No mocking infrastructure exists — would need setup from scratch

---

_Generated: 2026-02-23_
