import { expect, test, type Page } from '@playwright/test';
import data from '../../src/data/values.json' with { type: 'json' };

const cards = data.values.slice(0, 3).map(({ id, title, description }) => ({ id, title, description }));
const sessionId = 'functional-pages-session';
const backup = {
  version: 2,
  exportedAt: 100,
  session: {
    id: sessionId,
    version: 2,
    createdAt: 100,
    updatedAt: 200,
    exerciseType: 'personal',
    targetCoreValues: 1,
    initialValues: cards,
    currentRoundNumber: 1,
    status: 'completed',
  },
  rounds: [
    {
      version: 2,
      sessionId,
      roundNumber: 1,
      targetCoreValues: 1,
      deck: [],
      activeCategories: ['Very Important', 'Quite Important', 'Important', 'Not Important'],
      categories: {
        'Very Important': [cards[0]],
        'Quite Important': [],
        Important: [],
        'Of Some Importance': [],
        'Not Important': cards.slice(1),
      },
      commands: cards.map((card, i) => ({
        kind: 'drop',
        valueId: card.id,
        toCategory: i === 0 ? 'Very Important' : 'Not Important',
      })),
      createdAt: 100,
      updatedAt: 200,
    },
  ],
  completedSession: {
    version: 2,
    sessionId,
    completedAt: 200,
    finalValues: [{ ...cards[0], reason: 'My saved reason.' }],
    reflection: {
      version: 1,
      values: { [cards[0].id]: { observation: 'My private observation.' } },
      goal: 'My private goal.',
    },
  },
};

async function importBackup(page: Page) {
  await page.goto('/history');
  await page.getByRole('button', { name: 'Reject optional cookies' }).click();
  await page.getByLabel('Backup file contents (JSON)').fill(JSON.stringify(backup));
  await page.getByRole('button', { name: /Import.*text/ }).click();
  await expect(page.getByRole('link', { name: 'Resume session', exact: true })).toBeVisible();
}
async function downloadJson(page: Page, button: string) {
  const previousCount = await page.evaluate(
    () =>
      (window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> })
        .__capturedDownloads.length
  );
  await page.getByRole('button', { name: button, exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> })
            .__capturedDownloads.length
      )
    )
    .toBe(previousCount + 1);
  const captured = await page.evaluate(() =>
    (
      window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> }
    ).__capturedDownloads.at(-1)!
  );
  return JSON.parse(captured.content);
}

