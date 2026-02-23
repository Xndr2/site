# Code Conventions

**Analyzed:** 2026-02-23
**Codebase:** Next.js 15 Portfolio Site

## Language & Formatting

| Setting      | Value                                       |
| ------------ | ------------------------------------------- |
| Language     | TypeScript (strict-ish, some `any` present) |
| Formatter    | Prettier (`.prettierrc` configured)         |
| Linter       | ESLint 9 flat config (`eslint.config.mjs`)  |
| Line endings | LF (`.prettierignore` present)              |

**Prettier config:** Present — run `npm run format` to apply.

## Naming Conventions

| Element            | Convention                      | Example                               |
| ------------------ | ------------------------------- | ------------------------------------- |
| Components         | PascalCase default export       | `export default function Particles()` |
| Interfaces         | PascalCase, `I`-prefix not used | `BlogPostMeta`, `GitHubRepo`          |
| Types (inline)     | PascalCase                      | `type Circle = { ... }`               |
| Functions/vars     | camelCase                       | `getPostBySlug`, `fetchGitHubRepos`   |
| Constants          | SCREAMING_SNAKE_CASE            | `GITHUB_USERNAME`, `POSTS_PATH`       |
| Files (components) | camelCase `.tsx`                | `progressBar.tsx`, `particles.tsx`    |
| Files (libs)       | camelCase `.ts`                 | `blog.ts`, `github.ts`                |
| CSS classes        | Tailwind utility classes        | `className="scroll-smooth"`           |
| Route dirs         | kebab-case                      | `about-me/`, `[slug]/`                |

## Import Organization

Observed pattern (not enforced by tooling):

1. React/Next.js framework imports
2. Third-party library imports
3. Internal absolute imports (`@/util/...`, `@/app/...`)
4. Relative imports

```typescript
import React, { useRef, useEffect } from 'react';
import { useMousePosition } from '@/util/mouse';
```

**Path aliases:** `@/` maps to project root (configured in tsconfig).

## TypeScript Patterns

- Interfaces preferred over `type` for object shapes (e.g., `BlogPostMeta`, `GitHubRepo`)
- `type` used for local/utility types (e.g., `type Circle`)
- Optional properties marked with `?` (e.g., `image?: string`)
- Union types for nullable values (e.g., `string | null`)
- Type narrowing via filter callbacks: `.filter((post): post is BlogPost => ...)`
- `any` used in particle component (`circles.current: any[]`) — known tech debt

## Component Patterns

**Server components (default in App Router):**

- Async functions that fetch data directly
- No `"use client"` directive

**Client components:**

- Explicit `"use client"` at top of file
- Used for: interactive components (particles, nav), hooks, browser APIs

**Props pattern:**

```typescript
interface ComponentProps {
  prop?: string;      // optional with default
  required: number;   // required
}

export default function Component({ prop = "default", required }: ComponentProps) {
```

**Metadata export:**

```typescript
export const metadata: Metadata = {
  title: { default: '...', template: '...' },
  // ...
};
```

## Error Handling

**Pattern:** Silent failure with console logging — returns empty/null fallback.

```typescript
// GitHub API
if (!response.ok) {
  console.error('GitHub API error:', response.status);
  return [];
}

// Blog
try {
  const files = fs.readdirSync(POSTS_PATH);
  // ...
} catch {
  return [];
}
```

**Observations:**

- No error boundaries in component tree
- No user-facing error states documented
- `console.error` used in production code

## Data Fetching Patterns

**Server-side (blog):** Direct filesystem reads via Node.js `fs` module.

**Server-side (GitHub):** `fetch()` with Next.js `revalidate` option for ISR:

```typescript
next: {
  revalidate: 86400;
} // 24-hour cache
```

**No client-side fetching** observed — all data fetched at build/request time.

## CSS / Styling

- **Framework:** Tailwind CSS v3 with `@tailwindcss/typography` plugin
- **Approach:** Utility-first, all styling in className props
- **Global styles:** `app/globals.css` for base resets and custom properties
- **No CSS modules** — pure Tailwind

## Animations

- **Framer Motion** for page/component animations
- **Canvas API** (manual) for particle background
- **No CSS animations** observed

---

_Generated: 2026-02-23_
