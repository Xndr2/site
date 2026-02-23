# Phase 2: Performance Optimization - Research

**Researched:** 2026-02-23
**Domain:** Next.js 15 performance optimization (images, bundle, streaming, caching, Core Web Vitals)
**Confidence:** HIGH

## Summary

The xndr.site codebase is in good shape after Phase 1 cleanup. It runs Next.js 15.5.11 with React 19, Tailwind CSS 3.4, and deploys on Vercel. All pages are currently statically generated with a shared JS bundle of ~102KB. The site has five routes: home, about-me, projects, blog, blog/[slug], and contact.

A critical discovery is that **framer-motion (v11.18.2) is listed as a dependency but is never imported anywhere in the codebase**. The current animations are all Tailwind CSS keyframes (`animate-fade-in`, `animate-title`, etc.). Since framer-motion is not imported, it is already tree-shaken out of the build -- zero bytes in the bundle. The OPT-06 requirement (reduce framer-motion to <= 10KB) is therefore already satisfied by default, though the dependency should be removed from `package.json` to keep things clean. The Particles component (`app/components/particles.tsx`) also exists but is never imported by any page.

The primary optimization work centers on: (1) auditing and fixing `next/image` `sizes` props across 5 files, (2) restructuring the projects page to use a Suspense boundary so the page shell renders immediately while GitHub data streams in, (3) configuring ISR revalidation intervals per the user's decisions, (4) setting up proper caching headers for static assets, (5) dynamically importing the Particles component if it's to be preserved, and (6) measuring and documenting Lighthouse scores before/after.

**Primary recommendation:** Run a bundle analysis and Lighthouse baseline first, then address image `sizes` props, add Suspense to the projects page, configure ISR/caching headers, and remove the unused framer-motion dependency. Most changes are surgical and low-risk.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Projects loading experience: Show skeleton cards while GitHub data streams in via Suspense; error state with retry button; no spinner
- Animation trade-offs: Simplification acceptable; hero/landing section animations MUST be preserved; LazyMotion scope is Claude's discretion
- Data freshness: Projects data revalidate within 1-5 minutes; blog ISR strategy is Claude's discretion; static asset caching follows Next.js best practice; all pages can be cached aggressively
- Performance measurement: Before/after Lighthouse scores stored in `.planning/` directory; all pages measured (home, projects, blog, and any other routes); target >= 90 Performance on both mobile and desktop

### Claude's Discretion
- Exact skeleton card count and layout fidelity
- Hero animation implementation details (audit existing, preserve it)
- LazyMotion scope -- global or per-page, whichever hits the <= 10KB target cleanly
- Blog ISR interval (if applicable)
- Static asset cache headers specifics
- Lighthouse measurement methodology and whether to capture a pre-Phase 2 baseline

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| OPT-01 | Lighthouse / Core Web Vitals baseline measured and documented | Lighthouse CLI (`npx lighthouse`) with `--preset=desktop` and default mobile; store JSON/HTML reports in `.planning/` |
| OPT-02 | All identified Core Web Vitals issues resolved to achieve Lighthouse Performance >= 90 | Image `sizes` fixes, font loading optimization, dead asset removal, Suspense streaming are the primary levers |
| OPT-03 | All `next/image` usages audited -- `sizes` prop set correctly, `priority` on above-fold images only | 5 files use `next/image`; only navbar has `sizes`; projects images missing `sizes`; tech-stack/about-me icons need `sizes`; blog MDX images need `sizes` |
| OPT-04 | Caching headers verified -- ISR revalidation, static asset `Cache-Control: immutable` | Next.js auto-sets `immutable` on hashed `_next/static/` assets; ISR `revalidate` needs explicit config on projects route; Vercel handles CDN cache automatically |
| OPT-05 | Bundle analyzer run and quick-win reductions implemented | `ANALYZE=true next build` already configured; key wins: remove framer-motion from deps, remove unused Montserrat fonts (4.3MB), remove unused calsans font reference |
| OPT-06 | Framer Motion tree-shaken via LazyMotion + domAnimation | **Already satisfied**: framer-motion is never imported; 0KB in bundle. Remove dependency from package.json entirely. If hero animations need framer-motion in future, use LazyMotion + m + domAnimation pattern |
| OPT-07 | Particle component loaded via `next/dynamic` with `ssr: false` | Particles component exists but is NOT imported anywhere. If preserved for potential future use, wrap with `next/dynamic({ ssr: false })` at import site. If dead code, delete it |
| OPT-08 | Projects page GitHub data wrapped in `<Suspense>` boundary so page shell renders immediately | Extract GitHub repo section into async Server Component; wrap with `<Suspense fallback={<GitHubSkeleton />}>` in projects/page.tsx |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.5.11 | Framework | App Router, Image optimization, ISR, streaming |
| next/image | (built-in) | Image optimization | Auto srcset, format conversion, lazy loading |
| next/dynamic | (built-in) | Dynamic imports | Code splitting with SSR skip |
| sharp | 0.33.5 | Image processing | Required by next/image for production optimization |
| @vercel/analytics | 1.4.0 | Analytics | Performance monitoring in production |
| @vercel/speed-insights | 1.1.0 | Speed insights | Real user metrics (RUM) |

