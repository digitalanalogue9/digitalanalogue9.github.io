import { chromium } from '@playwright/test';
import fs from 'node:fs';
import valuesJson from '../../src/data/values.json' with { type: 'json' };
const base = 'https://core-values.me';
const cards = valuesJson.values.slice(0, 3).map(({ id, title, description }) => ({ id, title, description }));
function envelope(id, status, ready) {
  const categories = { 'Very Important': ready ? [cards[0]] : [], 'Quite Important': [], 'Important': [], 'Of Some Importance': [], 'Not Important': ready ? cards.slice(1) : [] };
  return { version: 2, exportedAt: Date.now(), session: { id, version: 2, createdAt: Date.now(), updatedAt: Date.now(), exerciseType: 'personal', targetCoreValues: 1, initialValues: cards, currentRoundNumber: 1, status }, rounds: [{ version: 2, sessionId: id, roundNumber: 1, targetCoreValues: 1, deck: ready ? [] : [...cards], activeCategories: Object.keys(categories), categories, commands: [], createdAt: Date.now(), updatedAt: Date.now() }], ...(status === 'completed' ? { completedSession: { version: 2, sessionId: id, completedAt: Date.now(), finalValues: [{ ...cards[0], reason: 'A saved reason for the Lighthouse report.' }] } } : {}) };
}
const bundles = [envelope('lighthouse-active-session', 'active', false), envelope('lighthouse-reasoning-session', 'active', true), envelope('lighthouse-completed-session', 'completed', true)];
const ctx = await chromium.launchPersistentContext('reports/lighthouse/seed-profile', { headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', ignoreHTTPSErrors: true, args: ['--no-sandbox'] });
const page = await ctx.newPage();
await page.goto(`${base}/history`, { waitUntil: 'domcontentloaded', timeout: 60000 });
const reject = page.getByRole('button', { name: 'Reject optional cookies' });
if (await reject.isVisible().catch(() => false)) await reject.click();
for (const bundle of bundles) {
 await page.getByLabel('Backup file contents (JSON)').fill(JSON.stringify(bundle));
 await page.getByRole('button', { name: 'Import from text' }).click();
 await page.waitForTimeout(500);
}
console.log('Seeded production browser profile with active, reasoning-ready, and completed sessions.');
await ctx.close();



