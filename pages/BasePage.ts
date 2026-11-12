import type { Page } from '@playwright/test';

/** Shared base Page Object providing common navigation helpers. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigates to a route relative to Playwright's configured baseURL. */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
