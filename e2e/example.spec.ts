import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check if the page has a title
  await expect(page).toHaveTitle(/ToddAgriScience/i);

  // Check if main content exists
  await expect(page.locator('main')).toBeVisible();
});
