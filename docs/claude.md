# Hope Trust India — Codebase Reference

## Project Overview

Hope Trust India is a **mental health and addiction recovery** centre based in Hyderabad. This repository is a fully **static Next.js 14** website deployed on **Netlify**. All pages are pre-rendered at build time (`output: 'export'`). There is no Next.js server; all form submissions are proxied through **Netlify Edge Functions** (which enforce rate limiting, honeypot checks, and server-side validation before writing to Supabase), and a fourth Edge Function proxies the WhatsApp CRM token.

**Live domain:** `https://hopetrustindia.com`

---

## Tech Stack

| Concern | Library / Tool |
|---|---|
| Framework | Next.js 14 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS + tailwindcss-animate |
| UI components | Radix UI primitives + shadcn/ui (`components/ui/`) |
| Animations | `motion/react` (Framer Motion v11+) |
| Smooth scroll | Lenis (`lenis` package) |
| Backend / DB | Supabase (PostgreSQL + Storage) |
| Form handling | Zod (client-side) + Netlify Edge Functions (server-side validation + rate limiting) + Supabase REST API |
| Blog content | MDX files → `gray-matter` → `marked` → `sanitize-html` |
| Email | Resend (newsletter test script) |
| Fonts | Bricolage Grotesque (primary), Inter, Roboto Flex, IBM Plex Mono, Ibarra Real Nova |
| Icons | Lucide React |
| Toast notifications | `sonner` |
| Testing | Vitest + @testing-library/react + @testing-library/user-event |
| Performance monitoring | `web-vitals` (production only) |

---

## Repository Structure

```
Hopetrust/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout — providers, global metadata
│   ├── page.tsx                    # Home page (dynamic imports for all sections)
│   ├── globals.css                 # Tailwind directives, CSS variables, fluid typography
│   ├── about/page.tsx              # About Us page
│   ├── addiction/page.tsx          # Addiction services page
│   ├── mental-health/page.tsx      # Mental health services page
│   ├── contact/page.tsx            # Contact page with validated form
│   ├── book-your-session/page.tsx  # Therapist directory + booking
│   ├── join-us/page.tsx            # Careers / job application page
│   ├── blogs/
│   │   ├── page.tsx                # Blog listing (SSG)
│   │   └── [slug]/page.tsx         # Individual blog post (SSG)
│   └── __tests__/
│       ├── contact.test.tsx
│       └── join-us.test.tsx
├── components/                     # All React components (see Components section)
│   ├── ui/                         # 47 shadcn/ui primitives
│   └── __tests__/
│       └── Header.test.tsx
├── hooks/
│   ├── useScrollAnimation.ts       # IntersectionObserver hook + animation helpers
│   └── use-toast.ts                # Toast state manager (Radix-style reducer)
├── lib/
│   ├── blog.ts                     # MDX blog parsing and query utilities
│   ├── doctors.ts                  # Static therapist/doctor data
│   ├── supabase.ts                 # Supabase client singleton
│   ├── assets.ts                   # Supabase Storage URL helpers
│   ├── utils.ts                    # cn() utility (clsx + tailwind-merge)
│   ├── performance.ts              # useDebounce, useThrottle, IntersectionObserver utils
│   └── newsletter-template.ts      # HTML email builder for newsletters
├── netlify/functions/
│   └── whatsapp-crm.mjs            # Netlify Edge Function — proxies CRM requests
├── content/
│   └── blogs/                      # 395 MDX blog posts
├── scripts/
│   ├── generate-sitemap.mjs        # Generates sitemap.xml + robots.txt post-build
│   ├── migrate-wp.mjs              # WordPress → MDX migration (one-time use)
│   └── test-newsletter.mjs         # Sends test newsletter email via Resend
├── public/
│   └── __forms.html                # Netlify Forms detection shim
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Environment Variables

See `.env.example` for the full annotated reference. Set in `.env.local` (development) and Netlify Dashboard → Environment Variables (production).

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, all Edge Functions | Supabase project URL (public — safe by design, RLS enforces access) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts`, all Edge Functions | Supabase anon key (public — safe by design, RLS enforces access) |
| `WHATSAPP_CRM_TOKEN` | `netlify/functions/whatsapp-crm.mjs` | Bearer token for CRM API — **rotate every 90 days** |
| `RESEND_API_KEY` | `scripts/test-newsletter.mjs` | Resend API key — dev/scripts only, never deployed |

