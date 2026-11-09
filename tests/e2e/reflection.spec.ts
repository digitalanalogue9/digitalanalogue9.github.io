import { expect, test } from '@playwright/test';

test.skip(
  process.env.VITE_ENABLE_BEHAVIOUR_REFLECTION !== 'true',
  'The behaviour-reflection journey requires an enabled Vite build.'
);

test('participant can complete and resume a Behaviour reflection', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/behaviour');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  await page.getByRole('button', { name: 'Start reflection' }).click();

  for (let position = 0; position < 6; position += 1) {
    await expect(page.getByText(`Situation ${position + 1} of 6`)).toBeVisible();
    await page.getByRole('radio').first().check();

    if (position < 5) {
      await page.getByRole('button', { name: 'Next situation' }).click();
    } else {
      await page.getByRole('button', { name: 'Finish and see perspectives' }).click();
    }
  }

  await expect(page.getByRole('heading', { name: 'Your reflections' })).toBeVisible();
  await expect(page.getByText('Possible intention:', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Possible perception:', { exact: false }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your reflections' })).toBeVisible();
  await page.getByRole('button', { name: /Continue with.*conversation prompt/ }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Copy prompt', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('hypothetical');
  await page.getByRole('button', { name: 'Recurring prompt', exact: true }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByLabel('Local time', { exact: true }).fill('11:30');
  await expect(page.getByRole('button', { name: 'Copy recurring prompt', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Copy recurring prompt', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('11:30');
  await page.reload();
  await page.getByRole('button', { name: /Continue with.*conversation prompt/ }).click();
  await page.getByRole('button', { name: 'Recurring prompt', exact: true }).click();
  await expect(page.getByLabel('Local time', { exact: true })).toHaveValue('11:30');
  await page.screenshot({ path: '.scratch/parity-scenario-prompts.png', fullPage: true });
  await page.goto('/history');
  const history = page.getByRole('region', { name: 'Behaviour reflections', exact: true });
  await expect(history.getByRole('button', { name: 'Review', exact: true })).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await history.getByRole('button', { name: 'Download results', exact: true }).click();
  expect((await downloaded).suggestedFilename()).toContain('scenario');
  await history.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.reload();
  await expect(history.getByRole('button', { name: 'Review', exact: true })).toHaveCount(0);
});
