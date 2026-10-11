import { expect, test } from '@playwright/test';

test('production cannot place a simulated order or discard the cart', async ({ page }) => {
  await page.goto('/checkout');
  for (const [id, value] of Object.entries({ email: 'audit@example.com', phone: '9999999999', firstName: 'Audit', address: 'Local test only', city: 'Bhubaneswar', pincode: '751001' })) {
    await page.locator(`#${id}`).fill(value);
  }
  await page.getByRole('button', { name: 'Pay Now', exact: true }).click();
  await expect(page.getByText('Checkout is currently unavailable. Please try again later.')).toBeVisible();
  await expect(page).toHaveURL(/\/checkout$/);
});

test('production cannot report a simulated OTP send', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input').first().fill('9876543210');
  await page.locator('button[type=submit]').click();
  await expect(page.getByText("We couldn't send the verification code. Please try again.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