---

## Pages Reference

### `/` — Home Page
`app/page.tsx`

Dynamically imports all below-fold sections to reduce initial bundle. Uses `FadeInSection` for scroll-triggered animations. Layout wraps a `<Header />` and a `<main>` containing:
- `HeroSection`
- `BackgroundCirclesSection`
- `WhatWeOfferSection`
- `MeetTheTeamSection`
- `ClientsSayingSection`
- `RectangleSection`
- `ResourcesSection`
- `LargeRectangleSection`
- `ContactSection`
- `HomeFinalCtaSection`

### `/about` — About Us
`app/about/page.tsx` — `'use client'`

- **Typewriter animations** — custom `TypewriterPlain` and `TypewriterSegments` implemented inline using `setInterval`
- `OurTeamSection` — auto-rotating team category display
- Service cards with `motion/react` scroll-triggered animations
- "How it works" 3-step process with animated steps
- `HomeFinalCtaSection` at the bottom
- Uses `getAssetUrl` for all images

### `/mental-health` — Mental Health Services
`app/mental-health/page.tsx` — `'use client'`

- Hero with **background video** and `useScroll` + `useTransform` parallax
- **Tabbed content** for: Therapy, Psychiatry, Couples Therapy, Family Therapy
- Assessment sections: ADHD, Student Mental Health, Queer Affirmative Mental Health
- `AnimatePresence` for smooth tab transitions

### `/addiction` — Addiction Services
`app/addiction/page.tsx` — `'use client'`

- Hero section with background image
- "Why Hope Trust" section with feature cards
- "Areas we support" — addiction types list
- "What treatment involves" — treatment modality cards
- "Road to recovery" — interactive multi-step section with `AnimatePresence`

### `/contact` — Contact
`app/contact/page.tsx` — `'use client'`

- Animated cards for **Email**, **Phone**, **Address** (each uses `motion/react` `whileInView`)
- **Training enquiries** dedicated section
- **Contact form** fields: `full_name`, `phone`, `email`, `message`
  - Validated with `zod` schema
  - Submitted to both Supabase (`contact_submissions` table) and Netlify Forms
  - Animated `CustomSubmitButton` with CSS `@keyframes` (takeOff/land/contrail animations)
- **Embedded map** via `<iframe>` pointing to Google Maps
- `sonner` toasts for success/error feedback

### `/book-your-session` — Book a Session
`app/book-your-session/page.tsx` — `'use client'`

- Search input filters by name and qualification
- Department filter buttons derived from `departments` array in `lib/doctors.ts`
- Results rendered using `TherapistCard` components
- Filtering is client-side only (static data)

### `/join-us` — Careers
`app/join-us/page.tsx` — `'use client'`

- "Why Join" perks cards (Expert Team, Purpose Driven, Growth Culture)
- 3-step process visual (Apply → HR Review → Clinical Interview)
- **Application form** fields: `full_name`, `email`, `position` (select), CV/portfolio file upload, `introduction`
  - Validated with `zod`
  - CV uploaded to Supabase Storage bucket `cv-uploads`
  - Form data inserted into `joinus_applications` Supabase table
  - Also submitted to Netlify Forms via `fetch('/__forms.html')`
  - File constraints: PDF or Word only, max 5 MB
- Same `CustomSubmitButton` animation component as Contact page

### `/blogs` — Blog Listing
`app/blogs/page.tsx` — **Server Component** (SSG)

- Calls `getAllPostsMeta()` and `getAllCategories()` at build time
- Passes data as props to `BlogListClient` (client component)
- No dynamic data; re-build required for new blog posts

### `/blogs/[slug]` — Blog Post
`app/blogs/[slug]/page.tsx` — **Server Component** (SSG)

- `generateStaticParams()` calls `getAllSlugs()` to pre-render all 395 posts
- `generateMetadata()` produces full Open Graph + Twitter Card metadata per post
- `JsonLd` component injects `application/ld+json` BlogPosting schema
- Content pipeline: MDX frontmatter parsed by `gray-matter` → body passed through `marked` (Markdown → HTML) → sanitized by `sanitize-html` (extended allowed tags for `img`, `iframe`, `video`, `figure`)
- Previous/Next navigation via `getAdjacentPosts()`
- Styled via `.blog-content` CSS class in `globals.css`

---

## Components Reference

### Navigation & Layout

