export function formattingDiffArguments(env) {
  const baseRef = env.GITHUB_BASE_REF ?? env.SYSTEM_PULLREQUEST_TARGETBRANCH?.replace(/^refs\/heads\//, '');
  return ['diff', '--name-only', '--diff-filter=ACMR', baseRef ? `origin/${baseRef}...HEAD` : 'HEAD^...HEAD'];
}
