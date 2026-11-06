import { expect, test } from '@playwright/test';

test('visitor can reach personal app pages from the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Core Values' })).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).toContainText('About');
  await expect(navigation).toContainText('How to use');
  await expect(navigation).toContainText('Privacy');

  await navigation.getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { name: 'Privacy', exact: true })).toBeVisible();
});

test('visitor can open and refresh a direct application route', async ({ page }) => {
  await page.goto('/history');
  await expect(page.getByRole('heading', { name: 'Session History' })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/history\/?$/);
  await expect(page.getByRole('heading', { name: 'Session History' })).toBeVisible();
});