#### `Header`
`components/Header.tsx` — `'use client'`

Fixed top navbar. Desktop: left nav items (About, Mental Health, Addiction, Join Us) + logo centre + right nav items (Blogs, Book Your Session, Contact). Mobile: hamburger → slide-in drawer from right with `translate-x` transition. Active link detection via `usePathname()` with normalized trailing-slash comparison. Locks `body.overflow` when drawer is open.

#### `Footer`
`components/Footer.tsx`

Minimal placeholder — orange bar (`bg-orange-500 h-32`). The real site footer content lives inside `HomeFinalCtaSection`.

#### `LenisProvider`
`components/LenisProvider.tsx` — `'use client'`

Wraps the entire app. Initialises Lenis with `duration: 1.1, smoothWheel: true` and drives it via `requestAnimationFrame`. Destroys instance on unmount.

#### `WebVitals`
`components/WebVitals.tsx` — `'use client'`

Lazy-imports `web-vitals` in production only and calls `getCLS`, `getFID`, `getFCP`, `getLCP`, `getTTFB`. Renders `null`. Accepts optional `onMetric` callback.

#### `WhatsAppButton`
`components/WhatsAppButton.tsx` — `'use client'`

Fixed FAB bottom-right. Toggles an animated chat panel. "Book Appointment" calls `POST /api/whatsapp-crm` (served by the Netlify Edge Function). Falls back to `https://wa.me/919000850001` on error. Click-outside detection via `mousedown` event listener. FAB turns orange when panel is open.

---

### Home Sections

#### `HeroSection`
`components/HeroSection.tsx` — `'use client'`

Full-screen section with two layered videos. Outer video is a parallax background (`backgroundY` transforms from `0%` to `20%`). Inner card video sits inside a rounded rectangle with a counter-parallax (`cardY` transforms from `0%` to `-10%`). Side "handle" decorative elements on desktop. CTA button "Chat with us" (no handler attached — UI only).

#### `BackgroundCirclesSection`
`components/BackgroundCirclesSection.tsx` — `'use client'`

Left side: stats (20+ years, 15+ experts) + `VariableProximity` heading + "Find A Therapist" CTA. Right side: `TiltedCard` with `2.jpg` image inside an orange rounded rectangle. Orange radial gradient background effect bottom-left.

#### `WhatWeOfferSection`
`components/WhatWeOfferSection.tsx` — `'use client'`

5-column grid of service icons fetched from Supabase Storage. Each icon has `whileHover={{ y: -8 }}` lift animation. Staggered `animate` entrance based on `useScrollAnimation`.

#### `MeetTheTeamSection`
`components/MeetTheTeamSection.tsx` — `'use client'`

Carousel of 3 visible circular placeholders (no real photos/data yet). Cycles through 5 dummy `teamMembers`. Uses `motion/react` stagger animation on visible circles. Navigation arrows increment/decrement `startIndex`.

#### `ClientsSayingSection`
`components/ClientsSayingSection.tsx` — `'use client'`

Left: typewriter heading "What our clients are saying" triggered once on scroll-into-view. Right: two testimonial cards shown side by side (second card hidden on mobile). Auto-advance not present — manual prev/next arrows cycle through 3 testimonials.

#### `RectangleSection`
`components/RectangleSection.tsx` — `'use client'`

"How your journey unfolds" section. Rounded card with background video (`Sun shine.mp4`). 4 steps shown with `AnimatePresence mode="wait"` transition. Step selection via pill progress indicator at the bottom. Inline portrait video (`FINal.mp4`) on the right.

#### `ResourcesSection`
`components/ResourcesSection.tsx` — `'use client'`

3 resource cards (Articles & Guides, Meditation & Relaxation, Webinars & Workshops) with staggered `motion/react` entrance. Each card has an `InteractiveHoverButton` with a different accent colour. Decorative donut shape behind the heading.

#### `LargeRectangleSection`
`components/LargeRectangleSection.tsx` — `'use client'`

Newsletter CTA card with `VariableProximity` heading. On hover, the entire card background transitions to `#00373E` (deep teal) via a full-cover `div` with `opacity-0 → opacity-100`. `NewsletterForm` switches to dark mode (`dark={isHovered}`) accordingly. Background illustration (`Group 22.png`) from Supabase Storage.

#### `ContactSection`
`components/ContactSection.tsx` — `'use client'`

