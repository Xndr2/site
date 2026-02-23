# Architecture Patterns

**Domain:** Email subscription system for Next.js 15 App Router portfolio site
**Researched:** 2026-02-23

## Recommended Architecture

### System Overview

```
+------------------+     +--------------------+     +------------------+
|  Subscribe Form  | --> |  POST /api/subscribe | --> |  Resend Contacts |
|  (Client Component) |  |  (Route Handler)   |     |  (Audience API)  |
+------------------+     +--------------------+     +------------------+

+------------------+     +--------------------+     +------------------+
|  git push (new   | --> |  Vercel Build      | --> |  POST /api/notify |
|  MDX post)       |     |  (deploy hook or   |     |  (Route Handler)  |
+------------------+     |  build script)     |     +--------+---------+
                          +--------------------+              |
                                                              v
                                                    +------------------+
                                                    |  Resend Batch    |
                                                    |  Send API        |
                                                    +------------------+
```

The system has two distinct flows:

1. **Subscribe flow**: Visitor submits email -> API route stores in Resend Audience
2. **Notify flow**: New post deployed -> triggered API route fetches subscribers -> sends email via Resend

### Component Boundaries

| Component             | Responsibility                                                       | Communicates With                                         | Location                            |
| --------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------- |
| `SubscribeForm`       | Client-side form with email input, validation, submit state          | `POST /api/subscribe`                                     | `app/components/subscribe-form.tsx` |
| `POST /api/subscribe` | Validates email, adds contact to Resend Audience, returns status     | Resend Contacts API                                       | `app/api/subscribe/route.ts`        |
| `POST /api/notify`    | Fetches subscribers from Resend, detects new post, sends batch email | Resend Audiences API + Resend Send API, `app/lib/blog.ts` | `app/api/notify/route.ts`           |
| `blog.ts` (existing)  | Provides `getAllPosts()` and `getPostBySlug()` for post metadata     | Filesystem (`content/posts/`)                             | `app/lib/blog.ts` (unchanged)       |

## Where Components Live

### Subscribe Form Placement

**Primary location: Blog listing page** (`app/blog/page.tsx`)

Place the subscribe form at the bottom of the blog listing page, after the post timeline. This is where visitors are already in "reading mode" and most likely to subscribe. The blog page is the highest-intent location -- visitors browsing posts are the ones who want notifications about new ones.

**Secondary location (optional): Individual blog post pages** (`app/blog/[slug]/page.tsx`)

A smaller inline CTA at the bottom of each post, after the content. Visitors who just finished reading a post are warm leads for subscription.

**NOT on the home page or contact page.** The home page is for first impressions and project discovery. The contact page is for business inquiries. Neither context matches "subscribe to blog updates."

### Subscribe Form Component

```
app/components/subscribe-form.tsx  ("use client")
```

This is a new **client component** because it needs:

- `useState` for email input, loading state, success/error feedback
- Form submission with `fetch()` to the API route
- User interaction (typing, clicking submit)

The component is self-contained: it manages its own state, calls the API, and displays feedback. No global state, no context providers needed.

**Why a separate component file:** Keeps the blog page as a Server Component. The subscribe form is the only interactive part, so it gets a clean `"use client"` boundary.

### API Route Structure

```
app/
  api/
    subscribe/
      route.ts      # POST: Add email to subscriber list
    notify/
      route.ts      # POST: Send notification to all subscribers
```

This is the site's **first API route directory**. The existing codebase has zero `api/` routes -- everything is static/server-rendered pages. Adding `app/api/` introduces a new layer.

**Convention choice: `app/api/` prefix.** While Next.js Route Handlers can live anywhere in `app/`, using the `api/` convention:

- Makes it obvious these are API endpoints, not pages
- Separates concerns from page routes
- Matches community convention and avoids confusion

## Data Flow: Subscribe

```
1. Visitor types email in SubscribeForm
2. Client-side validation (email format regex)
3. Form submits POST to /api/subscribe with JSON body: { email: "user@example.com" }
4. Route Handler validates email server-side (regex + length check)
5. Route Handler calls Resend Contacts API: POST https://api.resend.com/audiences/{id}/contacts
   - Body: { email: "user@example.com", unsubscribed: false }
   - Header: Authorization: Bearer re_XXXXX
6. Resend stores the contact in the Audience
7. Route Handler returns { success: true } or { error: "..." }
8. SubscribeForm shows success message or error state
```

**Key decision: Resend Audiences as the subscriber store.** No separate database needed. Resend's Audiences feature stores contacts, handles deduplication, and provides an unsubscribe mechanism. This eliminates the need for Vercel KV, Supabase, or any other database for subscriber storage.

