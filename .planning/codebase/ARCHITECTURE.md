# Architecture

**Analysis Date:** 2026-02-23

## Pattern Overview

**Overall:** Next.js App Router with Server Components and Static Generation

**Key Characteristics:**

- Server-first architecture using Next.js 15+ App Router
- Static site generation (SSG) for pages with `generateStaticParams`
- Client-side interactivity with strategic `"use client"` boundaries
- Separation of concerns across pages, components, utilities, and data layers
- Content-driven architecture for blog using MDX files

## Layers

**Pages Layer:**

- Purpose: Route handlers and page-level UI composition
- Location: `app/` (page.tsx, [slug]/page.tsx in route directories)
- Contains: Page components, layout definitions, metadata, static generation logic
- Depends on: Components, lib utilities, data files
- Used by: Router entry points

**Components Layer:**

- Purpose: Reusable UI components and interactive features
- Location: `app/components/` (e.g., navbar.tsx, particles.tsx, tech-stack.tsx)
- Contains: Presentational components, client components with interactivity
- Depends on: Data files, utilities, external libraries (Framer Motion, Canvas API)
- Used by: Page components, other components (composition)

**Data Layer:**

- Purpose: Static data and configuration
- Location: `app/data/` (skills.ts)
- Contains: Skill categories, proficiency levels, featured skills lists
- Depends on: None (pure data)
- Used by: Components, pages for rendering

**Utility/Library Layer:**

- Purpose: Business logic, file system operations, external API integration
- Location: `app/lib/`, `util/`
- Contains:
  - `app/lib/blog.ts`: Blog post parsing (frontmatter, MDX), tag management, date formatting
  - `app/lib/github.ts`: GitHub API integration, repo fetching, processing, sorting
  - `util/mouse.ts`: Mouse position tracking hook for interactive components
- Depends on: External libraries (gray-matter, reading-time, next-mdx-remote)
- Used by: Pages, components

**Layout Layer:**

- Purpose: Root and shared layout structure
- Location: `app/layout.tsx`, `app/footer.tsx`
- Contains: HTML metadata, font setup, global providers (Analytics, SpeedInsights)
- Depends on: Next.js core
- Used by: All pages via Next.js layout cascade

## Data Flow

**Blog Content Flow:**

1. MDX files stored in `content/posts/` directory with front matter
2. `app/lib/blog.ts` reads files, parses front matter using gray-matter
3. Reading time calculated using reading-time library
4. `getAllPosts()` returns sorted, published posts with metadata
5. `app/blog/page.tsx` calls `getAllPosts()`, renders timeline view
6. `app/blog/[slug]/page.tsx` fetches specific post, renders with MDXRemote + custom components
7. `generateStaticParams()` generates static pages at build time

**GitHub Projects Flow:**