Home-page contact section (simplified, non-functional form). Shows email, phone, and address with social icons. The full featured form is on `/contact`.

#### `HomeFinalCtaSection`
`components/HomeFinalCtaSection.tsx` — `'use client'`

Acts as the real site footer. Left card: logo + site link columns (About, Services, Therapists, Resources, Contact / Instagram, Facebook, LinkedIn / Terms, Privacy) + inline `NewsletterForm` + copyright. Right card: orange CTA "Find support, guidance, and balance" + "Find Support Now" button + decorative flower illustration.

---

### Utility & Shared Components

#### `FadeInSection`
`components/FadeInSection.tsx` — `'use client'`

Wraps children in a `motion.div`. Uses `useScrollAnimation` to trigger `opacity: 0 → 1, y: 40 → 0` when element enters viewport. `delay` prop accepts milliseconds (converted to seconds for `motion`). `triggerOnce: true` by default.

#### `TherapistCard`
`components/TherapistCard.tsx` — `'use client'`

Displays a doctor's photo (or initials fallback with gradient background), name, qualification, department badge, bio (truncated to 120 chars with expand/collapse), and a "Book Session" link (`<a target="_blank">` to `doctor.bookingUrl`).

#### `BlogListClient`
`components/BlogListClient.tsx` — `'use client'`

Full blog browser UI. State: `search`, `activeCategory`, `page`. Filtering via `useMemo` (category match + title/excerpt/tag text search). Paginated 12 posts per page. Featured post (first post) shown when no filter active. Category tabs with post counts. `NewsletterForm` inline CTA section between featured post and grid. Smooth scroll to grid top on page change.

#### `NewsletterForm`
`components/NewsletterForm.tsx` — `'use client'`

Two variants: `inline` (horizontal 3-field row) and `card` (stacked). Fields: `full_name`, `email`, `phone`. Validates with `zod`. Inserts into `newsletter_subscribers` Supabase table. Handles duplicate email error (code `23505`). Accepts `dark` prop for dark-background mode. Transitions to success state after submission.

#### `OurTeamSection`
`components/OurTeamSection.tsx` — `'use client'`

Auto-rotating category display cycling through: Therapists → Counsellors → Psychologists → Medical Professionals. Interval default 1800ms. Respects `prefers-reduced-motion`. Accepts `renderContent` render prop to display content per active category. Used on the About page.

#### `AuroraBackground`
`components/AuroraBackground.tsx` — `'use client'`

Animated aurora effect using CSS custom properties and `after:animate-aurora` Tailwind class. Warm orange/yellow palette. Accepts `showRadialGradient` prop to add a radial mask. Used inside `BackgroundCirclesSection`.

#### `TiltedCard`
`components/TiltedCard.tsx` — `'use client'`

3D tilt card. Calculates `rotateX`/`rotateY` from mouse position offset relative to card center. Uses `motion/react` `useSpring` for smooth physics-based animation. Supports optional overlay content rendered at `translateZ(30px)`. Optional tooltip `figcaption` follows cursor.

#### `VariableProximity`
`components/VariableProximity.tsx` — `'use client'`

Per-letter mouse-proximity **variable font axis interpolation**. Tracks mouse via `mousemove`/`touchmove` on a container ref. Each letter's `fontVariationSettings` is interpolated between `fromFontVariationSettings` and `toFontVariationSettings` based on distance and falloff type (`linear`, `exponential`, or `gaussian`). Runs on `requestAnimationFrame`, skips frames when mouse hasn't moved. Accessible via `sr-only` full text span.

#### `ProximityText`
`components/ProximityText.tsx` — `'use client'`

Similar to `VariableProximity` but simpler — only applies `translateY` lift (no font variation). Respects `prefers-reduced-motion`. Supports newline preservation (`\n` → `<br />`).

#### `MagicText`
`components/MagicText.tsx` — `'use client'`

Scroll-driven word-by-word opacity reveal. Uses `useScroll` with `offset: ["start 0.9", "start 0.25"]`. Each word's opacity is a `useTransform` of `scrollYProgress` mapped to its proportional range.

#### `InteractiveHoverButton`
`components/InteractiveHoverButton.tsx` — `'use client'`

Rounded button with expanding colour blob on hover. Default label slides out right while a new label + arrow slides in from the left. `accentClass` Tailwind prop controls the blob's background colour.

---

## Library Reference (`lib/`)

### `lib/blog.ts`

