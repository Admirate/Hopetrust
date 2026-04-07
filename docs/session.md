# Hope Trust India — Development Session Log

## Session Overview

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| **Date**         | April 7, 2026                              |
| **Objective**    | Full codebase exploration and documentation |
| **Status**       | ✅ Complete                                 |
| **Participants** | Developer + AI Assistant (Cascade)          |

---

## Session Goals

1. **Understand the entire codebase** — every file, folder, API, database table, and integration
2. **Document the architecture** — tech stack, data flows, rendering strategies, security model
3. **Create persistent documentation** — `docs/claude.md` (full project reference) and `docs/session.md` (this file)

---

## Exploration Timeline

### Phase 1: Project Structure Discovery

**Files examined:**
- `package.json` — Dependencies, scripts, project metadata
- `next.config.js` — Static export configuration, image optimization, remote patterns
- `tailwind.config.ts` — Theme configuration, custom colors/animations
- `tsconfig.json` — TypeScript paths and compilation settings
- `netlify.toml` — Build config, redirects, security headers, caching policies
- `vitest.config.ts` / `vitest.setup.ts` — Test framework configuration

**Key findings:**
- Next.js 15 with `output: 'export'` — fully static site generation
- Hosted on Netlify with serverless functions
- Extensive security headers (CSP, HSTS, X-Frame-Options)
- WordPress legacy URL redirects configured
- Comprehensive caching strategy for static assets

---

### Phase 2: Database Schema & Security

**Files examined:**
- `Database/supabase-setup.sql` — Initial table creation (contact, joinus, newsletter + storage bucket)
- `Database/doctors-table.sql` — Doctors table with seed data for 12 practitioners
- `Database/rls-policies.sql` — Detailed Row Level Security policies

**Key findings:**
- **4 tables:** `contact_submissions`, `joinus_applications`, `newsletter_subscribers`, `doctors`
- **2 storage buckets:** `cv-uploads` (applicant CVs), `hopetrust assets` (static assets)
- All tables have **Row Level Security (RLS)** enabled
- Anonymous users can only INSERT into form tables (with field-level validation in policies)
- Anonymous users can only SELECT active doctors
- All write/read access for admin is via `service_role` key (Supabase Dashboard)
- RLS policies include data validation: email regex, field length checks, URL pattern checks
- Doctor table has auto-updating `updated_at` trigger and composite index

---

### Phase 3: Backend Services & Utilities

**Files examined:**
- `lib/supabase.ts` — Client initialization (singleton pattern, anon key from env vars)
- `lib/doctors.ts` — Doctor fetching and department listing functions
- `lib/blog.ts` — Complete MDX blog reading pipeline (filesystem-based CMS)
- `lib/config.ts` — Centralized site configuration object
- `lib/assets.ts` — Supabase storage URL builder utilities
- `lib/newsletter-template.ts` — Branded HTML email template generator
- `lib/performance.ts` — Performance optimization hooks and utilities

**Key findings:**
- No traditional REST API — forms submit directly to Supabase from browser
- Blog system reads ~395 MDX files from `content/blogs/` directory at build time
- Supabase client uses public anonymous key (safe for client-side)
- Performance utilities include debounce, throttle, virtual list, and intersection observer
- Newsletter template builds complete HTML email with blog post cards

---

### Phase 4: Serverless Functions

**Files examined:**
- `netlify/functions/whatsapp-crm.mjs` — Netlify Function for CRM proxy
- `supabase/functions/send-newsletter/index.ts` — Supabase Edge Function for newsletters

**Key findings:**

#### WhatsApp CRM Function
- Acts as a server-side proxy to keep CRM tokens secret
- Only allows POST requests
- CORS restricted to production domain + localhost
- Forwards request body to external CRM endpoint with Bearer auth
- Returns 405 for non-POST, 500 for misconfiguration, 502 for CRM failures

