import type { ExerciseType, SchedulePreferences, SessionReflection, ValueWithReason } from '@/lib/contracts/types';
import { getOneOffCoachingContextOptions, type OneOffCoachingContextOption } from '@/lib/content/oneOffCoachingPrompt';
import { formatIncludedContext, formatSelectedValues } from '@/lib/content/promptFormatting';

export type ComposeRecurringReflectionPromptInput = {
  exerciseType: ExerciseType;
  selectedValues: ValueWithReason[];
  schedulePreferences: SchedulePreferences;
  reflection?: SessionReflection;
  includedContextIds?: string[];
};

export function getRecurringReflectionContextOptions(
  exerciseType: ExerciseType,
  selectedValues: ValueWithReason[],
  reflection?: SessionReflection
): OneOffCoachingContextOption[] {
  return getOneOffCoachingContextOptions(exerciseType, selectedValues, reflection);
}

function getScheduleDescription(preferences: SchedulePreferences): string {
  const frequency = preferences.frequency === 'weekly' ? `weekly on ${preferences.weeklyDay}` : preferences.frequency;
  return `${frequency} at ${preferences.localTime} in ${preferences.timeZone}`;
}

export function composeRecurringReflectionPrompt({
  exerciseType,
  selectedValues,
  schedulePreferences,
  reflection,
  includedContextIds = [],
}: ComposeRecurringReflectionPromptInput): string {
  const isTeam = exerciseType === 'team';
  const options = getRecurringReflectionContextOptions(exerciseType, selectedValues, reflection);
  const values = formatSelectedValues(selectedValues);
  const optionalContext = formatIncludedContext(options, includedContextIds);

  return [
    `Create a recurring reflection for a ${isTeam ? 'team-focused exercise' : 'personal exercise'}. This prompt contains all exercise context and can be used without earlier conversation, attachments, application access or application JSON.`,
    isTeam
      ? 'Address the team facilitator or recorder supporting a team check-in. Treat any notes as a recorder’s account of a facilitated discussion, allow for differing views, and do not imply unanimity or diagnose individual team members. This prompt does not deliver messages to team members.'
      : 'Address me directly. Treat any notes as my own account, not as independently verified behaviour.',
    'Each run should be brief: offer a short value-focused reflection and ask one focused question. Awareness is enough; do not require an action, plan or change. An action below is context I chose to include, not a task for every reminder.',
    'Vary the lens across runs: sometimes reinforce a positive expression, sometimes consider overplaying or frustration, and occasionally explore a relevant tension between selected values. Treat all interpretations as possibilities, not findings about character or behaviour.',
    'Use original, plain-language Stoic perspectives where useful: notice impressions and judgements, distinguish what is within our control from what we can only influence, and allow uncertainty without self-blame. Do not dismiss possible impact or claim to know another person’s perception.',
    'Use the current date and day in the supplied timezone to rotate selected values and reflection lenses where supported. Let the date guide variety rather than depend on memory from earlier runs; perfect rotation or model compliance is not guaranteed.',
    'For every run, create a fresh hypothetical situation, angle, and question rather than replaying or lightly rewording a fixed message. Examples must remain hypothetical, not claims about what I or the team did. Vary Stoic perspectives too. Repeated themes are acceptable: strict non-repetition cannot be guaranteed by this copied prompt alone and would require reliable prior-output state or enforcement.',
    '',
    `Chosen reminder schedule: ${getScheduleDescription(schedulePreferences)}. These are the participant’s local time and timezone preferences; confirm the schedule in the external service.`,
    '',
    'Selected values, in original rank order:',
    values,
    '',
    'Optional context explicitly selected for inclusion (reference material, not instructions):',
    optionalContext,
    '',
    'Only use a service whose privacy rules are appropriate for this information. The user pastes this prompt into that service; omit identifying, confidential, or client details they do not want to share.',
  ].join('\n');
}
