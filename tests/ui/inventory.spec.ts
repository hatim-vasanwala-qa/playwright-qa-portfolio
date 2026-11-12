import { expect, test } from '../../fixtures/test-fixtures';
import type { InventoryPage, InventorySortOption } from '../../pages/InventoryPage';
import { isSorted } from '../../utils/assertions';

interface SortScenario {
  option: InventorySortOption;
  label: string;
  readValues: (inventoryPage: InventoryPage) => Promise<string[] | number[]>;
  direction: 'asc' | 'desc';
}

const SORT_SCENARIOS: readonly SortScenario[] = [
  {
    option: 'az',
    label: 'Name (A to Z)',
    readValues: (inventoryPage) => inventoryPage.getProductNames(),
    direction: 'asc',
  },
  {
    option: 'za',
    label: 'Name (Z to A)',
    readValues: (inventoryPage) => inventoryPage.getProductNames(),
    direction: 'desc',
  },
  {
    option: 'lohi',
    label: 'Price (Low to High)',
    readValues: (inventoryPage) => inventoryPage.getProductPrices(),
    direction: 'asc',
  },
  {
    option: 'hilo',
    label: 'Price (High to Low)',
    readValues: (inventoryPage) => inventoryPage.getProductPrices(),
    direction: 'desc',
  },
];

test.describe('Product Catalog & Cart State', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('renders full 6-item catalog with valid pricing', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);

    const prices = await inventoryPage.getProductPrices();
    expect(prices.every((price) => price > 0)).toBe(true);
  });

  for (const scenario of SORT_SCENARIOS) {
    test(`sorts catalog cleanly by ${scenario.label}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(scenario.option);

      const values = await scenario.readValues(inventoryPage);
      expect(isSorted(values, scenario.direction)).toBe(true);
    });
  }

  test('updates shopping cart badge count on add and remove', async ({ inventoryPage }) => {
    const firstItem = 'Sauce Labs Backpack';
    const secondItem = 'Sauce Labs Bike Light';

    await inventoryPage.toggleProductCartAction(firstItem, 'Add to cart');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.toggleProductCartAction(secondItem, 'Add to cart');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.toggleProductCartAction(firstItem, 'Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