#### Newsletter Edge Function
- Runs on Deno (Supabase Edge Functions runtime)
- Uses `service_role` key to bypass RLS and read all active subscribers
- Sends emails via Resend API in batches of 50 with 1-second inter-batch delay
- Builds complete branded HTML newsletter with custom message + blog post cards
- Returns detailed send/fail statistics

---

### Phase 5: Frontend Pages

**Files examined:**

#### `app/layout.tsx` — Root Layout
- Sets up Inter font, global CSS, metadata (title, description, OG tags)
- Wraps app in `LenisProvider` (smooth scrolling), `Toaster` (notifications)
- Renders `WebVitals` (performance monitoring) and `WhatsAppButton` (floating CTA)

#### `app/page.tsx` — Homepage
- 10 dynamically imported sections for code splitting:
  - HeroSection, BackgroundCirclesSection, WhatWeOfferSection, RectangleSection
  - ClientsSayingSection, ResourcesSection, LargeRectangleSection
  - MeetTheTeamSection, ContactSection, HomeFinalCtaSection
- Each section wrapped in `FadeInSection` for scroll-triggered animations

#### `app/about/page.tsx` — About Page (~734 lines)
- Rich narrative content about Hope Trust's history, mission, values
- Custom animation components: `TypewriterPlain`, `TypewriterSegments`, `ProximityText`
- Dynamic imports: `OurTeamSection`, `HomeFinalCtaSection`
- Media gallery section, wellness coaching section, how-it-works timeline
- Extensive use of Framer Motion for entrance animations

#### `app/mental-health/page.tsx` — Mental Health Services
- Tabbed UI with 4 service categories: Therapy, Psychiatry, Couples, Family
- Each tab has description, list of issues addressed, and CTA
- Additional sections for ADHD Assessment, Student Support, Queer-Affirmative Therapy
- Dynamic import for `HomeFinalCtaSection`

#### `app/addiction/page.tsx` — Addiction Recovery
- 5-step "Road to Recovery" visual journey
- Each step has text content, step number, and illustration image
- Animated with `EASE_OUT_QUINT` timing and `FADE_IN_VIEWPORT` config
- Uses Supabase storage for step images

#### `app/blogs/page.tsx` — Blog Listing (Server Component)
- Reads all MDX metadata at build time via `getAllPostsMeta()`
- Passes data to `BlogListClient` component for interactive filtering/pagination
- SEO: static generation with proper metadata

#### `app/blogs/[slug]/page.tsx` — Blog Detail (~230 lines)
- `generateStaticParams()` pre-renders all ~395 blog post pages
- `generateMetadata()` sets per-page SEO (title, description, OG image)
- Content pipeline: `marked.parse()` → `sanitize-html` → `dangerouslySetInnerHTML`
- JSON-LD structured data (`BlogPosting` schema.org type)
- Previous/next post navigation via `getAdjacentPosts()`

#### `app/book-your-session/page.tsx` — Doctor Directory (~211 lines)
- Client-side data fetching from Supabase `doctors` table
- Search functionality (by name)
- Department filter dropdown
- `TherapistCard` component for each doctor
- Loading, error, and empty state handling

#### `app/contact/page.tsx` — Contact Form (~690 lines)
- Zod schema validation (full_name, phone, email, message)
- Dual submission: Supabase `contact_submissions` + hidden Netlify Form
- Toast notifications via Sonner
- Contact info cards (phone, email, WhatsApp, location)
- Embedded Google Maps iframe
- Animated submit button with loading state

#### `app/join-us/page.tsx` — Job Application (~700 lines)
- Zod schema validation (full_name, email, position, cv, introduction)
- Client-side file validation: PDF/DOCX only, max 5MB
- CV upload flow: file → Supabase `cv-uploads` bucket → get public URL → insert `joinus_applications`
- 3-step application process explanation
- Animated submit button with loading/success states
- Dual submission: Supabase + Netlify Forms

---

### Phase 6: Components & Hooks

**Files examined:**
- `components/NewsletterForm.tsx` — Newsletter signup form (inline + card variants)
- `hooks/useScrollAnimation.ts` — IntersectionObserver scroll animation hook

