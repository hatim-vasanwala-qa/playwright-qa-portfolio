import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/assertions';
import { BasePage } from './BasePage';

export type InventorySortOption = 'az' | 'za' | 'lohi' | 'hilo';

/** Page Object for the product catalog, sorting controls, and cart header badge. */
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /** Navigates directly to the authenticated product catalog. */
  async open(): Promise<void> {
    await this.goto('/inventory.html');
  }

  /** Applies a catalog sort option (`az`, `za`, `lohi`, or `hilo`). */
  async sortBy(option: InventorySortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /** Returns all visible product titles in current display order. */
  async getProductNames(): Promise<string[]> {
    const rawNames = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return rawNames.map((name) => name.trim());
  }

  /** Returns all visible product prices as numbers in current display order. */
  async getProductPrices(): Promise<number[]> {
    const rawPrices = await this.page
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    return rawPrices.map(parsePrice);
  }

  /** Clicks the action button (`Add to cart` / `Remove`) for a specific product card. */
  async toggleProductCartAction(
    productName: string,
    actionLabel: 'Add to cart' | 'Remove',
  ): Promise<void> {
    const card = this.inventoryItems.filter({ hasText: productName });
    await card.getByRole('button', { name: actionLabel }).click();
  }

  /** Navigates to the shopping cart page. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
