import { Page, Locator, expect } from '@playwright/test';

export class ToolDashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly toolGrid: Locator;
  readonly toolCards: Locator;
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Tools Dashboard/i });
    this.toolGrid = page.locator('[data-testid="tool-grid"]');
    this.toolCards = page.locator('[data-testid="tool-card"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]');
    this.backToHomeLink = page.getByRole('link', { name: 'Home' });
  }

  async goto() {
    await this.page.goto('/tools');
  }

  async searchTools(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByCategory(category: string) {
    await this.filterDropdown.selectOption(category);
  }

  async clickTool(toolName: string) {
    await this.toolCards.filter({ hasText: toolName }).click();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.toolGrid).toBeVisible();
  }

  async expectToolsCount(count: number) {
    await expect(this.toolCards).toHaveCount(count);
  }

  async expectToolVisible(toolName: string) {
    await expect(this.toolCards.filter({ hasText: toolName })).toBeVisible();
  }
}
