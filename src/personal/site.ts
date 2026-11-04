export const PERSONAL_SITE_URL = 'https://core-values.me';

export const PERSONAL_SITE_DESCRIPTION = 'Discover and prioritise your personal values.';

export function getShareUrl(path = '/') {
  return new URL(path, PERSONAL_SITE_URL).toString();
}
