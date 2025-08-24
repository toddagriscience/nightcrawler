import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check if the page has the correct title (matches actual title)
  await expect(page).toHaveTitle('Todd');

  // Check if page content loads
  await expect(page.locator('body')).toBeVisible();

  // Check if page doesn't show error messages
  await expect(page.locator('text=404')).not.toBeVisible();
});
