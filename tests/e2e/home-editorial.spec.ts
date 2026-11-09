import { expect, test } from '@playwright/test';

test('home introduces the values exercise and keeps the public routes within reach', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reject optional cookies' })).toBeVisible();
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();

  await expect(
    page.getByRole('heading', { level: 1, name: 'Some things matter more. Which things matter to you?' })
  ).toBeVisible();
  await expect(
    page.getByText(
      'Sort value cards to explore your priorities. Narrow your choices, then reflect on what your final set means to you.'
    )
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find my core values' }).first()).toHaveAttribute('href', '/exercise');
  await expect(page.getByRole('link', { name: 'See how it works' }).first()).toHaveAttribute('href', '/howtouse');
  await expect(page.getByRole('heading', { name: 'Example outcome' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Resume an exercise in History' })).toHaveAttribute('href', '/history');
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
    'Sort value cards, choose what matters most to you and reflect on your priorities. Save your exercise in this browser and return to it later.'
  );

  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Some things matter more. Which things matter to you?' })
  ).toBeVisible();
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
