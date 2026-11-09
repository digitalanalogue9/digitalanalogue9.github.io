import { expect, test } from '@playwright/test';

test('start, sort, save, resume, replay a previous round and complete with an optional reason', async ({ page }) => {
  await page.goto('/exercise');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  await page.getByLabel('How many values would you like to finish with?').fill('1');
  await page.getByRole('button', { name: 'Start exercise', exact: true }).click();
  const instructions = page.getByRole('dialog', { name: 'How to use Core Values' });
  await expect(instructions).toBeVisible();
  await instructions.getByRole('checkbox', { name: "Don't show again" }).check();
  await instructions.getByRole('button', { name: 'Start sorting' }).click();

  const firstCard = page.getByLabel(/^Current card /);
  const keptTitle = await firstCard.getByRole('heading').innerText();
  await page.getByRole('button', { name: 'Place current card in Very Important' }).click();
  await expect(page.getByRole('article', { name: 'Very Important category' })).toContainText(keptTitle);
  const sessionUrl = page.url();
  await page.getByRole('link', { name: 'Save and come back later' }).click();
  await page.reload();
  await page.getByRole('link', { name: 'Resume' }).click();
  await expect(page).toHaveURL(sessionUrl);
  await expect(instructions).toHaveCount(0);
  await expect(page.getByRole('article', { name: 'Very Important category' })).toContainText(keptTitle);

  // Retain one more card so the next round can demonstrate replay and early finish.
  let retainAnother = true;
  while (await page.getByLabel(/^Current card /).count()) {
    const card = page.getByLabel(/^Current card /);
    const title = await card.getByRole('heading').innerText();
    await page
      .getByRole('button', {
        name: `Place current card in ${retainAnother ? 'Very Important' : 'Not Important'}`,
        exact: true,
      })
      .click();
    retainAnother = false;
    await expect(page.getByLabel(`Current card ${title}`, { exact: true })).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Next Round' }).click();
  await expect(page.getByRole('heading', { name: 'Round 2 command center', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Replay Previous Round' }).click();
  await expect(page.getByLabel(/^Current card /)).toHaveCount(0);
  await page.getByRole('button', { name: 'Early Finish' }).click();
  await expect(page).toHaveURL(/\/reasoning\?sessionId=/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Reflect on your choices' })).toBeVisible();
  const finalTitle = await page
    .getByRole('textbox')
    .first()
    .evaluate(
      (input: HTMLTextAreaElement) => input.labels?.[0].querySelector('span:last-child')?.textContent?.trim() ?? ''
    );
  await page.getByRole('textbox').first().fill('This helps me choose deliberately.');
  await page.getByRole('button', { name: 'Save Completed Session', exact: true }).click();
  await expect(page.getByLabel('Reflect on your values', { exact: true })).toBeVisible();
  await page.getByLabel('Original results', { exact: true }).click();
  await expect(page.getByText('This helps me choose deliberately.', { exact: true })).toBeVisible();
  await page
    .getByRole('textbox', { name: `Observation for ${finalTitle}`, exact: true })
    .fill('I noticed this in a recent choice.');
  await page.getByRole('button', { name: 'Save reflection', exact: true }).click();
  await expect(page.getByText('Reflection saved on this device.', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByLabel('Original results', { exact: true }).click();
  await expect(page.getByText('This helps me choose deliberately.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: `Observation for ${finalTitle}`, exact: true })).toHaveValue(
    'I noticed this in a recent choice.'
  );
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'History', exact: true })
    .click();
  await expect(page.getByRole('link', { name: 'View results' })).toBeVisible();
  await page.getByRole('link', { name: 'Replay', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Replay', exact: true })).toBeVisible();
  await page.getByLabel('Playback speed').selectOption('2x');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Round 1 snapshot' })).toBeVisible();
  await page.screenshot({ path: '.scratch/parity-replay.png', fullPage: true });
});

test('Analytics makes no network request before consent and loads after explicit grant', async ({ page }) => {
  const analyticsRequests: string[] = [];
  await page.route(/https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com)\//, async (route) => {
    analyticsRequests.push(route.request().url());
    await route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Allow Analytics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Some things matter more. Which things matter to you?' })).toBeVisible();
  expect(analyticsRequests).toEqual([]);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Allow Analytics' }).click();
  await expect.poll(() => analyticsRequests).toContain('https://www.googletagmanager.com/gtag/js?id=G-JZPX5JCP5D');
  await expect
    .poll(() =>
      page.evaluate(() => window.dataLayer?.some((entry) => entry[0] === 'event' && entry[1] === 'page_view'))
    )
    .toBe(true);
});
