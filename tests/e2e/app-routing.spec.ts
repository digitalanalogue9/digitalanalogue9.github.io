import { expect, test } from '@playwright/test';

test('visitor can reach personal app pages from the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).toContainText('About');
  await expect(navigation).toContainText('How it works');
  await expect(navigation).toContainText('History');

  await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Privacy' }).click();
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
  await expect(page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  await page.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL(/\/exercise\/?$/);
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();
  await page.goto('/exercise');
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test('exercise setup creates a team-focused Session only after an explicit start', async ({ page }) => {
  const sessionsLoaded = page
    .getByText('No sessions saved in this browser yet.')
    .or(page.getByRole('listitem').first());

  await page.goto('/history');
  await expect(sessionsLoaded).toBeVisible();
  const initialSessionCount = await page.getByRole('listitem').count();

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  await page.goto('/exercise');
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Team-focused values' })).toBeVisible();
  await expect(
    page.getByText(
      'The team-focused set is an individual exercise about what matters to you at work. You can use your choices to start a conversation with others.'
    )
  ).toBeVisible();
  await page.getByRole('radio', { name: 'Team-focused values' }).check();
  await page.getByRole('spinbutton', { name: 'How many values would you like to finish with?' }).fill('2');
  await expect(page).toHaveURL(/\/exercise\/?$/);

  await page.goto('/history');
  await expect(sessionsLoaded).toBeVisible();
  expect(await page.getByRole('listitem').count()).toBe(initialSessionCount);

  await page.goto('/exercise');
  await page.getByRole('button', { name: 'Start exercise' }).click();

  await expect(page).toHaveURL(/\/exercise\?sessionId=/);
  await expect(page.getByRole('region', { name: 'Current card' })).toBeVisible();
  await page.goto('/history');
  await expect(sessionsLoaded).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(initialSessionCount + 1);
  await expect(page.getByRole('link', { name: 'Resume' }).first()).toBeVisible();
});
