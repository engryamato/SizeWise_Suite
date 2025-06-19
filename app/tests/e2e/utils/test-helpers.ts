import { Page, expect, Locator } from '@playwright/test';

/**
 * Utility functions for E2E tests
 */

export class TestHelpers {
  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForVisible(locator: Locator, timeout = 10000) {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for page to load completely
   */
  static async waitForPageLoad(page: Page, timeout = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Take a screenshot with a descriptive name
   */
  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Check if element exists without throwing error
   */
  static async elementExists(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'attached', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content safely (returns empty string if element doesn't exist)
   */
  static async getTextSafely(locator: Locator): Promise<string> {
    try {
      return await locator.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Fill input field and verify the value was set
   */
  static async fillAndVerify(locator: Locator, value: string) {
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  /**
   * Click element and wait for navigation
   */
  static async clickAndWaitForNavigation(page: Page, locator: Locator, expectedUrl?: string) {
    await Promise.all([
      page.waitForURL(expectedUrl || '**/*'),
      locator.click(),
    ]);
  }

  /**
   * Scroll element into view
   */
  static async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for element to be stable (not moving)
   */
  static async waitForStable(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toBeStable();
  }

  /**
   * Check if page has specific theme applied
   */
  static async hasTheme(page: Page, theme: 'light' | 'dark'): Promise<boolean> {
    const bodyClass = await page.locator('body').getAttribute('class') || '';
    const htmlClass = await page.locator('html').getAttribute('class') || '';
    const dataTheme = await page.locator('html').getAttribute('data-theme') || '';
    
    const themeIndicators = [bodyClass, htmlClass, dataTheme].join(' ').toLowerCase();
    return themeIndicators.includes(theme);
  }

  /**
   * Get current viewport size
   */
  static async getViewportSize(page: Page) {
    return await page.viewportSize();
  }

  /**
   * Check if element is in viewport
   */
  static async isInViewport(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Wait for all images to load
   */
  static async waitForImages(page: Page) {
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every(img => img.complete);
    });
  }

  /**
   * Get all console errors from the page
   */
  static collectConsoleErrors(page: Page): string[] {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    return errors;
  }

  /**
   * Mock network response
   */
  static async mockApiResponse(page: Page, url: string, response: any) {
    await page.route(url, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Simulate slow network
   */
  static async simulateSlowNetwork(page: Page, delay = 1000) {
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, delay));
      await route.continue();
    });
  }

  /**
   * Check accessibility violations
   */
  static async checkAccessibility(page: Page) {
    // Basic accessibility checks
    const issues: string[] = [];
    
    // Check for missing alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) {
        issues.push('Image missing alt text');
      }
    }
    
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    if (headings.length === 0) {
      issues.push('No headings found');
    }
    
    // Check for form labels
    const inputs = await page.locator('input[type="text"], input[type="number"], input[type="email"]').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        if (label === 0 && !ariaLabel && !ariaLabelledBy) {
          issues.push('Input missing label');
        }
      } else if (!ariaLabel && !ariaLabelledBy) {
        issues.push('Input missing label or aria-label');
      }
    }
    
    return issues;
  }

  /**
   * Measure page performance
   */
  static async measurePerformance(page: Page) {
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    return performanceMetrics;
  }

  /**
   * Generate random test data
   */
  static generateRandomData() {
    return {
      flowRate: Math.floor(Math.random() * 5000) + 100,
      width: Math.floor(Math.random() * 48) + 4,
      height: Math.floor(Math.random() * 36) + 3,
      diameter: Math.floor(Math.random() * 24) + 4,
      length: Math.floor(Math.random() * 500) + 10,
    };
  }

  /**
   * Retry an action with exponential backoff
   */
  static async retry<T>(
    action: () => Promise<T>,
    maxAttempts = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Wait for element count to stabilize
   */
  static async waitForStableCount(locator: Locator, expectedCount?: number, timeout = 5000) {
    const startTime = Date.now();
    let lastCount = -1;
    let stableCount = 0;
    
    while (Date.now() - startTime < timeout) {
      const currentCount = await locator.count();
      
      if (expectedCount !== undefined && currentCount === expectedCount) {
        return currentCount;
      }
      
      if (currentCount === lastCount) {
        stableCount++;
        if (stableCount >= 3) { // Count stable for 3 checks
          return currentCount;
        }
      } else {
        stableCount = 0;
        lastCount = currentCount;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return await locator.count();
  }
}
