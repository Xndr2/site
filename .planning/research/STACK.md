# Technology Stack: Newsletter & Optimization Additions

**Project:** Xndr Portfolio Site -- Newsletter + Optimization Milestone
**Researched:** 2026-02-23
**Scope:** New additions only (email sending, subscriber storage, Vercel optimization)

> **Confidence Note:** Web search and fetch tools were unavailable during this research session. All pricing/limit figures come from training data (cutoff: early 2025). Pricing tiers are flagged as MEDIUM confidence and MUST be verified against current pricing pages before implementation. Services frequently change free tier limits.

---

## Recommended Stack (New Additions)

### Email Sending: Resend

| Technology | Version | Purpose                                          | Why                                                                                                                |
| ---------- | ------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Resend     | latest  | Transactional email sending (blog notifications) | Developer-first API, built by ex-Vercel team, first-class Next.js SDK, generous free tier, no credit card required |

**Free tier (MEDIUM confidence -- verify at resend.com/pricing):**

- 3,000 emails/month (was 100/day, changed to monthly pool)
- 1 custom domain
- No credit card required to start
- Full API access on free tier

**Why Resend over alternatives:**

- **Native Next.js integration:** `resend` npm package with React Email support -- you can write email templates as React components, which fits the existing React 19 stack perfectly
- **Vercel ecosystem alignment:** Founded by Zeno Rocha (ex-Vercel), designed to work seamlessly with Vercel deployments and Next.js API routes
- **Simple API surface:** One function call to send email. No complex configuration, no SMTP credentials to manage
- **React Email:** Companion library `@react-email/components` lets you build email templates with the same JSX/TypeScript you already use
- **No subscriber management overhead:** Resend is a sending service, not a marketing platform. It sends what you tell it to send -- no bloated dashboard, no "campaign" abstraction

**Confidence:** MEDIUM -- free tier limits need verification against current pricing page. The 3,000/month figure is from early 2025 data.

### Subscriber Storage: Vercel KV (Upstash Redis)

| Technology | Version | Purpose                          | Why                                                                                   |
| ---------- | ------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| @vercel/kv | latest  | Store subscriber email addresses | Zero-config on Vercel, generous free tier, simple key-value operations, no ORM needed |

**Free tier (MEDIUM confidence -- verify at vercel.com/docs/storage/vercel-kv):**

- 256 MB storage
- 30,000 requests/day
- Data persisted across deployments
- Powered by Upstash Redis under the hood

**Why Vercel KV over alternatives:**

- **Zero additional accounts:** Already deployed on Vercel -- KV is a one-click add in the Vercel dashboard. No separate Supabase/Neon/PlanetScale account needed
- **Perfect for simple data:** Subscriber list is literally a set of email addresses. A Redis SET is the ideal data structure -- `SADD subscribers email@example.com`, `SMEMBERS subscribers`. No schema, no migrations, no ORM
- **Edge-compatible:** Works in both Node.js API routes and Edge functions
- **Atomic operations:** Redis SADD is naturally idempotent -- adding the same email twice is a no-op. Built-in deduplication for free
- **Low latency:** Sub-millisecond reads for subscriber list retrieval when sending notifications

**Data model:**

```
Key: "subscribers"          -> SET of email addresses
Key: "subscriber:{email}"   -> HASH with { email, subscribedAt, confirmed }
Key: "unsubscribe:{token}"  -> STRING with email (TTL: 7 days for unsubscribe links)
```

**Confidence:** MEDIUM -- Vercel KV free tier limits need verification. The 256MB/30K requests figures are from early 2025.

### Email Templates: React Email

| Technology              | Version | Purpose                      | Why                                                                      |
| ----------------------- | ------- | ---------------------------- | ------------------------------------------------------------------------ |
| @react-email/components | latest  | Build email templates in JSX | Write emails as React components -- same language as the rest of the app |

**Why:** Email templates are notoriously painful (inline CSS, table layouts, client compatibility). React Email abstracts this away and outputs compatible HTML. Since the project is already React 19 + TypeScript, this is the natural choice.

---

## Alternatives Considered

### Email Sending

