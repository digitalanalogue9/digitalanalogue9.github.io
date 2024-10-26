export const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
    const value = process.env[key]?.toLowerCase();
    if (value === undefined) return defaultValue;
    return value === 'true';
};

export const getEnvNumber = (key: string, defaultValue: number): number => {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};
