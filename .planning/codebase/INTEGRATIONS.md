# External Integrations

**Analysis Date:** 2026-02-23

## APIs & External Services

**GitHub API:**

- Service: GitHub REST API v3
- What it's used for: Fetch user's public repositories for portfolio display
  - SDK/Client: Native Fetch API
  - Endpoint: `https://api.github.com/users/{username}/repos`
  - Implementation: `app/lib/github.ts` - `fetchGitHubRepos()` function
  - Auth: None required (uses public endpoints; rate limit: 60 requests/hour unauthenticated)
  - Revalidation: 24-hour ISR cache (`revalidate: 86400`)
  - Usage: `app/projects/page.tsx` displays filtered and sorted repos

## Data Storage

**Databases:**

- None - This is a static/hybrid site with file-based content

**File Storage:**

- Local filesystem - Blog content stored as MDX files
  - Path: `content/posts/` directory
  - Client: Node.js `fs` module
  - Implementation: `app/lib/blog.ts` - File system operations
  - Metadata: YAML front-matter parsed with gray-matter

**Caching:**

- Next.js ISR (Incremental Static Regeneration)
  - GitHub repos: 24-hour revalidation
  - Static pages: Generated at build time
  - Blog posts: Statically generated with MDX

## Authentication & Identity

**Auth Provider:**

- None required - Portfolio is public read-only site
- No user authentication or authorization system

## Monitoring & Observability

**Error Tracking:**

- None detected - No dedicated error tracking service

**Logs:**

- Console logging only
  - GitHub API errors logged to console in `app/lib/github.ts`
  - No centralized logging system

**Analytics:**

- Vercel Web Analytics
  - Integration: `@vercel/analytics/react` imported in `app/layout.tsx`
  - Component: `<Analytics />` in root layout

- Vercel Speed Insights
  - Integration: `@vercel/speed-insights/next` imported in `app/layout.tsx`
  - Component: `<SpeedInsights />` in root layout

## CI/CD & Deployment

**Hosting:**

- Vercel (inferred from:
  - `@vercel/analytics` and `@vercel/speed-insights` packages
  - Image optimization config mentions Vercel caching TTL
  - Typical deployment platform for Next.js projects)

**CI Pipeline:**

- None detected - No GitHub Actions or similar CI configuration

**Build Process:**

- Scripts in `package.json`:
  - `npm run build` - Standard Next.js production build
  - `npm run dev` - Development with Turbopack
  - `npm start` - Production server
  - `npm run analyze` - Bundle analysis with Webpack Bundle Analyzer
  - `npm run type-check` - TypeScript compilation check

## Environment Configuration

**Required env vars:**

- None explicitly required - Site uses public APIs and local files
- Optional: May use `.env.local` for development-specific settings

**Configuration Files:**

- `.prettierrc` - Formatting rules
- `.eslintrc.mjs` - Linting rules (flat config)
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - TailwindCSS theming
- `postcss.config.js` - CSS processing

**Secrets location:**

- No secrets detected in codebase
- `.env` files are gitignored (see `.gitignore`)

## Webhooks & Callbacks

**Incoming:**

- None detected

**Outgoing:**

- None detected

## Image & Asset Hosting

**Image Sources:**

- Local static assets: `public/` directory
  - Project screenshots: `public/projects/`
  - Icons: `public/icons/`
  - App icons: `app/apple-icon.png`, `app/icon.png`

**Remote Images:**

- GitHub user avatars: `avatars.githubusercontent.com`
- GitHub raw content: `raw.githubusercontent.com`
- Both configured in `next.config.js` for Next.js Image Optimization

**Image Processing:**

- sharp 0.33.5 for optimization
- Formats: WebP, AVIF (primary), with fallback support
- Device sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840
- Image sizes: 16, 32, 48, 64, 96, 128, 256, 384
- Cache TTL: 30 days for optimized images

## Content Management

**Blog System:**

- File-based with MDX (Markdown + JSX)
- Storage: `content/posts/` directory
- Format: Markdown with YAML front-matter
  - Fields: title, date, description, tags, published, image, content
- Rendering: next-mdx-remote for server-side compilation
- Processing: gray-matter for front-matter extraction, reading-time for reading time calculation
- Features: GitHub-Flavored Markdown, syntax highlighting, auto-generated heading slugs

## Social Links

**No API integrations, direct links to:**

- Discord: `discordapp.com/users/{id}`
- Twitter/X: `twitter.com/{handle}`
- GitHub: `github.com/{username}`
- YouTube: `youtube.com/@{channel}`
- Email: `mailto:business@xndr.site`

## Font Delivery

**Google Fonts:**

- Inter (sans-serif) - Default font, loaded via Next.js built-in font optimization
- Cal Sans (display font) - Referenced via CSS variable `--font-calsans` but implementation not visible in dependencies

---

_Integration audit: 2026-02-23_