### Supporting (for measurement)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lighthouse | latest | Performance measurement | CLI: `npx lighthouse` for before/after scores |
| webpack-bundle-analyzer | 4.10.2 (installed) | Bundle visualization | Already configured via `ANALYZE=true` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lighthouse CLI | Chrome DevTools Lighthouse tab | CLI is scriptable and reproducible; DevTools is manual |
| @next/bundle-analyzer | webpack-bundle-analyzer (current) | Project already uses webpack-bundle-analyzer directly; @next/bundle-analyzer is a thin wrapper. Current setup works fine |

**Installation:**
```bash
# No new dependencies needed -- lighthouse runs via npx
# Remove unused dependency:
npm uninstall framer-motion
```

## Architecture Patterns

### Current Project Structure
```
app/
├── page.tsx                  # Home (static, hero section)
├── layout.tsx                # Root layout (Inter font, analytics)
├── loading.tsx               # Root loading skeleton
├── navbar.tsx                # Client component (Image with sizes)
├── hamburgerMenu.tsx         # Client component
├── globals.css               # Tailwind + custom CSS
├── about-me/page.tsx         # Static (Image icons, no sizes)
├── blog/
│   ├── page.tsx              # Static (filesystem data)
│   ├── [slug]/page.tsx       # SSG via generateStaticParams
│   ├── error.tsx             # Error boundary
│   └── loading.tsx           # Loading skeleton
├── contact/page.tsx          # Static (no images)
├── projects/
│   ├── page.tsx              # SSG + ISR (GitHub fetch, 24h revalidate)
│   ├── error.tsx             # Error boundary
│   └── loading.tsx           # Loading skeleton
├── components/
│   ├── particles.tsx         # UNUSED client component (canvas)
│   └── tech-stack.tsx        # Image icons (no sizes)
├── data/skills.ts            # Skill data
└── lib/
    ├── blog.ts               # Filesystem blog reader
    └── github.ts             # GitHub API fetcher (revalidate: 86400)
```

### Pattern 1: Suspense Streaming for Projects Page
**What:** Extract the async GitHub data fetch into a separate Server Component, wrap it with a Suspense boundary in the parent page, so the static shell (header + featured projects) renders immediately while GitHub repos stream in.
**When to use:** When a page has both static content and async data that should not block initial render.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

// app/projects/_components/github-repos.tsx (new async Server Component)
import { fetchGitHubRepos } from '@/app/lib/github';

