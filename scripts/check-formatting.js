import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const baseRef =
  process.env.GITHUB_BASE_REF ?? process.env.SYSTEM_PULLREQUEST_TARGETBRANCH?.replace(/^refs\/heads\//, '');
const diffArguments = baseRef
  ? ['diff', '--name-only', '--diff-filter=ACMR', `origin/${baseRef}...HEAD`]
  : process.env.CI
    ? ['diff', '--name-only', '--diff-filter=ACMR', 'HEAD^...HEAD']
    : ['diff', '--name-only', '--diff-filter=ACMR', 'HEAD'];

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
