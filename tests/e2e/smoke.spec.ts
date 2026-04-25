import { test, expect } from '@playwright/test';

test.describe('Smoke tests — pages load', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Hope Trust/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('mental health page loads', async ({ page }) => {
    await page.goto('/mental-health/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('addiction page loads', async ({ page }) => {
    await page.goto('/addiction/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('training page loads', async ({ page }) => {
    await page.goto('/training/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('form')).toBeVisible();
  });

  test('book your session page loads', async ({ page }) => {
    await page.goto('/book-your-session/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('corporate wellness page loads', async ({ page }) => {
    await page.goto('/corporate-wellness/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('intervention services page loads', async ({ page }) => {
    await page.goto('/intervention-services/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('blogs page loads', async ({ page }) => {
    await page.goto('/blogs/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('404 page for unknown route', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Navigation', () => {
  test('header nav links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About Us' }).first().click();
    await expect(page).toHaveURL(/about/);
  });

  test('footer links exist', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link').first()).toBeVisible();
  });
});

test.describe('SEO basics', () => {
  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.+/);
  });

  test('homepage has OG title', async ({ page }) => {
    await page.goto('/');
    const og = page.locator('meta[property="og:title"]');
    await expect(og).toHaveAttribute('content', /.+/);
  });

  test('homepage has JSON-LD', async ({ page }) => {
    await page.goto('/');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();
  });
});