1. `app/lib/github.ts` fetches repos from GitHub API (https://api.github.com/users/Xndr2/repos)
2. Response cached with 24-hour revalidation
3. Filters: removes forks, archived repos, excluded repos
4. Processing: transforms fields (html_url → url, stargazers_count → stars)
5. Sorting: pinned repos first, then by stars descending
6. `app/projects/page.tsx` awaits async function, renders featured + GitHub repos
7. Repos displayed as cards with language color coding

**Skills Display Flow:**

1. `app/data/skills.ts` defines structured skill categories with proficiency levels
2. `app/about-me/page.tsx` imports `skillCategories`, renders grouped by category
3. Proficiency visualization: color coding and level badges (mobile/desktop variants)
4. `app/components/tech-stack.tsx` uses `featuredSkills` for homepage hero section
5. Icons imported from `/public/icons/`

**Page Navigation Flow:**

1. `app/navbar.tsx` (client component) maintains menu state for mobile
2. Navigation links hardcoded as constant in navbar component
3. Pages set metadata via `export const metadata` (static)
4. Navbar receives `pageName` prop to display current page in header

**State Management:**

- None at global level (no Redux, Zustand, Context for data)
- Component-level state only: navbar menu toggle (`useState` in navbar.tsx)
- Local interactive state: particle canvas animation state (refs in particles.tsx)
- All data is either static (files) or server-fetched async once at build/request time

## Key Abstractions

**BlogPost Interface:**

- Purpose: Represents parsed blog content with metadata
- Examples: `app/lib/blog.ts` (lines 6-19)
- Pattern: TypeScript interface defining structure; metadata separated from content in retrieval

**GitHubRepo Processing:**

- Purpose: Transforms raw GitHub API response to domain model
- Examples: `app/lib/github.ts` (lines 19-30, 74-85)
- Pattern: Raw GitHub API type → ProcessedRepo type, field mapping, null handling

**Skill Categories:**

- Purpose: Hierarchical skill organization with proficiency metadata
- Examples: `app/data/skills.ts` (SkillCategory, Skill interfaces)
- Pattern: Nested objects with categorization; used for rendering different UI layouts

**MDX Custom Components:**

- Purpose: Semantic HTML styling for blog post content
- Examples: `app/blog/[slug]/page.tsx` (lines 50-109)
- Pattern: Object mapping HTML tag names to styled React components; integrated with MDXRemote

## Entry Points

**Home Page:**

- Location: `app/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Hero section, featured tech stack, CTA buttons

**Blog Listing:**

- Location: `app/blog/page.tsx`
- Triggers: Request to `/blog`
- Responsibilities: List all posts with timeline visualization, tag display

**Blog Post:**

- Location: `app/blog/[slug]/page.tsx`
- Triggers: Request to `/blog/[slug]`
- Responsibilities: Parse and render single post, generate static params at build time, 404 for missing/unpublished posts

**Projects:**

- Location: `app/projects/page.tsx`
- Triggers: Request to `/projects`
- Responsibilities: Fetch GitHub repos (async), render featured projects + open source grid

**About:**

- Location: `app/about-me/page.tsx`
- Triggers: Request to `/about-me`
- Responsibilities: Biography, comprehensive skill matrix with proficiency levels

**Contact:**

- Location: `app/contact/page.tsx`
- Triggers: Request to `/contact`
- Responsibilities: Email link, social media links with icons

**Root Layout:**

- Location: `app/layout.tsx`
- Triggers: All requests
- Responsibilities: HTML setup, fonts (Inter), metadata, analytics providers

## Error Handling

**Strategy:** Fail-safe graceful degradation

**Patterns:**

- **Blog Posts:** Returns empty array on missing `/content/posts` directory (line 38-40 in blog.ts); `notFound()` for unpublished/missing posts (line 116 in [slug]/page.tsx)
- **GitHub API:** Catches fetch errors, logs, returns empty array (lines 100-103 in github.ts); filters handle null fields (description, homepage)
- **File System:** `ensurePostsDir()` creates directory if missing (lines 24-28 in blog.ts)
- **MDX Rendering:** MDXRemote handles invalid markdown gracefully; custom components prevent rendering errors with type-safe handlers

## Cross-Cutting Concerns

**Logging:** Console errors only; no structured logging framework

- `console.error()` in `github.ts` for API failures
- No client-side error tracking

**Validation:** Type-level validation via TypeScript strict mode

- Interface checks prevent invalid data shapes
- GitHub API response validated via type casting (no runtime validators)

**Authentication:** None required; public content only

- Email contact link (`mailto:business@xndr.site`)
- No protected routes or API endpoints

**SEO/Metadata:** Implemented via Next.js metadata API

- `export const metadata` for static pages
- `generateMetadata()` for dynamic pages ([slug])
- Open Graph, Twitter cards configured
- Robots/indexing directives in layout.tsx

**Performance:**

- Image optimization: Next.js Image component with formats (webp, avif)
- Code splitting: Server/client boundary at navbar level
- Caching: GitHub API 24-hour revalidation, image TTL 30 days
- Static generation: Blog pages prerendered at build time via `generateStaticParams`

---

_Architecture analysis: 2026-02-23_
