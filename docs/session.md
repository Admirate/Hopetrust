# Hope Trust India — Development Session Log

## Session Overview

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| **Date**         | April 7, 2026 (Session 1) / April 19, 2026 (Session 2) |
| **Objective**    | Full codebase exploration, documentation, and ongoing update discipline |
| **Status**       | ✅ Ongoing — docs updated each session       |
| **Participants** | Developer + AI Assistant (Cascade)          |

---

## Session Goals

1. **Understand the entire codebase** — every file, folder, API, database table, and integration
2. **Document the architecture** — tech stack, data flows, rendering strategies, security model
3. **Create persistent documentation** — `docs/claude.md` (full project reference) and `docs/session.md` (this file)
4. **Keep docs updated** — both `claude.md` and `session.md` are updated at the end of every session to reflect any new findings or changes

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

## Session 2 — April 19, 2026

### Objective
Complete the remaining component/page/function read-through and correct errors found in the initial documentation. Establish a discipline of updating `claude.md` and `session.md` after every change.

### Files Examined

#### Components
- `components/Header.tsx` — Auto-hide header, hover-reveal background, desktop dropdown for Addiction Services, mobile slide-in drawer with expandable sections
- `components/Footer.tsx` — Orange outer wrapper, white rounded card interior, nav + social + legal links, decorative SVG, two CTA buttons
- `components/HeroSection.tsx` — Full-screen parallax video hero using Framer Motion `useScroll`/`useTransform`; two layered videos with glassmorphism card
- `components/NewsletterForm.tsx` — Zod-validated (name, email, phone), two variants (`inline` / `card`), dark mode, inserts to `newsletter_subscribers`, handles code `23505` duplicates
- `components/WhatsAppButton.tsx` — Fixed FAB: green closes to orange when open; calls `/api/whatsapp-crm`, falls back to direct WhatsApp URL
- `components/TherapistCard.tsx` — Doctor card with 4:3 image or initials avatar, expand/collapse bio, booking CTA link
- `components/FadeInSection.tsx` — `motion.div` + `useScrollAnimation` at 20% threshold, cubic-bezier `[0.22, 0.61, 0.36, 1]`, `delay` prop in ms
- `components/LenisProvider.tsx` — Wraps Lenis (duration 1.1, smoothWheel) in rAF loop, destroys on unmount
- `components/WebVitals.tsx` — Production-only dynamic import of `web-vitals`; reports CLS, FID, FCP, LCP, TTFB via optional `onMetric` callback
- `components/BlogListClient.tsx` — 12/page pagination, search (title/excerpt/categories/tags), category filter tabs, featured post hero, inline newsletter CTA, scroll-to-top on page change
- `components/OurTeamSection.tsx` — Auto-rotates 4 team category labels every 1.8s; respects `prefers-reduced-motion`; background video; `renderContent` slot prop
- `components/ResourcesSection.tsx` — 3 resource cards with staggered Framer Motion entrance; `InteractiveHoverButton` CTAs

#### Netlify Functions (newly documented)
- `netlify/functions/admin-login.mjs` — bcrypt password verify → 24h JWT; service_role Supabase query; generic error messages prevent email enumeration
- `netlify/functions/admin-programs.mjs` — GET public; POST/PUT/DELETE require `Authorization: Bearer <jwt>`; full CRUD on `addiction_programs`

#### Pages (newly documented)
- `app/admin/page.tsx` (~740 lines) — Login form → JWT stored in `sessionStorage`; dashboard with add/edit/delete programs UI
- `app/corporate-wellness/page.tsx` — Placeholder "coming soon"
- `app/intervention-services/page.tsx` — Placeholder "coming soon"
- `app/sitemap/page.tsx` — Human-readable sitemap with Bricolage Grotesque font
- `app/error.tsx` — Global error boundary with Try Again + Back to Home
- `app/not-found.tsx` — Custom 404

#### Test Files
- `app/__tests__/contact.test.tsx` — 5 tests: renders form, renders contact cards, validation errors, successful Supabase submit, Supabase error handling
- `components/__tests__/Header.test.tsx` — 4 tests: logo renders, nav links render, mobile toggle exists, correct link count
- `lib/assets.test.ts` — 4 tests: correct URL format, leading slash stripping, space encoding, special char encoding
- `lib/utils.test.ts` — 6 tests: merge, conditional, Tailwind conflict resolution, empty, null/undefined, array inputs

#### Infrastructure
- `public/_headers` — Netlify CDN-only CSP (separate from `netlify.toml` because `netlify dev` skips it, allowing HMR `eval()`)
- `public/__forms.html` — Hidden Netlify Forms declarations for `contact` and `joinus` forms (spam filtering + email backup)
- `vitest.setup.ts` — Mocks `IntersectionObserver` and `ResizeObserver` for jsdom environment

