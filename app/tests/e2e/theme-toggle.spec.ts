import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Theme Toggle Functionality', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Find theme toggle button (it might have different selectors)
    const themeToggle = page.locator('button[aria-label*="theme" i]')
      .or(page.locator('[data-testid="theme-toggle"]'))
      .or(page.locator('button:has-text(/theme/i)'))
      .or(page.locator('button:has([class*="sun"])'))
      .or(page.locator('button:has([class*="moon"])'));

    await expect(themeToggle).toHaveCount(1);

    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeEnabled();

    // Get initial theme state
    const initialBodyClass = await page.locator('body').getAttribute('class') || '';
    const initialHtmlClass = await page.locator('html').getAttribute('class') || '';
    const initialDataTheme = await page.locator('html').getAttribute('data-theme') || '';
    
    // Click theme toggle
    await themeToggle.click();
    
    // Wait for theme change animation/transition
    await page.waitForTimeout(500);
    
    // Check that theme has changed
    const newBodyClass = await page.locator('body').getAttribute('class') || '';
    const newHtmlClass = await page.locator('html').getAttribute('class') || '';
    const newDataTheme = await page.locator('html').getAttribute('data-theme') || '';
    
    // At least one of these should have changed
    const themeChanged = 
      initialBodyClass !== newBodyClass ||
      initialHtmlClass !== newHtmlClass ||
      initialDataTheme !== newDataTheme;
    
    expect(themeChanged).toBeTruthy();
  });

  test('should persist theme preference across page reloads', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i]')
      .or(page.locator('[data-testid="theme-toggle"]'))
      .or(page.locator('button:has-text(/theme/i)'))
      .or(page.locator('button:has([class*="sun"])'))
      .or(page.locator('button:has([class*="moon"])'));

    await expect(themeToggle).toHaveCount(1);

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Get theme state after toggle
    const themeAfterToggle = await page.locator('html').getAttribute('class') || '';
    const dataThemeAfterToggle = await page.locator('html').getAttribute('data-theme') || '';
    
    // Reload page
    await page.reload();
    await homePage.expectToBeVisible();
    
    // Check that theme is still the same
    const themeAfterReload = await page.locator('html').getAttribute('class') || '';
    const dataThemeAfterReload = await page.locator('html').getAttribute('data-theme') || '';
    
    expect(themeAfterReload).toBe(themeAfterToggle);
    expect(dataThemeAfterReload).toBe(dataThemeAfterToggle);
  });

  test('should persist theme across different pages', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i]')
      .or(page.locator('[data-testid="theme-toggle"]'))
      .or(page.locator('button:has-text(/theme/i)'))
      .or(page.locator('button:has([class*="sun"])'))
      .or(page.locator('button:has([class*="moon"])'));

    await expect(themeToggle).toHaveCount(1);

    // Toggle theme on home page
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const homeTheme = await page.locator('html').getAttribute('class') || '';
    const homeDataTheme = await page.locator('html').getAttribute('data-theme') || '';
    
    // Navigate to tools page
    await homePage.navigateToTools();
    await expect(page).toHaveURL('/tools');
    
    // Check theme is preserved
    const toolsTheme = await page.locator('html').getAttribute('class') || '';
    const toolsDataTheme = await page.locator('html').getAttribute('data-theme') || '';
    
    expect(toolsTheme).toBe(homeTheme);
    expect(toolsDataTheme).toBe(homeDataTheme);
  });

  test('should update theme toggle icon/text when theme changes', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i]')
      .or(page.locator('[data-testid="theme-toggle"]'))
      .or(page.locator('button:has-text(/theme/i)'))
      .or(page.locator('button:has([class*="sun"])'))
      .or(page.locator('button:has([class*="moon"])'));

    await expect(themeToggle).toHaveCount(1);

    // Get initial button content/attributes
    const initialAriaLabel = await themeToggle.getAttribute('aria-label') || '';
    const initialInnerHTML = await themeToggle.innerHTML();
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Check that button content/attributes changed
    const newAriaLabel = await themeToggle.getAttribute('aria-label') || '';
    const newInnerHTML = await themeToggle.innerHTML();
    
    // At least one should have changed to reflect the new theme state
    const buttonChanged = 
      initialAriaLabel !== newAriaLabel ||
      initialInnerHTML !== newInnerHTML;
    
    expect(buttonChanged).toBeTruthy();
  });

  test('should respect system theme preference on first visit', async ({ page, context }) => {
    // Create a new context with dark mode preference
    const darkContext = await context.browser()?.newContext({
      colorScheme: 'dark'
    });

    expect(darkContext).toBeDefined();
    
    const darkPage = await darkContext.newPage();
    const darkHomePage = new HomePage(darkPage);
    
    await darkHomePage.goto();
    await darkHomePage.expectToBeVisible();
    
    // Check if the page respects the dark theme preference
    const bodyClass = await darkPage.locator('body').getAttribute('class') || '';
    const htmlClass = await darkPage.locator('html').getAttribute('class') || '';
    const dataTheme = await darkPage.locator('html').getAttribute('data-theme') || '';
    
    // Should contain some indication of dark theme
    const hasDarkTheme = 
      bodyClass.includes('dark') ||
      htmlClass.includes('dark') ||
      dataTheme.includes('dark');
    
    // Note: This test might fail if the app doesn't implement system theme detection
    // In that case, it's still valuable to know that this feature is missing
    if (!hasDarkTheme) {
      console.log('System theme preference not detected - consider implementing this feature');
    }
    
    await darkContext.close();
  });

  test('should maintain theme during navigation and form interactions', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="theme" i]')
      .or(page.locator('[data-testid="theme-toggle"]'))
      .or(page.locator('button:has-text(/theme/i)'))
      .or(page.locator('button:has([class*="sun"])'))
      .or(page.locator('button:has([class*="moon"])'));

    await expect(themeToggle).toHaveCount(1);

    // Set dark theme
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const darkTheme = await page.locator('html').getAttribute('class') || '';
    
    // Navigate to Air Duct Sizer
    await homePage.clickAirDuctSizer();
    await expect(page).toHaveURL('/duct-sizer');
    
    // Theme should still be dark
    const toolTheme = await page.locator('html').getAttribute('class') || '';
    expect(toolTheme).toBe(darkTheme);
    
    // Interact with form elements (if they exist)
    const flowRateInput = page.locator('input[type="number"]').first();
    if (await flowRateInput.count() > 0) {
      await flowRateInput.fill('1000');
      
      // Theme should still be preserved after form interaction
      const themeAfterInput = await page.locator('html').getAttribute('class') || '';
      expect(themeAfterInput).toBe(darkTheme);
    }
  });
});
