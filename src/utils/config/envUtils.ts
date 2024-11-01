import config from '../../config/config.json';

export function getEnvNumber(key: keyof typeof config, defaultValue: number): number {
  const configKey = key as keyof typeof config;
  const value = config[configKey];
  if (typeof value === 'number') {
    return value;
  }
  return defaultValue;
}

export function getEnvBoolean(key: keyof typeof config, defaultValue: boolean): boolean {
  const configKey = key as keyof typeof config;
  const value = config[configKey];
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}
