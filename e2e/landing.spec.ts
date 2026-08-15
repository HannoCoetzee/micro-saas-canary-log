import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('hero heading is visible', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
