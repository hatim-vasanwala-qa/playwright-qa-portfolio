import { ENV } from '../../config/env';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

interface NegativeLoginCase {
  scenario: string;
  username: string;
  password: string;
  expectedError: string;
}

const NEGATIVE_LOGIN_CASES: readonly NegativeLoginCase[] = [
  {
    scenario: 'rejects locked-out account with explicit lock notice',
    username: ENV.lockedOutUser,
    password: ENV.demoPassword,
    expectedError: 'Sorry, this user has been locked out.',
  },
  {
    scenario: 'rejects invalid password with credential mismatch message',
    username: ENV.standardUser,
    password: 'wrong_password_123',
    expectedError: 'Username and password do not match',
  },
  {
    scenario: 'validates missing username',
    username: '',
    password: ENV.demoPassword,
    expectedError: 'Username is required',
  },
  {
    scenario: 'validates missing password',
    username: ENV.standardUser,
    password: '',
    expectedError: 'Password is required',
  },
];

test.describe('Authentication UI Flows', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto('/');
  });

  test('signs in valid standard user and opens product inventory', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(ENV.standardUser, ENV.demoPassword);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  for (const testCase of NEGATIVE_LOGIN_CASES) {
    test(testCase.scenario, async ({ loginPage }) => {
      await loginPage.login(testCase.username, testCase.password);

      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorBanner).toContainText(testCase.expectedError);
    });
  }
});