#### Supabase Edge Function
- `supabase/functions/send-newsletter/index.ts` — Deno runtime; batched Resend sends (50/batch, 1s delay); builds inline HTML template (separate from `lib/newsletter-template.ts`)

### Corrections Made to `claude.md`

| Issue | Fix |
| ----- | --- |
| `app/join-us/page.tsx` listed (route removed) | Removed from directory tree and routes table; noted in `joinus_applications` table description |
| `lib/performance.ts` listed (file does not exist) | Removed entirely from Key Library Modules |
| `hooks/use-toast.ts` listed (file does not exist) | Removed from hooks directory listing |
| `lib/programs.ts` missing | Added to directory tree and Key Library Modules |
| `netlify/functions/` only showed `whatsapp-crm.mjs` | Added `admin-login.mjs` and `admin-programs.mjs` |
| `Database/admin-schema.sql` missing | Added to directory tree |
| `scripts/seed-admin.mjs` missing | Added to scripts directory listing |
| Admin DB tables missing | Added `admin_users` and `addiction_programs` schema sections |
| Admin Netlify functions undocumented | Added full documentation for both |
| Routes table missing 5 pages | Added `/admin`, `/training`, `/corporate-wellness`, `/intervention-services`, `/sitemap` |
| `ADMIN_JWT_SECRET` env var missing | Added to environment variables table |
| Potential improvement #1 claimed no admin dashboard | Corrected — admin dashboard exists at `/admin` |
| `app/about` route had wrong component path | Fixed to `app/about/page.tsx` |

---

## Session 3 — April 19, 2026

### Objective
Implement production-grade brute-force rate limiting on the admin login endpoint.

### Changes Made

#### `Database/admin-security.sql` (new file)
Safe `ALTER TABLE` migration — adds two columns to `admin_users` using `ADD COLUMN IF NOT EXISTS` with defaults. Existing rows receive `failed_attempts = 0` and `locked_until = NULL`. Zero data loss.
- `failed_attempts integer NOT NULL DEFAULT 0`
- `locked_until timestamptz DEFAULT NULL`
- Partial index on `locked_until WHERE locked_until IS NOT NULL` for fast lockout queries

#### `netlify/functions/admin-login.mjs` (rewritten)
Full rate-limiting implementation:
- **Input guards:** Content-Type check, email ≤ 200 chars, password ≤ 128 chars (prevents CPU abuse from bcrypt on giant inputs)
- **Lockout check:** If `locked_until > now()` → HTTP 429 with `Retry-After` header + `retryAfter` seconds in body
- **Fresh-window logic:** If lockout has expired, counter is treated as 0 (user gets 5 new attempts)
- **Failed attempt tracking:** Each wrong password increments `failed_attempts`; reaching 5 sets `locked_until = now() + 15min`
- **Attempt feedback:** Responses include "X attempts remaining before lockout" (does NOT reveal email existence)
- **Success reset:** On correct password, `failed_attempts` and `locked_until` are both reset to clean state before JWT is issued
- **Helper `json()`** function deduplicated all response creation

#### `app/admin/page.tsx` (LoginForm updated)
Client-side lockout handling:
- New `lockoutUntil` (Date | null) and `countdown` (number) states
- `useEffect` countdown timer — ticks every second, clears interval and resets state when reaches 0
- `handleSubmit` checks for HTTP 429 and sets `lockoutUntil` from `data.retryAfter`
- Submit button disabled during lockout, shows "Account Locked" text
- Error box turns **amber** (vs red) during lockout and shows `MM:SS` countdown timer

### Design Decisions
- **DB-based tracking over Redis** — No new infrastructure needed; Supabase service_role writes are fast enough for a low-traffic admin endpoint
- **Per-email, not per-IP** — IP-based limiting would require a separate table + CIDR parsing; per-email is sufficient for a 1-2 person admin panel
- **Lockout counter resets after window** — More user-friendly: after waiting 15 minutes, you get a fresh 5 attempts rather than being permanently locked

---

## Session 4 — April 19, 2026

### Objective
Implement 401 auto-logout so expired/invalid JWTs force the admin back to the login screen.

### Changes Made

#### `lib/programs.ts`
- Added `export class UnauthorizedError extends Error` — custom error class with `name = 'UnauthorizedError'` and a user-facing message
- `createProgram`, `updateProgram`, `deleteProgram` each check `if (res.status === 401) throw new UnauthorizedError()` **before** the generic `!res.ok` check
- `fetchPrograms` is a public GET — no 401 expected, no change needed

