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
  await expect(
    page.getByRole('heading', { level: 1, name: 'Some things matter more. Which things matter to you?' })
  ).toBeVisible();
  await page.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL('/exercise');
  await expect(page).not.toHaveURL(/sessionId=/);
  await expect(page.locator('#main-content h1').last()).toBeVisible();
  await expect(page.locator('#main-content h1').last()).toHaveText('Set up your values exercise');
});

test('optional sample stays in memory, gives neutral feedback, and does not create saved work', async ({ page }) => {
  const requestsAfterLoad: string[] = [];
  const observedRequests: Array<{ url: string; method: string; body: string | null }> = [];
  page.on('request', (request) => {
    observedRequests.push({ url: request.url(), method: request.method(), body: request.postData() });
  });
  await page.route(/https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com)\//, async (route) => {
    requestsAfterLoad.push(route.request().url());
    await route.fulfill({ contentType: 'application/javascript', body: '' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  const requestCountBeforeSample = observedRequests.length;
  const beforeDatabases = await page.evaluate(() => indexedDB.databases().then((dbs) => dbs.map((db) => db.name)));
  const beforeLocalStorage = await page.evaluate(() => Object.keys(localStorage).sort());
  const sample = page.getByRole('region', { name: 'Try a short reflection' });
  const security = sample.getByRole('radio', { name: /Security/ });
  const independence = sample.getByRole('radio', { name: /Independence/ });
  await expect(security).toBeVisible();
  await expect(security).not.toBeChecked();
  await expect(independence).not.toBeChecked();
  await expect(sample.getByText('When two good things compete, what comes first?')).toBeVisible();
  await expect(sample.getByText('There’s no right answer. The interesting part is why.')).toBeVisible();
  await expect(sample.getByText('A sample only. Your choice isn’t saved.')).toBeVisible();
  await expect(sample).toContainText('It is important to know your work will always be there for you.');
  await expect(sample).toContainText(
    'You like being able to work in the way you want, without others telling you what to do.'
  );
  await expect(sample.getByRole('link', { name: 'Find my core values' }).first()).toHaveAttribute('href', '/exercise');

  await security.check();
  const neutralPrompt = 'What makes that feel more important to you today?';
  const completeSetPrompt = 'Explore the complete set and see which other values you want to keep.';
  await expect(sample.getByText(neutralPrompt)).toBeVisible();
  await expect(sample.getByText(completeSetPrompt)).toBeVisible();
  await expect(sample.getByRole('button', { name: 'Reset sample' })).toBeVisible();
  await expect(sample.getByRole('link', { name: 'Find my core values' }).first()).toBeVisible();
  await independence.check();
  await expect(independence).toBeChecked();
  await expect(sample.getByText(neutralPrompt)).toBeVisible();
  await expect(sample.getByText(completeSetPrompt)).toBeVisible();
  await sample.getByRole('button', { name: 'Reset sample' }).click();
  await expect(security).not.toBeChecked();
  await expect(independence).not.toBeChecked();
  await expect(sample.getByText(neutralPrompt)).toHaveCount(0);

  await security.focus();
  await page.keyboard.press('Space');
  await expect(security).toBeChecked();
  await expect(security).toBeFocused();
  await expect(sample.getByText(neutralPrompt)).toBeVisible();
  expect(observedRequests.slice(requestCountBeforeSample)).toEqual([]);
  await page.getByRole('link', { name: 'How it works', exact: true }).first().click();
  await expect(page).toHaveURL('/howtouse');
  await page.getByRole('link', { name: 'Core Values home' }).click();
  await expect(
    page.getByRole('region', { name: 'Try a short reflection' }).getByRole('radio').nth(0)
  ).not.toBeChecked();

  const homeSample = page.getByRole('region', { name: 'Try a short reflection' });
  await homeSample.getByRole('radio', { name: /Security/ }).check();
  await page.reload();
  await expect(page.getByRole('region', { name: 'Try a short reflection' }).getByRole('radio')).toHaveCount(2);
  await expect(
    page.getByRole('region', { name: 'Try a short reflection' }).getByRole('radio').nth(0)
  ).not.toBeChecked();

  expect(requestsAfterLoad).toEqual([]);
  expect(await page.evaluate(() => indexedDB.databases().then((dbs) => dbs.map((db) => db.name)))).toEqual(
    beforeDatabases
  );
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(beforeLocalStorage);
  const selectedSample = page.getByRole('region', { name: 'Try a short reflection' });
  await selectedSample.getByRole('radio', { name: /Security/ }).check();
  await selectedSample.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL('/exercise');
  await expect(page).not.toHaveURL(/sessionId=/);
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();
});

test('sample is usable on mobile with reduced motion and touch-sized controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  const sample = page.getByRole('region', { name: 'Try a short reflection' });
  const firstRadio = sample.getByRole('radio', { name: /Security/ });
  const independence = sample.getByRole('radio', { name: /Independence/ });
  const radioTargets = [firstRadio, independence];
  for (const radio of radioTargets) {
    const targetHeight = await radio.evaluate((input) => input.closest('label')?.getBoundingClientRect().height ?? 0);
    expect(targetHeight).toBeGreaterThanOrEqual(44);
  }
  for (const control of [
    sample.getByRole('button', { name: 'Reset sample' }),
    sample.getByRole('link', { name: 'Find my core values' }).last(),
  ]) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await firstRadio.focus();
  await expect(firstRadio).toBeFocused();
  await page.keyboard.press('Space');
  await expect(sample.getByText('What makes that feel more important to you today?')).toBeVisible();
});
