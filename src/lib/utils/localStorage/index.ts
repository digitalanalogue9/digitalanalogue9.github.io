export function getLocalStorage(key: string, defaultValue: unknown) {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  } catch {
    return defaultValue;
  }
}

export function setLocalStorage(key: string, value: unknown) {
  if (typeof window === 'undefined' || value === undefined) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
