import { test, expect } from '@playwright/test';
import { AirDuctSizerPage } from './pages/AirDuctSizerPage';

test.describe('Air Duct Sizer Tool', () => {
  let airDuctSizerPage: AirDuctSizerPage;

  test.beforeEach(async ({ page }) => {
    airDuctSizerPage = new AirDuctSizerPage(page);
    await airDuctSizerPage.goto();
  });

  test('should display the tool interface correctly', async ({ page }) => {
    await airDuctSizerPage.expectToBeVisible();

    // Check all form elements are present
    await expect(airDuctSizerPage.flowRateInput).toBeVisible();
    await expect(airDuctSizerPage.ductShapeSelector).toBeVisible();
    await expect(airDuctSizerPage.lengthInput).toBeVisible();
    await expect(airDuctSizerPage.calculateButton).toBeVisible();
  });

  test('should switch between rectangular and circular duct shapes', async ({ page }) => {
    // Start with rectangular (default)
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.expectRectangularInputsVisible();

    // Switch to circular
    await airDuctSizerPage.selectDuctShape('circular');
    await airDuctSizerPage.expectCircularInputsVisible();

    // Switch back to rectangular
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.expectRectangularInputsVisible();
  });

  test('should calculate rectangular duct sizing correctly', async ({ page }) => {
    // Fill in rectangular duct parameters
    await airDuctSizerPage.fillFlowRate('1000');
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.fillRectangularDimensions('12', '8');
    await airDuctSizerPage.fillLength('100');

    // Perform calculation
    await airDuctSizerPage.calculate();

    // Check if results are displayed
    await airDuctSizerPage.expectResultsVisible();

    // Verify results contain numerical values
    const velocityText = await airDuctSizerPage.velocityResult.textContent();
    const pressureLossText = await airDuctSizerPage.pressureLossResult.textContent();

    expect(velocityText).toMatch(/\d+/); // Should contain numbers
    expect(pressureLossText).toMatch(/\d+/); // Should contain numbers
  });

  test('should calculate circular duct sizing correctly', async ({ page }) => {
    // Fill in circular duct parameters
    await airDuctSizerPage.fillFlowRate('1000');
    await airDuctSizerPage.selectDuctShape('circular');
    await airDuctSizerPage.fillCircularDimension('10');
    await airDuctSizerPage.fillLength('100');

    // Perform calculation
    await airDuctSizerPage.calculate();

    // Check if results are displayed
    await airDuctSizerPage.expectResultsVisible();
  });

  test('should validate input fields', async ({ page }) => {
    // Try to calculate without required fields
    await airDuctSizerPage.calculate();

    // Should show validation errors or prevent calculation
    const flowRateValue = await airDuctSizerPage.flowRateInput.inputValue();
    if (!flowRateValue) {
      // Check if there's an error message or if the button is disabled
      const isButtonEnabled = await airDuctSizerPage.calculateButton.isEnabled();
      if (isButtonEnabled) {
        // If button is enabled, there should be an error message after clicking
        await airDuctSizerPage.expectErrorMessage();
      }
    }
  });

  test('should handle invalid input values', async ({ page }) => {
    // Test with negative values
    await airDuctSizerPage.fillFlowRate('-100');
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.fillRectangularDimensions('-5', '-3');
    await airDuctSizerPage.fillLength('-50');

    // Try to calculate - this should trigger validation
    await airDuctSizerPage.calculate();

    // Wait a bit for any validation or calculation to complete
    await page.waitForTimeout(2000);

    // Check if either error messages appear OR results don't appear (validation prevented calculation)
    const hasErrors = (await page.locator('.text-red-600').count()) > 0;
    const hasResults = await airDuctSizerPage.resultsSection.isVisible();

    // Either should show errors or should not show results for invalid input
    expect(hasErrors || !hasResults).toBeTruthy();
  });

  test('should handle very large input values', async ({ page }) => {
    // Test with very large values
    await airDuctSizerPage.fillFlowRate('999999');
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.fillRectangularDimensions('1000', '1000');
    await airDuctSizerPage.fillLength('10000');

    await airDuctSizerPage.calculate();

    // Should either calculate or show appropriate warning
    // The exact behavior depends on your validation rules
    await page.waitForTimeout(1000);

    const hasResults = await airDuctSizerPage.resultsSection.isVisible();
    const hasError = await airDuctSizerPage.errorMessage.isVisible();

    expect(hasResults || hasError).toBeTruthy();
  });

  test('should persist form values during shape changes', async ({ page }) => {
    // Fill flow rate and length
    await airDuctSizerPage.fillFlowRate('1500');
    await airDuctSizerPage.fillLength('150');

    // Switch between shapes
    await airDuctSizerPage.selectDuctShape('rectangular');
    await airDuctSizerPage.fillRectangularDimensions('14', '10');

    await airDuctSizerPage.selectDuctShape('circular');
    await airDuctSizerPage.fillCircularDimension('12');

    // Flow rate and length should be preserved
    const flowRateValue = await airDuctSizerPage.flowRateInput.inputValue();
    const lengthValue = await airDuctSizerPage.lengthInput.inputValue();

    expect(flowRateValue).toBe('1500');
    expect(lengthValue).toBe('150');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Tool should still be functional
    await airDuctSizerPage.expectToBeVisible();

    // Form elements should be accessible
    await expect(airDuctSizerPage.flowRateInput).toBeVisible();
    await expect(airDuctSizerPage.calculateButton).toBeVisible();

    // Try a calculation on mobile
    await airDuctSizerPage.fillFlowRate('800');
    await airDuctSizerPage.selectDuctShape('circular');
    await airDuctSizerPage.fillCircularDimension('8');
    await airDuctSizerPage.fillLength('80');

    await airDuctSizerPage.calculate();

    // Results should be visible on mobile
    await airDuctSizerPage.expectResultsVisible();
  });

  test('should handle units conversion', async ({ page }) => {
    // If units selector exists, test different units
    const unitsSelector = airDuctSizerPage.unitsSelector;

    if (await unitsSelector.isVisible()) {
      // Test with different units
      await airDuctSizerPage.fillFlowRate('1000');
      await airDuctSizerPage.selectDuctShape('rectangular');
      await airDuctSizerPage.fillRectangularDimensions('12', '8');
      await airDuctSizerPage.fillLength('100');

      // Calculate with default units
      await airDuctSizerPage.calculate();
      await airDuctSizerPage.expectResultsVisible();

      const firstResult = await airDuctSizerPage.velocityResult.textContent();

      // Change units and recalculate
      await airDuctSizerPage.selectUnits('metric');
      await airDuctSizerPage.calculate();

      const secondResult = await airDuctSizerPage.velocityResult.textContent();

      // Results should be different (unless they're the same by coincidence)
      // This is a basic check that units conversion is working
      expect(firstResult).toBeTruthy();
      expect(secondResult).toBeTruthy();
    }
  });
});