Parses all `.mdx` files from `content/blogs/` at build time. Uses `gray-matter` for frontmatter and `reading-time` for estimated read time.

**Types:**
```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  readingTime: string;
  content: string;       // raw Markdown body
}

interface BlogPostMeta {
  // Same as BlogPost but without `content`
}
```

**Exported functions:**
| Function | Returns | Notes |
|---|---|---|
| `getAllPosts()` | `BlogPost[]` | Sorted newest first |
| `getAllPostsMeta()` | `BlogPostMeta[]` | Sorted newest first, no content string |
| `getPostBySlug(slug)` | `BlogPost \| null` | |
| `getAllSlugs()` | `string[]` | Used by `generateStaticParams` |
| `getAllCategories()` | `string[]` | Unique, sorted alphabetically |
| `getAllTags()` | `string[]` | Unique, sorted alphabetically |
| `getAdjacentPosts(slug)` | `{ prev, next }` | Both are `BlogPostMeta \| null` |

### `lib/doctors.ts`

Static data file. Exports:
- `doctors: Doctor[]` — array of therapist objects
- `departments: string[]` — unique department names derived from `doctors`

**`Doctor` type:**
```typescript
type Doctor = {
  name: string;
  qualification: string;
  department: string;
  bio: string;
  photo?: string;       // URL string (optional)
  bookingUrl: string;   // External booking link
};
```

### `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Single exported `supabase` client instance. Used directly in client components.

### `lib/assets.ts`

```typescript
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET = 'assets';

export function getAssetUrl(filename: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

export function getLogoUrl(): string {
  return getAssetUrl('logo1.png');
}
```

All images, videos, and icons are stored in the Supabase `assets` storage bucket. Always use `getAssetUrl()` to reference them — never hardcode URLs.

### `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Standard `cn()` helper for composing conditional Tailwind class strings.

### `lib/performance.ts`

Performance utilities:
- `useDebounce<T>(value, delay)` — debounced state value
- `useThrottle<T>(value, interval)` — throttled state value
- `createOptimizedObserver(callback, options)` — shared `IntersectionObserver` with element-to-callback map
- `preloadImage(src)` — returns a Promise that resolves when an `Image` loads
- `createStyleSheet(css)` — injects a `<style>` tag once by ID
- `measurePerformance(name, fn)` — wraps a function call with `performance.mark`
- `createVirtualizedList(items, visibleCount, buffer)` — returns a slice of items for virtualized rendering

### `lib/newsletter-template.ts`

Exports `buildNewsletterHtml(data: NewsletterData): string` which constructs a full HTML email. Used in conjunction with Resend for bulk newsletter sends.

```typescript
interface BlogPostLink {
  title: string;
  excerpt: string;
  url: string;
  featuredImage?: string;
}

interface NewsletterData {
  customMessage: string;   // HTML string inserted into the body
  posts: BlogPostLink[];
}
```

---

## Hooks Reference (`hooks/`)

### `useScrollAnimation`
`hooks/useScrollAnimation.ts`

```typescript
const { elementRef, isVisible } = useScrollAnimation({
  threshold?: number,    // default 0.1
  rootMargin?: string,   // default '0px 0px -50px 0px'
  triggerOnce?: boolean, // default true
});
```

Returns a `ref` to attach to a DOM element and `isVisible` boolean. When `triggerOnce` is true (default), the observer disconnects after first trigger for performance. Uses `requestAnimationFrame` for state updates to avoid layout thrashing.

**Also exports animation helper functions** that return inline style objects:
```typescript
fadeInUp(isVisible, delay?)   // translateY(50px) → 0
fadeInLeft(isVisible, delay?) // translateX(-50px) → 0
fadeInRight(isVisible, delay?)// translateX(50px) → 0
scaleIn(isVisible, delay?)    // scale(0.8) → 1
fadeIn(isVisible, delay?)     // opacity only
```
All use `translate3d` for GPU acceleration and `willChange: 'transform, opacity'`.

### `use-toast`
`hooks/use-toast.ts`

Internal toast state manager modelled after the shadcn/ui pattern. Manages a global `toasts` array via a reducer (`ADD_TOAST`, `UPDATE_TOAST`, `DISMISS_TOAST`, `REMOVE_TOAST`). Limit of 1 concurrent toast. Used alongside `components/ui/toast` and `components/ui/toaster`. **Note:** the primary toast system in use throughout the app is `sonner` (via `toast` from `'sonner'`), not this hook.

