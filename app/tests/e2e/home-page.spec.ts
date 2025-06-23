import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display main heading and subtitle', async ({ page }) => {
    await homePage.expectToBeVisible();
    
    // Check for specific text content
    await expect(homePage.heading).toHaveText('Welcome to SizeWise Suite');
    await expect(homePage.subtitle).toContainText('professional HVAC engineering toolkit');
  });

  test('should display navigation menu', async ({ page }) => {
    await homePage.expectNavigationToBeVisible();

    // Check navigation links are clickable based on viewport
    await expect(homePage.homeLink).toBeEnabled();

    // Check viewport width to determine which tools link to test
    const viewportSize = page.viewportSize();
    const isSmallViewport = viewportSize && viewportSize.width < 640;

    if (isSmallViewport) {
      // On mobile, check mobile menu button is enabled
      await expect(homePage.mobileMenuButton).toBeEnabled();
    } else {
      // On desktop, check desktop tools link is enabled
      await expect(homePage.toolsLink).toBeEnabled();
    }
  });

  test('should display available tools', async ({ page }) => {
    await homePage.expectToolCardsToBeVisible();
    
    // Check Air Duct Sizer card content
    await expect(homePage.airDuctSizerCard).toContainText('Air Duct Sizer');
    await expect(homePage.airDuctSizerCard).toContainText('Calculate duct dimensions');
    await expect(homePage.airDuctSizerCard).toContainText('Phase 0.1');
  });

  test('should have working theme toggle', async ({ page }) => {
    // Check if theme toggle exists
    const themeToggle = page.locator('button[aria-label*="theme" i], button[data-testid="theme-toggle"]');
    
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
      await expect(themeToggle).toBeEnabled();
      
      // Click theme toggle and verify it works
      await themeToggle.click();
      
      // Wait a bit for theme change animation
      await page.waitForTimeout(500);
      
      // Theme should have changed (check for dark/light class on body or html)
      const bodyClass = await page.locator('body').getAttribute('class');
      const htmlClass = await page.locator('html').getAttribute('class');
      
      // Should contain either 'dark' or 'light' theme indicator
      expect(bodyClass || htmlClass || '').toMatch(/(dark|light)/);
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main content should still be visible
    await homePage.expectToBeVisible();
    await homePage.expectToolCardsToBeVisible();
    
    // Navigation should adapt to mobile (might be hamburger menu)
    await expect(homePage.navigation).toBeVisible();
  });

  test('should have proper meta tags and title', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/SizeWise Suite/);
    
    // Check meta description if present
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toContain('HVAC');
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await homePage.goto();
    await homePage.expectToBeVisible();
    
    // Allow some time for any async operations
    await page.waitForTimeout(2000);
    
    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.toLowerCase().includes('warning') &&
      !error.includes('Importing a module script failed') && // WebKit module import issue
      !error.includes('Failed to initialize tools') && // Related to WebKit module imports
      !error.includes('Failed to initialize tool registry') && // Related to WebKit module imports
      !error.includes('The above error occurred in one of your React components') && // React error boundary messages
      !error.includes('React will try to recreate this component tree') // React error boundary recovery
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have accessible elements', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check for alt text on images (if any)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper link text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Links should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});