**Key findings:**
- `NewsletterForm` has two layout variants (`inline` for footer, `card` for standalone)
- Validates with Zod, submits to Supabase, handles duplicate email error (code 23505)
- `useScrollAnimation` provides GPU-accelerated animation presets using `translate3d`
- Observer auto-disconnects after first trigger for performance

---

### Phase 7: Build Scripts

**Files examined:**
- `scripts/generate-sitemap.mjs` — Post-build sitemap and robots.txt generator
- `scripts/migrate-wp.mjs` — WordPress to MDX migration tool (reference only)
- `scripts/test-newsletter.mjs` — Newsletter send test utility (reference only)

**Key findings:**
- Sitemap covers 8 static pages + all ~395 blog post URLs
- Homepage gets `changefreq: weekly`, `priority: 1.0`
- Blog posts get `changefreq: monthly`, `priority: 0.6`
- Writes to `out/` (post-build) or `public/` (dev)
- Generates `robots.txt` allowing all crawlers

---

## Architecture Decisions Identified

### 1. Static Export Strategy
**Decision:** `output: 'export'` instead of server-side rendering.
**Rationale:** Pure static HTML deployed to Netlify CDN = maximum performance, zero server costs, global edge distribution. Acceptable because content changes infrequently (requires rebuild).

### 2. Direct Supabase Client Access
**Decision:** Forms submit directly from browser to Supabase using anon key.
**Rationale:** RLS policies provide security at the database level. No need for a custom API layer. Simplifies architecture significantly.
**Trade-off:** All validation must be duplicated (client-side Zod + database-level RLS `WITH CHECK`).

### 3. MDX File-Based Blog
**Decision:** Blog posts stored as MDX files in repo instead of a CMS or database.
**Rationale:** Content is version-controlled, no external CMS dependency, works perfectly with static export. ~395 posts migrated from WordPress.
**Trade-off:** New posts require a code commit + rebuild + deploy.

### 4. Dual Form Submission
**Decision:** Forms submit to both Supabase AND Netlify Forms.
**Rationale:** Redundancy — if Supabase is down, Netlify Forms captures the submission. Netlify Forms also provides built-in spam filtering and email notifications.

### 5. Batched Newsletter Sending
**Decision:** Emails sent in batches of 50 with 1-second delays.
**Rationale:** Prevents rate limiting from email provider (Resend). Ensures reliable delivery for growing subscriber lists.

### 6. Code Splitting via Dynamic Imports
**Decision:** All homepage sections use `next/dynamic` with `ssr: false`.
**Rationale:** Reduces initial JavaScript bundle size. Sections load on demand as user scrolls.

---

## Security Model

### Client-Side
- Supabase anon key is public (by design) — security enforced via RLS
- Form validation with Zod prevents malformed data
- `sanitize-html` prevents XSS in blog content rendering
- No authentication required for public-facing features

### Database (RLS)
- Anonymous users can ONLY:
  - INSERT into `contact_submissions`, `joinus_applications`, `newsletter_subscribers` (with validation)
  - SELECT from `doctors` where `is_active = true`
- Anonymous users CANNOT: SELECT, UPDATE, or DELETE from form submission tables
- `service_role` has full access (used only server-side in edge functions)

### Server-Side
- CRM token stored as Netlify env var, proxied via serverless function
- Resend API key + Supabase service_role key only used in Supabase Edge Functions
- `WHATSAPP_CRM_TOKEN` never exposed to browser

### HTTP Headers (Netlify)
- `Content-Security-Policy` — restricts script/style/image sources
- `Strict-Transport-Security` — 2-year HSTS with preload
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-XSS-Protection: 1; mode=block` — legacy XSS filter
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Permissions-Policy` — denies camera, microphone, geolocation, payment

---

## Performance Optimizations