#### `app/admin/page.tsx`
- Imported `UnauthorizedError` from `@/lib/programs`
- **`ProgramCard`**: added `onUnauthorized: () => void` prop; `onDelete` type changed to `Promise<void>`
  - `handleSave` — catches `UnauthorizedError` → `onUnauthorized()`
  - `handleDelete` — **bug fix**: now properly `await`s `onDelete`, wrapped in `try/catch`; `UnauthorizedError` → `onUnauthorized()`; other errors show inline error + reset `deleting`/`confirmDelete` state (previously `setDeleting` was never reset on failure)
- **`Dashboard.handleAdd`** — wraps `createProgram` in try/catch; `UnauthorizedError` → `onLogout()`; other errors re-thrown so `AddProgramForm` displays them
- **`Dashboard.handleDelete`** — `UnauthorizedError` → `onLogout()`; other errors set dashboard error and re-throw so `ProgramCard` can reset its loading state
- Passes `onUnauthorized={onLogout}` to every `ProgramCard`

---

## Session 5 — April 19, 2026

### Objective
Implement client-side JWT expiry check so stale tokens from session-restore (browser reopen) are detected and discarded on mount.

### Changes Made

#### `app/admin/page.tsx`
- **`parseJwtExpiry(token)`** — pure helper that splits the JWT on `.`, `atob`-decodes the payload segment, parses JSON, returns `exp` (number) or `null` on any failure. No signature verification — used only to decide whether to restore a session.
- **`AdminPage`** — added `sessionExpired` state (boolean)
- **`useEffect` (mount)** — before restoring token from `sessionStorage`:
  1. Calls `parseJwtExpiry(saved)`
  2. If `exp` is null or `exp * 1000 <= Date.now()` → clears both `sessionStorage` keys + sets `sessionExpired = true`; returns early
  3. Otherwise restores token and email as before
- **`LoginForm`** — added optional `sessionExpired?: boolean` prop (default `false`)
  - When `true`, renders an amber banner above the form: *"Your session has expired. Please sign in again."*
- `AdminPage` passes `sessionExpired={sessionExpired}` to `LoginForm`

---

## Session 6 — April 19, 2026

### Objective
Enforce input length limits on both client and server to prevent oversized payloads.

### Changes Made

#### `netlify/functions/admin-programs.mjs`
- Added `LIMITS` constant (title/subtitle 200, description 2000, note 500, cost 100, feature per-item 300, max 20 features)
- Added `validateFields()` helper — returns descriptive error string or `null`; called in both `POST` and `PUT` handlers between required-field check and Supabase insert/update

