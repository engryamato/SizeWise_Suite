import { Page, Locator, expect } from '@playwright/test';

export class AirDuctSizerPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly flowRateInput: Locator;
  readonly ductShapeSelector: Locator;
  readonly rectangularOption: Locator;
  readonly circularOption: Locator;
  readonly widthInput: Locator;
  readonly heightInput: Locator;
  readonly diameterInput: Locator;
  readonly lengthInput: Locator;
  readonly unitsSelector: Locator;
  readonly calculateButton: Locator;
  readonly resultsSection: Locator;
  readonly velocityResult: Locator;
  readonly pressureLossResult: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Air Duct Sizer/i });
    this.flowRateInput = page.locator('#flowRate');
    this.ductShapeSelector = page.locator('#ductShape');
    this.rectangularOption = page.locator('#ductShape option[value="rectangular"]');
    this.circularOption = page.locator('#ductShape option[value="round"]');
    this.widthInput = page.locator('#width');
    this.heightInput = page.locator('#height');
    this.diameterInput = page.locator('#diameter');
    this.lengthInput = page.locator('#length');
    this.unitsSelector = page.locator('#units');
    this.calculateButton = page.locator('button[type="submit"]');
    this.resultsSection = page.locator('.space-y-5.p-6.bg-white.border').filter({ hasText: 'Duct Sizing Results' });
    this.velocityResult = page.locator('text=Air Velocity').locator('..').locator('.text-right span.text-sm.font-semibold.text-blue-700').first();
    this.pressureLossResult = page.locator('text=Pressure Loss').locator('..').locator('.text-right span.text-sm.font-semibold.text-blue-700').first();
    this.errorMessage = page.locator('.text-red-600');
    this.loadingSpinner = page.locator('.animate-spin');
  }

  async goto() {
    await this.page.goto('/air-duct-sizer');
  }

  async fillFlowRate(value: string) {
    await this.flowRateInput.fill(value);
  }

  async selectDuctShape(shape: 'rectangular' | 'circular') {
    const value = shape === 'circular' ? 'round' : 'rectangular';
    await this.ductShapeSelector.selectOption(value);
  }

  async fillRectangularDimensions(width: string, height: string) {
    await this.widthInput.fill(width);
    await this.heightInput.fill(height);
  }

  async fillCircularDimension(diameter: string) {
    await this.diameterInput.fill(diameter);
  }

  async fillLength(value: string) {
    await this.lengthInput.fill(value);
  }

  async selectUnits(units: string) {
    await this.unitsSelector.selectOption(units);
  }

  async calculate() {
    await this.calculateButton.click();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.flowRateInput).toBeVisible();
    await expect(this.ductShapeSelector).toBeVisible();
  }

  async expectRectangularInputsVisible() {
    await expect(this.widthInput).toBeVisible();
    await expect(this.heightInput).toBeVisible();
    // Diameter input should not exist in DOM when rectangular is selected
    const diameterCount = await this.diameterInput.count();
    expect(diameterCount).toBe(0);
  }

  async expectCircularInputsVisible() {
    await expect(this.diameterInput).toBeVisible();
    // Width and height inputs should not exist in DOM when circular is selected
    const widthCount = await this.widthInput.count();
    const heightCount = await this.heightInput.count();
    expect(widthCount).toBe(0);
    expect(heightCount).toBe(0);
  }

  async expectResultsVisible() {
    await expect(this.resultsSection).toBeVisible();
    await expect(this.velocityResult).toBeVisible();
    await expect(this.pressureLossResult).toBeVisible();
  }

  async expectErrorMessage(message?: string) {
    // Check if any error messages are visible
    await expect(this.errorMessage.first()).toBeVisible();
    if (message) {
      await expect(this.errorMessage.filter({ hasText: message })).toBeVisible();
    }
  }

  async expectLoadingState() {
    await expect(this.loadingSpinner).toBeVisible();
  }

  async waitForCalculationComplete() {
    await expect(this.loadingSpinner).not.toBeVisible();
  }
}