**Why this matters:** The PROJECT.md lists "Subscriber storage could use Vercel KV, PlanetScale free, Supabase free, or Neon free tier" as options. Using Resend Audiences means zero additional infrastructure -- the email provider IS the subscriber store.

### Subscribe Route Handler Detail

```typescript
// app/api/subscribe/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Validate
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Valid email required' }, { status: 400 });
  }

  // Add to Resend Audience
  const res = await fetch(
    `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    }
  );

  if (!res.ok) {
    return Response.json({ error: 'Subscription failed' }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

**No `resend` npm package needed for this.** The Resend API is a simple REST API. Using raw `fetch()` keeps the bundle lean and avoids adding a dependency for what amounts to two HTTP calls. The `resend` SDK is nice but unnecessary for this scope.

## Data Flow: New Post Notification

This is the more architecturally interesting question. How does the system know a new post was published?

### Recommended Approach: Vercel Deploy Hook + Build-time Detection

```
1. Developer writes new MDX file in content/posts/
2. Developer commits and pushes to main
3. Vercel detects push, runs build
4. During build, a custom script OR after deploy, a webhook compares posts
5. If new post detected, POST /api/notify is called
6. /api/notify fetches all contacts from Resend Audience
7. /api/notify sends batch email via Resend Send API
8. Subscribers receive "New post: [Title]" email
```

### Trigger Mechanism Options (ranked)

**Option A: Vercel Deploy Hook (RECOMMENDED)**

Use a Vercel Deploy Hook as a webhook target, but inverted -- the site itself calls its own `/api/notify` endpoint after build. Specifically:

1. Add a `postbuild` script in `package.json` that writes a manifest of current posts to a known location
2. The `/api/notify` route, when called, compares current posts against a "last notified" marker stored in Resend (via a tag or custom metadata) or a simple approach: store the last-notified post slug/date as a Vercel Environment Variable updated via the Vercel API

**Simplified version (actually recommended):** Make notification a **manual trigger** with a secret. The developer (Xander) calls `POST /api/notify?secret=NOTIFY_SECRET` after publishing a new post. This is the simplest, most reliable approach for a single-author blog with 3 posts.

Why manual is better here:

- A single-author blog with infrequent posts (currently 3 total) does not need automation
- Automated detection adds complexity: tracking which posts were already notified, handling edge cases (draft toggles, date changes, republishes)
- The developer already has to write the MDX file and push -- adding one more step (curl/click) is trivial
- No risk of accidental duplicate notifications

**Option B: GitHub Actions Webhook (alternative)**

A GitHub Action on push to `content/posts/` that calls the notify endpoint. More automated but adds CI complexity.

**Option C: Vercel Deployment Webhook + comparison logic (complex)**

Vercel can send webhooks on deployment completion. A Route Handler receives the webhook, checks for new posts vs. a stored manifest, and triggers email. Over-engineered for this use case.

### Notify Route Handler Detail

```typescript
// app/api/notify/route.ts
import { NextRequest } from 'next/server';
import { getAllPosts } from '@/app/lib/blog';

export async function POST(request: NextRequest) {
  // Authenticate: simple shared secret
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.NOTIFY_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get the latest post (or accept slug as parameter)
  const { slug } = await request.json().catch(() => ({ slug: null }));

  const posts = getAllPosts();
  const post = slug ? posts.find(p => p.slug === slug) : posts[0]; // Latest post if no slug specified

  if (!post) {
    return Response.json({ error: 'No post found' }, { status: 404 });
  }

  // Fetch subscribers from Resend Audience
  const contactsRes = await fetch(
    `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
    {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    }
  );

  if (!contactsRes.ok) {
    return Response.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }

  const { data: contacts } = await contactsRes.json();
  const subscribers = contacts
    .filter((c: { unsubscribed: boolean }) => !c.unsubscribed)
    .map((c: { email: string }) => c.email);

  if (subscribers.length === 0) {
    return Response.json({ message: 'No subscribers to notify' });
  }

  // Send batch email via Resend
  const emailRes = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      subscribers.map((email: string) => ({
        from: 'Xndr Blog <blog@xndr.site>',
        to: email,
        subject: `New Post: ${post.title}`,
        html: `<p>A new post was published on xndr.site:</p>
               <h2>${post.title}</h2>
               <p>${post.description}</p>
               <a href="https://xndr.site/blog/${post.slug}">Read it here</a>`,
      }))
    ),
  });

  if (!emailRes.ok) {
    return Response.json({ error: 'Failed to send emails' }, { status: 500 });
  }

  return Response.json({
    success: true,
    sent: subscribers.length,
    post: post.slug,
  });
}
```

**Important: `getAllPosts()` uses filesystem reads.** This works in Route Handlers on Vercel because they run in the Node.js runtime (not Edge). The blog.ts library reads from `content/posts/` which is bundled into the deployment. The Route Handler has access to the same filesystem the build-time pages use.

### Notify Trigger Usage

After deploying a new post:

```bash
curl -X POST "https://xndr.site/api/notify?secret=$NOTIFY_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-new-post"}'
```

Or without slug (auto-selects latest post):

```bash
curl -X POST "https://xndr.site/api/notify?secret=$NOTIFY_SECRET"
```

## Environment Variables

| Variable             | Purpose                                              | Where Set                    |
| -------------------- | ---------------------------------------------------- | ---------------------------- |
| `RESEND_API_KEY`     | Authenticates with Resend API                        | Vercel Environment Variables |
| `RESEND_AUDIENCE_ID` | Identifies the subscriber audience in Resend         | Vercel Environment Variables |
| `NOTIFY_SECRET`      | Protects the notify endpoint from unauthorized calls | Vercel Environment Variables |

These go in Vercel's dashboard under Project Settings > Environment Variables. They should NOT be in `.env.local` committed to git (add `.env.local` to `.gitignore` -- check if it already is).

## Patterns to Follow

### Pattern 1: Client/Server Boundary for Forms

**What:** Keep page components as Server Components. Extract interactive forms into dedicated `"use client"` components imported by the page.

**When:** Any page that needs form interactivity but is otherwise static.

**Why this site specifically:** The blog page (`app/blog/page.tsx`) currently has zero client-side JS. It is a pure Server Component. Adding a subscribe form should NOT make the entire page a client component. Instead, import `<SubscribeForm />` which has its own `"use client"` directive.

```typescript
// app/blog/page.tsx (remains Server Component)
import SubscribeForm from '@/app/components/subscribe-form';

