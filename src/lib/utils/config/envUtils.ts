'use client';

export function getEnvNumber(key: string, defaultValue: number): number {
const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  const numberValue = Number(value);
  return isNaN(numberValue) ? defaultValue : numberValue;
}

export function getEnvBoolean(key: string, defaultValue: boolean): boolean {
const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
}

export function getEnvString(key: string, defaultValue: string): string {
const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  return value;
}
