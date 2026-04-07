# Hope Trust India — Complete Project Documentation

## Project Overview

**Hope Trust India** (`hopetrustindia.com`) is a mental health and addiction recovery clinic website based in Banjara Hills, Hyderabad, India. Founded in 2002, the organization offers therapy, psychiatry, couples/family therapy, addiction recovery, and wellness coaching services.

This is a **statically exported Next.js 15 application** hosted on **Netlify**, with **Supabase** as the backend (PostgreSQL database + file storage) and **Resend** for transactional emails.

---

## Tech Stack

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| **Framework**    | Next.js 15 (App Router) — `output: 'export'` (fully static site generation) |
| **Language**     | TypeScript 5.2                                                             |
| **Styling**      | TailwindCSS 3.3 + shadcn/ui (47 Radix-based UI primitives) + tailwindcss-animate |
| **Animation**    | Framer Motion (via `motion` package v11), Lenis smooth scroll, Three.js / OGL for 3D effects |
| **Database**     | Supabase (PostgreSQL) — anonymous client via `@supabase/supabase-js` v2   |
| **Email**        | Resend API v6 (for bulk newsletter sending)                                |
| **Validation**   | Zod v3 + react-hook-form v7                                               |
| **Blog/CMS**     | ~395 MDX files in `content/blogs/` (migrated from WordPress), parsed with `gray-matter` + `marked` |
| **Hosting**      | Netlify (static export + Netlify Functions + Netlify Forms)                |
| **Testing**      | Vitest 4 + @testing-library/react + jsdom                                 |
| **Icons**        | Lucide React                                                               |
| **Notifications**| Sonner (toast notifications)                                               |

---

## Directory Structure

