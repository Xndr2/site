# Directory Structure

**Analyzed:** 2026-02-23
**Pattern:** Next.js 15 App Router

## Top-Level Layout

```
site/
├── app/                    # Next.js App Router — all pages, components, libs
├── content/                # Static content (MDX blog posts)
├── public/                 # Static assets served at /
│   ├── fonts/              # Montserrat variable font + static cuts
│   ├── icons/              # Tech stack and social SVG/PNG icons
│   └── abandoned/          # Unused legacy logos
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS / Tailwind config
├── eslint.config.mjs       # ESLint flat config
└── .prettierrc             # Prettier formatting rules
```

## `app/` — Application Root

```
app/
├── layout.tsx              # Root layout — fonts, metadata, shared wrappers
├── page.tsx                # Home page (/)
├── loading.tsx             # Global loading UI
├── globals.css             # Global styles and CSS variables
├── navbar.tsx              # Top navigation bar
├── footer.tsx              # Site footer
├── hamburgerMenu.tsx       # Mobile nav menu
│
├── about-me/
│   └── page.tsx            # /about-me route
├── blog/
│   ├── page.tsx            # /blog route — post listing
│   └── [slug]/
│       └── page.tsx        # /blog/[slug] — individual post
├── contact/
│   └── page.tsx            # /contact route
├── projects/
│   └── page.tsx            # /projects route — GitHub repos
│
├── components/             # Shared UI components
│   ├── particles.tsx       # Animated particle background
│   ├── progressBar.tsx     # Skill/progress bar component
│   ├── tech-stack.tsx      # Tech icon grid display
│   ├── whoarewe.tsx        # About section component
│   └── alert.tsx           # Alert/notification component
│
├── data/
│   └── skills.ts           # Static skills data (used by tech-stack)
│
└── lib/                    # Server-side data fetching
    ├── blog.ts             # Blog post loader (filesystem + gray-matter)
    └── github.ts           # GitHub API client (public repos)
```

## `content/` — Blog Content

```
content/
└── posts/                  # MDX blog posts
    ├── FrontierNetwork.mdx
    ├── ListeningStats.mdx
    └── welcome.mdx
```

## `public/` — Static Assets

```
public/
├── fonts/                  # Montserrat variable font family
│   ├── Montserrat-VariableFont_wght.ttf
│   ├── Montserrat-Italic-VariableFont_wght.ttf
│   └── static/             # 18 static weight/style cuts
├── icons/                  # 25+ tech/social icons (SVG + PNG)
│   ├── github.svg, discord.svg, steam.svg
│   ├── nextjs.svg, react.svg, javascript.svg
│   ├── python.svg, java.svg, c.svg, c++.svg, c-sharp-logo.svg
│   ├── azure.png, linux.png, godot.png, blender.svg
│   └── ...
└── abandoned/              # Unused legacy assets (safe to delete)
```

## Key File Locations

| Purpose                | Path                           |
| ---------------------- | ------------------------------ |
| Root layout + metadata | `app/layout.tsx`               |
| Home page              | `app/page.tsx`                 |
| Blog post loader       | `app/lib/blog.ts`              |
| GitHub repo fetcher    | `app/lib/github.ts`            |
| Skills data            | `app/data/skills.ts`           |
| Particle background    | `app/components/particles.tsx` |
| Global styles          | `app/globals.css`              |
| Next.js config         | `next.config.js`               |
| Blog posts (MDX)       | `content/posts/*.mdx`          |

## Naming Conventions

| Convention   | Pattern                       | Example                            |
| ------------ | ----------------------------- | ---------------------------------- |
| Page files   | `page.tsx` (Next.js standard) | `app/blog/page.tsx`                |
| Components   | camelCase `.tsx`              | `progressBar.tsx`, `techStack.tsx` |
| Lib modules  | camelCase `.ts`               | `blog.ts`, `github.ts`             |
| Data files   | camelCase `.ts`               | `skills.ts`                        |
| MDX posts    | PascalCase `.mdx`             | `FrontierNetwork.mdx`              |
| Icons/assets | kebab-case                    | `c-sharp-logo.svg`                 |
| Routes       | kebab-case directories        | `about-me/`, `[slug]/`             |

## What's Missing

- No `__tests__/` or `*.test.ts` files — no test suite
- No `middleware.ts` — no auth or route guards
- No `api/` routes — purely static/server-rendered
- No `utils/` top-level (utilities live in `app/lib/`)

---

_Generated: 2026-02-23_
