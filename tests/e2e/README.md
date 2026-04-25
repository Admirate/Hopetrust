# E2E Tests

End-to-end tests using Playwright.

## Setup

```bash
npm install -D @playwright/test
npx playwright install
```

## Running

```bash
npx playwright test
```

## Structure

- `smoke.spec.ts` — Basic page load & navigation smoke tests
- `enrollment.spec.ts` — Razorpay enrollment flow (test mode)
- `admin.spec.ts` — Admin login & dashboard tests
- `contact.spec.ts` — Contact form submission
