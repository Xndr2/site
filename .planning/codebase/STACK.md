# Technology Stack

**Analysis Date:** 2026-02-23

## Languages

**Primary:**

- TypeScript 5.7.0 - Application logic, components, configuration files (`app/**/*.ts`, `app/**/*.tsx`)
- JavaScript - Build/config files and optional dependencies

**Secondary:**

- CSS3 - Styling through TailwindCSS
- MDX - Blog content format (`content/posts/**/*.mdx`)

## Runtime

**Environment:**

- Node.js >= 18.18.0 (specified in `package.json` engines)

**Package Manager:**

- npm >= 9.0.0
- Lockfile: `package-lock.json` (463KB)

## Frameworks

**Core:**

- Next.js 15.1.0 - Full-stack React framework for SSR, static generation, and routing
  - Location: `app/` directory using App Router
  - Turbopack enabled for dev builds (`next dev --turbopack`)

**UI & Components:**

- React 19.0.0 - Component framework
- React DOM 19.0.0 - DOM rendering

**Styling:**

- TailwindCSS 3.4.17 - Utility-first CSS framework
  - Config: `tailwind.config.ts`
  - PostCSS integration for processing
- @tailwindcss/typography 0.5.15 - Prose styling for blog content
- autoprefixer 10.4.20 - CSS vendor prefixing
- postcss 8.4.49 - CSS transformation tool
- postcss-preset-env 10.1.0 - Modern CSS features
- cssnano 7.0.6 - CSS minification (production only)

**Animations:**

- Framer Motion 11.15.0 - Advanced animations (`app/components/particles.tsx`, `app/components/progressBar.tsx`)

**Icon & UI Components:**

- @headlessui/react 2.2.0 - Unstyled accessible components
- @heroicons/react 2.2.0 - Heroicon SVG components

## Key Dependencies

**Critical:**

- next-mdx-remote 6.0.0 - Render MDX content server-side for blog posts
- gray-matter 4.0.3 - Parse YAML front-matter from blog MDX files (`app/lib/blog.ts`)
- reading-time 1.5.0 - Calculate estimated reading time for posts

**Image Processing:**

- sharp 0.33.5 - Image optimization and transformation for `next/image`

**Content & Markdown:**

- remark-gfm 4.0.0 - GitHub-Flavored Markdown support for blog
- rehype-highlight 7.0.0 - Syntax highlighting for code blocks
- rehype-slug 6.0.0 - Auto-generate heading slugs for blog navigation

**Analytics & Monitoring:**

- @vercel/analytics 1.4.0 - Vercel Web Analytics integration (`app/layout.tsx`)
- @vercel/speed-insights 1.1.0 - Vercel Speed Insights monitoring (`app/layout.tsx`)

## Development Dependencies

**Linting & Code Quality:**

- ESLint 9.17.0 - JavaScript/TypeScript linter
  - Config: `eslint.config.mjs` (flat config format)
  - eslint-config-next 15.1.0 - Next.js recommended rules
  - Rules: React hooks exhaustive deps (warn), no unescaped entities (off), prefer const (warn), no var (warn)

**Formatting:**

- Prettier 3.4.0 - Code formatter
  - Config: `.prettierrc` with 2-space indentation, 80-char line width, semicolons, trailing commas
  - .prettierignore: `project-root/.prettierignore`

**Type Checking:**

- @types/node 22 - Node.js type definitions
- @types/react 19 - React type definitions
- @types/react-dom 19 - React DOM type definitions

**Build & Analysis:**

- webpack-bundle-analyzer 4.10.2 - Analyze bundle size (`next build` with `ANALYZE=true` env var)

## Configuration

**Environment:**

- TypeScript strict mode enabled (`tsconfig.json`)
  - `strict: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `exactOptionalPropertyTypes: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`
  - `noUncheckedIndexedAccess: true`

**Path Aliases:**

- `@/*` maps to repository root for imports (`tsconfig.json`)

**Build:**

- `next.config.js` - Next.js configuration
  - Image optimization with WebP and AVIF formats
  - Remote image patterns: `avatars.githubusercontent.com`, `raw.githubusercontent.com` (for GitHub avatars)
  - Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
  - Powered-by header removed for security

**PostCSS:**

- `postcss.config.js` - Plugins: TailwindCSS, autoprefixer, postcss-preset-env, cssnano (production)
  - Custom media queries and nesting-rules enabled
  - CSS compression in production

## Platform Requirements

**Development:**

- Node.js 18.18.0+
- npm 9.0.0+
- Git (for version control)
- Bash shell (scripts in `package.json` use Unix commands)

**Production:**

- Vercel (inferred from `@vercel/analytics` and `@vercel/speed-insights` integration)
- Static hosting or Node.js server for SSR capabilities

---

_Stack analysis: 2026-02-23_