export default function BlogPage() {
  const posts = getAllPosts();
  // ... render posts ...
  return (
    <div>
      {/* ... existing post timeline ... */}
      <SubscribeForm />
    </div>
  );
}
```

### Pattern 2: Route Handler as Thin Proxy

**What:** Route Handlers should validate input, call the external service, and return a result. No business logic accumulation.

**When:** Building API routes that talk to third-party services.

**Example for this project:** The subscribe route validates email format and calls Resend. It does NOT store emails locally, manage queues, or do template rendering. Resend handles storage and delivery.

### Pattern 3: Secret-Based Endpoint Protection

**What:** Protect internal/admin API endpoints with a shared secret passed as a query parameter or header, rather than building full auth.

**When:** Single-user sites with no auth system where you need an endpoint only the owner should call.

**Why not auth:** The site explicitly has "User authentication" as out of scope. A shared secret in an environment variable is appropriate for a single-author blog's notification trigger. It is NOT appropriate for user-facing endpoints (subscribe does not need it -- it is public).

### Pattern 4: Resend Audiences as Subscriber Store

**What:** Use Resend's built-in Audiences (contact lists) instead of a separate database.

**When:** The only thing you need to store about subscribers is their email address, and the only consumer of that data is the email service itself.

**Why:** Eliminates an entire infrastructure dependency (database). Resend Audiences support: adding contacts, listing contacts, removing contacts, tracking unsubscribes. This covers all subscription management needs.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Making the Blog Page a Client Component

**What:** Adding `"use client"` to `app/blog/page.tsx` just to add a subscribe form.

**Why bad:** Turns the entire blog listing into client-rendered JS. Currently, the blog page is fully server-rendered with zero client JS (except what navbar/particles contribute). Adding `"use client"` would ship all post data as JSON to the client, increase bundle size, and hurt performance.

**Instead:** Extract the form into a separate `"use client"` component. The page stays a Server Component.

### Anti-Pattern 2: Separate Database for Subscribers

**What:** Adding Vercel KV, Supabase, or Neon just to store email addresses.

**Why bad:** Adds infrastructure complexity, requires managing database connections, introduces another free-tier dependency to track, and creates a data synchronization problem (subscriber list in DB vs. email service contacts).

**Instead:** Use Resend Audiences. The email service IS the subscriber store.

### Anti-Pattern 3: Automated New-Post Detection

**What:** Building complex logic to automatically detect new posts on every deployment and send notifications.

**Why bad for this site:** The blog has 3 posts. Posts are authored infrequently. Automated detection requires: tracking which posts were already notified, handling edge cases (draft->published toggles, date changes, slug changes), and risking duplicate/missed notifications. The complexity-to-value ratio is terrible.

**Instead:** Manual trigger (curl command after deploy). Add automation later IF post frequency increases.

### Anti-Pattern 4: Using Edge Runtime for Email Routes

**What:** Adding `export const runtime = 'edge'` to the subscribe or notify route handlers.

**Why bad:** The notify route calls `getAllPosts()` which reads from the filesystem using Node.js `fs` module. The Edge runtime does not support `fs`. Even the subscribe route gains nothing from Edge -- the latency difference for a single `fetch()` to Resend's API is negligible.

**Instead:** Use the default Node.js runtime (which is the default, so just don't set `runtime`).

## Build Order Implications

This is the dependency chain for implementation:

### Phase 1: Resend Setup (prerequisite to everything)

1. Create Resend account
2. Verify domain (`xndr.site`) for sending -- required for non-testing use
3. Create an Audience in Resend dashboard
4. Get API key and Audience ID
5. Add `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NOTIFY_SECRET` to Vercel Environment Variables

**Cannot proceed to any code without this.** The API key and Audience ID are needed for both route handlers.

### Phase 2: Subscribe Flow (build first)

1. Create `app/api/subscribe/route.ts`
2. Create `app/components/subscribe-form.tsx`
3. Integrate `<SubscribeForm />` into `app/blog/page.tsx`
4. Test: form submission stores contact in Resend Audience

**Why build this first:** It is user-facing, simpler, and immediately testable. The notify flow depends on having subscribers to notify.

### Phase 3: Notify Flow (build second)

1. Create `app/api/notify/route.ts`
2. Test with manual curl command
3. Document the trigger process for Xander

**Why build this second:** It depends on Phase 1 (Resend setup) and is more useful after Phase 2 (subscribers exist). It is also admin-only, so lower priority than the user-facing subscribe form.

### Phase 4: Polish

1. Unsubscribe link in notification emails (Resend handles this with `{{{unsubscribe_url}}}` template variable)
2. Email template refinement (HTML styling)
3. Error states in the subscribe form (network errors, duplicate email, rate limits)

## New File Inventory

| File                                | Type             | Purpose                                             |
| ----------------------------------- | ---------------- | --------------------------------------------------- |
| `app/api/subscribe/route.ts`        | Route Handler    | POST endpoint for email subscription                |
| `app/api/notify/route.ts`           | Route Handler    | POST endpoint for triggering new-post notifications |
| `app/components/subscribe-form.tsx` | Client Component | Email input form with submit/feedback states        |

**Modified files:**
| File | Change |
|------|--------|
| `app/blog/page.tsx` | Import and render `<SubscribeForm />` below post timeline |
| `app/blog/[slug]/page.tsx` | (Optional) Add inline subscribe CTA at bottom of post |

**No changes to:**

- `app/lib/blog.ts` -- used as-is by the notify route
- `app/layout.tsx` -- no global providers needed
- `next.config.js` -- no config changes needed
- `package.json` -- no new dependencies (using raw `fetch()` for Resend API)

## Scalability Considerations

| Concern              | Current (< 50 subscribers)      | 100+ subscribers                          | 1000+ subscribers                             |
| -------------------- | ------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Subscriber storage   | Resend Audience (free)          | Resend Audience (still free)              | May need Resend paid tier depending on limits |
| Email sending        | Individual sends or small batch | Resend Batch API                          | Resend Batch API; check rate limits           |
| Notification trigger | Manual curl                     | Manual curl still works                   | Consider GitHub Action automation             |
| Form spam            | None needed                     | Add simple rate limiting in Route Handler | Add Turnstile/reCAPTCHA                       |

For a personal portfolio blog, the < 50 subscribers column is the realistic target. The architecture scales to 100+ without any changes. At 1000+, Resend's free tier (100 emails/day) becomes the bottleneck, not the architecture.

## Confidence Assessment

| Component                                  | Confidence | Basis                                                                                                       |
| ------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------- |
| Next.js Route Handlers patterns            | HIGH       | Verified from official Next.js docs (v16.1.6, fetched 2026-02-23)                                           |
| Subscribe form as client component         | HIGH       | Standard Next.js App Router pattern, verified in docs                                                       |
| Resend API for contacts/audiences          | MEDIUM     | Based on training data; Resend API is stable but free tier limits should be verified at implementation time |
| Manual notify trigger approach             | HIGH       | Architectural reasoning from codebase analysis (3 posts, single author, no auth)                            |
| `getAllPosts()` in Route Handler on Vercel | HIGH       | Node.js runtime supports fs; verified Route Handlers default to Node.js runtime                             |
| No separate database needed                | MEDIUM     | Depends on Resend Audiences feature availability on free tier -- verify during Resend setup                 |

## Sources

- Next.js Route Handlers documentation (official, v16.1.6, confirmed 2026-02-23): https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Existing codebase analysis: `app/lib/blog.ts`, `app/blog/page.tsx`, `package.json` (read directly)
- Resend API patterns: training data (MEDIUM confidence -- verify free tier specifics at https://resend.com/pricing during implementation)

---

_Architecture research: 2026-02-23_
