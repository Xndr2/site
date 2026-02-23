# Xndr Portfolio Site

## What This Is

A personal developer portfolio and blog for Xander (Xndr), a self-taught developer from Belgium. The site showcases projects pulled live from GitHub, a technical blog written in MDX, an about page with a skill matrix, and a contact page. Deployed on Vercel.

## Core Value

Visitors can discover who Xander is and what he's built — the site must load fast, look clean, and work reliably.

## Requirements

### Validated

- ✓ MDX blog with frontmatter, reading time, tag filtering, and date sorting — existing
- ✓ GitHub projects page with pinned repos, language colors, live API data (24h cache) — existing
- ✓ About page with categorized skill matrix and proficiency levels — existing
- ✓ Contact page with email and social links — existing
- ✓ Particle background animation with mouse interaction — existing
- ✓ Responsive navigation with mobile hamburger menu — existing
- ✓ Vercel Analytics + Speed Insights integrated — existing
- ✓ SEO: OpenGraph, Twitter cards, robots, canonical URLs — existing
- ✓ Static generation for blog posts via generateStaticParams — existing
- ✓ Security headers (X-Frame-Options, X-Content-Type-Options, etc.) — existing

### Active

- [ ] Remove all dead code (util/performance.ts, abandoned/ assets, unused exports)
- [ ] Simplify particle component (remove eslint-disable hacks, clean up any-typed refs)
- [ ] Apply consistent code style (Prettier-aligned, uniform quote style, no mixed conventions)
- [ ] Surface errors meaningfully instead of silently returning empty data
- [ ] Achieve green Lighthouse / Core Web Vitals scores on Vercel
- [ ] Correct caching strategy (ISR revalidation, image TTL, edge config)
- [ ] Reduce JS bundle size (tree-shake, code-split where applicable)
- [ ] Ensure all Vercel-specific features are properly configured (Analytics, Speed Insights, OG)
- [ ] Add email subscribe form on the site (visitors can subscribe to blog updates)
- [ ] Send email to subscribers when a new blog post is published (free tier only)

### Out of Scope

- User authentication — public content only, no protected routes
- Paid email services — free tier is the hard constraint
- Admin dashboard / CMS — posts are authored as MDX files directly
- Real-time features — static/ISR is sufficient
- Mobile app — web only

## Context

**Existing codebase:** Next.js 15, React 19, TypeScript (strict mode), Tailwind CSS v3, deployed on Vercel.

**Known tech debt:**

- `util/performance.ts` is unused dead code
- `public/abandoned/` contains legacy assets that can be deleted
- `app/components/particles.tsx` has `any[]` typed refs and multiple `eslint-disable` comments
- GitHub API and blog silently return empty arrays on failure
- `console.error` used in production with no user-facing error states

**Email constraints:** Must use free-tier services. Options to research: Resend (free tier), Brevo (free tier), MailerSend, EmailOctopus, Buttondown, ConvertKit free plan. Subscriber storage could use Vercel KV, PlanetScale free, Supabase free, or Neon free tier.

## Constraints

- **Budget**: $0 — all third-party services must be on permanent free tiers
- **Tech stack**: Next.js + Vercel — no platform changes
- **Behavior**: Refactoring must not change any visible behavior for site visitors
- **TypeScript**: Strict mode must remain — no `any` widening as part of cleanup

## Key Decisions

| Decision                | Rationale                                                | Outcome   |
| ----------------------- | -------------------------------------------------------- | --------- |
| Email provider TBD      | Research free tiers before committing                    | — Pending |
| Subscriber storage TBD  | Depends on email provider's built-in list vs external DB | — Pending |
| Error handling approach | Surface errors visually vs log to Vercel dashboard only  | — Pending |

---

_Last updated: 2026-02-23 after initialization_
