import { expect, test } from '@playwright/test';

test('visitor can reach personal app pages from the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Core Values' })).toBeVisible();
  await expect(page.getByRole('navigation')).toContainText('About');
  await expect(page.getByRole('navigation')).toContainText('How to use');
  await expect(page.getByRole('navigation')).toContainText('Privacy');

  await page.getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible();
});

test('visitor can open and refresh a direct application route', async ({ page }) => {
  await page.goto('/history');
  await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/history\/?$/);
  await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
});
