import type { ValueWithReason } from '@/lib/contracts/types';
import type { OneOffCoachingContextOption } from '@/lib/content/oneOffCoachingPrompt';

export function formatSelectedValues(selectedValues: ValueWithReason[]): string {
  return selectedValues.length === 0
    ? 'No values were selected for this exercise.'
    : selectedValues.map((value, index) => `${index + 1}. ${value.title} — ${value.description}`).join('\n');
}

export function formatIncludedContext(
  contextOptions: OneOffCoachingContextOption[],
  includedContextIds: string[]
): string {
  const includedIds = new Set(includedContextIds);
  const includedContext = contextOptions.filter(({ id }) => includedIds.has(id));
  return includedContext.length === 0
    ? 'No optional reasons, notes, actions or possibilities have been included.'
    : includedContext.map(({ label, text }) => `- ${label}: “${text}”`).join('\n');
}
