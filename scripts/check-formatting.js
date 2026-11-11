import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { formattingDiffArguments } from './formatting-diff.js';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const diffArguments = formattingDiffArguments(process.env);

const diff = spawnSync('git', diffArguments, {
  cwd: repositoryRoot,
  encoding: 'utf8',
});

if (diff.status !== 0) {
  process.stderr.write(diff.stderr);
  process.exit(diff.status ?? 1);
}

const untracked = spawnSync('git', ['ls-files', '--others', '--exclude-standard'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
});

if (untracked.status !== 0) {
  process.stderr.write(untracked.stderr);
  process.exit(untracked.status ?? 1);
}

const workingTreeDiff = spawnSync('git', ['diff', '--name-only', '--diff-filter=ACMR', 'HEAD'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
});
if (workingTreeDiff.status !== 0) {
  process.stderr.write(workingTreeDiff.stderr);
  process.exit(workingTreeDiff.status ?? 1);
}
const changedFiles = [
  ...new Set([
    ...diff.stdout.split(/\r?\n/),
    ...workingTreeDiff.stdout.split(/\r?\n/),
    ...untracked.stdout.split(/\r?\n/),
  ]),
]
  .filter(Boolean)
  .filter((file) => file !== 'pnpm-lock.yaml')
  .filter((file) => !isWorkspaceContextFile(file));

function isWorkspaceContextFile(file) {
  return (
    file === 'AGENTS.md' ||
    file.startsWith('.scratch/') ||
    file.startsWith('.serena/') ||
    file.startsWith('docs/agents/')
  );
}

if (changedFiles.length === 0) {
  console.log('No changed files to format-check.');
  process.exit(0);
}

const prettierCli = fileURLToPath(import.meta.resolve('prettier/bin/prettier.cjs'));
const prettier = spawnSync(process.execPath, [prettierCli, '--check', '--ignore-unknown', ...changedFiles], {
  cwd: repositoryRoot,
  stdio: 'inherit',
});

process.exit(prettier.status ?? 1);