---

## Netlify Edge Functions

All Edge Functions live in `netlify/functions/`. They run on Deno (Netlify Edge runtime) and share the same CORS and env var patterns. Use `process.env` (Netlify polyfills this) to read environment variables.

### `netlify/functions/whatsapp-crm.mjs`

Served at `POST /api/whatsapp-crm` via `export const config = { path: "/api/whatsapp-crm" }`.

**Purpose:** Proxies to external CRM so `WHATSAPP_CRM_TOKEN` is never exposed to the browser.

**Flow:** Validates token present → forwards POST with Bearer auth → returns CRM JSON → 502 on error.

**Called by:** `WhatsAppButton.tsx` → "Book Appointment" click.

---

### `netlify/functions/submit-contact.mjs`

Served at `POST /api/submit-contact`. Defined in `netlify.toml` with `rate_limit = { window_size = 60, max_requests = 5 }`.

**Flow:**
1. CORS origin check
2. Honeypot field check (`bot_field`) — silently returns 200 without writing
3. Server-side field validation (name ≥ 2 chars, phone digits ≥ 10, valid email, message ≥ 10 chars)
4. `POST` to Supabase REST API (`/rest/v1/contact_submissions`) using anon key — RLS INSERT policy applies
5. Returns `{ ok: true }` or `{ error: "..." }` with appropriate HTTP status

**Called by:** `app/contact/page.tsx` → `handleSubmit`.

---

### `netlify/functions/submit-newsletter.mjs`

Served at `POST /api/submit-newsletter`. Rate limit: `{ window_size = 60, max_requests = 3 }`.

**Flow:** Same as submit-contact. Handles `409` (unique constraint on email) and returns `{ error: "duplicate" }` with HTTP 409 — the client shows "You're already subscribed!".

**Called by:** `components/NewsletterForm.tsx` → `handleSubmit`.

---

### `netlify/functions/submit-joinus.mjs`

Served at `POST /api/submit-joinus`. Rate limit: `{ window_size = 3600, max_requests = 3 }` (3 applications per hour per IP).

**Additional validation:** `position` must be one of the whitelisted values; `cv_link` must start with `https://` and must begin with the project's `SUPABASE_URL` (prevents submitting arbitrary external URLs as CV links).

**Note:** CV file upload to Supabase Storage still happens **in the browser** (before this function is called). The function only receives the resulting public URL as `cv_link`.

**Called by:** `app/join-us/page.tsx` → `handleSubmit`.

---

## Supabase Schema (Inferred)

| Table | Columns | Source |
|---|---|---|
| `contact_submissions` | `full_name`, `phone`, `email`, `message` | `/contact` form |
| `newsletter_subscribers` | `full_name`, `email`, `phone` (unique on email) | `NewsletterForm` |
| `joinus_applications` | `full_name`, `email`, `position`, `cv_link`, `introduction` | `/join-us` form |

**RLS Policies** (defined in `supabase/migrations/001_rls_policies.sql`):
| Table | anon | service_role |
|---|---|---|
| `contact_submissions` | INSERT only | ALL |
| `newsletter_subscribers` | INSERT only | ALL |
| `joinus_applications` | INSERT only | ALL |

**Storage Buckets:**
| Bucket | anon | service_role | Notes |
|---|---|---|---|
| `assets` | SELECT only | ALL | Public CDN — read-only for everyone |
| `cv-uploads` | INSERT + SELECT | ALL | Upload restricted to `.pdf/.doc/.docx` by storage policy |

CV files are uploaded with a `timestamp_filename` path pattern. The public URL is passed to the `submit-joinus` Edge Function as `cv_link`, which validates it starts with the project's Supabase URL.

---

## Netlify Forms

Two forms are registered for Netlify's form detection system via `public/__forms.html`. This file is a static HTML page with hidden forms that Netlify's build bot scans:

- `contact` — fields: `bot-field` (honeypot), `full_name`, `phone`, `email`, `message`
- `joinus` — fields: `bot-field` (honeypot), `full_name`, `email`, `position`, `cv_link`, `introduction`

Each page still renders a hidden `<form data-netlify="true">` in JSX for Netlify's build-time detection. However, **runtime form submissions no longer go through Netlify Forms** — they are handled exclusively by the Edge Functions which write directly to Supabase. The `public/__forms.html` shim exists purely for the build-time scan.

