import { expect, test } from '@playwright/test';

test('visitor can reach personal app pages from the home page', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })
  ).toBeVisible();
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
  await expect(page.getByLabel('Backup file contents (JSON)')).toBeVisible();
  await expect(page.getByText(/Restoring a behaviour reflection backup with an existing ID/)).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/history\/?$/);
  await expect(page.getByRole('heading', { name: 'Session History' })).toBeVisible();
});

test('trailing-slash routes preserve their page-specific layout', async ({ page }) => {
  await page.goto('/about/');
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('main', { name: 'Main content' })).toHaveClass(/core-values-background--about/);

  await page.goto('/exercise/');
  await expect(page).toHaveURL(/\/exercise\/$/);
  await expect(page.getByRole('main', { name: 'Main content' })).toHaveClass(/exercise-main/);
  await expect(page.locator('footer')).toHaveClass(/exercise-footer/);
});

test('behaviour reflection route follows the build-time feature flag', async ({ page }) => {
  await page.goto('/behaviour');

  if (process.env.VITE_ENABLE_BEHAVIOUR_REFLECTION === 'true') {
    await expect(page.getByRole('heading', { name: 'Behaviour reflection' })).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'We couldn’t find that page' })).toBeVisible();
  }
});

test('privacy page loads directly, refreshes and manages consent', async ({ page }) => {
  await page.goto('/privacy');

  await expect(page.getByRole('heading', { name: 'Privacy', exact: true })).toBeVisible();
  await expect(page).toHaveTitle('Privacy · Core Values');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Understand what Core Values saves in your browser, how backups work and how to allow or reject optional Google Analytics.'
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://core-values.me/privacy/');

  const banner = page.getByRole('region', { name: 'Privacy preferences' });
  await expect(banner).toContainText('Optional Google Analytics helps me understand visits to this site.');
  await expect(banner.getByRole('button', { name: 'Allow analytics' })).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Reject optional cookies' })).toBeVisible();
  await expect(banner.getByText('Customise preferences')).toBeVisible();
  await banner.getByRole('link', { name: 'Read the privacy notice' }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await page.setViewportSize({ width: 320, height: 800 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);
  // A 640px CSS viewport matches a 1280px browser viewport at 200% zoom.
  await page.setViewportSize({ width: 640, height: 800 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);
  const rejectAnalytics = page.getByRole('button', { name: 'Reject analytics' });
  await rejectAnalytics.focus();
  await rejectAnalytics.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Your analytics preference has been saved.');
  await expect(
    page.getByRole('main', { name: 'Main content' }).getByRole('button', { name: 'Allow analytics' })
  ).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Privacy', exact: true })).toBeVisible();
  await expect(page.getByText('Rejected', { exact: true })).toBeVisible();
});

test('home and direct exercise setup load and refresh without browser runtime errors', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })
  ).toBeVisible();
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
  const sessionSelector = page.getByRole('combobox', { name: 'Choose a session' });
  const sessionOptions = sessionSelector.locator('option');
  const noSavedSessions = page.getByText('No sessions saved in this browser yet.');
  const sessionsLoaded = sessionSelector.or(noSavedSessions);

  await page.goto('/history');
  await expect(sessionsLoaded).toBeVisible();
  const initialSessionCount = await sessionOptions.count();

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })
  ).toBeVisible();
  await page.goto('/exercise');
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Team-focused values' })).toBeVisible();
  await expect(
    page.getByText(
      'Use the team-focused set together to discuss what matters to your team and agree on your team’s core values.'
    )
  ).toBeVisible();
  await page.getByRole('radio', { name: 'Team-focused values' }).check();
  await page.getByRole('spinbutton', { name: 'How many values would you like to finish with?' }).fill('2');
  await expect(page).toHaveURL(/\/exercise\/?$/);

  await page.goto('/history');
  await expect(sessionsLoaded).toBeVisible();
  expect(await sessionOptions.count()).toBe(initialSessionCount);

  await page.goto('/exercise');
  await page.getByRole('button', { name: 'Start exercise' }).click();

  await expect(page).toHaveURL(/\/exercise\?sessionId=/);
  await expect(page.getByRole('region', { name: 'Current card' })).toBeVisible();
  await page.goto('/history');
  await expect(sessionsLoaded).toBeVisible();
  await expect(sessionOptions).toHaveCount(initialSessionCount + 1);
  await expect(page.getByRole('link', { name: 'Resume', exact: true })).toBeVisible();
});
