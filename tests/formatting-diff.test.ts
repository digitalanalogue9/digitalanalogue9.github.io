import { describe, expect, it } from 'vitest';
import { formattingDiffArguments } from '../scripts/formatting-diff.js';

describe('formatting diff selection', () => {
  it('checks the latest commit locally as well as in CI', () => {
    expect(formattingDiffArguments({})).toEqual(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD^...HEAD']);
    expect(formattingDiffArguments({ CI: 'true' })).toEqual(formattingDiffArguments({}));
  });

  it('checks the full pull request against its target branch', () => {
    expect(formattingDiffArguments({ GITHUB_BASE_REF: 'main' })).toEqual([
      'diff',
      '--name-only',
      '--diff-filter=ACMR',
      'origin/main...HEAD',
    ]);
  });
});