---

## Security Architecture

### Form Submission Flow (post-security hardening)

```
User submits form
  └─▶ Client: Zod validates fields (UX only)
  └─▶ Client: [join-us only] Magic bytes check on uploaded file
  └─▶ Browser uploads CV to Supabase Storage (join-us only)
  └─▶ fetch POST /api/submit-{contact|newsletter|joinus}
          └─▶ Netlify Edge Function
                ├─ CORS origin check
                ├─ Honeypot field check (bot_field)
                ├─ Rate limiting (netlify.toml — requires Pro plan)
                ├─ Server-side field validation
                ├─ [joinus] cv_link domain validation
                └─▶ Supabase REST API (anon key + RLS INSERT policy)
```

### Security Headers (`netlify.toml`)

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | camera/mic/geo/payment/interest-cohort all `()` | Disable unused APIs |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforce HTTPS |
| `Content-Security-Policy` | (see below) | Restrict resource origins |

**CSP directives:**
- `script-src 'self' 'unsafe-inline'` — Next.js static bundles + hydration inline scripts
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- `img-src 'self' data: blob: https://*.supabase.co`
- `media-src 'self' https://*.supabase.co blob:`
- `connect-src 'self' https://*.supabase.co https://prodcron.askadmissionsone.in`
- `frame-src https://www.google.com https://maps.google.com` — Google Maps embed
- `object-src 'none'` — blocks plugins
- `base-uri 'self'` — prevents base-tag injection

### File Upload Security (`app/join-us/page.tsx`)

Three-layer validation before a CV reaches Supabase Storage:
1. **MIME type check** — `ALLOWED_FILE_TYPES` array (browser-reported MIME)
2. **Size check** — max 5 MB
3. **Magic bytes check** — reads first 8 bytes of the file and verifies against known signatures:
   - PDF: `0x25 0x50 0x44 0x46` (`%PDF`)
   - DOCX: `0x50 0x4B 0x03 0x04` (ZIP/PK header)
   - DOC: `0xD0 0xCF 0x11 0xE0` (OLE2 compound document)

This prevents renamed executables from being uploaded regardless of file extension.

### Supabase RLS Migration

File: `supabase/migrations/001_rls_policies.sql`

Run this SQL in **Supabase Dashboard → SQL Editor** before going to production. The file is idempotent (`DROP POLICY IF EXISTS` before each `CREATE POLICY`).

### Token Rotation (WHATSAPP_CRM_TOKEN)

See `.env.example` for the full rotation procedure. Summary:
1. Generate new token in CRM dashboard
2. Update in Netlify Dashboard → Environment Variables
3. Trigger redeploy
4. Revoke old token in CRM dashboard
5. Update rotation date in secrets log

Rotate every **90 days** or immediately on suspected compromise.

---

## Build & Scripts

### NPM Scripts

```bash
npm run dev         # Next.js dev server (localhost:3000)
npm run build       # next build (outputs to /out directory)
npm run start       # next start (not used in production — static export)
npm run lint        # ESLint
npm run test        # vitest run
```

### Post-Build: Sitemap Generation

```bash
node scripts/generate-sitemap.mjs
```

