import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Page Object for the shopping cart review screen. */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /** Returns the line item locator matching a given product name. */
  itemByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  /** Removes a product from the cart by its display name. */
  async removeItem(productName: string): Promise<void> {
    await this.itemByName(productName).getByRole('button', { name: 'Remove' }).click();
  }

  /** Proceeds from cart review to Checkout Step One. */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