| Category  | Recommended | Alternative             | Why Not                                                                                                                                                                                     |
| --------- | ----------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email API | **Resend**  | Brevo (Sendinblue)      | Brevo's free tier is 300 emails/day but comes with Brevo branding on free plan, heavier SDK, marketing-platform complexity unnecessary for simple notifications                             |
| Email API | **Resend**  | Buttondown              | Buttondown is a full newsletter platform (overkill). Free tier limited to 100 subscribers. Forces you into their workflow/UI rather than API-first                                          |
| Email API | **Resend**  | EmailOctopus            | Free tier decent (2,500 subscribers, 10,000 emails/month) but requires separate account, no native Next.js SDK, designed for marketing not developer workflows                              |
| Email API | **Resend**  | ConvertKit (Kit)        | Creator-focused marketing platform, massive overkill for "send notification when blog post published." Free tier exists but designed for content creators, not developers. Heavy onboarding |
| Email API | **Resend**  | MailerSend              | Decent free tier (3,000 emails/month) but less ecosystem alignment with Next.js/Vercel. No React Email equivalent. Works fine but Resend is more ergonomic for this stack                   |
| Email API | **Resend**  | AWS SES                 | Cheapest at scale but requires AWS account, IAM configuration, domain verification through AWS -- massive overhead for a portfolio site. Free tier only within AWS Free Tier period         |
| Email API | **Resend**  | Nodemailer + Gmail SMTP | Free but unreliable. Gmail rate-limits SMTP, requires App Passwords, Google periodically breaks this flow. Not production-grade                                                             |

### Subscriber Storage

