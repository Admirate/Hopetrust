# Razorpay Program Booking System

> **⚠️ CURRENTLY DISABLED (May 2026)**
> All payment/enrollment UI is commented out across the site. The backend
> (Netlify Functions, database tables, lib modules, components) is **untouched**
> and ready to re-enable. See `docs/claude.md` → "Disabled Features" for the
> full list of changes and re-enablement steps. Search for `PAYMENT DISABLED`
> in the codebase.

End-to-end online enrollment + payment flow for Hope Trust training and
addiction programs. Built April 22, 2026.

---

## 1. Overview

Visitors browsing `/training/` or `/addiction/` can click **Enroll** on any
program (or specific training level), fill a short form, pay via Razorpay
Checkout, and land on `/enrollment-success/` which waits for webhook
confirmation. A branded confirmation email goes to the customer and an alert
email goes to the Hope Trust front office. Admins view, filter, and export
all enrollments from the `/admin/` dashboard.

### Design principles

- **Server-side price resolution** — amounts are *always* looked up in the
  database inside Netlify Functions. The client cannot influence the price.
- **Idempotent webhooks** — duplicate deliveries are safe; only the first
  `payment.captured` event transitions the row to `paid`.
- **Idempotency key** — `create-order` accepts an `Idempotency-Key` header;
  retries with the same key return the cached enrollment instead of creating
  duplicates. The client sends `crypto.randomUUID()` per call.
- **Signature verification** — Razorpay webhooks verified via HMAC-SHA256
  with constant-time comparison (`crypto.timingSafeEqual`).
- **Rate limiting** — DB-backed per-IP (10/15 min) and per-email (5/15 min)
  throttles on `create-order`. Queries the `enrollments` table directly.
- **Duplicate order guard** — if the same email already has a `created`
  order for the same program within 30 minutes, the existing order is
  returned instead of spawning a new Razorpay order.
- **Request size limits** — `create-order` rejects bodies > 4 KB (413);
  webhook rejects bodies > 64 KB. Both check `Content-Length` *and* actual
  body length.
- **IP trust** — client IP is forwarded to Razorpay in `order.notes.ip` for
  fraud scoring and stored in enrollment `metadata.ip` for rate limiting.
- **Zero new dependencies on server** — helpers use `node:crypto` + `fetch`;
  no `razorpay` or `resend` SDKs.
- **Defence in depth** — CORS locked to production origin, JWT on admin
  endpoints, UUID regex validation on every id parameter, ILIKE escaping.

---

## 2. Data Model

### `enrollments` table (new)

See `Database/enrollments.sql` for the full migration. Key columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Generated client-side by `create-order` (`crypto.randomUUID()`) so it can be used as the Razorpay `receipt` before insert |
| `program_type` | `text` | `'training'` or `'addiction'` |
| `program_id` | `uuid` | FK-like reference to `training_programs.id` / `addiction_programs.id` (not a hard FK — programs can be deactivated without deleting enrollments) |
| `program_title` | `text` | Snapshot of title at booking time |
| `program_level` | `text` | Optional — training levels only |
| `amount_inr` | `integer` | **Paise**, not rupees. Authoritative. |
| `full_name`, `email`, `phone` | `text` | Customer details |
| `razorpay_order_id`, `razorpay_payment_id` | `text` | Populated across the flow |
| `status` | `text` | `created` → `paid` / `failed` / `abandoned` |
| `paid_at`, `failure_reason` | — | Set by webhook |
| `metadata` | `jsonb` | IP, user agent, idempotency key, webhook event, admin notes, email send results |

Indexes on `status`, `program_id`, `email`, `razorpay_order_id`,
`razorpay_payment_id`, `created_at DESC`. RLS enabled with no public policies
— all access flows through Netlify Functions using the service role key.

### Existing program tables — new columns

`Database/enrollments.sql` adds two authoritative-amount columns:

- `addiction_programs.cost_inr` (paise) — single price per program
- `training_programs.fee_inr` (paise) — single price (traineeships)
- `training_programs.levels[*].price_inr` (paise) — per-level price inside the
  existing `levels` jsonb array

Seed UPDATEs are guarded so admin edits are never overwritten.

### Audit log reuse

The existing `admin_audit_log` table now also records:
- `ENROLLMENT_PAID` — written by the webhook when a payment succeeds
- `ENROLLMENT_FAILED` — written by the webhook on payment failure
- `ENROLLMENT_UPDATED` — written when an admin patches a row

