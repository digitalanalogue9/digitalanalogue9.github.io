import { expect, test } from '@playwright/test';

test('home keeps its introduction on mobile and shows the example cards on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const cards = page.getByRole('figure', { name: 'Three values from the personal card sort', includeHidden: true });
  await expect(cards).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(cards).toBeVisible();
  await expect(page.locator('.editorial-team--mobile')).toBeHidden();
  const closingTop = await page
    .locator('.editorial-closing')
    .evaluate((element) => element.getBoundingClientRect().top);
  const teamTop = await page
    .locator('.editorial-team--desktop')
    .evaluate((element) => element.getBoundingClientRect().top);
  expect(teamTop).toBeGreaterThan(closingTop);
});

test('mobile home shows the complete personal and team introductions together', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  const personal = page.locator('.editorial-hero');
  const team = page.locator('.editorial-team--mobile');
  await expect(page.locator('.editorial-home').getByRole('link', { name: 'Find my core values' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start a team values conversation' })).toBeVisible();

  for (const viewport of [
    { width: 375, height: 667 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(team).toBeVisible();
    await expect(page.locator('.editorial-team--desktop')).toBeHidden();
    const personalBottom = await personal.evaluate((element) => element.getBoundingClientRect().bottom);
    const teamBottom = await team.evaluate((element) => element.getBoundingClientRect().bottom);
    console.info(
      `Mobile homepage ${viewport.width}×${viewport.height}: personal ${personalBottom}px, team ${teamBottom}px`
    );

    if (viewport.width === 375) {
      expect(personalBottom).toBeLessThanOrEqual(viewport.height);
      expect(teamBottom).toBeLessThanOrEqual(viewport.height);
    }
  }
});

test('keyboard focus follows the personal and team actions in reading order', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  const home = page.locator('.editorial-home');
  const howItWorks = home.getByRole('link', { name: 'See how it works' });
  const resume = home.getByRole('link', { name: 'Resume an exercise' });
  const personalAction = home.getByRole('link', { name: 'Find my core values' });
  const teamAction = home.getByRole('link', { name: 'Start a team values conversation' });

  await howItWorks.focus();
  await page.keyboard.press('Tab');
  await expect(resume).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(personalAction).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(teamAction).toBeFocused();
});

test('keyboard users can skip the shared navigation', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('home introduces the values exercise and keeps the public routes within reach', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reject optional cookies' })).toBeVisible();
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Some things matter more.' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Which things matter to you?' })).toBeVisible();
  await expect(
    page.getByText('Sort value cards to explore your priorities, then reflect on what your final set means to you.')
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find my core values' }).first()).toHaveAttribute('href', '/exercise');
  await expect(page.getByRole('link', { name: 'See how it works' }).first()).toHaveAttribute('href', '/howtouse');
  await expect(page.getByRole('heading', { name: 'Example outcome' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Resume an exercise' })).toHaveAttribute('href', '/history');
  const behaviourInvitation = page.getByRole('link', { name: 'Explore behaviour reflection' });
  if (process.env.VITE_ENABLE_BEHAVIOUR_REFLECTION === 'true') {
    await expect(behaviourInvitation).toHaveAttribute('href', '/behaviour');
  } else {
    await expect(behaviourInvitation).toHaveCount(0);
  }
  await expect(page.getByRole('link', { name: 'How it works', exact: true })).toHaveAttribute('href', '/howtouse');
  await expect(page.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute('href', '/privacy');
  await expect(page.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', '/contact');
  await expect(page).toHaveTitle('Core Values · Explore what matters to you');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    'Sort value cards to explore personal priorities or use the team-focused set together in a meeting to discuss what matters in working together.'
  );

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Some things matter more.' })).toBeVisible();
  await page.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL('/exercise');
  await expect(page).not.toHaveURL(/sessionId=/);
  await expect(page.locator('#main-content h1').last()).toBeVisible();
  await expect(page.locator('#main-content h1').last()).toHaveText('Set up your values exercise');
});

test('mobile navigation opens and closes after following a link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  const navigation = page.getByRole('navigation', { name: 'Main navigation', includeHidden: true });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();
  await menu.click();
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'About' }).focus();
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.click();
  await navigation.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL('/about');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('Home behaviour invitation follows the public feature flag', async ({ page }) => {
  await page.goto('/');
  const invitation = page.getByRole('link', { name: 'Explore behaviour reflection' });
  if (process.env.VITE_ENABLE_BEHAVIOUR_REFLECTION === 'true') {
    await expect(invitation).toHaveAttribute('href', '/behaviour');
  } else {
    await expect(invitation).toHaveCount(0);
  }
});
