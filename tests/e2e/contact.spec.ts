import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/');
  });

  test('renders contact form with all fields', async ({ page }) => {
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
    await expect(page.getByPlaceholder('+91 98765 43210')).toBeVisible();
    await expect(page.getByPlaceholder('john@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('How can we help you today?')).toBeVisible();
  });

  test('renders contact info cards', async ({ page }) => {
    await expect(page.getByText('Email Us')).toBeVisible();
    await expect(page.getByText('Call Us')).toBeVisible();
    await expect(page.getByText('Visit Us')).toBeVisible();
  });

  test('shows validation error for short name', async ({ page }) => {
    await page.getByPlaceholder('John Doe').fill('A');
    await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
    await page.getByPlaceholder('john@example.com').fill('test@test.com');
    await page.getByPlaceholder('How can we help you today?').fill('Need help with therapy sessions');

    await page.locator('button[type="submit"]').click();

    // Should show a toast error for short name
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible({ timeout: 5000 });
  });

  test('shows validation error for short message', async ({ page }) => {
    await page.getByPlaceholder('John Doe').fill('John Doe');
    await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
    await page.getByPlaceholder('john@example.com').fill('john@test.com');
    await page.getByPlaceholder('How can we help you today?').fill('Hi');

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('Message must be at least 10 characters')).toBeVisible({ timeout: 5000 });
  });

  test('Google Maps embed is present', async ({ page }) => {
    const iframe = page.locator('iframe[src*="google.com/maps"]');
    await expect(iframe).toBeAttached();
  });
});
