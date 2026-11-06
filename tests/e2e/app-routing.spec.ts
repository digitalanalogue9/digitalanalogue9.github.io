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

test('home and direct exercise setup load and refresh without browser runtime errors', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Core Values', exact: true })).toBeVisible();
  await page.goto('/exercise');
  await expect(page.getByRole('heading', { name: 'Explore what matters to you' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Explore what matters to you' })).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test('exercise setup creates a team-focused Session only after an explicit start', async ({ page }) => {
  await page.goto('/exercise');
  await expect(page.getByRole('radio', { name: 'Team-focused values' })).toBeVisible();
  await expect(page.getByText(/This is an individual exercise using values relevant to working together/)).toBeVisible();
  await page.getByRole('radio', { name: 'Team-focused values' }).check();
  await page.getByRole('spinbutton', { name: 'Target number of core values' }).fill('2');
  await expect(page).toHaveURL(/\/exercise\/?$/);
  await page.getByRole('button', { name: 'Start exercise' }).click();

  await expect(page).toHaveURL(/\/exercise\?sessionId=/);
  await expect(page.getByRole('region', { name: 'Current card' })).toBeVisible();
  await page.goto('/history');
  await expect(page.getByRole('link', { name: 'Resume' }).first()).toBeVisible();
});