#### `app/admin/page.tsx`
- Added `FIELD_LIMITS` constant at module top — mirrors server values exactly (single source to update)
- Added `FIELD_LIMITS.email` (200) and `FIELD_LIMITS.password` (128) to `LoginForm` inputs
- Added `maxLength` to every `<input>` and `<textarea>` in `AddProgramForm` and `ProgramCard` edit form
- Features textareas intentionally have **no** `maxLength` (per-line limits can't be expressed as a single character count); instead both `AddProgramForm.handleSubmit` and `ProgramCard.handleSave` validate: lines ≤ 20, each line ≤ 300 chars

---

## Session 7 — April 19, 2026

### Objective
Implement an append-only audit log table and server-side writes for all admin actions.

### Changes Made

#### `Database/admin-audit-log.sql` (new file)
- Creates `admin_audit_log` table with columns: `id`, `action`, `actor_email`, `resource_type`, `resource_id`, `metadata` (jsonb), `ip_address`, `created_at`
- RLS denies `FOR ALL` to `anon` and `authenticated` — only `service_role` can read/write
- 3 indexes: `created_at DESC`, `actor_email`, `action`

#### `netlify/functions/admin-programs.mjs`
- Added `writeAuditLog(supabase, req, opts)` — fire-and-forget, wrapped in try/catch, never blocks response
- IP extracted from `x-forwarded-for` (first IP) with fallback to `x-nf-client-connection-ip`
- Writes after each successful operation: `CREATE` (metadata: title), `UPDATE` (metadata: title), `DELETE`

#### `netlify/functions/admin-login.mjs`
- Added same `writeAuditLog` helper (resource_type: `'session'`)
- `LOGIN_BLOCKED` — attempt on locked account (metadata: locked_until)
- `LOGIN_FAILED` — wrong password, not yet locked (metadata: attempts_remaining)
- `ACCOUNT_LOCKED` — 5th failure triggers lockout (metadata: locked_until, failed_attempts)
- `LOGIN_SUCCESS` — after counter reset, before JWT issue

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

1. **Admin dashboard exists** — `/admin` route provides a JWT-secured CRUD dashboard for addiction programs. Doctor management and form submissions still require direct Supabase Dashboard access.

2. **Blog requires rebuild** — Adding/editing blog posts requires committing MDX files and redeploying. A headless CMS (Sanity, Contentful) or Supabase-based blog could enable non-technical content updates.

3. **No unsubscribe route** — Newsletter emails link to `${siteUrl}/unsubscribe` but no `/unsubscribe` page exists in the app routes.

4. **Duplicate validation** — Form validation exists in both Zod schemas (client) and RLS policies (database). Changes must be kept in sync manually.

5. **No error monitoring** — No Sentry, LogRocket, or similar error tracking service integrated.

6. **No analytics** — No Google Analytics, Plausible, or similar analytics visible in the codebase.

7. **Test coverage** — Coverage is minimal: contact form, Header, cn utility, and asset URL tests only.

8. **Newsletter template duplication** — `lib/newsletter-template.ts` and the inline `buildNewsletterHtml` in the Supabase edge function are two separate template implementations.

9. **No sitemap in next.config** — Sitemap generated by custom script (intentional for static export).

10. **Placeholder pages** — `/training`, `/corporate-wellness`, `/intervention-services` show "coming soon" with no real content.

11. **Dead sitemap link** — `app/sitemap/page.tsx` links to `/join-us` but that route has been removed.

12. **Admin JWT in sessionStorage** — Token cleared on browser close; acceptable but worth noting.

### Resolved

- ✅ **Brute-force / rate limiting** (Session 3) — 5-attempt lockout with 15-min window stored in `admin_users`
- ✅ **401 auto-logout** (Session 4) — `UnauthorizedError` thrown by `lib/programs.ts`; caught in `Dashboard` and `ProgramCard` to call `onLogout()`
- ✅ **Client-side token expiry check** (Session 5) — `parseJwtExpiry` on mount; stale tokens cleared with `sessionExpired` banner
- ✅ **WhatsApp button on admin page** (Session 4) — `usePathname` guard in `WhatsAppButton` returns `null` on `/admin`
- ✅ **Input length limits** (Session 6) — `LIMITS` + `validateFields` server-side; `FIELD_LIMITS` + `maxLength` + submit-time features validation client-side
- ✅ **Audit log** (Session 7) — `admin_audit_log` table; `writeAuditLog` in both Netlify functions covering all login events and all CRUD mutations

---

## File Size & Complexity Highlights

| File                              | Lines | Notes                           |
| --------------------------------- | ----- | ------------------------------- |
| `app/about/page.tsx`              | ~734  | Largest page, rich animations   |
| `app/admin/page.tsx`              | ~740  | Admin dashboard + login form    |
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

## Session 8 — April 20, 2026

### Objective
Implement full CRUD for training programs (admin dashboard + public page), make training page responsive, refactor hardcoded Supabase URLs, and implement core SEO improvements.

### Changes Made

#### Training Programs — Full CRUD Stack

##### `Database/training-programs.sql` (new file)
- `training_programs` table: `id`, `category` (internship/traineeship), `title`, `description`, `levels` (JSONB array), `duration`, `fee`, `format`, `display_order`, `is_active`, timestamps
- RLS: public read of active programs, all writes via service_role only

##### `netlify/functions/admin-training-programs.mjs` (new file)
- Full CRUD Netlify function mirroring `admin-programs.mjs` pattern
- GET (public), POST/PUT/DELETE (JWT auth required)
- Field validation + audit log writes

##### `lib/training-programs.ts` (new file)
- TypeScript interfaces (`TrainingProgram`, `TrainingProgramLevel`)
- CRUD functions: `fetchTrainingPrograms`, `createTrainingProgram`, `updateTrainingProgram`, `deleteTrainingProgram`

##### `app/admin/page.tsx`
- Added tabbed UI: "Addiction Programs" | "Training Programs"
- New components: `AddTrainingProgramForm`, `TrainingProgramCard`
- Full state management for training programs CRUD
- Fixed duplicate `format` field in both form and card edit mode

##### `app/training/page.tsx`
- Replaced hardcoded internship/traineeship content with dynamic Supabase data
- Card-style containers for program display
- Auto-cycling "What you gain" text animation with `AnimatePresence`
- **Full responsive overhaul:** hero `h-screen`, font scaling, grid gaps, card padding, level pill sizing, cycling text container height (`h-[52px]` on mobile to prevent clipping)

---

#### Hardcoded Supabase URL Refactor

##### `lib/assets.ts`
- Added `getStorageUrl(bucket, path)` for custom buckets
- `getAssetUrl` now delegates to `getStorageUrl`

##### 9 files updated (34 instances total)
| File | Count | Approach |
| --- | --- | --- |
| `components/AffiliationsSection.tsx` | 9 | `getStorageUrl(AFFIL_BUCKET, ...)` (different bucket) |
| `app/training/page.tsx` | 6 | `getAssetUrl(...)` |
| `app/addiction/page.tsx` | 5 | `getAssetUrl(...)` |
| `app/mental-health/page.tsx` | 5 | `getAssetUrl(...)` |
| `app/intervention-services/page.tsx` | 3 | `getAssetUrl(...)` |
| `app/about/page.tsx` | 2 | `getAssetUrl(...)` |
| `app/corporate-wellness/page.tsx` | 2 | `getAssetUrl(...)` |
| `components/OurTeamSection.tsx` | 1 | `getAssetUrl(...)` |
| `components/ResourcesSection.tsx` | 1 | `getAssetUrl(...)` |

Only remaining instance: the fallback value in `lib/assets.ts` itself (single source of truth).

---

#### SEO Implementation

##### 1. Sitemap + Robots.txt (`scripts/generate-sitemap.mjs`)
- Per-page `priority` and `changefreq` (home=weekly/1.0, services=monthly/0.9, blogs=weekly/0.8)
- `robots.txt` now blocks `/admin/` from crawlers
- Already wired into build via `npm run build`

##### 2. JSON-LD Structured Data

###### `lib/jsonld.ts` (new file)
Reusable schema generators:
- `getOrganizationSchema()` — `Organization` + `MedicalBusiness` with address, geo, opening hours, medical specialties
- `getWebSiteSchema()` — `WebSite` schema
- `getServiceSchema(opts)` — `MedicalTherapy` schema for service pages
- `getBreadcrumbSchema(items)` — `BreadcrumbList` schema
- `getFAQSchema(faqs)` — `FAQPage` schema (available for future use)

###### `components/JsonLd.tsx` (new file)
Lightweight `<script type="application/ld+json">` wrapper component.

###### Root layout (`app/layout.tsx`)
- `Organization` + `MedicalBusiness` schema (every page)
- `WebSite` schema (every page)

###### Service page layouts
`MedicalTherapy` + `BreadcrumbList` JSON-LD added to:
- `app/mental-health/layout.tsx`
- `app/addiction/layout.tsx`
- `app/training/layout.tsx`
- `app/corporate-wellness/layout.tsx`
- `app/intervention-services/layout.tsx`

###### Non-service page layouts
`BreadcrumbList` JSON-LD added to:
- `app/about/layout.tsx`
- `app/contact/layout.tsx`
- `app/book-your-session/layout.tsx`

##### 3. Per-Page Canonical URLs
Added `alternates.canonical` to all 8 sub-page layouts:
- `/about/`, `/mental-health/`, `/addiction/`, `/training/`, `/corporate-wellness/`, `/intervention-services/`, `/contact/`, `/book-your-session/`
- Root layout already had `canonical: '/'`

---

### Design Decisions
- **`getStorageUrl` vs modifying `getAssetUrl`** — Added a new generic function to support multiple buckets (affiliations logos use a different bucket) while keeping `getAssetUrl` as a convenient default-bucket wrapper
- **JSON-LD in layouts vs pages** — Layouts are server components, so structured data is rendered at build time into static HTML (no client JS needed)
- **Relative canonicals** — Using relative paths (e.g. `/about/`) with `metadataBase` set in root layout; Next.js resolves to full URLs automatically

---

---

## Session — April 22, 2026 · Razorpay Booking System

**Objective:** Ship an end-to-end online enrollment + payment flow for training
and addiction programs. Customers pay via Razorpay Checkout, webhook confirms
server-side, emails fire, admin can manage enrollments.

**Scope delivered (4 phases):**

### Phase 1 — Database (`Database/enrollments.sql`)
- New `enrollments` table: UUID PK, `program_type`, `program_id`, `program_title`, `program_level`, `amount_inr` (paise), `full_name`/`email`/`phone`, `razorpay_order_id`/`razorpay_payment_id`, `status` (created/paid/failed/abandoned), `paid_at`, `failure_reason`, `metadata` jsonb. RLS locked, indexes on lookup columns.
- Amount columns added (non-destructively): `addiction_programs.cost_inr`, `training_programs.fee_inr`, and per-level `price_inr` inside existing `levels` jsonb.
- Seed UPDATEs are guarded so admin edits via the dashboard are never overwritten.
- Migration is fully idempotent (all `ADD COLUMN IF NOT EXISTS`, all seeds guarded on `= 0` / jsonb shape match).

### Phase 2 — Netlify Functions (`netlify/functions/`)
- `_shared/razorpay.mjs` — `createRazorpayOrder`, `verifyWebhookSignature` (timing-safe), `verifyCheckoutSignature`. Pure fetch + `node:crypto`, no SDK.
- `_shared/emails.mjs` — `buildEnrollmentConfirmationEmail`, `buildAdminAlertEmail`, `sendEmail` (Resend REST API). Brand-consistent HTML templates.
- `create-order.mjs` (public, rate-limited) — validates input, **resolves amount server-side from DB**, pre-generates enrollment UUID, creates Razorpay order, inserts row with `status='created'`. Client cannot influence price.
- `razorpay-webhook.mjs` (public, signature-verified) — HMAC-SHA256 verification, idempotent, handles `payment.captured` + `payment.failed`, sends both emails in parallel, writes `ENROLLMENT_PAID`/`ENROLLMENT_FAILED` to `admin_audit_log`.
- `enrollment-status.mjs` (public, UUID-gated) — minimal fields for `/enrollment-success` polling.
- `admin-enrollments.mjs` (JWT-gated) — GET list with filters + pagination, GET `?format=csv` export (10k row cap, safe ILIKE escaping), PATCH for manual status/notes corrections, audit-logged.

### Phase 3 — Frontend
- `lib/enrollment.ts` — client API (`createOrder`, `fetchEnrollmentStatus`) + idempotent Razorpay Checkout script loader + `openRazorpayCheckout` helper.
- `components/EnrollmentModal.tsx` — reusable modal: name/email/phone form with matched client+server validation, Escape/backdrop dismiss, body scroll lock, focus management, responsive bottom-sheet on mobile → centered modal on desktop.
- `app/training/page.tsx` — replaced each `Book now` anchor with per-level **Enroll** buttons (internships) and single **Enroll now** (traineeships). Modal mounted at page root.
- `app/addiction/page.tsx` — added **Enroll now** button per program card (only for programs with a real DB `id`; hardcoded fallbacks skipped).
- `app/enrollment-success/page.tsx` + `layout.tsx` — polls status every 2 s for 15 attempts (~30 s), four states (processing / paid / failed / timeout), `robots: noindex`.
- `public/_headers` CSP extended for `checkout.razorpay.com`, `api.razorpay.com`, `lumberjack.razorpay.com`.
- `netlify.toml` added `/api/*` → `/.netlify/functions/*` redirects.

### Phase 4 — Admin Dashboard
- `lib/enrollments-admin.ts` — typed client for `admin-enrollments`: `fetchEnrollments`, `updateEnrollment`, `downloadEnrollmentsCsv`. 401 → `UnauthorizedError` for auto-logout.
- `components/admin/EnrollmentsTab.tsx` — full management UI:
  - Labelled filter bar: search (debounced 350 ms), status, program type, **From date / To date** with cross-referenced `min`/`max`, Clear filters button (shown only when filters active)
  - Table on `md:+`, card list below `md:`, 25/page pagination, auto-refresh every 30 s while visible, manual Refresh button, CSV Export (respects filters)
  - Detail drawer: customer mailto/tel links, one-click-copy payment IDs, status dropdown + internal notes (stored in `metadata.admin_notes`), Save disabled until changes exist
- `app/admin/page.tsx` — added `Receipt`-iconed **Enrollments** third tab with live count badge.

### Responsive polish
- Admin top header, tab bar, all three heading bars, and the Enrollments table/filter bar all laid out for mobile / tablet / desktop breakpoints.
- Tab bar horizontally scrolls on mobile with shortened labels ("Addiction (4)" vs "Addiction Programs (4)").
- Filter bar inputs now each have uppercase labels (Search / Status / Program type / From date / To date) — fixed UX issue where the two date pickers were unlabeled.

### Key design decisions
- **Server-side amount resolution** — amount is never trusted from client input; looked up inside `create-order` from `cost_inr`/`fee_inr`/`levels[].price_inr`. Tampering the request body can only produce a 400 response.
- **UUID as Razorpay receipt** — we pre-generate the enrollment UUID via `crypto.randomUUID()` so it can be passed as the Razorpay `receipt` (< 40 chars). The webhook then looks up the row by `razorpay_order_id` and has all context it needs.
- **No SDKs on server** — Razorpay + Resend both accessed via `fetch`. Keeps cold start fast and dependencies minimal.
- **Idempotent webhook** — duplicate `payment.captured` deliveries return 200 without re-sending emails or re-running audit writes (guarded by checking `status === 'paid' && razorpay_payment_id === payment.id`).
- **Email failure doesn't 500 the webhook** — Resend errors are persisted into `enrollments.metadata` for diagnostics, but the webhook still returns 200 so Razorpay does not retry indefinitely.
- **UUID obscurity for status polling** — `/enrollment-status` is public but only accepts valid UUIDs. With 128-bit entropy and no listing endpoint, there's no practical enumeration attack; the UUID is only ever handed to the paying user via the Razorpay handler redirect.

### New docs
- `docs/razorpay-booking.md` — 450-line technical reference: schema, function-by-function breakdown, frontend wiring, env vars, CSP, flow diagram, operational runbook.
- `docs/readme.md` — tech stack + project structure updated to mention Razorpay and new docs.

---

## Session — April 24, 2026 · Security Audit & Fixes

### Objective
Perform a comprehensive security audit of the entire Hope Trust India website and fix all critical and high-severity vulnerabilities identified.

### Audit Scope
Full-stack audit covering:
1. Netlify Functions (auth, input validation, injection)
2. RLS policies & DB security
3. CSP headers, CORS, `netlify.toml`
4. Client-side code (XSS, secrets, token handling)
5. Environment variables & secret exposure
6. Razorpay payment flow
7. Email & newsletter security

### Vulnerabilities Found & Fixed

#### CRITICAL

| # | Issue | Fix | File(s) |
|---|---|---|---|
| 1 | `.env` in git history | Verified clean — `git log --all -- .env` returned empty | N/A |
| 2 | Newsletter edge function had **no authentication** — anyone could trigger mass emails to all subscribers | Added Bearer token auth using `SUPABASE_SERVICE_ROLE_KEY`; requests without valid token get 401 | `supabase/functions/send-newsletter/index.ts` |
| 3 | Newsletter **HTML injection** — `customMessage`, post titles, excerpts, URLs, and image URLs were interpolated raw into HTML | Added `esc()` helper that escapes `& < > " '`; applied to all user-supplied interpolations in `buildNewsletterHtml` | `supabase/functions/send-newsletter/index.ts` |

#### HIGH

| # | Issue | Fix | File(s) |
|---|---|---|---|
| 4 | No UUID validation on **DELETE** `id` param in admin programs | Added UUID regex check — invalid IDs return 400 | `netlify/functions/admin-programs.mjs` |
| 5 | No UUID validation on **PUT** `id` body field in admin programs | Added UUID regex check — invalid IDs return 400 | `netlify/functions/admin-programs.mjs` |
| 6 | No UUID validation on **DELETE/PUT** in admin training programs | Added UUID regex check to both endpoints | `netlify/functions/admin-training-programs.mjs` |
| 7 | Login response **leaked attempt count** ("3 attempts remaining before lockout") — aids brute-force timing | Changed to generic `"Invalid credentials"` message; attempt count still logged server-side in audit log | `netlify/functions/admin-login.mjs` |
| 8 | Public enrollment status endpoint **leaked Razorpay IDs** (`razorpay_payment_id`, `razorpay_order_id`) | Removed both fields from DB query, API response, TypeScript interface, and success page UI | `netlify/functions/enrollment-status.mjs`, `lib/enrollment.ts`, `app/enrollment-success/page.tsx` |
| 9 | `Permissions-Policy: payment=()` **blocked Razorpay Checkout** Payment Request API | Changed to `payment=(self "https://checkout.razorpay.com")` | `netlify.toml` |

#### LOW (cosmetic / dev-only)

| # | Issue | Fix | File(s) |
|---|---|---|---|
| 10 | React hydration warnings from browser extension injecting `fdprocessedid` on buttons | Added `suppressHydrationWarning` to affected buttons | `components/WhatsAppButton.tsx`, `components/HeroSection.tsx` |

### Remaining Audit Findings (not yet fixed)

| Severity | Issue | Notes |
|---|---|---|
| HIGH | Initial SQL RLS policies too permissive | Needs careful review — no data at risk currently |
| HIGH | CRM function ignores body / no size limit | `whatsapp-crm.mjs` forwards empty `{}` body — may be intentional |
| MEDIUM | `sanitize-html` allows iframes from any `src` | Blog content is author-controlled MDX, low risk |
| MEDIUM | `'unsafe-inline'` in CSP for `script-src` and `style-src` | Required by Next.js static export + inline styles |
| LOW | `enrollment-status.mjs` has no rate limiting | UUID entropy provides sufficient protection |
| INFO | Newsletter template exists in two places | `lib/newsletter-template.ts` vs inline in edge function |

### Payment Integration Testing
- Verified Razorpay test mode flow end-to-end in Chrome
- Order creation, Checkout popup, test card payment (`4111 1111 1111 1111`), enrollment status polling all working
- Webhook-based status update requires deployment with `RAZORPAY_WEBHOOK_SECRET`
- Edge browser has popup redirect issues with Razorpay test mode (Chrome works fine)

### Key Design Decisions
- **Generic login errors** — never reveal whether the email exists or how many attempts remain. Audit log retains full detail server-side for incident response
- **No Razorpay IDs in public API** — users see only their enrollment reference UUID; Razorpay payment/order IDs accessible only via JWT-gated admin dashboard
- **Newsletter auth via service_role key** — simplest secure approach; no additional secrets needed since the key already exists in the edge function environment

---

## Session — May 1, 2026 · Disable Payment & Newsletter Features

### Objective
Temporarily disable all payment/enrollment (Razorpay) and newsletter signup UI across the site, preserving all backend code for future re-enablement.

### Payment / Enrollment — Changes Made

#### `app/training/page.tsx`
- Commented out `EnrollmentModal` import, `EnrollTarget` interface, `enrollTarget` state
- Commented out Enroll buttons in internship level rows and traineeship cards
- Commented out `<EnrollmentModal />` component at page root

#### `app/addiction/page.tsx`
- Commented out `EnrollmentModal` import, `EnrollTarget` interface, `enrollTarget` state
- Commented out "Enroll now" buttons in program cards
- Commented out `<EnrollmentModal />` component at page root

#### `app/arel-ops/page.tsx` (Admin dashboard)
- Commented out `EnrollmentsTab` import and `Receipt` icon import
- Commented out `enrollmentCount` state
- Commented out Enrollments tab button and tab content panel
- Narrowed `activeTab` type to `'addiction' | 'training'`

#### `app/enrollment-success/page.tsx`
- Replaced entire page with a `useEffect` redirect to `/`
- Original implementation available in git history

#### `netlify.toml`
- Commented out 4 payment-related redirect rules (`create-order`, `razorpay-webhook`, `enrollment-status`, `admin-enrollments`)
- Removed Razorpay from `Permissions-Policy` (`payment=()` instead of `payment=(self "https://checkout.razorpay.com")`)

#### `public/_headers`
- Removed Razorpay domains from CSP (`checkout.razorpay.com`, `api.razorpay.com`, `lumberjack.razorpay.com`)
- Original CSP preserved in a comment for future restoration

### Newsletter — Changes Made

#### `app/page.tsx`
- Commented out `LargeRectangleSection` dynamic import and `<LargeRectangleSection />` usage (entire section is a newsletter signup card)

#### `components/LargeRectangleSection.tsx`
- Commented out `NewsletterForm` import and the form element (component itself still exists but form is removed)

#### `components/BlogListClient.tsx`
- Commented out `NewsletterForm` import and the full "Newsletter CTA" section at top of blog listing

#### `components/Footer.tsx`
- Commented out "Subscribe to our newsletter" CTA button

### What was NOT changed (preserved for re-enablement)
- All Netlify Functions (`create-order.mjs`, `razorpay-webhook.mjs`, `enrollment-status.mjs`, `admin-enrollments.mjs`)
- All lib modules (`lib/enrollment.ts`, `lib/enrollments-admin.ts`, `lib/newsletter-template.ts`)
- Components (`components/EnrollmentModal.tsx`, `components/admin/EnrollmentsTab.tsx`, `components/NewsletterForm.tsx`)
- Supabase Edge Function (`supabase/functions/send-newsletter/`)
- Database tables, RLS policies, and seed data

### Verification
- `npx tsc --noEmit` — zero TypeScript errors after all changes

### Comment markers
- All payment comments tagged `PAYMENT DISABLED`
- All newsletter comments tagged `NEWSLETTER DISABLED`
- Easy to find and revert with `grep -r "PAYMENT DISABLED"` and `grep -r "NEWSLETTER DISABLED"`

### Docs updated
- `docs/readme.md` — marked Razorpay and Resend as *currently disabled*
- `docs/claude.md` — added "Disabled Features (as of May 2026)" section with full inventory and re-enablement steps; updated routes table, data flow diagram, security headers description, and last-updated date
- `docs/razorpay-booking.md` — added prominent disabled notice at top
- `docs/session.md` — this entry

---

*Last updated: May 1, 2026*
*Sessions: April 7 (initial) · April 19 ×7 (docs corrections, rate limiting, 401 auto-logout, token expiry check, input limits, audit log) · April 20 (training CRUD, responsive training page, URL refactor, SEO) · April 22 (Razorpay booking system — 4 phases: schema, functions, frontend, admin) · April 24 (security audit & fixes — 10 vulnerabilities patched) · May 1 (payment & newsletter features disabled)*
