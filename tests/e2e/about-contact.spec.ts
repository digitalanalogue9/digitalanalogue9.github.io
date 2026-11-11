import { expect, test } from '@playwright/test';

test('About and Contact load directly, refresh, and remain usable at 320px', async ({ page }) => {
  const pages = [
    {
      path: '/about',
      heading: 'It started with a borrowed deck of cards.',
      title: 'About Core Values · A borrowed deck of cards',
      action: 'exercise',
    },
    {
      path: '/contact',
      heading: 'A question, an idea, or something that didn’t work?',
      title: 'Contact · Core Values',
      action: 'email',
    },
  ] as const;

  for (const { path, heading, title, action } of pages) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await expect(page).toHaveTitle(title);

    const primaryLink =
      action === 'exercise'
        ? page.getByRole('main').getByRole('link', { name: 'Find my core values' })
        : page.getByRole('main').getByRole('link', { name: 'corevaluesanalytics@gmail.com' });
    if (action === 'exercise') await expect(primaryLink).toHaveAttribute('href', '/exercise');
    else await expect(primaryLink).toHaveAttribute('href', 'mailto:corevaluesanalytics@gmail.com');

    await page.screenshot({ path: `test-results/${path.slice(1)}-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 320, height: 900 });
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.getByRole('button', { name: 'Menu' }).press('Enter');
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    for (const target of await page.locator('.public-nav a, .editorial-button, .public-footer nav a').all()) {
      expect(await target.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
    await primaryLink.focus();
    await expect(primaryLink).toBeFocused();
    expect(await primaryLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
    await page.screenshot({ path: `test-results/${path.slice(1)}-mobile.png`, fullPage: true });

    await page.reload();
    await expect(page).toHaveURL(new RegExp(`${path}/?$`));
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    if (action === 'exercise') {
      await primaryLink.click();
      await expect(page).toHaveURL(/\/exercise\/?$/);
      await expect(page.getByRole('heading', { name: 'Set up your values exercise' })).toBeVisible();
    }
  }

  await page.goto('/history');
  await expect(page.getByText('No sessions saved in this browser yet.')).toBeVisible();

  await page.goto('/about');
  await expect(page.getByRole('link', { name: 'James Clear: Let Your Values Drive Your Choices' })).toHaveAttribute(
    'href',
    'https://jamesclear.com/values-choices'
  );
  await expect(
    page.getByRole('link', { name: 'Brené Brown and Barrett Guillen: Living Into Our Values' })
  ).toHaveAttribute('href', 'https://brenebrown.com/podcast/living-into-our-values/');
  await expect(page.getByRole('link', { name: 'Larisa Halilović: Core Values - Your Inner Compass' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=mL4l75rMIiQ'
  );
});
