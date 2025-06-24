import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly toolCards: Locator;
  readonly airDuctSizerCard: Locator;
  readonly themeToggle: Locator;
  readonly navigation: Locator;
  readonly homeLink: Locator;
  readonly toolsLink: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;
  readonly mobileToolsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Welcome to SizeWise Suite' });
    this.subtitle = page.getByText('Your professional HVAC engineering toolkit');
    this.toolCards = page.locator('a.block.p-6.bg-white.rounded-lg'); // Tool card links
    this.airDuctSizerCard = page.locator('a[href="/duct-sizer"]');
    this.themeToggle = page
      .locator('button')
      .filter({ hasText: /theme|dark|light/i })
      .or(page.locator('[aria-label*="theme" i]'));
    this.navigation = page.locator('nav');
    this.homeLink = page.getByRole('link', { name: 'SizeWise Suite' });
    this.toolsLink = page.getByRole('link', { name: 'Tools' });
    this.mobileMenuButton = page.locator('button[aria-controls="mobile-menu"]');
    this.mobileMenu = page.locator('#mobile-menu');
    this.mobileToolsLink = page.locator('#mobile-menu a[href="/tools"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickAirDuctSizer() {
    await this.airDuctSizerCard.click();
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async navigateToTools() {
    // Check viewport width to determine if we need to use mobile menu
    const viewportSize = this.page.viewportSize();
    const isSmallViewport = viewportSize && viewportSize.width < 640; // sm breakpoint is 640px

    if (isSmallViewport) {
      // On mobile, open the mobile menu first
      await this.mobileMenuButton.click();
      await this.mobileToolsLink.click();
    } else {
      // On desktop, use the regular tools link
      await this.toolsLink.click();
    }
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.subtitle).toBeVisible();
  }

  async expectToolCardsToBeVisible() {
    await expect(this.toolCards).toHaveCount(1); // Currently only Air Duct Sizer
    await expect(this.airDuctSizerCard).toBeVisible();
  }

  async expectNavigationToBeVisible() {
    await expect(this.navigation).toBeVisible();

    // Check viewport width to determine if navigation links should be visible
    const viewportSize = this.page.viewportSize();
    const isSmallViewport = viewportSize && viewportSize.width < 640; // sm breakpoint is 640px

    if (isSmallViewport) {
      // On small viewports, check mobile menu button is visible
      await expect(this.mobileMenuButton).toBeVisible();
      await expect(this.homeLink).toBeVisible(); // Logo/home link should always be visible
    } else {
      // On larger viewports, navigation links should be visible
      await expect(this.homeLink).toBeVisible();
      await expect(this.toolsLink).toBeVisible();
    }
  }
}