```
Hopetrust/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Inter font, Lenis, Toaster, WhatsApp button)
│   ├── page.tsx                # Homepage (10 code-split sections)
│   ├── about/page.tsx          # About page (story, team, typewriter, wellness)
│   ├── addiction/page.tsx      # Addiction recovery (5-step road)
│   ├── blogs/
│   │   ├── page.tsx            # Blog listing (server component)
│   │   └── [slug]/page.tsx     # Blog detail (SSG, markdown, JSON-LD)
│   ├── book-your-session/page.tsx  # Doctor directory (Supabase-powered)
│   ├── contact/page.tsx        # Contact form (Zod + Supabase + Netlify Forms)
│   ├── join-us/page.tsx        # Job application form (CV upload)
│   ├── mental-health/page.tsx  # Mental health services (tabs UI)
│   ├── globals.css             # Global styles
│   └── __tests__/              # App-level tests
│
├── components/                 # React components
│   ├── ui/                     # 47 shadcn/ui components (Button, Dialog, Tabs, etc.)
│   ├── Header.tsx              # Site header / navigation
│   ├── Footer.tsx              # Site footer
│   ├── HeroSection.tsx         # Homepage hero
│   ├── BlogListClient.tsx      # Blog listing with filtering/pagination (~16KB)
│   ├── TherapistCard.tsx       # Doctor/therapist card component
│   ├── NewsletterForm.tsx      # Newsletter signup (inline + card variants)
│   ├── WhatsAppButton.tsx      # Floating WhatsApp button
│   ├── ContactSection.tsx      # Homepage contact section
│   ├── FadeInSection.tsx       # Scroll-triggered fade-in wrapper
│   ├── AuroraBackground.tsx    # Animated aurora background effect
│   ├── ProximityText.tsx       # Mouse-proximity text effect
│   ├── VariableProximity.tsx   # Variable font proximity animation
│   ├── TiltedCard.tsx          # 3D tilt card effect
│   ├── MagicText.tsx           # Animated text component
│   ├── ReviewsSection.tsx      # Client testimonials carousel
│   ├── ServicesSection.tsx     # Services overview
│   ├── OurTeamSection.tsx      # Team members section
│   ├── MeetTheTeamSection.tsx  # Homepage team preview
│   ├── WebVitals.tsx           # Web Vitals performance reporter
│   ├── LenisProvider.tsx       # Lenis smooth scroll provider
│   └── __tests__/              # Component tests
│
├── lib/                        # Shared utilities and services
│   ├── supabase.ts             # Supabase client singleton (anon key)
│   ├── doctors.ts              # fetchDoctors(), fetchDepartments()
│   ├── blog.ts                 # Blog MDX reading (getAllPosts, getPostBySlug, etc.)
│   ├── config.ts               # Site config (name, contact info, maps URL)
│   ├── assets.ts               # getAssetUrl() — Supabase storage URL builder
│   ├── newsletter-template.ts  # HTML email template builder
│   ├── performance.ts          # useDebounce, useThrottle, IntersectionObserver utils
│   ├── utils.ts                # cn() — Tailwind class merger
│   ├── assets.test.ts          # Asset utility tests
│   └── utils.test.ts           # Utils tests
│
├── hooks/                      # Custom React hooks
│   ├── useScrollAnimation.ts   # IntersectionObserver scroll animations
│   └── use-toast.ts            # Shadcn toast hook
│
├── content/
│   └── blogs/                  # ~395 MDX blog posts (migrated from WordPress)
│
├── Database/                   # SQL migration scripts
│   ├── supabase-setup.sql      # Initial tables (contact, joinus, newsletter, storage)
│   ├── doctors-table.sql       # Doctors table + seed data (12 doctors)
│   └── rls-policies.sql        # Row Level Security policies
│
├── netlify/
│   └── functions/
│       └── whatsapp-crm.mjs    # Netlify Function: WhatsApp CRM proxy
│
├── supabase/
│   └── functions/
│       └── send-newsletter/
│           └── index.ts        # Supabase Edge Function: bulk newsletter email
│
├── scripts/
│   ├── generate-sitemap.mjs    # Post-build sitemap.xml + robots.txt
│   ├── migrate-wp.mjs          # WordPress → MDX migration tool
│   └── test-newsletter.mjs     # Newsletter send test script
│
├── public/                     # Static public assets
├── netlify.toml                # Netlify config (build, redirects, headers, caching)
├── next.config.js              # Next.js config (static export, image optimization)
├── tailwind.config.ts          # Tailwind theme config
├── tsconfig.json               # TypeScript config
├── vitest.config.ts            # Vitest test config
├── vitest.setup.ts             # Vitest setup (testing-library matchers)
├── package.json                # Dependencies and scripts
└── .env                        # Environment variables (gitignored)
```

---

## Database Schema (Supabase PostgreSQL)

### Table: `contact_submissions`

Stores contact form submissions from the `/contact` page.

| Column       | Type         | Constraints                    |
| ------------ | ------------ | ------------------------------ |
| `id`         | uuid (PK)    | `DEFAULT gen_random_uuid()`    |
| `full_name`  | text         | NOT NULL, 2–200 chars          |
| `phone`      | text         | NOT NULL, 7–20 chars           |
| `email`      | text         | NOT NULL, regex validated       |
| `message`    | text         | NOT NULL, 5–5000 chars         |
| `created_at` | timestamptz  | `DEFAULT now()`                |

**RLS Policies:**
- `anon` role: INSERT only (with field length + format validation in policy `WITH CHECK`)
- `anon` role: SELECT, UPDATE, DELETE explicitly denied
- Data is only accessible via Supabase Dashboard or service_role key

### Table: `joinus_applications`

Stores job applications from the `/join-us` page.

| Column         | Type         | Constraints                    |
| -------------- | ------------ | ------------------------------ |
| `id`           | uuid (PK)    | `DEFAULT gen_random_uuid()`    |
| `full_name`    | text         | NOT NULL, 2–200 chars          |
| `email`        | text         | NOT NULL, regex validated       |
| `position`     | text         | NOT NULL, 2–200 chars          |
| `cv_link`      | text         | NOT NULL, must be `https?://`  |
| `introduction` | text         | NOT NULL, 10–5000 chars        |
| `created_at`   | timestamptz  | `DEFAULT now()`                |

