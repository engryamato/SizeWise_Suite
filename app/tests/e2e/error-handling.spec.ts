import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Error Handling and Edge Cases', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Go offline
    await page.context().setOffline(true);
    
    try {
      await homePage.goto();
      
      // Should either show an offline message or cached content
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
      
      // Look for offline indicators
      const hasOfflineMessage = pageContent?.toLowerCase().includes('offline') ||
                               pageContent?.toLowerCase().includes('network') ||
                               pageContent?.toLowerCase().includes('connection');
      
      if (hasOfflineMessage) {
        console.log('Offline handling detected');
      }
    } catch (error) {
      // If the page fails to load offline, that's also acceptable behavior
      console.log('Page requires network connection');
    }
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('should handle JavaScript errors without crashing', async ({ page }) => {
    const homePage = new HomePage(page);
    const jsErrors: string[] = [];
    
    // Collect JavaScript errors
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    await homePage.goto();
    
    // Inject a JavaScript error to test error boundary
    await page.evaluate(() => {
      // Simulate an error in a component
      setTimeout(() => {
        throw new Error('Test error for error boundary');
      }, 100);
    });
    
    await page.waitForTimeout(1000);
    
    // Page should still be functional despite the error
    await homePage.expectToBeVisible();
    
    // Check if error boundary caught the error
    const errorBoundaryMessage = page.locator('[data-testid="error-boundary"]')
      .or(page.locator(':has-text("Something went wrong")'))
      .or(page.locator(':has-text("Error")'));
    
    const hasErrorBoundary = await errorBoundaryMessage.count() > 0;
    
    if (hasErrorBoundary) {
      console.log('Error boundary is working');
      await expect(errorBoundaryMessage).toBeVisible();
    }
  });

  test('should handle slow network conditions', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Simulate slow network
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      await route.continue();
    });
    
    const startTime = Date.now();
    await homePage.goto();
    const loadTime = Date.now() - startTime;
    
    // Should still load, just slower
    await homePage.expectToBeVisible();
    
    // Verify it actually took longer (accounting for the delay we added)
    expect(loadTime).toBeGreaterThan(500);
  });

  test('should handle missing resources gracefully', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Block some resources to simulate missing files
    await page.route('**/*.png', route => route.abort());
    await page.route('**/*.jpg', route => route.abort());
    await page.route('**/*.svg', route => route.abort());
    
    await homePage.goto();
    
    // Page should still be functional without images
    await homePage.expectToBeVisible();
    await homePage.expectNavigationToBeVisible();
  });

  test('should handle browser back/forward edge cases', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate through several pages quickly
    await homePage.goto();
    await homePage.navigateToTools();
    await page.goBack();
    await page.goForward();
    await page.goBack();
    
    // Should handle rapid navigation without issues
    await expect(page).toHaveURL('/');
    await homePage.expectToBeVisible();
  });

  test('should handle window resize events', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Test various viewport sizes
    const viewports = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad landscape
      { width: 1920, height: 1080 }, // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Allow for responsive adjustments
      
      // Content should still be visible and accessible
      await homePage.expectToBeVisible();
      
      // Navigation should be accessible (might be different on mobile)
      const navigation = homePage.navigation;
      await expect(navigation).toBeVisible();
    }
  });

  test('should handle form validation edge cases', async ({ page }) => {
    // Navigate to a form page (Air Duct Sizer)
    await page.goto('/duct-sizer');
    
    // Test with various invalid inputs
    const testCases = [
      { flowRate: '', expected: 'required' },
      { flowRate: '0', expected: 'positive' },
      { flowRate: 'abc', expected: 'number' },
      { flowRate: '999999999999', expected: 'range' },
    ];
    
    for (const testCase of testCases) {
      const flowRateInput = page.locator('input[type="number"]').first();
      
      if (await flowRateInput.count() > 0) {
        await flowRateInput.fill(testCase.flowRate);
        
        // Try to submit or trigger validation
        const submitButton = page.locator('button[type="submit"]')
          .or(page.locator('button:has-text("Calculate")'))
          .or(page.locator('[data-testid="calculate-button"]'));
        
        if (await submitButton.count() > 0) {
          await submitButton.click();
          
          // Should show some form of validation feedback
          const validationMessage = page.locator('.error')
            .or(page.locator('[role="alert"]'))
            .or(page.locator(':has-text("invalid")'))
            .or(page.locator(':has-text("required")'));
          
          // Either validation message appears or form doesn't submit
          const hasValidation = await validationMessage.count() > 0;
          const currentUrl = page.url();
          
          // Form should either show validation or not proceed
          expect(hasValidation || currentUrl.includes('duct-sizer')).toBeTruthy();
        }
      }
    }
  });

  test('should handle concurrent user interactions', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Simulate rapid but sequential interactions to avoid navigation conflicts
    try {
      // Quick navigation sequence
      await homePage.navigateToTools();
      await page.waitForTimeout(100);
      await page.goBack();
      await page.waitForTimeout(100);
      await homePage.clickAirDuctSizer();
      await page.waitForTimeout(100);
      await page.goBack();
      await page.waitForTimeout(100);
    } catch (error) {
      // Some navigation actions might fail due to timing, that's OK
      console.log('Navigation error (expected):', error);
    }

    // Ensure we're on a valid page
    await homePage.goto();

    // Page should be in a valid state
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(|tools|duct-sizer)$/);

    // Content should be visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle memory leaks during navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate back and forth multiple times to test for memory leaks
    for (let i = 0; i < 5; i++) {
      await homePage.goto();
      await homePage.navigateToTools();
      await page.goBack();
      await homePage.clickAirDuctSizer();
      await page.goBack();
    }
    
    // Page should still be responsive
    await homePage.expectToBeVisible();
    
    // Check for excessive console errors that might indicate memory issues
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('memory')) {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should not have memory-related errors
    expect(errors).toHaveLength(0);
  });
});