---

## 3. Netlify Functions

All live under `netlify/functions/`.

### `_shared/razorpay.mjs`

Pure-fetch helpers — no SDK:
- `createRazorpayOrder({ amount, receipt, notes })` → POSTs to `/v1/orders` with Basic auth
- `verifyWebhookSignature(rawBody, signature)` → HMAC-SHA256 with `RAZORPAY_WEBHOOK_SECRET`
- `verifyCheckoutSignature({ orderId, paymentId, signature })` → HMAC-SHA256 with `RAZORPAY_KEY_SECRET` (reserved for future client-side verification path)

### `_shared/emails.mjs`

- `buildEnrollmentConfirmationEmail(...)` → returns `{ subject, html, text }` for the customer receipt. Uses Hope Trust brand colours (`#00373E`, `#ED7428`, `#F9E6D0`) with a responsive email-safe layout.
- `buildAdminAlertEmail(...)` → compact internal alert with all customer + payment details and a link to `/admin`.
- `sendEmail({ to, subject, html, text, from, replyTo })` → POSTs to Resend REST API (`https://api.resend.com/emails`). Never throws; returns `{ ok, id?, error? }`.
- `formatINR(paise)` → INR display helper (`₹26,500`).

### `create-order.mjs` (public, rate-limited)

`POST /api/create-order`

Headers (optional):
- `Idempotency-Key: <uuid>` — if provided, a repeat request with the same
  key returns the previously created enrollment instead of creating a new one.
  The client (`lib/enrollment.ts`) sends `crypto.randomUUID()` by default.

Input (JSON, max **4 KB**):
```json
{
  "program_type": "training" | "addiction",
  "program_id": "<uuid>",
  "level_index": 0,               // training multi-level only
  "full_name": "...",
  "email": "...",
  "phone": "..."
}
```

Flow:
1. **Request size limit** — reject if `Content-Length` or actual body > 4 096 bytes (HTTP 413).
2. Validate input (regex + length caps on name/email/phone, UUID regex on program_id).
3. Extract IP (`x-forwarded-for` / `x-nf-client-connection-ip`), user-agent, and `Idempotency-Key` header.
4. **Idempotency check** — if `Idempotency-Key` was sent, query `enrollments` where `metadata->>idempotency_key` matches. If found, return the cached checkout payload.
5. **IP rate limit** — count enrollments from the same IP in the last 15 minutes. If ≥ 10 → HTTP 429.
6. **Email rate limit** — count enrollments from the same email in the last 15 minutes. If ≥ 5 → HTTP 429.
7. **Duplicate order guard** — if the same email already has a `status='created'` enrollment for the same `program_id` within 30 minutes, return that existing order (with `_reused: true`) instead of creating a new one.
8. **Resolve amount server-side** from the correct program table:
   - `addiction_programs.cost_inr`
   - `training_programs.fee_inr` (single-fee) or `levels[level_index].price_inr` (multi-level)
9. Pre-generate `enrollment_id = crypto.randomUUID()` so it can be the Razorpay `receipt`.
10. Call Razorpay `/orders` API → get `order_id`. IP is included in `notes.ip` for Razorpay fraud signals.
11. Insert an `enrollments` row with `status='created'`, `razorpay_order_id`, `amount_inr`, and metadata `{ ip, user_agent, idempotency_key? }`.
12. Return:
   ```json
   {
     "enrollment_id": "...",
     "order_id": "order_...",
     "amount": 265000,
     "currency": "INR",
     "key_id": "rzp_test_...",
     "program_title": "...",
     "program_level": "Level 1 — 10 hours" | null,
     "prefill": { "name": "...", "email": "...", "contact": "..." },
     "_reused": false           // true when duplicate guard or idempotency cache hit
   }
   ```

#### Abuse prevention constants

| Constant | Value | Purpose |
| --- | --- | --- |
| `MAX_BODY_BYTES` | 4 096 | Request body size cap |
| `RATE_WINDOW_MS` | 15 min | Sliding window for rate limiting |
| `MAX_ORDERS_PER_IP` | 10 | Max orders per IP in the window |
| `MAX_ORDERS_PER_EMAIL` | 5 | Max orders per email in the window |
| `DUPLICATE_WINDOW_MS` | 30 min | Reuse existing `created` order within this window |

