import { expect, test } from '@playwright/test';

test('start, sort, save, resume, replay a previous round and complete with an optional reason', async ({ page }) => {
  await page.goto('/exercise');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  await page.getByLabel('Target number of core values').fill('1');
  await page.getByRole('button', { name: 'Start personal exercise', exact: true }).click();
  const instructions = page.getByRole('dialog', { name: 'How to use Core Values' });
  await expect(instructions).toBeVisible();
  await instructions.getByRole('checkbox', { name: "Don't show again" }).check();
  await instructions.getByRole('button', { name: 'Start sorting' }).click();

  const firstCard = page.getByRole('list', { name: 'Value cards to sort' }).getByRole('listitem').first();
  const keptTitle = await firstCard.locator('strong').innerText();
  await firstCard.getByRole('button', { name: `Place ${keptTitle}`, exact: true }).click();
  await expect(page.getByRole('region', { name: 'Very Important', exact: true })).toContainText(keptTitle);
  const sessionUrl = page.url();
  await page.getByRole('link', { name: 'Save and return to history' }).click();
  await page.reload();
  await page.getByRole('link', { name: 'Resume exercise' }).click();
  await expect(page).toHaveURL(sessionUrl);
  await expect(instructions).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Very Important', exact: true })).toContainText(keptTitle);

  // Retain one more card so the next round can demonstrate replay and early finish.
  let retainAnother = true;
  while (await page.getByRole('list', { name: 'Value cards to sort' }).count()) {
    const card = page.getByRole('list', { name: 'Value cards to sort' }).getByRole('listitem').first();
    const title = await card.locator('strong').innerText();
    await card.getByRole('combobox').selectOption(retainAnother ? 'Very Important' : 'Not Important');
    retainAnother = false;
    await card.getByRole('button', { name: `Place ${title}`, exact: true }).click();
    await expect(page.getByRole('button', { name: `Place ${title}`, exact: true })).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Continue to next round' }).click();
  await expect(page.getByRole('heading', { name: 'Round 2', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Replay previous round' }).click();
  await expect(page.getByRole('list', { name: 'Value cards to sort' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Finish early' }).click();
  await expect(page).toHaveURL(/\/reasoning\?sessionId=/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Reflect on your choices' })).toBeVisible();
  const finalTitle = await page
    .getByRole('textbox')
    .first()
    .evaluate((input: HTMLTextAreaElement) => input.labels?.[0].textContent ?? '');
  await page.getByRole('textbox', { name: finalTitle, exact: true }).fill('This helps me choose deliberately.');
  await page.getByRole('button', { name: 'Complete exercise', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Exercise complete' })).toBeVisible();
  await expect(page.getByText('This helps me choose deliberately.', { exact: true })).toBeVisible();
  await page
    .getByRole('textbox', { name: `Observation for ${finalTitle}`, exact: true })
    .fill('I noticed this in a recent choice.');
  await page.getByRole('button', { name: 'Save reflection', exact: true }).click();
  await expect(page.getByText('Reflection saved on this device.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('This helps me choose deliberately.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: `Observation for ${finalTitle}`, exact: true })).toHaveValue(
    'I noticed this in a recent choice.'
  );
  await page.getByRole('link', { name: 'Back to history' }).click();
  await expect(page.getByRole('link', { name: 'Review exercise' })).toBeVisible();
  await page.getByRole('link', { name: 'Replay choices' }).click();
  await expect(page.getByRole('heading', { name: 'Round 1 choices' })).toBeVisible();
  await expect(page.getByText(`${keptTitle} placed in Very Important`, { exact: true })).toBeVisible();
});

test('Analytics makes no network request before consent and loads after explicit grant', async ({ page }) => {
  const analyticsRequests: string[] = [];
  await page.route(/https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com)\//, async (route) => {
    analyticsRequests.push(route.request().url());
    await route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Allow Analytics' })).toBeVisible();
  await page.getByRole('link', { name: 'Start an exercise', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Start an exercise' })).toBeVisible();
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
