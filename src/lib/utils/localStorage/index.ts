import "client-only";

export function getLocalStorage(key: string, defaultValue: any) {
    const stickyValue = localStorage.getItem(key);

    try {
        return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
        return stickyValue !== null ? stickyValue : defaultValue;
    }
}

export function setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}