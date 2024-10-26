import config from '../config/config.json';

export function getEnvNumber(key: keyof typeof config, defaultValue: number): number {
  console.log('getEnvNumber', key, process.env);
  const configKey = key.toLowerCase() as keyof typeof config;
  const value = config[configKey];
  console.log('getEnvNumber value:', value);
  if (typeof value === 'number') {
    return value;
  }
  return defaultValue;
}

export function getEnvBoolean(key: keyof typeof config, defaultValue: boolean): boolean {
  console.log('getEnvBoolean', key, process.env);
  const configKey = key.toLowerCase() as keyof typeof config;
  const value = config[configKey];
  console.log('getEnvBoolean value:', value);
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}