test('history imports, exports, copies and deletes sessions; results provide print, HTML and prompt workflows', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await context.addInitScript(() => {
    window.print = () => {};
    const target = window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> };
    target.__capturedDownloads = [];
    document.addEventListener(
      'click',
      (event) => {
        const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[download]');
        if (!anchor) return;
        event.preventDefault();
        void fetch(anchor.href)
          .then((response) => response.text())
          .then((content) => target.__capturedDownloads.push({ filename: anchor.download, content }));
      },
      true
    );
  });
  await importBackup(page);
  const legacy = await downloadJson(page, 'Legacy backup');
  expect(legacy.session.timestamp).toBeDefined();
  const ordinary = await downloadJson(page, 'Export');
  expect(ordinary.completedSession.reflection.goal).toBe('My private goal.');
  expect(ordinary.completedSession.reflection.values[cards[0].id].observation).toBe('My private observation.');
  await expect(page.getByRole('button', { name: 'Reflection backup', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Copy values', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(cards[0].title);
  await page.getByRole('link', { name: 'Resume session', exact: true }).click();
  await expect(page).toHaveURL(/\/reasoning\?sessionId=/);
  await page.getByRole('link', { name: 'Back to results', exact: true }).click();
  await expect(page).toHaveURL(/\/completed\?sessionId=/);
  await page.getByRole('link', { name: 'Back to reflection', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Session goal (optional)' })).toHaveValue('My private goal.');
  await page.getByRole('link', { name: 'Back to results', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Set up recurring reflection', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your core values', level: 1 })).toBeVisible();
  const resultDetails = page.getByRole('region', { name: 'Selected core values' });
  await expect(resultDetails.locator('ol')).toBeVisible();
  await expect(resultDetails.locator('dt')).toHaveText(['Session reference', 'Completed']);
  expect(
    await resultDetails
      .locator('ol')
      .evaluate((list) =>
        Boolean(
          list.compareDocumentPosition(list.parentElement!.querySelector('dl')!) & Node.DOCUMENT_POSITION_FOLLOWING
        )
      )
  ).toBe(true);
  await expect(page.getByRole('radio', { name: 'Microsoft 365 Copilot', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Microsoft 365 Copilot Chat', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Claude Cowork', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Codex', exact: true })).toHaveCount(0);
  await expect(page.getByText(/Microsoft calls these Scheduled tasks\./)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Microsoft guide to scheduled tasks in Copilot Chat' })).toHaveAttribute(
    'href',
    'https://support.microsoft.com/en-us/microsoft-365-copilot/schedule-your-most-used-copilot-prompts'
  );
  await page.getByRole('radio', { name: 'Microsoft 365 Copilot', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Claude Cowork', exact: true })).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Claude Cowork', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Microsoft 365 Copilot Chat', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Claude guide to scheduled tasks' })).toHaveAttribute(
    'href',
    'https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork'
  );
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Codex', exact: true })).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Codex', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Claude Cowork', exact: true })).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Official OpenAI documentation for Codex scheduled tasks' })
  ).toHaveAttribute('href', 'https://developers.openai.com/codex/app/automations');
  const prompt = page.getByRole('textbox', { name: 'Recurring prompt' });
  expect(
    await prompt.evaluate((field) =>
      Boolean(
        field.compareDocumentPosition(document.querySelector('input[name="recurring-reflection-service"]')!) &
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    )
  ).toBe(true);
  await expect(prompt).not.toHaveValue(/This prompt contains all exercise context/);
  expect(
    await prompt.evaluate((field) =>
      Boolean(
        field.compareDocumentPosition(document.querySelector('#recurring-reflection-heading')!) &
        Node.DOCUMENT_POSITION_PRECEDING
      )
    )
  ).toBe(true);
  expect(
    await prompt.evaluate((field) =>
      Boolean(
        field.compareDocumentPosition(
          Array.from(document.querySelectorAll('h3')).find((heading) => heading.textContent === 'Codex')!
        ) & Node.DOCUMENT_POSITION_FOLLOWING
      )
    )
  ).toBe(true);
  await expect(prompt).toHaveValue(/My private observation\./);
  await expect(prompt).toHaveValue(/My private goal\./);
  await expect(prompt).toHaveValue(/My saved reason\./);
  await prompt.fill('An edited reflection prompt.');
  await page.getByRole('button', { name: 'Copy prompt', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('An edited reflection prompt.');
  await expect(page.getByText('Prompt copied.', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open History', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Preview one-off coaching prompt' })).toHaveCount(0);
  await expect(page.getByLabel('Recurring reflection frequency')).toHaveCount(0);
  await expect(page.getByLabel('Recurring reflection local time')).toHaveCount(0);
  await expect(page.getByLabel('Recurring reflection timezone')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to reflection', exact: true }).click();
  await page.getByRole('button', { name: 'Save reflection', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your core values', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Set up recurring reflection', exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Microsoft 365 Copilot', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy prompt', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Recurring prompt' })).toHaveValue(
    /Selected values, in original rank order:/
  );
  await expect(page.getByRole('heading', { name: 'Your core values', exact: true })).toBeVisible();
  const previousDownloadCount = await page.evaluate(
    () =>
      (window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> })
        .__capturedDownloads.length
  );
  await page.getByRole('button', { name: 'Export HTML', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> })
            .__capturedDownloads.length
      )
    )
    .toBe(previousDownloadCount + 1);
  expect(
    await page.evaluate(
      () =>
        (
          window as unknown as Window & { __capturedDownloads: Array<{ filename: string; content: string }> }
        ).__capturedDownloads.at(-1)!.content
    )
  ).toContain('My saved reason.');
  await page.screenshot({ path: '.scratch/parity-completed.png', fullPage: true });
  const popupPending = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Print', exact: true }).click();
  const popup = await popupPending;
  await expect(popup.getByText('My saved reason.', { exact: true })).toBeVisible();
  await popup.close();
  await page.goto('/history');
  await page.screenshot({ path: '.scratch/parity-history.png', fullPage: true });
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Resume session', exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('No sessions saved in this browser yet.', { exact: true })).toBeVisible();
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: 'legacy.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(legacy)) });
  await expect(page.getByRole('link', { name: 'Resume session', exact: true })).toBeVisible();
});
