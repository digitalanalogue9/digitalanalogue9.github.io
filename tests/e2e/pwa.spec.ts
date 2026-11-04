import { expect, test } from '@playwright/test';

test('production app registers and updates its service worker', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Core Values/);
  await expect
    .poll(() =>
      page.evaluate(() =>
        navigator.serviceWorker?.getRegistration().then((registration) => Boolean(registration?.active))
      )
    )
    .toBe(true);
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker?.controller !== null)).toBe(true);
  const activeAfterUpdateCheck = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (!registration?.active) return false;
    await registration.update();
    return registration.active.state === 'activated';
  });
  expect(activeAfterUpdateCheck).toBe(true);
});

test('production app exposes its personal installation manifest and icons', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
  const manifest = await page.evaluate(async () => {
    const response = await fetch('/manifest.webmanifest');
    return response.json();
  });
  expect(manifest.name).toBe('Core Values');
  expect(manifest.id).toBe('https://core-values.me/');
  expect(manifest.start_url).toBe('https://core-values.me/');
  expect(manifest.scope).toBe('https://core-values.me/');
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ src: '/icons/icon-192x192.png', sizes: '192x192' }),
      expect.objectContaining({ src: '/icons/icon-512x512.png', sizes: '512x512' }),
    ])
  );
});

test('visitor sees offline status while the installed app is offline', async ({ page, context }) => {
  await page.goto('/');
  await expect
    .poll(() =>
      page.evaluate(() =>
        navigator.serviceWorker?.getRegistration().then((registration) => Boolean(registration?.active))
      )
    )
    .toBe(true);
  await page.reload();

  await context.setOffline(true);
  await page.goto('/history');

  await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('You are offline. Some features may be limited.');

  await context.setOffline(false);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('visitor can use the browser install prompt when it is supported', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted'; platform: string }>;
    };
    event.prompt = () => Promise.resolve();
    event.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'test' });
    window.dispatchEvent(event);
  });

  const prompt = page.getByRole('alertdialog', { name: 'Install Core Values App' });
  await expect(prompt).toBeVisible();
  await prompt.getByRole('button', { name: 'Install application' }).click();
  await expect(prompt).toHaveCount(0);
});
