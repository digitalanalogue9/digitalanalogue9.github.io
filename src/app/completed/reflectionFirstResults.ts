export function isReflectionFirstResultsEnabled(
  value: string | undefined = import.meta.env.VITE_ENABLE_REFLECTION_FIRST_RESULTS
): boolean {
  return value !== 'false';
}
