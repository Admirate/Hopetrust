# Hope Trust India

A modern mental health & addiction recovery clinic website for [Hope Trust](https://hopetrustindia.com), Hyderabad, India.

## Tech Stack

- **Next.js 15** (App Router, static export)
- **TypeScript** + **TailwindCSS** + **shadcn/ui**
- **Supabase** (PostgreSQL + Storage)
- **Netlify** (hosting + serverless functions)
- **Resend** (newsletter emails)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Start with Netlify Functions
npm run dev:netlify

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=https://hopetrustindia.com
NEXT_PUBLIC_WHATSAPP_NUMBER=<whatsapp-number>
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=<google-maps-embed-url>

# Server-side only (Netlify / Supabase Edge Functions)
CRM_ENDPOINT=<crm-api-url>
WHATSAPP_CRM_TOKEN=<crm-bearer-token>
RESEND_API_KEY=<resend-api-key>
NEWSLETTER_FROM_EMAIL=Hope Trust <newsletter@hopetrustindia.com>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
```

## Project Structure

```
app/                → Next.js pages (9 routes)
components/         → React components (custom + shadcn/ui)
lib/                → Utilities (Supabase client, blog, config, assets)
hooks/              → Custom React hooks
content/blogs/      → ~395 MDX blog posts
Database/           → SQL schema & RLS policies
netlify/functions/  → Netlify serverless functions
supabase/functions/ → Supabase Edge Functions
scripts/            → Build & migration scripts
docs/               → Project documentation
```

## Key Features

- **Doctor Directory** — filterable therapist listing from Supabase
- **Blog** — ~395 MDX posts with categories, tags, and SEO
- **Contact & Join Us Forms** — Zod-validated, dual-submit to Supabase + Netlify Forms
- **Newsletter** — signup form + bulk email via Supabase Edge Function + Resend
- **WhatsApp CRM** — server-side proxy to external CRM API
- **Animations** — Framer Motion, scroll-triggered effects, smooth scrolling (Lenis)

## Database

4 Supabase tables with Row Level Security:

| Table                      | Purpose                    |
| -------------------------- | -------------------------- |
| `doctors`                  | Therapist directory        |
| `contact_submissions`      | Contact form entries       |
| `joinus_applications`      | Job applications + CV link |
| `newsletter_subscribers`   | Newsletter signups         |

Run the SQL files in `Database/` to set up tables and policies.

## Testing

```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

## Deployment

Deployed automatically on Netlify via git push. Build command: `npm run build` (runs `next build` + sitemap generation). Output directory: `out/`.

## Documentation

- [`docs/claude.md`](./claude.md) — Full architecture reference
- [`docs/session.md`](./session.md) — Codebase exploration session log
