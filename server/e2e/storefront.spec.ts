import { expect, test } from '@playwright/test';

test('cart renders and checkout button navigates', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto('/cart');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Your Cart', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: /Checkout/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.locator('#email')).toBeVisible();
  expect(errors).toEqual([]);
});

test('category grid fits viewport and retains visual tokens', async ({ page }, testInfo) => {
  await page.goto('/category/personalised-gifts');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return ['--background', '--primary', '--secondary'].map(name => styles.getPropertyValue(name).trim());
  });
  expect(tokens.map(token => token.toLowerCase())).toEqual(['#fcfaf5', '#07514d', '#d2a01f']);
  await page.screenshot({ path: testInfo.outputPath('category.png'), animations: 'disabled' });
});

test('search safely handles a literal percent', async ({ page }) => {
  const response = await page.goto('/search?q=%25');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'No gifts found for "%"' })).toBeVisible();
});

test('sample order confirmation renders without client exceptions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/order/success/ORD-12345');
  await expect(page.getByText('ORD-12345', { exact: false }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('tracking shows existing development fixture', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/track-order');
  await page.locator('#orderId').fill('ORD-12345');
  await page.locator('#email').fill('ananya.sharma@example.com');
  await page.getByRole('button', { name: 'Track Order', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Order Tracking', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('OTP form remains accessible at its established route', async ({ page }) => {
  await page.goto('/verify-otp?id=9876543210');
  await expect(page.getByRole('heading', { name: 'Verify your number' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verify & Continue' })).toBeDisabled();
});
