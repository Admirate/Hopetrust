import { test, expect } from '@playwright/test';

test.describe('Admin dashboard', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('/admin/');
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/admin/');
    await page.getByPlaceholder(/email/i).fill('wrong@test.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|login|log in/i }).click();

    // Should show an error message
    await expect(page.getByText(/invalid|error|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test('rejects empty form', async ({ page }) => {
    await page.goto('/admin/');
    await page.getByRole('button', { name: /sign in|login|log in/i }).click();

    // HTML5 validation should prevent submission, or app shows error
    const emailInput = page.getByPlaceholder(/email/i);
    // Check it's still on the admin page (no redirect)
    await expect(page).toHaveURL(/admin/);
  });
});
