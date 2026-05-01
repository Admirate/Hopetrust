# Hope Trust India

A modern mental health & addiction recovery clinic website for [Hope Trust](https://hopetrustindia.com), Hyderabad, India.

## Tech Stack

- **Next.js 15** (App Router, static export)
- **TypeScript** + **TailwindCSS** + **shadcn/ui**
- **Supabase** (PostgreSQL + Storage)
- **Netlify** (hosting + serverless functions)
- **Resend** (enrollment emails + newsletter — *currently disabled*)
- **Razorpay** (training + addiction program booking/payments — *currently disabled*)

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

## Project Structure

```
app/                → Next.js pages (13+ routes)
components/         → React components (custom + shadcn/ui)
lib/                → Utilities (Supabase client, blog, config, assets)
hooks/              → Custom React hooks
content/blogs/      → ~395 MDX blog posts
Database/           → SQL schema & RLS policies
netlify/functions/  → Netlify serverless functions
supabase/functions/ → Supabase Edge Functions
scripts/            → Build & migration scripts
docs/               → Project documentation
                       ├─ razorpay-booking.md  (enrollment + payment system — currently disabled)
                       ├─ claude.md            (full project reference)
                       └─ session.md           (dev session log)

## Testing

```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

## Deployment

Deployed automatically on Netlify via git push. Build command: `npm run build` (runs `next build` + sitemap generation). Output directory: `out/`.
