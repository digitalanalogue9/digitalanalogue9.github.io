export function getEnvNumber(key: string, defaultValue: number): number {
  // In development, return default values
  if (process.env.NODE_ENV === 'development') {
    if (key === 'maxCards') {
      return 15;
    }
    if (key === 'numCoreValues') {
      return 10;
    }
    return defaultValue;
  }

  // In production, use environment variables
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  
  const numberValue = Number(value);
  return isNaN(numberValue) ? defaultValue : numberValue;
}

export function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  // In development, return default values
  if (process.env.NODE_ENV === 'development') {
    return defaultValue;
  }

  // In production, use environment variables
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true';
}
