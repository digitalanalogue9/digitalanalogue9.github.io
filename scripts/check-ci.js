import { spawnSync } from 'node:child_process';

// Keep this sequence aligned with .github/workflows/pages.yml.
const steps = [
  ['format:check'],
  ['typecheck'],
  ['lint'],
  ['test:coverage'],
  ['build', 'false'],
  ['validate:pages-artifact'],
  ['test:e2e', 'false'],
  ['build', 'true'],
  ['exec', 'true', 'playwright', 'test', 'tests/e2e/reflection.spec.ts'],
];

for (const [command, reflection, ...args] of steps) {
  const commandArgs = command === 'exec' ? [command, ...args] : [command];
  const env = { ...process.env, CI: 'true' };
  if (reflection === 'true' || reflection === 'false') env.VITE_ENABLE_BEHAVIOUR_REFLECTION = reflection;
  console.log(`\n> pnpm ${commandArgs.join(' ')}${reflection ? ` (reflection: ${reflection})` : ''}`);
  const result = spawnSync('pnpm', commandArgs, {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) console.error(result.error);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
