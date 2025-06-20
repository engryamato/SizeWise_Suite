import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { AirDuctSizerPage } from './pages/AirDuctSizerPage';
import { ToolDashboardPage } from './pages/ToolDashboardPage';
import { TestHelpers } from './utils/test-helpers';
import { ductSizerTestData, responsiveTestData, navigationTestData } from './fixtures/test-data';

test.describe('Comprehensive E2E Tests', () => {
  test('should complete full user journey - home to calculation', async ({ page }) => {
    const homePage = new HomePage(page);
    const airDuctSizerPage = new AirDuctSizerPage(page);
    const errors = TestHelpers.collectConsoleErrors(page);

    // Start at home page
    await homePage.goto();
    await TestHelpers.waitForPageLoad(page);
    await homePage.expectToBeVisible();

    // Navigate to Air Duct Sizer
    await homePage.clickAirDuctSizer();
    await expect(page).toHaveURL('/duct-sizer');
    await airDuctSizerPage.expectToBeVisible();

    // Perform a calculation with valid data
    const testData = ductSizerTestData.rectangular.valid[0];
    await airDuctSizerPage.fillFlowRate(testData.flowRate);
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.fillRectangularDimensions(testData.width, testData.height);
    await airDuctSizerPage.fillLength(testData.length);

    // Calculate and verify results
    await airDuctSizerPage.calculate();
    await airDuctSizerPage.expectResultsVisible();

    // Verify no critical errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.toLowerCase().includes('warning')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should work correctly across all viewport sizes', async ({ page }) => {
    const homePage = new HomePage(page);
    const airDuctSizerPage = new AirDuctSizerPage(page);

    for (const viewport of responsiveTestData.viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Test home page
      await homePage.goto();
      await homePage.expectToBeVisible();
      await homePage.expectNavigationToBeVisible();

      // Test Air Duct Sizer
      await homePage.clickAirDuctSizer();
      await airDuctSizerPage.expectToBeVisible();

      // Perform a quick calculation
      await airDuctSizerPage.fillFlowRate('1000');
      await airDuctSizerPage.selectDuctShape('circular');
      await airDuctSizerPage.fillCircularDimension('10');
      await airDuctSizerPage.fillLength('100');
      await airDuctSizerPage.calculate();

      // Results should be visible on all screen sizes
      await airDuctSizerPage.expectResultsVisible();
    }
  });

  test('should handle multiple calculation scenarios', async ({ page }) => {
    const airDuctSizerPage = new AirDuctSizerPage(page);
    await airDuctSizerPage.goto();

    // Test rectangular calculations
    for (const testCase of ductSizerTestData.rectangular.valid) {
      await airDuctSizerPage.fillFlowRate(testCase.flowRate);
      await airDuctSizerPage.selectDuctShape('rectangular');
      await airDuctSizerPage.fillRectangularDimensions(testCase.width, testCase.height);
      await airDuctSizerPage.fillLength(testCase.length);
      
      await airDuctSizerPage.calculate();
      await airDuctSizerPage.expectResultsVisible();

      // Verify results are within expected ranges
      const velocityText = await TestHelpers.getTextSafely(airDuctSizerPage.velocityResult);

      // Handle comma-separated numbers (e.g., "1,500.00")
      const velocityMatch = velocityText.match(/([\d,]+\.?\d*)/);

      if (velocityMatch) {
        // Remove commas and parse as float
        const velocity = parseFloat(velocityMatch[1].replace(/,/g, ''));

        // Check that we got a reasonable velocity value
        expect(velocity).toBeGreaterThan(0);
        expect(velocity).toBeLessThan(10000);
      }
    }

    // Test circular calculations
    for (const testCase of ductSizerTestData.circular.valid) {
      await airDuctSizerPage.fillFlowRate(testCase.flowRate);
      await airDuctSizerPage.selectDuctShape('circular');
      await airDuctSizerPage.fillCircularDimension(testCase.diameter);
      await airDuctSizerPage.fillLength(testCase.length);
      
      await airDuctSizerPage.calculate();
      await airDuctSizerPage.expectResultsVisible();
    }
  });

  test('should validate all input scenarios', async ({ page }) => {
    const airDuctSizerPage = new AirDuctSizerPage(page);
    await airDuctSizerPage.goto();

    // Test invalid rectangular inputs
    for (const testCase of ductSizerTestData.rectangular.invalid) {
      await airDuctSizerPage.fillFlowRate(testCase.flowRate);
      await airDuctSizerPage.selectDuctShape('rectangular');
      await airDuctSizerPage.fillRectangularDimensions(testCase.width, testCase.height);
      await airDuctSizerPage.fillLength(testCase.length);
      
      await airDuctSizerPage.calculate();
      
      // Should show error or prevent calculation
      const hasError = await TestHelpers.elementExists(airDuctSizerPage.errorMessage);
      const hasResults = await TestHelpers.elementExists(airDuctSizerPage.resultsSection);
      
      // Either show error or don't show results for invalid input
      expect(hasError || !hasResults).toBeTruthy();
    }

    // Test invalid circular inputs
    for (const testCase of ductSizerTestData.circular.invalid) {
      await airDuctSizerPage.fillFlowRate(testCase.flowRate);
      await airDuctSizerPage.selectDuctShape('circular');
      await airDuctSizerPage.fillCircularDimension(testCase.diameter);
      await airDuctSizerPage.fillLength(testCase.length);
      
      await airDuctSizerPage.calculate();
      
      const hasError = await TestHelpers.elementExists(airDuctSizerPage.errorMessage);
      const hasResults = await TestHelpers.elementExists(airDuctSizerPage.resultsSection);
      
      expect(hasError || !hasResults).toBeTruthy();
    }
  });

  test('should maintain performance standards', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Measure home page performance
    const startTime = Date.now();
    await homePage.goto();
    await TestHelpers.waitForPageLoad(page);
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000); // 5 seconds
    
    // Check for performance metrics
    const metrics = await TestHelpers.measurePerformance(page);
    
    // Basic performance checks
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    expect(metrics.firstContentfulPaint).toBeLessThan(2000);
  });

  test('should be accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    const airDuctSizerPage = new AirDuctSizerPage(page);

    // Check home page accessibility
    await homePage.goto();
    const homeAccessibilityIssues = await TestHelpers.checkAccessibility(page);
    
    // Should have minimal accessibility issues
    expect(homeAccessibilityIssues.length).toBeLessThan(3);

    // Check Air Duct Sizer accessibility
    await airDuctSizerPage.goto();
    const toolAccessibilityIssues = await TestHelpers.checkAccessibility(page);
    
    expect(toolAccessibilityIssues.length).toBeLessThan(5);
  });

  test('should handle edge cases gracefully', async ({ page }) => {
    const airDuctSizerPage = new AirDuctSizerPage(page);
    await airDuctSizerPage.goto();

    // Test very large values
    const largeData = ductSizerTestData.edgeCases.veryLarge;
    await airDuctSizerPage.fillFlowRate(largeData.flowRate);
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.fillRectangularDimensions(largeData.width, largeData.height);
    await airDuctSizerPage.fillLength(largeData.length);
    
    await airDuctSizerPage.calculate();
    
    // Should either calculate or show appropriate warning
    const hasResults = await TestHelpers.elementExists(airDuctSizerPage.resultsSection);
    const hasError = await TestHelpers.elementExists(airDuctSizerPage.errorMessage);
    expect(hasResults || hasError).toBeTruthy();

    // Test very small values
    const smallData = ductSizerTestData.edgeCases.verySmall;
    await airDuctSizerPage.fillFlowRate(smallData.flowRate);
    await airDuctSizerPage.fillRectangularDimensions(smallData.width, smallData.height);
    await airDuctSizerPage.fillLength(smallData.length);
    
    await airDuctSizerPage.calculate();
    
    const hasSmallResults = await TestHelpers.elementExists(airDuctSizerPage.resultsSection);
    const hasSmallError = await TestHelpers.elementExists(airDuctSizerPage.errorMessage);
    expect(hasSmallResults || hasSmallError).toBeTruthy();

    // Test decimal values
    const decimalData = ductSizerTestData.edgeCases.decimal;
    await airDuctSizerPage.fillFlowRate(decimalData.flowRate);
    await airDuctSizerPage.fillRectangularDimensions(decimalData.width, decimalData.height);
    await airDuctSizerPage.fillLength(decimalData.length);
    
    await airDuctSizerPage.calculate();
    
    const hasDecimalResults = await TestHelpers.elementExists(airDuctSizerPage.resultsSection);
    const hasDecimalError = await TestHelpers.elementExists(airDuctSizerPage.errorMessage);
    expect(hasDecimalResults || hasDecimalError).toBeTruthy();
  });

  test('should work with random data generation', async ({ page }) => {
    const airDuctSizerPage = new AirDuctSizerPage(page);
    await airDuctSizerPage.goto();

    // Test with 5 sets of random data
    for (let i = 0; i < 5; i++) {
      const randomData = TestHelpers.generateRandomData();
      
      await airDuctSizerPage.fillFlowRate(randomData.flowRate.toString());
      await airDuctSizerPage.selectDuctShape('rectangular');
      await airDuctSizerPage.fillRectangularDimensions(
        randomData.width.toString(), 
        randomData.height.toString()
      );
      await airDuctSizerPage.fillLength(randomData.length.toString());
      
      await airDuctSizerPage.calculate();
      
      // Should produce some result (either calculation or error)
      await page.waitForTimeout(1000);
      
      const hasResults = await TestHelpers.elementExists(airDuctSizerPage.resultsSection);
      const hasError = await TestHelpers.elementExists(airDuctSizerPage.errorMessage);
      
      expect(hasResults || hasError).toBeTruthy();
    }
  });
});
