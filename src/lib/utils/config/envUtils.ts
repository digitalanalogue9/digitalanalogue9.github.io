'use client';

export function getEnvNumber(key: string, defaultValue: number): number {
  // In production, use environment variables
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  const numberValue = Number(value);
  return isNaN(numberValue) ? defaultValue : numberValue;
}

export function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
}

export function getEnvString(key: string, defaultValue: string): string {
  // In production, use environment variables
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  return value;
}
