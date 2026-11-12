import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/assertions';
import { BasePage } from './BasePage';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Page Object spanning Checkout Step One (customer info), Step Two (overview), and Complete. */
export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorBanner: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorBanner = page.locator('[data-test="error"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /** Populates Step One customer fields and attempts to advance to order overview. */
  async submitCustomerInfo(customer: CustomerDetails): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  /** Extracts numeric subtotal, tax, and grand total amounts from Checkout Step Two. */
  async getOrderTotals(): Promise<{ subtotal: number; tax: number; total: number }> {
    const [subtotalText, taxText, totalText] = await Promise.all([
      this.subtotalLabel.innerText(),
      this.taxLabel.innerText(),
      this.totalLabel.innerText(),
    ]);

    return {
      subtotal: parsePrice(subtotalText),
      tax: parsePrice(taxText),
      total: parsePrice(totalText),
    };
  }

  /** Confirms and places the order on Checkout Step Two. */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
