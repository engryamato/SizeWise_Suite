import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ToolDashboardPage } from './pages/ToolDashboardPage';
import { AirDuctSizerPage } from './pages/AirDuctSizerPage';

test.describe('Navigation', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    const toolDashboardPage = new ToolDashboardPage(page);

    // Start at home page
    await homePage.goto();
    await homePage.expectToBeVisible();
    await homePage.expectNavigationToBeVisible();

    // Navigate to tools dashboard
    await homePage.navigateToTools();
    await expect(page).toHaveURL('/tools');
    await toolDashboardPage.expectToBeVisible();

    // Navigate back to home
    await page.getByRole('link', { name: 'SizeWise Suite' }).click();
    await expect(page).toHaveURL('/');
    await homePage.expectToBeVisible();
  });

  test('should navigate to Air Duct Sizer from home page', async ({ page }) => {
    const homePage = new HomePage(page);
    const airDuctSizerPage = new AirDuctSizerPage(page);

    await homePage.goto();
    await homePage.expectToolCardsToBeVisible();

    // Click on Air Duct Sizer card
    await homePage.clickAirDuctSizer();
    await expect(page).toHaveURL('/duct-sizer');
    await airDuctSizerPage.expectToBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    const toolDashboardPage = new ToolDashboardPage(page);

    // Navigate through pages
    await homePage.goto();
    await homePage.navigateToTools();
    await expect(page).toHaveURL('/tools');

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/');
    await homePage.expectToBeVisible();

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/tools');
    await toolDashboardPage.expectToBeVisible();
  });

  test('should show 404 for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route');

    // The app uses a catch-all route /:toolId, so invalid routes go to ToolLoader
    // which should show an error message for non-existent tools
    const currentUrl = page.url();
    expect(currentUrl).toContain('/invalid-route');

    // Should show an error message for invalid tool
    const errorMessage = page.locator('.text-red-700, .text-red-600, .bg-red-50').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should maintain navigation state across page refreshes', async ({ page }) => {
    const toolDashboardPage = new ToolDashboardPage(page);

    await toolDashboardPage.goto();
    await toolDashboardPage.expectToBeVisible();

    // Refresh the page
    await page.reload();
    await expect(page).toHaveURL('/tools');
    await toolDashboardPage.expectToBeVisible();
  });
});
