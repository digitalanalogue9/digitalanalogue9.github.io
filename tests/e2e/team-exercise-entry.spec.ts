import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const teamValueTitles = (
  JSON.parse(readFileSync(new URL('../../src/data/team-values.json', import.meta.url), 'utf8')) as {
    values: Array<{ title: string }>;
  }
).values.map(({ title }) => title);

test('team action preselects team values without creating a session until start', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  const teamAction = page.getByRole('link', { name: 'Start a team values conversation' });
  await expect(teamAction).toHaveAttribute('href', '/exercise?exerciseType=team');
  await teamAction.click();

  await expect(page).toHaveURL('/exercise?exerciseType=team');
  await expect(page.getByRole('radio', { name: 'Team-focused values' })).toBeChecked();
  await expect(page).not.toHaveURL(/sessionId=/);

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('No sessions saved in this browser yet.')).toBeVisible();
});

test('team session uses team-focused cards and resumes the saved session', async ({ page }) => {
  await page.goto('/exercise?exerciseType=team');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  const teamChoice = page.getByRole('radio', { name: 'Team-focused values' });
  const personalChoice = page.getByRole('radio', { name: 'Personal values' });
  await expect(teamChoice).toBeChecked();

  await personalChoice.check();
  await expect(personalChoice).toBeChecked();
  await teamChoice.check();
  await expect(teamChoice).toBeChecked();

  await page.getByLabel('How many values would you like to finish with?').fill('1');
  await page.getByRole('button', { name: 'Start exercise', exact: true }).click();
  const instructions = page.getByRole('dialog', { name: 'How to use Core Values' });
  await expect(instructions).toBeVisible();
  await instructions.getByRole('button', { name: 'Start sorting' }).click();
  const currentCard = page.getByLabel(/^Current card /);
  await expect(currentCard).toBeVisible();
  const firstTitle = (await currentCard.getByRole('heading').innerText()).toUpperCase();
  expect(teamValueTitles).toContain(firstTitle);

  const sessionUrl = page.url();
  await page.getByRole('link', { name: 'Save and come back later' }).click();
  await expect(page).toHaveURL('/history');
  await expect(page.getByRole('heading', { name: 'Team values session' })).toBeVisible();
  await page.getByRole('link', { name: 'Resume' }).click();
  await expect(page).toHaveURL(sessionUrl);
  await expect(page.getByLabel(`Current card ${firstTitle}`, { exact: true })).toBeVisible();
});

test('personal home action and direct setup keep Personal values selected', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  await page.getByRole('link', { name: 'Find my core values' }).first().click();
  await expect(page).toHaveURL('/exercise');
  await expect(page.getByRole('radio', { name: 'Personal values' })).toBeChecked();

  await page.goto('/exercise');
  await expect(page.getByRole('radio', { name: 'Personal values' })).toBeChecked();
});
