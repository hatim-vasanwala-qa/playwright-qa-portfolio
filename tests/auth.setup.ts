import fs from 'node:fs';
import path from 'node:path';
import { expect, test as setup } from '../fixtures/test-fixtures';
import { ENV } from '../config/env';

setup('authenticate standard user and persist storageState', async ({ page, loginPage }) => {
  await loginPage.goto('/');
  await loginPage.login(ENV.standardUser, ENV.demoPassword);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');

  fs.mkdirSync(path.dirname(ENV.authStoragePath), { recursive: true });
  await page.context().storageState({ path: ENV.authStoragePath });
});