### `razorpay-webhook.mjs` (public, signature-verified)

`POST /api/razorpay-webhook`

1. **Request size limit** — reject if `Content-Length` or actual body > 64 KB (HTTP 413).
2. Read raw body as text (required for HMAC).
3. Verify `X-Razorpay-Signature` with `verifyWebhookSignature` — reject `400` if invalid.
4. Extract `payload.payment.entity` — ignore unrelated events (200 + `ignored`).
5. Look up `enrollments` by `razorpay_order_id`.
6. **Idempotency check** — if already `paid` with the same `payment_id`, return 200.
7. On `payment.captured`:
   - Update `status='paid'`, `razorpay_payment_id`, `paid_at=now()`, merge metadata.
   - Write `ENROLLMENT_PAID` to `admin_audit_log`.
   - Send customer email (Resend) + admin alert email in parallel.
   - If either email fails, persist the Resend error into `metadata` but still return 200 (Razorpay would otherwise keep retrying).
8. On `payment.failed`:
   - Update `status='failed'`, `failure_reason`, metadata error details.
   - Write `ENROLLMENT_FAILED` audit entry.
9. Return `200 ok`.

### `enrollment-status.mjs` (public)

`GET /api/enrollment-status?id=<uuid>`

- UUID regex validation.
- Returns minimal non-sensitive fields: `{ id, status, program_title, program_level, amount_inr, payment_id, order_id, paid_at }`.
- `Cache-Control: no-store`.
- Used only by `/enrollment-success/` polling — safe by UUID obscurity (128-bit, only handed to the paying user).

### `admin-enrollments.mjs` (JWT-gated)

- `GET /api/admin-enrollments?status=&program_type=&program_id=&from=&to=&q=&limit=&offset=` — paginated list with filters + total count
- `GET /api/admin-enrollments?format=csv&...filters` — CSV export (max 10 000 rows, `Content-Disposition: attachment`)
- `PATCH /api/admin-enrollments?id=<uuid>` — body `{ status?, notes? }`, writes `ENROLLMENT_UPDATED` audit log
- Search query escapes `%` and `_` for ILIKE safety
- All responses gated on `verifyToken(req)` using `ADMIN_JWT_SECRET`

---

## 4. Frontend

### `lib/enrollment.ts` (client API + Razorpay loader)

- `createOrder(input)` → POST `/api/create-order` (sends `Idempotency-Key: <uuid>` header)
- `fetchEnrollmentStatus(id)` → GET `/api/enrollment-status`
- `loadRazorpayCheckout()` → idempotent script injection of `https://checkout.razorpay.com/v1/checkout.js`
- `openRazorpayCheckout(options)` → await script load then `new window.Razorpay(options).open()`
- `formatINR(paise)`

### `lib/enrollments-admin.ts` (admin API wrapper)

- `fetchEnrollments(token, filters)` → list
- `updateEnrollment(token, id, patch)` → PATCH
- `downloadEnrollmentsCsv(token, filters)` → triggers browser download via blob + anchor
- `UnauthorizedError` — thrown on 401 for auto-logout

### `components/EnrollmentModal.tsx`

Reusable modal used by both `/training/` and `/addiction/`:
- Inputs: full name / email / phone (with regex validation + length caps matching server)
- Program summary block (title, level, price display)
- On submit:
  1. `createOrder(...)`
  2. `openRazorpayCheckout({ key, order_id, amount, prefill, notes: { enrollment_id }, theme, handler, modal.ondismiss })`
  3. `handler` → `window.location.href = /enrollment-success/?id=<uuid>`
  4. `ondismiss` → stay on modal so the user can retry
- Features: Escape to close, backdrop click to close (disabled while submitting), body scroll lock, auto-focus first input, responsive bottom-sheet on mobile / centered modal on desktop.

### `app/training/page.tsx` wiring

- Adds `EnrollTarget` state: `{ programId, programTitle, levelIndex?, levelLabel?, priceDisplay? }`
- Internship cards: per-level row becomes a `flex` row with an **Enroll** button next to each level pill — each opens the modal with that level pre-selected.
- Traineeship cards: single **Enroll now** button passing `priceDisplay = tp.fee`.

### `app/addiction/page.tsx` wiring

