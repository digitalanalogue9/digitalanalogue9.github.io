import { expect, test } from '@playwright/test';

test('visitor can read and refresh the how it works guide', async ({ page }) => {
  await page.goto('/howtouse', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { name: 'Sort. Narrow. Reflect.' })).toBeVisible();
  await expect(page.getByText('Example exercise')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sort the cards' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Narrow your choices' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reflect on your final set' })).toBeVisible();
  await expect(page.getByText('Export reflection backup')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find my core values' }).first()).toHaveAttribute('href', '/exercise');
  await expect(page.getByRole('link', { name: 'View History' }).first()).toHaveAttribute('href', '/history');
  await expect(page.getByRole('link', { name: 'Explore behaviour reflection' }).first()).toHaveAttribute(
    'href',
    '/behaviour'
  );

  await expect(page).toHaveTitle('How Core Values works');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups.'
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'How Core Values works');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Sort. Narrow. Reflect.' })).toBeVisible();
});

test('guide actions open exercise setup and History', async ({ page }) => {
  await page.goto('/howtouse', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL(/\/exercise\/?$/);
  await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();

  await page.goto('/howtouse', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'View History' }).first().click();
  await expect(page).toHaveURL(/\/history\/?$/);
  await expect(page.getByRole('heading', { name: 'Session History' })).toBeVisible();
});

test('visitor can change the saved instruction preference from the guide', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.localStorage.setItem('show-instructions', 'false'));
  await page.goto('/howtouse', { waitUntil: 'domcontentloaded' });

  const preference = page.getByRole('checkbox', { name: 'Show instructions when starting the exercise' });
  await expect(preference).not.toBeChecked();
  await expect(page.getByText('Instructions will not appear automatically.')).toBeVisible();

  await preference.check();
  await expect(page.getByText('Instructions will appear at the start of each new exercise.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('show-instructions'))).toBe('true');

  await page.reload();
  await expect(preference).toBeChecked();
});

test('example views scale on a 320px screen and guide links receive keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/howtouse', { waitUntil: 'domcontentloaded' });

  const images = page.locator('.help-guide__view img');
  await expect(images).toHaveCount(3);
  for (const image of await images.all()) {
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }

  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    images: Array.from(document.querySelectorAll('.help-guide__view img')).map(
      (image) => image.getBoundingClientRect().width
    ),
    content: document.querySelector('.help-guide')?.getBoundingClientRect().width ?? 0,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  expect(widths.images.every((width) => width <= widths.content)).toBe(true);

  const action = page.getByRole('link', { name: 'Find my core values' }).first();
  await action.focus();
  await expect(action).toBeFocused();
  await expect.poll(() => action.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid');
});

test('guide explains each view when an illustration cannot load', async ({ page }) => {
  await page.route('**/images/how-it-works-*.svg', (route) => route.abort());
  await page.goto('/howtouse', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Example view unavailable')).toHaveCount(3);
  await expect(page.getByRole('img', { name: /Security card is being placed/ })).toBeVisible();
  await expect(page.getByRole('img', { name: /Two sample rounds show/ })).toBeVisible();
  await expect(page.getByRole('img', { name: /A final example set lists/ })).toBeVisible();
});