Reads all `.mdx` slugs from `content/blogs/` and writes `sitemap.xml` + `robots.txt` to the `/out` directory (or `/public` if `/out` doesn't exist). Site URL hardcoded as `https://hopetrustindia.com`.

Static pages included: `/`, `/about/`, `/mental-health/`, `/addiction/`, `/join-us/`, `/blogs/`, `/book-your-session/`, `/contact/`.

### WordPress Migration

```bash
node scripts/migrate-wp.mjs
```

One-time script. Fetches all posts from `https://hopetrustindia.com/wp-json/wp/v2` (paginated at 100/page), converts HTML content to Markdown using `TurndownService`, and saves each post as an `.mdx` file under `content/blogs/` with correct frontmatter. Not needed for ongoing development.

### Newsletter Test

```bash
# Set env var first
set RESEND_API_KEY=re_your_key_here

node scripts/test-newsletter.mjs your@email.com
```

Sends a single test HTML email to the specified address using Resend. Uses the same HTML template structure as `lib/newsletter-template.ts`.

---

## Styling System

### Tailwind Configuration (`tailwind.config.ts`)

- `darkMode: ['class']` — dark mode toggled via `.dark` class on `<html>`
- **Custom keyframes:** `aurora`, `cursor-blink`, `accordion-down`, `accordion-up`, `fade-in`, `slide-in`
- **Plugin:** `tailwindcss-animate`
- **Disabled:** `container` core plugin (unused, reduces bundle)
- **JIT mode** enabled

### Global CSS (`app/globals.css`)

CSS custom properties follow the shadcn/ui pattern (`--background`, `--foreground`, `--primary`, etc.) defined on `:root` and `.dark`.

**Fluid typography** via `clamp()`:
```css
h1: clamp(32px, 6vw, 56px)
h2: clamp(26px, 4.5vw, 42px)
h3: clamp(22px, 3.5vw, 32px)
body: clamp(14px, 2vw, 18px)
```

Utility classes: `.fade-in-optimized`, `.fluid-heading-hero`, `.fluid-heading-xl`, `.fluid-body-xl`, `.fluid-body-lg`

**`.blog-content` styles** — comprehensive article typography for blog post rendering, covering `h1`–`h4`, `p`, `a`, `ul`, `ol`, `li`, `blockquote`, `img`, `hr`, `strong`, `table`, `pre`, `code`, `iframe`.

`prefers-reduced-motion` media query disables all animations globally.

### Brand Colours

| Usage | Hex |
|---|---|
| Primary (dark teal) | `#00373E` |
| Accent (orange) | `#F97316` / `#ED7428` / `#ED742B` |
| Background warm | `#F7F5EF` |
| Background peach | `#F9E6D0` / `#FEF2EB` |
| Text secondary | `#486364` |
| Text muted | `#6A8181` |

---

## Testing

Tests use **Vitest** with **jsdom** environment and **@testing-library/react**.

### Standard Mocks (applied in every test file)

```typescript
vi.mock('next/navigation', () => ({ usePathname: () => '/path' }));
vi.mock('next/image', () => ({ default: (props) => <img {...props} /> }));
vi.mock('next/link', () => ({ default: ({ children, href, ...p }) => <a href={href} {...p}>{children}</a> }));
vi.mock('next/font/google', () => ({ Bricolage_Grotesque: () => ({ className: 'mock-font' }) }));
vi.mock('next/dynamic', () => ({ default: () => () => <div data-testid="dynamic-component" /> }));
vi.mock('@/lib/assets', () => ({ getAssetUrl: (p) => `/mock/${p}` }));
vi.mock('@/lib/supabase', () => ({ supabase: { from: () => ({ insert: mockInsert }) } }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() }, Toaster: () => null }));
```

### Test Files

| File | Covers |
|---|---|
| `components/__tests__/Header.test.tsx` | Logo rendering, nav links, mobile toggle, link count |
| `app/__tests__/contact.test.tsx` | Form rendering, Zod validation errors, successful Supabase insert, DB error handling |
| `app/__tests__/join-us.test.tsx` | Form rendering, perks section, position select options, validation, successful submission, error handling |

Run tests:
```bash
npm run test
# or watch mode:
npx vitest
```

---

## Known Issues & Incomplete Areas

- **`MeetTheTeamSection`** — Uses 5 dummy placeholder `teamMembers` with no photos or real data. The circular cards render empty.
- **`Footer`** — Is a near-empty orange bar placeholder. The real footer content is in `HomeFinalCtaSection`.
- **`HomeFinalCtaSection` links** — The link columns (About, Services, Therapists, etc.) and social media links (Instagram, Facebook, LinkedIn) are plain `<p>` tags with no `href`.
- **`HeroSection` CTA** — "Chat with us" button has no `onClick` handler.
- **`JourneySection`** / **`ConnectShareSection`** / **`WhySection`** / **`TrustSection`** — Appear to be older design iterations. `TrustSection` still has a `<div className="bg-gray-200">` placeholder image area.
- **`ServicesSection`** — "Our Services" button has no navigation handler.
- **`ResourcesSection`** — "Explore" buttons have no navigation handlers.
- **`ContactSection` (home page)** — The form `onSubmit` is not wired up; it's a UI-only prototype.
- **`/api/whatsapp-crm`** — Only works on Netlify (Edge Function). Will 404 during local `next dev`. Test with `netlify dev` locally.
- **`join-us.test.tsx` mismatch** — The test expects a `cv_link` text input (`placeholder="https://linkedin.com/in/..."`) but the actual page has a file upload input. The test reflects an older version of the form and will fail against the current implementation.
