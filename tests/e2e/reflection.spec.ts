import { expect, test } from '@playwright/test';

test('participant can complete and resume a Scenario reflection', async ({ page }) => {
  await page.goto('/behaviour');
  await page.getByRole('button', { name: 'Begin scenarios' }).click();

  for (let position = 0; position < 6; position += 1) {
    await expect(page.getByText(`Situation ${position + 1} of 6`)).toBeVisible();
    await page.getByRole('radio').first().check();

    if (position < 5) {
      await page.getByRole('button', { name: 'Next situation' }).click();
    } else {
      await page.getByRole('button', { name: 'Finish and see reflections' }).click();
    }
  }

  await expect(page.getByRole('heading', { name: 'Your scenario reflections' })).toBeVisible();
  await expect(page.getByText('Possible intention:', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Possible perception:', { exact: false }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your scenario reflections' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reflection prompts' })).toBeVisible();
});