| Category | Recommended   | Alternative            | Why Not                                                                                                                                                                                                             |
| -------- | ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Database | **Vercel KV** | Supabase (PostgreSQL)  | Full PostgreSQL is overkill for a subscriber list. Requires separate account, connection pooling setup, schema management. Free tier is generous (500MB) but the complexity is unjustified for ~100 email addresses |
| Database | **Vercel KV** | Neon (PostgreSQL)      | Same problem as Supabase -- relational DB for what is fundamentally a set of strings. Good free tier but unnecessary complexity                                                                                     |
| Database | **Vercel KV** | PlanetScale (MySQL)    | PlanetScale removed their free tier in early 2024. Not an option for $0 budget. **Do not use**                                                                                                                      |
| Database | **Vercel KV** | Vercel Postgres        | Could work but PostgreSQL overhead for simple key-value data. Vercel KV is simpler for this exact use case                                                                                                          |
| Database | **Vercel KV** | JSON file in repo      | Tempting but terrible. Requires git commits to add subscribers, no concurrent write safety, Vercel deployments are immutable (can't write to filesystem in production)                                              |
| Database | **Vercel KV** | Upstash Redis (direct) | This IS what Vercel KV uses under the hood. Direct Upstash gives you more control but requires a separate account. Vercel KV wraps it with zero-config integration                                                  |

---

## Next.js 15 + Vercel Optimization Best Practices

### Image Optimization (already partially configured)

**Current state:** The site already uses `next/image` with WebP/AVIF formats, proper device sizes, and 30-day cache TTL. This is well-configured.

**Recommendations:**
| Optimization | Current | Recommended | Impact |
|--------------|---------|-------------|--------|
| Image formats | WebP + AVIF | Keep as-is | Already optimal |
| Cache TTL | 30 days | Keep as-is (or increase to 60 days for static assets) | Reduces Vercel image optimization costs |
| `priority` prop | Unknown | Add to above-fold images (hero, navbar logo) | Eliminates LCP delay for critical images |
| `sizes` prop | Likely missing | Add explicit `sizes` to all `<Image>` components | Prevents downloading oversized images on mobile |
| `placeholder="blur"` | Likely missing | Add to hero/large images with `blurDataURL` | Perceived performance improvement |

### Bundle Optimization

| Optimization                         | Action                                                                                                                     | Impact                                              | Confidence |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------- |
| Analyze current bundle               | Run `npm run analyze` (already configured)                                                                                 | Identify large dependencies                         | HIGH       |
| Framer Motion tree-shaking           | Import from `framer-motion/m` instead of `framer-motion` for simple animations; or use `LazyMotion` + `domAnimation`       | Can reduce Framer Motion from ~30KB to ~5KB gzipped | HIGH       |
| Dynamic imports for heavy components | `next/dynamic` for particles component (only loads on client, not needed for SSR)                                          | Reduces initial JS payload                          | HIGH       |
| Package import optimization          | Verify `@heroicons/react` imports are specific (`@heroicons/react/24/outline/XMarkIcon` not `@heroicons/react/24/outline`) | Prevents importing entire icon library              | MEDIUM     |
| `optimizePackageImports`             | Add to `next.config.js`: `experimental: { optimizePackageImports: ['framer-motion', '@headlessui/react'] }`                | Automatic tree-shaking for barrel exports           | HIGH       |

### Caching & ISR Strategy

| Resource                      | Current                       | Recommended                | Rationale                                         |
| ----------------------------- | ----------------------------- | -------------------------- | ------------------------------------------------- |
| GitHub repos                  | 24h ISR (86400s)              | Keep as-is                 | Repos don't change frequently; 24h is appropriate |
| Blog posts                    | Static (generateStaticParams) | Keep static, no ISR needed | MDX files only change on deploy                   |
| Subscriber API routes         | N/A (new)                     | No caching -- always fresh | Subscription/unsubscription must be real-time     |
| Newsletter send endpoint      | N/A (new)                     | No caching, POST only      | Side-effect endpoint, never cache                 |
| Static pages (about, contact) | Static                        | Keep static                | Content changes only on deploy                    |

### Vercel-Specific Optimizations

| Feature                       | Status                   | Recommendation                                                                                                       | Confidence   |
| ----------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------ |
| Vercel Analytics              | Installed                | Keep -- already integrated in layout.tsx                                                                             | HIGH         |
| Vercel Speed Insights         | Installed                | Keep -- already integrated in layout.tsx                                                                             | HIGH         |
| Edge Runtime for API routes   | Not used                 | Use Edge Runtime for subscribe/unsubscribe endpoints (faster cold starts, lower latency)                             | HIGH         |
| Vercel KV                     | Not installed            | Add for subscriber storage (see above)                                                                               | MEDIUM       |
| `headers()` in next.config.js | Security headers present | Add `Cache-Control` headers for static assets; verify `stale-while-revalidate` for ISR pages                         | HIGH         |
| Vercel Cron Jobs              | Not used                 | Consider for "check for new posts and send newsletter" -- Vercel Cron can trigger a serverless function daily/weekly | MEDIUM       |
| `@vercel/og`                  | Not used                 | Consider for dynamic OG images for blog posts (generates images at the edge)                                         | LOW priority |

### Core Web Vitals Targets

| Metric                              | Target  | How to Achieve                                                                           |
| ----------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| LCP (Largest Contentful Paint)      | < 2.5s  | `priority` on hero images, preload critical fonts, minimize render-blocking JS           |
| FID/INP (Interaction to Next Paint) | < 200ms | Minimize hydration cost, lazy-load non-critical interactivity (particles)                |
| CLS (Cumulative Layout Shift)       | < 0.1   | Explicit `width`/`height` on all images, font-display: swap already handled by next/font |
| TTFB (Time to First Byte)           | < 800ms | Static/ISR pages on Vercel CDN should be <100ms; API routes on Edge Runtime for low TTFB |

---

## New Dependencies to Install

### Production Dependencies

```bash
# Email sending
npm install resend

# Email templates
npm install @react-email/components

# Subscriber storage (Vercel KV)
npm install @vercel/kv
```

### Development Dependencies

```bash
# Email template preview (optional but helpful)
npm install -D react-email
```

### No New Dev Dependencies Required For

- Bundle optimization (already has webpack-bundle-analyzer)
- Image optimization (already has sharp)
- Vercel features (already has @vercel/analytics, @vercel/speed-insights)

---

## Environment Variables Required (New)

```env
# Resend API key (get from resend.com dashboard)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Vercel KV (auto-populated when KV store is linked in Vercel dashboard)
KV_REST_API_URL=https://xxxxx.kv.vercel-storage.com
KV_REST_API_TOKEN=xxxxx
KV_REST_API_READ_ONLY_TOKEN=xxxxx

# Site URL (for unsubscribe links in emails)
NEXT_PUBLIC_SITE_URL=https://xndr.site

# Email sender (must match verified domain in Resend)
EMAIL_FROM=newsletter@xndr.site
```

---

## API Routes to Create

| Route                  | Method | Runtime | Purpose                                                                   |
| ---------------------- | ------ | ------- | ------------------------------------------------------------------------- |
| `/api/subscribe`       | POST   | Edge    | Accept email, add to KV, send confirmation                                |
| `/api/unsubscribe`     | GET    | Edge    | Token-based unsubscribe link handler                                      |
| `/api/send-newsletter` | POST   | Node.js | Send blog notification to all subscribers (triggered manually or by cron) |

**Security considerations:**

- `/api/send-newsletter` must be protected with a secret token (e.g., `CRON_SECRET` header) to prevent unauthorized sends
- `/api/subscribe` should have basic rate limiting (Vercel KV can track request counts)
- Email validation on subscribe endpoint (reject invalid formats)
- Double opt-in recommended but optional for small personal blog

---

## What NOT to Use

| Technology                  | Why Not                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **PlanetScale**             | Removed free tier in 2024. Dead option for $0 budget                                                                                 |
| **Nodemailer + Gmail SMTP** | Unreliable, rate-limited, Google breaks App Passwords periodically. Not production-grade                                             |
| **SendGrid**                | Free tier requires credit card, has been reducing free limits over the years. Twilio ownership has not improved developer experience |
| **Mailchimp**               | Massively overengineered for this use case. Free tier has gotten worse. Intuit ownership focused on upselling                        |
| **ConvertKit/Kit**          | Creator platform, not a developer tool. Requires you to use their forms and flows rather than your own UI                            |
| **JSON file storage**       | Vercel deployments are immutable -- you cannot write to the filesystem in production. Fundamentally broken approach                  |
| **MongoDB Atlas**           | Free tier exists but a document database for a list of emails is absurd over-engineering                                             |
| **Firebase**                | Google ecosystem lock-in, heavy SDK, overkill for key-value storage                                                                  |
| **Vercel Blob**             | Designed for file storage (images, PDFs), not structured data. Wrong tool for subscriber lists                                       |

---

## Implementation Sketch

### Subscribe Flow

```
User enters email -> POST /api/subscribe
  -> Validate email format
  -> SADD to Vercel KV "subscribers" set
  -> Store metadata in "subscriber:{email}" hash
  -> (Optional) Send welcome/confirmation email via Resend
  -> Return success
```

### Send Notification Flow

```
New blog post published -> Trigger /api/send-newsletter
  -> SMEMBERS from Vercel KV "subscribers" set
  -> For each subscriber, send email via Resend
  -> Use React Email template with post title, excerpt, link
  -> Include unsubscribe link with signed token
```

### Unsubscribe Flow

```
User clicks unsubscribe link -> GET /api/unsubscribe?token=xxx
  -> Verify token from KV
  -> SREM email from "subscribers" set
  -> DEL subscriber metadata
  -> Redirect to "successfully unsubscribed" page
```

---

## Confidence Assessment

| Area                                 | Confidence | Notes                                                                                                          |
| ------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Resend as email provider             | MEDIUM     | Training data says 3,000 emails/month free. MUST verify current limits at resend.com/pricing before committing |
| Vercel KV as subscriber storage      | MEDIUM     | Training data says 256MB + 30K req/day free. MUST verify at vercel.com/docs/storage/vercel-kv                  |
| React Email for templates            | HIGH       | Well-established library, same team as Resend, React component model is proven                                 |
| Next.js image optimization practices | HIGH       | Based on official Next.js docs patterns, verified against existing next.config.js                              |
| Bundle optimization techniques       | HIGH       | Standard Next.js patterns (dynamic imports, optimizePackageImports, LazyMotion)                                |
| Framer Motion tree-shaking           | HIGH       | Well-documented pattern, `LazyMotion` + `domAnimation` is official recommendation                              |
| Edge Runtime for API routes          | HIGH       | Standard Vercel/Next.js feature, well-documented                                                               |
| PlanetScale free tier removal        | HIGH       | Widely reported, confirmed by multiple sources in 2024                                                         |
| Vercel Cron Jobs                     | MEDIUM     | Available on Vercel Hobby plan but limits may apply (verify)                                                   |

---

## Sources

- Resend pricing: resend.com/pricing (not fetched -- VERIFY)
- Buttondown pricing: buttondown.com/pricing (not fetched -- evaluated from training data)
- Brevo pricing: brevo.com/pricing (not fetched -- evaluated from training data)
- Vercel KV docs: vercel.com/docs/storage/vercel-kv (not fetched -- VERIFY)
- Next.js Image docs: nextjs.org/docs/app/building-your-application/optimizing/images
- Next.js Bundle Analysis: nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer
- React Email: react.email (not fetched -- evaluated from training data)
- PlanetScale free tier removal: Widely reported February-March 2024

---

_Stack research: 2026-02-23 | Web verification tools unavailable -- all pricing figures are MEDIUM confidence and must be verified before implementation_