**RLS Policies:**
- `anon` role: INSERT only (with validation)
- `anon` role: SELECT, UPDATE, DELETE explicitly denied

### Table: `newsletter_subscribers`

Stores newsletter signups from `NewsletterForm` component (used across multiple pages).

| Column          | Type         | Constraints                    |
| --------------- | ------------ | ------------------------------ |
| `id`            | uuid (PK)    | `DEFAULT gen_random_uuid()`    |
| `full_name`     | text         | NOT NULL, 2–200 chars          |
| `email`         | text         | NOT NULL, **UNIQUE**, regex validated |
| `phone`         | text         | NOT NULL, 7–20 chars           |
| `subscribed_at` | timestamptz  | `DEFAULT now()`                |
| `is_active`     | boolean      | `DEFAULT true`                 |

**RLS Policies:**
- `anon` role: INSERT only (with validation)
- `anon` role: SELECT, UPDATE, DELETE explicitly denied
- Duplicate email insert returns error code `23505`

### Table: `doctors`

Stores the therapist/doctor directory displayed on `/book-your-session`.

| Column          | Type         | Constraints                         |
| --------------- | ------------ | ----------------------------------- |
| `id`            | uuid (PK)    | `DEFAULT gen_random_uuid()`         |
| `name`          | text         | NOT NULL                            |
| `qualification` | text         | NOT NULL                            |
| `department`    | text         | NOT NULL (Psychology/Psychiatry/Social Work) |
| `bio`           | text         | NOT NULL, DEFAULT ''                |
| `booking_url`   | text         | NOT NULL, DEFAULT '' (MeetMyDoctor links) |
| `photo`         | text         | nullable                            |
| `is_active`     | boolean      | NOT NULL, DEFAULT true              |
| `display_order` | integer      | NOT NULL, DEFAULT 0                 |
| `created_at`    | timestamptz  | NOT NULL, DEFAULT now()             |
| `updated_at`    | timestamptz  | NOT NULL, DEFAULT now() (auto-updated via trigger) |

**Trigger:** `doctors_updated_at` — auto-sets `updated_at = now()` on row update.
**Index:** `idx_doctors_active_order` on `(is_active, display_order)`.

**RLS Policies:**
- `anon` role: SELECT only where `is_active = true` (public doctor directory)
- `anon` role: INSERT, UPDATE, DELETE explicitly denied
- `service_role`: Full access (for dashboard management)

**Seed Data:** 12 doctors pre-loaded (Mrs. Rajeshwari Luther, Dr. Vidhya Sagar, Ms. Muskan Gupta, Ms. Akansha Kabra, Ms. Sneha Sesha, Ms. Arani Shankar, Dr. Nishanth Vemana, Dr. K. Aparna, Dr. Justina Wilma Fernandes, Ms. Purvi Chottai, Ms. Apeksha, Ms. Shruti Sharma).

### Storage Buckets

| Bucket              | Access  | Purpose                                      |
| ------------------- | ------- | -------------------------------------------- |
| `cv-uploads`        | Public  | Job applicant CV/portfolio files (PDF, DOCX) |
| `hopetrust assets`  | Public  | Static assets (logo, images, GIFs, illustrations) |

---

## API & Serverless Functions

### 1. Netlify Function: `whatsapp-crm`

- **File:** `netlify/functions/whatsapp-crm.mjs`
- **Endpoint:** `POST /api/whatsapp-crm`
- **Purpose:** Server-side proxy to an external WhatsApp CRM API. Keeps the CRM token secret from the browser.
- **Auth:** Bearer token from `WHATSAPP_CRM_TOKEN` env var
- **CORS:** Restricted to `hopetrustindia.com`, `www.hopetrustindia.com`, `localhost:3000`
- **Flow:**
  1. Client sends POST to `/api/whatsapp-crm`
  2. Function forwards request to `CRM_ENDPOINT` with Bearer auth
  3. Returns CRM response to client