1. **Static Export** — All pages pre-rendered as HTML, served from CDN edge
2. **Code Splitting** — All homepage sections dynamically imported
3. **Image Optimization** — WebP/AVIF formats configured, device-responsive sizes
4. **Lenis Smooth Scroll** — Hardware-accelerated smooth scrolling
5. **IntersectionObserver Animations** — Elements animate only when scrolled into view, observer auto-disconnects
6. **GPU-Accelerated CSS** — `translate3d()` and `willChange` for all scroll animations
7. **Debounce/Throttle Hooks** — Prevent excessive re-renders on scroll/resize
8. **Console Removal** — `removeConsole` in production builds
9. **Asset Caching** — Immutable cache headers for static assets (1 year)
10. **Compression** — `compress: true` in Next.js config

---

## Potential Improvements & Technical Debt

### Identified During Exploration

1. **No admin dashboard** — Doctor management, form submissions, and newsletter sending require direct Supabase Dashboard or API access. Could benefit from a protected `/admin` route.

2. **Blog requires rebuild** — Adding/editing blog posts requires committing MDX files and redeploying. A headless CMS (Sanity, Contentful) or Supabase-based blog could enable non-technical content updates.

3. **No unsubscribe route** — Newsletter emails link to `${siteUrl}/unsubscribe` but no `/unsubscribe` page exists in the app routes.

4. **Duplicate validation** — Form validation exists in both Zod schemas (client) and RLS policies (database). Changes must be kept in sync manually.

5. **No error monitoring** — No Sentry, LogRocket, or similar error tracking service integrated.

6. **No analytics** — No Google Analytics, Plausible, or similar analytics visible in the codebase.

7. **Test coverage** — Test files exist (`__tests__/` directories, `.test.ts` files) but coverage appears minimal relative to codebase size.

8. **Newsletter template duplication** — `lib/newsletter-template.ts` and the inline `buildNewsletterHtml` in the edge function are two separate template implementations.

9. **No sitemap in next.config** — Sitemap is generated by a custom script rather than using Next.js built-in `sitemap.ts` (though this may be intentional given static export).

10. **WordPress migration artifacts** — `wpLink` field in blog frontmatter and `migrate-wp.mjs` script suggest one-time migration; these could be cleaned up.

---

## File Size & Complexity Highlights

| File                              | Lines | Notes                           |
| --------------------------------- | ----- | ------------------------------- |
| `app/about/page.tsx`              | ~734  | Largest page, rich animations   |
| `app/join-us/page.tsx`            | ~700  | Complex form with file upload   |
| `app/contact/page.tsx`            | ~690  | Form + contact cards + map      |
| `components/BlogListClient.tsx`   | ~16KB | Blog listing with filters       |
| `content/blogs/`                  | ~395 files | Bulk of content volume     |
| `Database/doctors-table.sql`      | ~185  | Schema + seed data              |

---

## Commands Reference

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)
npm run dev:netlify      # Start with Netlify Functions (localhost:8888)

# Build & Deploy
npm run build            # Build static site + generate sitemap
                         # Netlify auto-deploys on git push

# Testing
npm test                 # Run Vitest in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Run tests with coverage report

# Utilities
node scripts/generate-sitemap.mjs    # Regenerate sitemap.xml + robots.txt
node scripts/test-newsletter.mjs     # Test newsletter sending
```

---

## Dependencies Summary

### Production (Key)
- `next` 15.x — Framework
- `react` / `react-dom` 19.x — UI library
- `@supabase/supabase-js` — Database client
- `motion` (Framer Motion) 11.x — Animations
- `zod` — Schema validation
- `marked` — Markdown → HTML
- `sanitize-html` — XSS protection
- `gray-matter` — MDX frontmatter parsing
- `reading-time` — Blog read time calculation
- `sonner` — Toast notifications
- `lenis` — Smooth scrolling
- `lucide-react` — Icons
- `three` / `ogl` — 3D graphics
- 47 `@radix-ui/*` packages — shadcn/ui primitives

### Dev
- `typescript` 5.2.x
- `tailwindcss` 3.3.x
- `vitest` 4.x + `@testing-library/react`
- `@types/node`, `@types/react`
- `eslint` + `eslint-config-next`

---

*Last updated: April 7, 2026*
*Generated during codebase exploration session*
