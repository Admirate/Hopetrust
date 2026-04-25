import { test, expect } from '@playwright/test';

test.describe('Enrollment flow', () => {
  test('addiction page has enroll buttons', async ({ page }) => {
    await page.goto('/addiction/');
    const enrollButtons = page.getByRole('button', { name: /enroll/i });
    await expect(enrollButtons.first()).toBeVisible({ timeout: 10000 });
  });

  test('training page has enroll buttons', async ({ page }) => {
    await page.goto('/training/');
    const enrollButtons = page.getByRole('button', { name: /enroll/i });
    await expect(enrollButtons.first()).toBeVisible({ timeout: 10000 });
  });

  test('clicking enroll opens modal on addiction page', async ({ page }) => {
    await page.goto('/addiction/');
    const enrollBtn = page.getByRole('button', { name: /enroll/i }).first();
    await enrollBtn.click();

    // Modal should appear with enrollment form
    await expect(page.getByText('Enroll now')).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel('Full name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Phone')).toBeVisible();
  });

  test('enrollment modal validates empty fields', async ({ page }) => {
    await page.goto('/addiction/');
    const enrollBtn = page.getByRole('button', { name: /enroll/i }).first();
    await enrollBtn.click();

    // Wait for modal
    await expect(page.getByText('Enroll now')).toBeVisible({ timeout: 5000 });

    // Try to submit without filling
    await page.getByRole('button', { name: /proceed to payment/i }).click();

    // HTML5 required validation should prevent submission
    // The form should still be visible (no redirect)
    await expect(page.getByLabel('Full name')).toBeVisible();
  });

  test('enrollment modal validates short name', async ({ page }) => {
    await page.goto('/addiction/');
    const enrollBtn = page.getByRole('button', { name: /enroll/i }).first();
    await enrollBtn.click();

    await expect(page.getByText('Enroll now')).toBeVisible({ timeout: 5000 });

    await page.getByLabel('Full name').fill('A');
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Phone').fill('9876543210');
    await page.getByRole('button', { name: /proceed to payment/i }).click();

    await expect(page.getByText('Please enter your full name')).toBeVisible({ timeout: 5000 });
  });

  test('enrollment success page handles missing id', async ({ page }) => {
    await page.goto('/enrollment-success/');
    // Should show some kind of error or fallback
    await expect(page.locator('main')).toBeVisible();
  });
});
