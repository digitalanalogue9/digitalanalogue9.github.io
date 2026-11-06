import { expect, test } from '@playwright/test';

test('home introduces the values exercise and keeps the public routes within reach', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reject optional cookies' })).toBeVisible();
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  await expect(page.getByText('Sort value cards to explore your priorities. Narrow your choices, then reflect on what your final set means to you.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find my core values' }).first()).toHaveAttribute('href', '/exercise');
  await expect(page.getByRole('link', { name: 'See how it works' }).first()).toHaveAttribute('href', '/howtouse');
  await expect(page.getByRole('heading', { name: 'Example outcome' })).toBeVisible();
  const exampleValues = page.getByRole('list', { name: 'Illustrative final set' });
  await expect(exampleValues.getByRole('heading', { name: 'Learning' })).toBeVisible();
  await expect(exampleValues.getByRole('heading', { name: 'Independence' })).toBeVisible();
  await expect(exampleValues.getByRole('heading', { name: 'Helping others' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Resume an exercise in History' })).toHaveAttribute('href', '/history');
  await expect(page.getByRole('link', { name: 'Explore behaviour reflection' })).toHaveAttribute('href', '/behaviour');
  await expect(page.getByRole('link', { name: 'How it works', exact: true })).toHaveAttribute('href', '/howtouse');
  await expect(page.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute('href', '/privacy');
  await expect(page.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', '/contact');
  await expect(page).toHaveTitle('Core Values · Explore what matters to you');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    'Sort value cards, choose what matters most to you and reflect on your priorities. Save your exercise in this browser and return to it later.'
  );

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  await page.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL('/exercise');
  await expect(page).not.toHaveURL(/sessionId=/);
  await expect(page.locator('#main-content h1').last()).toBeVisible();
  await expect(page.locator('#main-content h1').last()).toHaveText('Set up your values exercise');
});