- **Error Handling:** Returns 405 for non-POST, 500 if CRM not configured, 502 if CRM request fails

### 2. Supabase Edge Function: `send-newsletter`

- **File:** `supabase/functions/send-newsletter/index.ts`
- **Runtime:** Deno (Supabase Edge Functions)
- **Purpose:** Send branded HTML newsletter emails to all active subscribers
- **Auth:** Uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS to read subscribers)
- **Email Provider:** Resend API
- **Flow:**
  1. Receives JSON body with `customMessage` and optional `recentPosts[]`
  2. Queries `newsletter_subscribers` where `is_active = true`
  3. Builds branded HTML email (Hope Trust header, custom message, blog post cards, CTA, footer)
  4. Sends emails in **batches of 50** with **1-second delay** between batches
  5. Returns `{ sent, failed, errors }` summary
- **Required Env:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NEWSLETTER_FROM_EMAIL`

### 3. Client-Side Supabase Calls (No Server API)

Forms submit **directly from the browser** to Supabase using the anon key:

| Form            | Table                    | Additional                          |
| --------------- | ------------------------ | ----------------------------------- |
| Contact form    | `contact_submissions`    | Also POSTs to Netlify Forms backup  |
| Join Us form    | `joinus_applications`    | Uploads CV to `cv-uploads` bucket first |
| Newsletter form | `newsletter_subscribers` | Handles duplicate email (code 23505) |

---

## Page Routes & Rendering Strategy

| Route                | Component                    | Rendering   | Data Source               |
| -------------------- | ---------------------------- | ----------- | ------------------------- |
| `/`                  | `app/page.tsx`               | Static SSG  | None (hardcoded content)  |
| `/about`             | `app/about/page.tsx`         | Client CSR  | None (hardcoded + assets) |
| `/mental-health`     | `app/mental-health/page.tsx` | Client CSR  | None (hardcoded content)  |
| `/addiction`          | `app/addiction/page.tsx`     | Client CSR  | None (hardcoded content)  |
| `/blogs`             | `app/blogs/page.tsx`         | Static SSG  | MDX files (filesystem)    |
| `/blogs/[slug]`      | `app/blogs/[slug]/page.tsx`  | Static SSG  | MDX file by slug          |
| `/book-your-session` | `app/book-your-session/page.tsx` | Client CSR | Supabase `doctors` table |
| `/contact`           | `app/contact/page.tsx`       | Client CSR  | Supabase (form submit)    |
| `/join-us`           | `app/join-us/page.tsx`       | Client CSR  | Supabase (form + upload)  |

**Note:** Since `output: 'export'` is set, ALL pages are pre-rendered at build time. Client-side pages use `'use client'` for interactivity but are still served as static HTML.

---

## Blog System

### Architecture
- **~395 MDX files** stored in `content/blogs/`
- Migrated from WordPress using `scripts/migrate-wp.mjs`
- Each `.mdx` file has YAML frontmatter:

```yaml
---
title: "Post Title"
date: "2024-01-15"
excerpt: "Brief description"
categories: ["Mental Health", "Wellness"]
tags: ["anxiety", "therapy"]
featuredImage: "https://..."
author: "Hope Trust"
slug: "post-slug"
wpLink: "https://original-wordpress-url"
---

