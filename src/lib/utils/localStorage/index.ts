import 'client-only';

export function getLocalStorage(key: string, defaultValue: unknown) {
  const stickyValue = localStorage.getItem(key);

  try {
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  } catch (_) {
    return stickyValue !== null ? stickyValue : defaultValue;
  }
}

export function setLocalStorage(key: string, value: unknown) {
  if (value !== undefined) {
    // Check if value is undefined
    localStorage.setItem(key, JSON.stringify(value));
  }
}