- Each program card gets an **Enroll now** button below the cost line — only rendered for programs loaded from Supabase (have a real `id`). Hardcoded fallback programs deliberately have no button so we never attempt to book something without a matching DB row.

### `app/enrollment-success/page.tsx`

- Reads `?id=<uuid>` client-side (static-export compatible).
- Polls `/api/enrollment-status` every 2 s for up to 15 attempts (~30 s).
- Renders 4 states: processing (spinner), paid (green check + payment details), failed (red alert), timeout (friendly "still processing, email will arrive" message).
- `metadata.robots = { index: false, follow: false }` so the page is never indexed.
- Uses brand-consistent styling with `@/lib/config.siteConfig.contact.email` for contact CTA.

### `app/admin/page.tsx` — Enrollments tab

New third tab using `components/admin/EnrollmentsTab.tsx`.

Filter bar (labelled):
- Search (debounced 350 ms; matches name / email / phone / order_id / payment_id)
- Status: all / Paid / Awaiting / Failed / Abandoned
- Program type: all / Training / Addiction
- From date / To date (with `min`/`max` cross-references)
- Clear-filters button (appears only when any filter is active)

Table (desktop) / card list (below `md:`):
- Created (IST), Name + email, Program + level, Type badge, Amount (INR), Status pill, View button
- Mobile: each row is a full-width tappable card
- Pagination: 25/page, Prev / Next
- Auto-refreshes silently every 30 s while the tab is visible
- Manual Refresh + Export CSV buttons honour current filters

Detail drawer (slides in from right):
- Customer section: mailto / tel links
- Payment section: Order ID / Payment ID / Enrollment ID — each one-click copyable with a visual tick
- Timestamps (Created, Paid at, Failure reason)
- Admin actions: status dropdown + internal notes (stored in `metadata.admin_notes`, max 2000 chars)
- Save button is disabled until something actually changed
- Escape + backdrop close, body scroll locked

---

## 5. Security Headers & Redirects

`public/_headers` CSP extended for Razorpay:
- `script-src` += `https://checkout.razorpay.com`
- `connect-src` += `https://api.razorpay.com https://lumberjack.razorpay.com`
- `frame-src` += `https://api.razorpay.com https://checkout.razorpay.com`

`netlify.toml` redirects added so the frontend can use friendly paths:
- `/api/create-order` → `/.netlify/functions/create-order`
- `/api/razorpay-webhook` → `/.netlify/functions/razorpay-webhook`
- `/api/enrollment-status` → `/.netlify/functions/enrollment-status`
- `/api/admin-enrollments` → `/.netlify/functions/admin-enrollments`

---

## 6. Environment Variables

Added in `.env.example`. Set in Netlify → Site settings → Environment variables.

| Variable | Where used | Notes |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | create-order | Dashboard → Keys. Start with test keys. |
| `RAZORPAY_KEY_SECRET` | create-order, webhook | Never expose to client. |
| `RAZORPAY_WEBHOOK_SECRET` | webhook | Any strong string you set when creating the webhook in Razorpay Dashboard. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | client (EnrollmentModal via order response) | Mirror of `RAZORPAY_KEY_ID` — safe to expose. Actually the server returns `key_id` inline so the client env var is optional; keep it set for clarity. |
| `NEWSLETTER_FROM_EMAIL` | emails.mjs | Verified Resend domain. Format: `Hope Trust <frontoffice@hopetrustindia.com>` |
| `ADMIN_ALERT_EMAIL` | webhook | Falls back to `NEWSLETTER_FROM_EMAIL` if unset. |
| `RESEND_API_KEY` | emails.mjs | Already configured for the newsletter flow. |

---

## 7. End-to-End Flow (Happy Path)

