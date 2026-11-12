import { expect, test } from '../../fixtures/test-fixtures';
import type { CustomerDetails } from '../../pages/CheckoutPage';
import { buildCustomerDetails } from '../../utils/test-data';

interface CheckoutValidationCase {
  scenario: string;
  customer: CustomerDetails;
  expectedError: string;
}

const CHECKOUT_VALIDATION_CASES: readonly CheckoutValidationCase[] = [
  {
    scenario: 'requires first name before advancing checkout',
    customer: { firstName: '', lastName: 'Patel', postalCode: '380015' },
    expectedError: 'Error: First Name is required',
  },
  {
    scenario: 'requires last name before advancing checkout',
    customer: { firstName: 'Aarav', lastName: '', postalCode: '380015' },
    expectedError: 'Error: Last Name is required',
  },
  {
    scenario: 'requires postal code before advancing checkout',
    customer: { firstName: 'Aarav', lastName: 'Patel', postalCode: '' },
    expectedError: 'Error: Postal Code is required',
  },
];

test.describe('Cart & End-to-End Checkout Flows', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('completes E2E purchase with dynamic customer data and verifies totals', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const backpack = 'Sauce Labs Backpack';
    const jacket = 'Sauce Labs Fleece Jacket';

    await inventoryPage.toggleProductCartAction(backpack, 'Add to cart');
    await inventoryPage.toggleProductCartAction(jacket, 'Add to cart');
    await inventoryPage.openCart();

    await expect(cartPage.itemByName(backpack)).toBeVisible();
    await expect(cartPage.itemByName(jacket)).toBeVisible();

    await cartPage.proceedToCheckout();
    await checkoutPage.submitCustomerInfo(buildCustomerDetails());

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    const totals = await checkoutPage.getOrderTotals();
    expect(totals.subtotal).toBeGreaterThan(0);
    expect(totals.tax).toBeGreaterThan(0);
    expect(totals.total).toBeCloseTo(totals.subtotal + totals.tax, 2);

    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('removes item from shopping cart before checkout', async ({ inventoryPage, cartPage }) => {
    const firstItem = 'Sauce Labs Backpack';
    const secondItem = 'Sauce Labs Onesie';

    await inventoryPage.toggleProductCartAction(firstItem, 'Add to cart');
    await inventoryPage.toggleProductCartAction(secondItem, 'Add to cart');
    await inventoryPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);
    await cartPage.removeItem(firstItem);

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemByName(secondItem)).toBeVisible();
  });

  for (const testCase of CHECKOUT_VALIDATION_CASES) {
    test(testCase.scenario, async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.toggleProductCartAction('Sauce Labs Backpack', 'Add to cart');
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.submitCustomerInfo(testCase.customer);

      await expect(checkoutPage.errorBanner).toBeVisible();
      await expect(checkoutPage.errorBanner).toContainText(testCase.expectedError);
    });
  }
});
