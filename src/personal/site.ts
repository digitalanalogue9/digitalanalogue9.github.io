export const PERSONAL_SITE_URL = 'https://core-values.me';

export function getShareUrl(path = '/') {
  return new URL(path, PERSONAL_SITE_URL).toString();
}
