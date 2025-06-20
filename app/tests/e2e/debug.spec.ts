import { test, expect } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('should check what is on the duct-sizer page', async ({ page }) => {
    // Collect console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    });

    // Collect page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    await page.goto('/duct-sizer');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Get page title
    const title = await page.title();
    console.log('Page title:', title);

    // Get page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));

    // Check for any error messages
    const errorElements = await page.locator('.error, .bg-red-50, [role="alert"]').all();
    for (const error of errorElements) {
      const errorText = await error.textContent();
      console.log('Error found:', errorText);
    }

    // Check for headings
    const headings = await page.locator('h1, h2, h3').all();
    for (const heading of headings) {
      const headingText = await heading.textContent();
      console.log('Heading found:', headingText);
    }

    // Check current URL
    console.log('Current URL:', page.url());

    // Print console logs
    console.log('Console logs:');
    consoleLogs.forEach(log => console.log('  ', log));

    // Print page errors
    console.log('Page errors:');
    pageErrors.forEach(error => console.log('  ', error));

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-duct-sizer.png', fullPage: true });
  });

  test('should check what is on the home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Get page title
    const title = await page.title();
    console.log('Home page title:', title);
    
    // Check for tool cards
    const toolCards = await page.locator('a[href="/duct-sizer"]').all();
    console.log('Tool cards found:', toolCards.length);
    
    for (const card of toolCards) {
      const cardText = await card.textContent();
      console.log('Tool card text:', cardText);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-home.png', fullPage: true });
  });
});