export default async function GitHubRepos() {
  const repos = await fetchGitHubRepos();
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.slice(0, 6).map(repo => (
          <GitHubRepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}

// app/projects/page.tsx (parent page)
import { Suspense } from 'react';
import GitHubRepos from './_components/github-repos';
import GitHubReposSkeleton from './_components/github-repos-skeleton';

export default function Projects() {
  // Page is now NOT async -- renders immediately
  return (
    <div>
      {/* Static shell: header + featured projects render instantly */}
      <section>{/* featured projects */}</section>

      {/* Async data streams in */}
      <Suspense fallback={<GitHubReposSkeleton />}>
        <GitHubRepos />
      </Suspense>
    </div>
  );
}
```

### Pattern 2: next/image sizes Prop for Responsive Images
**What:** The `sizes` prop tells the browser how wide the image will be at each viewport breakpoint, so it downloads the smallest adequate source from the srcset.
**When to use:** Every `next/image` usage that is responsive (not fixed pixel size).
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image#sizes

// Featured project cards in a 2-column grid on md+
<Image
  src={project.img}
  alt={project.name}
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full h-40 object-cover rounded-lg mb-4"
/>

// Small icons (16px) -- use explicit small size
<Image
  src={tech.src}
  alt={tech.name}
  width={16}
  height={16}
  sizes="16px"
/>

// Tech stack icons on home page (50px declared, responsive)
<Image
  src={tech.src}
  alt={tech.name}
  width={50}
  height={50}
  sizes="(max-width: 768px) 24px, 40px"
/>
```

### Pattern 3: ISR Configuration for Projects
**What:** Set `revalidate` export on the projects route to control how frequently the GitHub data is refreshed.
**When to use:** Pages with external data that should be cached but periodically refreshed.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/incremental-static-regeneration

// app/projects/page.tsx
export const revalidate = 300; // 5 minutes (within user's 1-5 min range)
```
Note: This overrides the per-fetch `revalidate: 86400` in github.ts. When both route-level and fetch-level revalidate are set, the **lowest** value wins.

### Pattern 4: Cache-Control Headers for Static Assets
**What:** Next.js automatically sets `Cache-Control: public, max-age=31536000, immutable` on all hashed assets under `_next/static/`. For public folder assets, explicit headers can be configured.
**When to use:** Verify this is working correctly; add headers for non-hashed public assets if needed.
**Example:**
```javascript
// Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

// next.config.js - add to existing headers() function
{
  source: '/_next/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
},
```
Note: Next.js sets this automatically for `_next/static/` assets. The above is redundant on Vercel but useful for self-hosting verification. On Vercel, ISR pages get proper `s-maxage` headers automatically.

### Pattern 5: Dynamic Import for Canvas Component
**What:** Use `next/dynamic` with `ssr: false` to defer loading heavy client-side canvas code.
**When to use:** Client components that use browser-only APIs (canvas, WebGL, window).
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/lazy-loading

import dynamic from 'next/dynamic';

const Particles = dynamic(
  () => import('@/app/components/particles'),
  { ssr: false }
);
```

### Anti-Patterns to Avoid
- **Missing `sizes` on responsive images:** Without `sizes`, the browser assumes the image is viewport-width and downloads the largest srcset entry. This is the most common cause of slow LCP on image-heavy pages.
- **`priority` on all images:** Only the above-fold hero/LCP image should have `priority` (or the newer `preload` prop). Multiple priority images compete for bandwidth and hurt performance.
- **Wrapping entire pages in Suspense instead of specific async sections:** `loading.tsx` wraps the entire route in Suspense. For partial streaming (static shell + async data), use inline `<Suspense>` boundaries wrapping only the async Server Component.
- **Setting `revalidate: 0` or `no-store` on fetches:** This forces dynamic rendering and prevents caching entirely. Use time-based revalidation instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom sharp pipeline | `next/image` + `sizes` prop | Handles srcset, format conversion, lazy loading, CDN caching automatically |
| Bundle analysis | Manual chunk inspection | `ANALYZE=true next build` (already configured) | Visual treemap shows exactly what's in each chunk |
| Cache headers | Manual Cache-Control in middleware | Next.js built-in headers + Vercel CDN | Next.js automatically handles hashed asset immutability and ISR stale-while-revalidate |
| Performance measurement | Custom performance.now() timing | Lighthouse CLI | Standardized scoring, reproducible, industry-accepted metrics |
| Code splitting | Manual webpack chunks | `next/dynamic` + React Suspense | Framework handles chunk boundaries, preloading, and hydration |

**Key insight:** Next.js 15 on Vercel handles most caching and optimization automatically. The main manual work is ensuring correct `sizes` props on images and structuring components to enable streaming.

## Common Pitfalls

### Pitfall 1: Forgetting sizes on statically imported images
**What goes wrong:** Statically imported images (like the featured project images) bypass the need for `width`/`height` since Next.js infers them, but they still need `sizes` if they render responsively. Without `sizes`, Next.js generates a limited srcset (1x, 2x) instead of a full responsive srcset.
**Why it happens:** Static imports auto-set width/height, so developers assume everything is handled.
**How to avoid:** Audit every `<Image>` usage. If CSS makes the image responsive (percentage width, grid layout), it needs a `sizes` prop.
**Warning signs:** Lighthouse flags "Properly size images" or downloads are larger than expected.

### Pitfall 2: ISR revalidate conflicts between route and fetch
**What goes wrong:** The route's `export const revalidate = 300` and a fetch's `{ next: { revalidate: 86400 } }` can confuse developers. The lowest value wins for the route, but each fetch maintains its own Data Cache TTL.
**Why it happens:** Next.js has two caching layers -- the Data Cache (per-fetch) and the Full Route Cache (per-page).
**How to avoid:** Set `revalidate` at the route level to control page-level caching. Either remove per-fetch revalidate or align them. For this project, set route-level revalidate to 300 (5 min) and remove the per-fetch revalidate from github.ts.
**Warning signs:** Stale data persisting longer than expected.

### Pitfall 3: Suspense boundary placement too high or too low
**What goes wrong:** If the Suspense boundary wraps the entire page, the static shell is empty (same as `loading.tsx`). If it wraps too little, layout shift occurs when content pops in.
**Why it happens:** Developers either use `loading.tsx` (wraps entire route) or don't think about where exactly to place the boundary.
**How to avoid:** Place `<Suspense>` around only the async Server Component that fetches data. Everything above/around it (header, featured projects) should be outside the boundary.
**Warning signs:** Full-page loading skeletons instead of partial streaming.

### Pitfall 4: Lighthouse score variability
**What goes wrong:** Scores vary between runs by 5-10 points due to network conditions, CPU throttling, and browser state.
**Why it happens:** Lighthouse simulates network/CPU conditions, but the host machine's actual state affects results.
**How to avoid:** Run 3-5 times and take the median. Use consistent conditions (same machine, no other tabs/processes). Use `--chrome-flags="--headless=new"` for reproducibility.
**Warning signs:** Scores fluctuating wildly between runs.

### Pitfall 5: Giant images in public/ slowing projects page
**What goes wrong:** The HeadshotInteractive thumbnail is 6MB PNG. Even with `next/image` optimization, the source file must be fetched and processed.
**Why it happens:** Source images were committed without size optimization.
**How to avoid:** Compress source images before committing. The 6MB PNG should be reduced to < 500KB.
**Warning signs:** Slow image optimization on first request, high bandwidth usage.

## Code Examples

Verified patterns from official sources:

### ISR Route Configuration
```typescript
// Source: https://nextjs.org/docs/app/guides/incremental-static-regeneration

// app/projects/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

export default function Projects() {
  // Page component -- note: NOT async when using Suspense pattern
  return (/* ... */);
}
```

### Suspense with Skeleton Fallback
```typescript
// Source: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

import { Suspense } from 'react';

// The skeleton should match the layout of the real content
function GitHubReposSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-full mb-2" />
          <div className="h-3 bg-slate-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

// In parent page
<Suspense fallback={<GitHubReposSkeleton />}>
  <GitHubRepos />
</Suspense>
```

### next/dynamic with SSR Disabled
```typescript
// Source: https://nextjs.org/docs/app/guides/lazy-loading

import dynamic from 'next/dynamic';

const Particles = dynamic(
  () => import('@/app/components/particles'),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0" aria-hidden="true" />,
  }
);
```

### Lighthouse CLI Commands
```bash
# Source: https://github.com/GoogleChrome/lighthouse

# Mobile (default)
npx lighthouse http://localhost:3000 --output=json --output=html --output-path=.planning/lighthouse/home-mobile

# Desktop
npx lighthouse http://localhost:3000 --preset=desktop --output=json --output=html --output-path=.planning/lighthouse/home-desktop

# All pages (script pattern)
for page in "" "/projects" "/blog" "/about-me" "/contact"; do
  npx lighthouse "http://localhost:3000${page}" --output=json --output=html \
    --output-path=".planning/lighthouse/${page:-home}-mobile"
  npx lighthouse "http://localhost:3000${page}" --preset=desktop --output=json --output=html \
    --output-path=".planning/lighthouse/${page:-home}-desktop"
done
```

### Cache Headers in next.config.js
```javascript
// Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

async headers() {
  return [
    // Existing security headers...
    {
      source: '/icons/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/projects/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `priority` prop on Image | `preload` prop (Next.js 16+) | Next.js 16 | `priority` still works in 15.x; migration to `preload` only needed if upgrading to 16+ |
| framer-motion `motion` component (34KB) | LazyMotion + `m` component (~5KB) | framer-motion v4+ | Project doesn't use framer-motion at all -- moot point |
| Pages Router ISR with getStaticProps | App Router ISR with `export const revalidate` | Next.js 13+ | Simpler API, works at route segment level |
| Manual code splitting | React Server Components auto code-split | Next.js 13+ | Server Components never ship JS to client |
| Manual `Cache-Control` headers | Next.js auto-immutable for hashed assets | Next.js 12+ | `_next/static/` assets are automatically immutable |

**Deprecated/outdated:**
- `next/legacy/image`: The old image component with `layout` prop. Current project correctly uses the modern `next/image`.
- `priority` on Image component: Deprecated in Next.js 16 in favor of `preload`. Still works in 15.x but marked for migration.
- `domains` in image config: Deprecated in favor of `remotePatterns`. Project correctly uses `remotePatterns`.

## Codebase-Specific Findings

### Critical Discovery: Framer Motion Not Used
**Confidence: HIGH** (verified by grep and build output)

`framer-motion` (v11.18.2) is in `package.json` dependencies but is never imported by any file. The build output confirms 0 bytes of framer-motion in any chunk. All current animations use Tailwind CSS keyframes defined in `tailwind.config.ts`:
- `animate-fade-in`: 0.3s opacity fade on every page
- `animate-title`: 0.4s letter-spacing animation (defined but unused in current pages)
- `animate-fade-left` / `animate-fade-right`: Slide animations (defined but unused)

**Implication for OPT-06:** The requirement to "reduce ~30KB to ~5KB" is already satisfied (0KB). Remove the dependency entirely. If framer-motion is needed in the future for the hero section, use the LazyMotion + m + domAnimation pattern.

### Critical Discovery: Particles Component Not Used
**Confidence: HIGH** (verified by grep)

`app/components/particles.tsx` exists with a full canvas particle animation system, but is never imported by any page. The companion `util/mouse.ts` hook is also only used by particles.tsx.

**Implication for OPT-07:** The `next/dynamic({ ssr: false })` requirement is moot since the component isn't used. Decision needed: delete as dead code, or preserve with dynamic import for future use.

### Image Audit Summary
**Confidence: HIGH** (verified by reading all files)

| File | Image Usage | Has `sizes`? | Has `priority`? | Issue |
|------|-------------|-------------|-----------------|-------|
| `navbar.tsx` | PFP icon (fill) | Yes (`128px`) | Yes | OK -- above fold, correct |
| `projects/page.tsx` | Featured project images (static import, responsive) | No | No | Needs `sizes="(max-width: 768px) 100vw, 50vw"` |
| `components/tech-stack.tsx` | Skill icons (50x50 declared, responsive via CSS) | No | No | Needs `sizes="(max-width: 768px) 24px, 40px"` |
| `about-me/page.tsx` | Skill icons (16x16) | No | No | Needs `sizes="16px"` |
| `blog/[slug]/page.tsx` | MDX content images (800x400 default) | No | No | Needs `sizes="(max-width: 768px) 100vw, 672px"` (max-w-screen-md) |

### Dead Assets
**Confidence: HIGH**

- `public/fonts/` (4.3MB): Montserrat font files, never referenced in code. Layout uses `next/font/google` for Inter.
- `tailwind.config.ts` references `--font-calsans` which is never defined.
- `public/projects/abandoned/library_header_en.png` and `public/projects/DiscordBot/Thumbnail.png` and `public/projects/renderer/Thumbnail.png` -- need to verify if these are referenced anywhere.

### Oversized Images
**Confidence: HIGH**

- `public/projects/HeadshotInteractive/Thumbnail.png`: **6.0MB** -- needs compression to < 500KB
- `public/projects/jitsemoerman.be/Thumbnail.png`: **1.1MB** -- should be < 300KB
- These are used via static import in `projects/page.tsx` and processed by `next/image`, but the source file size still affects build time and initial optimization latency.

### ISR Current State
**Confidence: HIGH**

- `app/lib/github.ts` sets `{ next: { revalidate: 86400 } }` (24 hours) on the GitHub API fetch
- No route-level `revalidate` export on any page
- Blog pages use `generateStaticParams` (fully static, no ISR)
- Blog data comes from filesystem (no fetch, no revalidation needed)
- User wants projects data to revalidate within 1-5 minutes

### @next/swc Version Mismatch
**Confidence: HIGH** (from build output)

Build warning: `Mismatching @next/swc version, detected: 15.5.7 while Next.js is on 15.5.11`. The `optionalDependencies` in package.json has `"@next/swc-linux-x64-gnu": "npm:null@^2.0.0"` which is likely a workaround for a platform issue. This is non-blocking but produces a warning.

## Open Questions

1. **Particles component: delete or preserve?**
   - What we know: Component exists, is never used, references `util/mouse.ts`
   - What's unclear: Whether the user intends to use it in the future (perhaps on the hero section)
   - Recommendation: Note it as dead code during planning. The user's CONTEXT.md says "Hero animation approach: Claude decides (audit existing implementation and preserve it)" -- the existing hero has no particles import, only Tailwind fade-in. Recommend deleting particles.tsx and mouse.ts as dead code (CLEAN-01 in requirements mentions dead code deletion). If the user wants particles later, it's in git history.

2. **Unused images in public/projects/?**
   - What we know: DiscordBot/Thumbnail.png and renderer/Thumbnail.png are not referenced in the featured projects array
   - What's unclear: Whether they're used elsewhere or are dead assets
   - Recommendation: Verify during planning; if unused, note for cleanup (but don't delete during performance phase -- that's cleanup scope)

3. **`@next/swc` version mismatch**
   - What we know: Build warning exists due to optionalDependencies workaround
   - What's unclear: Whether this affects performance at all
   - Recommendation: Address as a quick fix during phase execution (remove the optionalDependencies entry or update the lock file)

## Sources

### Primary (HIGH confidence)
- [Next.js Image Component docs](https://nextjs.org/docs/app/api-reference/components/image) - `sizes`, `priority`/`preload`, responsive image patterns
- [Next.js ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration) - `revalidate` config, time-based and on-demand revalidation
- [Next.js Lazy Loading Guide](https://nextjs.org/docs/app/guides/lazy-loading) - `next/dynamic` with `ssr: false`, loading components
- [Next.js Streaming/Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) - Suspense boundaries, streaming patterns
- Codebase analysis (direct file reads) - All architecture findings verified against source code

### Secondary (MEDIUM confidence)
- [Motion.dev bundle size docs](https://motion.dev/docs/react-reduce-bundle-size) - LazyMotion, m component, domAnimation (~5KB), domMax (~28KB)
- [Lighthouse CLI GitHub](https://github.com/GoogleChrome/lighthouse) - CLI flags, headless mode, presets
- [Next.js headers config](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers) - Cache-Control header configuration

### Tertiary (LOW confidence)
- None -- all findings verified against official sources or direct codebase analysis.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already installed; no new dependencies needed
- Architecture: HIGH - Patterns verified against official Next.js 15 docs and current codebase structure
- Pitfalls: HIGH - Based on known Next.js patterns and confirmed against codebase state
- Framer Motion finding: HIGH - Verified via grep (no imports) and build output (no chunks)
- Image audit: HIGH - Every `<Image>` usage read and cataloged from source files

**Research date:** 2026-02-23
**Valid until:** 2026-03-23 (30 days -- Next.js and ecosystem are stable at current versions)