```
┌─────────────┐    click Enroll    ┌─────────────────────┐
│  /training  ├──────────────────►│   EnrollmentModal    │
└─────────────┘                    └──────────┬──────────┘
                                              │ POST /api/create-order
                                              ▼
                                   ┌─────────────────────┐
                                   │   create-order.mjs   │
                                   │  • resolve amount    │
                                   │  • Razorpay /orders  │
                                   │  • insert enrollment │
                                   └──────────┬──────────┘
                                              │ order_id, key_id
                                              ▼
                                   ┌─────────────────────┐
                                   │  Razorpay Checkout  │
                                   │  (iframe overlay)   │
                                   └──────────┬──────────┘
                                              │ payment captured
                                              │
                    ┌─────────────────────────┼─────────────────────┐
                    │                         │                     │
                    ▼                         ▼                     ▼
        ┌────────────────────┐   ┌────────────────────┐   ┌─────────────────────┐
        │  handler() client  │   │ webhook (async)    │   │ user lands on       │
        │  redirect          │   │ • verify signature │   │ /enrollment-success │
        └─────────┬──────────┘   │ • status=paid      │   │ polls status every  │
                  │              │ • send emails      │   │ 2 s                 │
                  ▼              │ • audit log        │   │                     │
        /enrollment-success/     └─────────┬──────────┘   └──────────┬──────────┘
               ?id=<uuid>                  │                         │
                                           ▼                         ▼
                                   ┌────────────────────────────────────┐
                                   │ Customer + admin emails delivered  │
                                   │ Row visible in /admin Enrollments  │
                                   └────────────────────────────────────┘
```

---

## 8. Operational Runbook

### Initial setup

1. Run `Database/enrollments.sql` in Supabase Dashboard → SQL Editor.
2. In Netlify, set all env vars from section 6.
3. In Razorpay Dashboard → Settings → Webhooks:
   - URL: `https://hopetrustindia.com/api/razorpay-webhook`
   - Secret: value you put in `RAZORPAY_WEBHOOK_SECRET`
   - Events: `payment.captured`, `payment.failed`
4. In the admin dashboard, set `cost_inr` / `fee_inr` / `levels[].price_inr`
   for each program you want bookable. Any program with `0` will be rejected
   by `create-order`.

### Testing (Razorpay Test Mode)

- Test card: `4111 1111 1111 1111`, any future expiry, any CVV, any OTP.
- Each successful test payment produces a real row in `enrollments` with
  `status='paid'`. Clean up via the admin dashboard or Supabase if needed.

### When the webhook fails to fire

- `/enrollment-success/` will stop polling after ~30 s and show a friendly
  "still processing" message. The customer's card is not charged twice.
- Payment already captured by Razorpay can be reconciled manually from the
  admin dashboard — use the drawer's status dropdown to set `paid` and
  optionally copy the payment ID from Razorpay Dashboard into notes.

### When an admin needs to refund

- Issue the refund in the Razorpay Dashboard.
- In Hope Trust admin, open the enrollment, set status to `abandoned` and
  add an internal note. (We deliberately do not expose Razorpay refund
  controls from our admin UI — refunds stay a Razorpay Dashboard action.)

### Email deliverability

- Customer confirmations are sent from `NEWSLETTER_FROM_EMAIL` via Resend.
- Admin alerts go to `ADMIN_ALERT_EMAIL`.
- If Resend fails, the webhook persists the error details into
  `enrollments.metadata.email_user` / `email_admin` for diagnostics but
  still returns 200 to Razorpay.

---

## 9. File Index

| Path | Purpose |
| --- | --- |
| `Database/enrollments.sql` | Schema migration (idempotent) |
| `netlify/functions/_shared/razorpay.mjs` | REST helpers + signature verification |
| `netlify/functions/_shared/emails.mjs` | Branded email templates + Resend wrapper |
| `netlify/functions/create-order.mjs` | Public: create Razorpay order + enrollment row |
| `netlify/functions/razorpay-webhook.mjs` | Public: signature-verified webhook handler |
| `netlify/functions/enrollment-status.mjs` | Public: UUID-gated status polling |
| `netlify/functions/admin-enrollments.mjs` | JWT-gated: list / CSV / PATCH |
| `lib/enrollment.ts` | Client API + Razorpay script loader |
| `lib/enrollments-admin.ts` | Admin client API |
| `components/EnrollmentModal.tsx` | Public enrollment modal |
| `components/admin/EnrollmentsTab.tsx` | Admin dashboard tab |
| `app/enrollment-success/page.tsx` | Post-payment polling page |
| `app/enrollment-success/layout.tsx` | `noindex` metadata |
| `app/training/page.tsx` | Wired Enroll buttons |
| `app/addiction/page.tsx` | Wired Enroll buttons |
| `app/admin/page.tsx` | New Enrollments tab |
| `.env.example` | Razorpay + email env vars |
| `netlify.toml` | `/api/*` → `/.netlify/functions/*` redirects |
| `public/_headers` | CSP extended for Razorpay |