Markdown content here...
```

### Reading Pipeline
1. `lib/blog.ts` reads MDX files from filesystem using `fs.readFileSync`
2. Parses frontmatter with `gray-matter`
3. Calculates reading time with `reading-time`
4. Blog listing page (`/blogs`) uses `getAllPostsMeta()` — returns metadata only (no content)
5. Blog detail page (`/blogs/[slug]`) uses `getPostBySlug()` — returns full content
6. Content rendered: `marked.parse()` → `sanitize-html` (XSS protection) → `dangerouslySetInnerHTML`

### SEO Features
- `generateStaticParams()` pre-renders all blog slugs at build time
- `generateMetadata()` sets per-page title, description, OpenGraph
- `JsonLd` component outputs `BlogPosting` schema.org structured data
- Previous/Next post navigation with `getAdjacentPosts()`

---

## Key Library Modules

### `lib/supabase.ts`
Singleton Supabase client using public anon key. Used by all client-side form submissions and the doctors directory.

### `lib/doctors.ts`
- **`fetchDoctors()`** — Queries active doctors ordered by `display_order`, maps snake_case DB columns to camelCase TypeScript types
- **`fetchDepartments()`** — Returns unique department names from active doctors

### `lib/blog.ts`
- **`getAllPosts()`** — Reads all `.mdx` files, sorts by date descending
- **`getAllPostsMeta()`** — Same but strips content (lighter for listing pages)
- **`getPostBySlug(slug)`** — Reads single MDX file by slug
- **`getAllSlugs()`** — Returns all blog slugs (for `generateStaticParams`)
- **`getAllCategories()`** / **`getAllTags()`** — Aggregates unique categories/tags
- **`getAdjacentPosts(slug)`** — Returns prev/next posts for navigation

### `lib/config.ts`
Centralized site configuration:
- Site name and URL
- Contact emails (frontoffice, training)
- Phone numbers (main, secondary, training)
- WhatsApp URL
- Physical address (with Google Maps directions URL)
- Google Maps embed URL

### `lib/assets.ts`
- **`getAssetUrl(path)`** — Builds Supabase storage public URL for the `hopetrust assets` bucket
- **`getLogoUrl()`** — Returns logo URL (used in layout favicon)

### `lib/newsletter-template.ts`
Builds a complete branded HTML email template with:
- Hope Trust branded header (dark teal + orange accent)
- Custom message body
- Blog post cards with featured images
- "Need Support?" CTA section
- Footer with contact info + unsubscribe link

### `lib/performance.ts`
- **`useDebounce(callback, delay)`** — Debounce hook for expensive operations
- **`useThrottle(callback, delay)`** — Throttle hook for scroll/animation events
- **`createOptimizedObserver()`** — IntersectionObserver factory with defaults
- **`preloadImage(src)`** — Promise-based image preloading
- **`createVirtualizedList()`** — Virtual scrolling calculator for large lists
- **`measurePerformance(name, fn)`** — Simple performance timing logger

---

## Custom Hooks

### `useScrollAnimation`
IntersectionObserver-based hook that returns `{ elementRef, isVisible }`. Features:
- Configurable `threshold`, `rootMargin`, `triggerOnce`
- Uses `requestAnimationFrame` for smooth updates
- Auto-disconnects observer after first trigger (when `triggerOnce`)
- Exports animation presets: `fadeInUp`, `fadeInLeft`, `fadeInRight`, `scaleIn`, `fadeIn` — all GPU-accelerated with `translate3d` and `willChange`

---

## Environment Variables

| Variable                            | Scope      | Used By                        |
| ----------------------------------- | ---------- | ------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`          | Client     | Supabase client + asset URLs   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Client     | Supabase client (public key)   |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`       | Client     | WhatsApp floating button       |
| `NEXT_PUBLIC_SITE_URL`              | Client     | Sitemap, newsletter, OG tags   |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Client     | Contact page map iframe        |
| `CRM_ENDPOINT`                      | Server     | Netlify whatsapp-crm function  |
| `WHATSAPP_CRM_TOKEN`               | Server     | Netlify whatsapp-crm auth      |
| `RESEND_API_KEY`                    | Server     | Supabase newsletter function   |
| `NEWSLETTER_FROM_EMAIL`            | Server     | Newsletter "from" address      |
| `SUPABASE_SERVICE_ROLE_KEY`        | Server     | Newsletter function (bypass RLS) |

---

## Build & Deployment

### Build Process
```bash
npm run build    # next build && node scripts/generate-sitemap.mjs
```
1. Next.js static export generates all pages into `out/`
2. `generate-sitemap.mjs` creates `sitemap.xml` (static pages + all blog slugs) and `robots.txt`

### Netlify Configuration (`netlify.toml`)
- **Build command:** `npm run build`
- **Publish directory:** `out`
- **Node version:** 18
- **Redirects:**
  - `/blog/:slug` → `/blogs/:slug/` (301) — WordPress legacy URLs
  - `/blog/` → `/blogs/` (301)
  - `/*` → `/index.html` (200) — SPA fallback
- **Security Headers:** CSP, HSTS (2-year, preload), X-Frame-Options DENY, X-XSS-Protection, X-Content-Type-Options nosniff, strict Referrer-Policy, Permissions-Policy (camera/mic/geo/payment denied)
- **Caching:** Immutable for `/_next/static/*`, JS, CSS, fonts; 1-year for images, videos

### NPM Scripts
| Script           | Command                               |
| ---------------- | ------------------------------------- |
| `dev`            | `next dev`                            |
| `dev:netlify`    | `netlify dev` (with functions)        |
| `build`          | `next build && node scripts/generate-sitemap.mjs` |
| `start`          | `next start`                          |
| `lint`           | `next lint`                           |
| `test`           | `vitest`                              |
| `test:run`       | `vitest run`                          |
| `test:coverage`  | `vitest run --coverage`               |

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Static Pages ──────── Netlify CDN (pre-built HTML/JS/CSS)   │
│                                                              │
│  Contact Form ────┬──► Supabase (contact_submissions INSERT) │
│                   └──► Netlify Forms (backup)                │
│                                                              │
│  Join Us Form ────┬──► Supabase Storage (cv-uploads bucket)  │
│                   ├──► Supabase (joinus_applications INSERT) │
│                   └──► Netlify Forms (backup)                │
│                                                              │
│  Newsletter ──────────► Supabase (newsletter_subscribers)    │
│                                                              │
│  Doctor List ─────────► Supabase (doctors SELECT active)     │
│                                                              │
│  WhatsApp CRM ────────► Netlify Function ──► External CRM    │
│                                                              │
│  Blog Pages ──────────► Pre-built at build from MDX files    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    ADMIN / BACKEND                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Newsletter Send ─────► Supabase Edge Function               │
│                         ├── Read subscribers (service_role)   │
│                         ├── Build HTML template               │
│                         └── Send via Resend API (batch 50)    │
│                                                              │
│  Doctor Management ───► Supabase Dashboard (service_role)    │
│  Form Submissions ────► Supabase Dashboard / Netlify Forms   │
│  Blog Management ─────► Edit MDX files → Rebuild & Deploy    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Design System & Branding

### Colors
| Token           | Hex       | Usage                            |
| --------------- | --------- | -------------------------------- |
| Primary Dark    | `#00373E` | Headers, buttons, dark sections  |
| Primary Orange  | `#ED7428` / `#F97316` / `#F06D00` | Accents, CTAs, links |
| Background Warm | `#F7F6F4` / `#F7F5EF` / `#F6EFE8` | Page backgrounds |
| Background Peach| `#FFF7ED` / `#FFF5ED` / `#FEF2EB` | Card backgrounds |
| Card Peach      | `#F9E6D0` / `#FFEBD7`             | Feature cards    |
| Text Secondary  | `#486364` / `#6A8181`              | Body text        |

### Typography
- **Primary:** Inter (system font, loaded via `next/font/google`)
- **Display:** Bricolage Grotesque (headings, body in content pages)
- **Code/Mono:** IBM Plex Sans (select headings)

### Component Patterns
- Rounded corners: `rounded-2xl` to `rounded-[60px]` (large, organic feel)
- Glassmorphism: `bg-white/80 backdrop-blur-sm` on cards
- Shadows: Soft, layered (`shadow-[0_20px_50px_rgba(0,0,0,0.03)]`)
- Animations: Scroll-triggered fade-in/slide-in, hover lift (`y: -12`), scale on hover
- All home sections are code-split via `next/dynamic` for performance
