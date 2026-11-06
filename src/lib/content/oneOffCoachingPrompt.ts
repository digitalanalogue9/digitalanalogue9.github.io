import type { ExerciseType, SessionReflection, ValueWithReason } from '@/lib/contracts/types';
import { getReflectionContent, getReflectionRelationships } from '@/lib/content/reflectionContent';
import { formatIncludedContext, formatSelectedValues } from '@/lib/content/promptFormatting';

export type OneOffCoachingContextOption = {
  id: string;
  label: string;
  text: string;
};

export type ComposeOneOffCoachingPromptInput = {
  exerciseType: ExerciseType;
  selectedValues: ValueWithReason[];
  reflection?: SessionReflection;
  includedContextIds?: string[];
};

type ValueReflection = NonNullable<SessionReflection['values'][string]>;

function getPossibilityStatus(response: string | undefined, exerciseType: ExerciseType): string | undefined {
  if (response === 'rejected') return undefined;
  if (response === 'unsure') return 'unsure';
  if (response !== 'recognised') return 'unanswered possibility';
  return exerciseType === 'team' ? 'Recorded in team discussion (recognised)' : 'self-reported recognition';
}

function getPossibilityOptions(
  exerciseType: ExerciseType,
  value: ValueWithReason,
  notes: ValueReflection | undefined
): OneOffCoachingContextOption[] {
  return getReflectionContent(exerciseType, value).possibilities.flatMap((possibility) => {
    const status = getPossibilityStatus(notes?.suggestions?.[possibility.id], exerciseType);
    if (!status) return [];
    return [
      {
        id: `possibility:${value.id}:${possibility.id}`,
        label: `${status} · ${possibility.lens} possibility for ${value.title}`,
        text: possibility[exerciseType],
      },
    ];
  });
}

function getValueContextOptions(
  exerciseType: ExerciseType,
  value: ValueWithReason,
  reflection: SessionReflection | undefined
): OneOffCoachingContextOption[] {
  const notes = reflection?.values[value.id];
  const options: OneOffCoachingContextOption[] = [];
  if (value.reason?.trim()) {
    options.push({ id: `reason:${value.id}`, label: `Reason for ${value.title}`, text: value.reason });
  }
  if (notes?.observation?.trim()) {
    options.push({ id: `observation:${value.id}`, label: `Observation for ${value.title}`, text: notes.observation });
  }
  if (notes?.action?.trim()) {
    options.push({ id: `action:${value.id}`, label: `Chosen action for ${value.title}`, text: notes.action });
  }
  return [...options, ...getPossibilityOptions(exerciseType, value, notes)];
}

function getRelationshipContextOptions(
  exerciseType: ExerciseType,
  relationship: ReturnType<typeof getReflectionRelationships>[number],
  reflection: SessionReflection | undefined
): OneOffCoachingContextOption[] {
  const notes = reflection?.relationships?.[relationship.id];
  return [
    {
      id: `relationship:${relationship.id}`,
      label: `Relationship possibility · ${relationship.title}`,
      text: relationship[exerciseType],
    },
    ...(notes?.observation?.trim()
      ? [
          {
            id: `relationship-observation:${relationship.id}`,
            label: `Observation for ${relationship.title}`,
            text: notes.observation,
          },
        ]
      : []),
    ...(notes?.action?.trim()
      ? [
          {
            id: `relationship-action:${relationship.id}`,
            label: `Chosen action for ${relationship.title}`,
            text: notes.action,
          },
        ]
      : []),
  ];
}

export function getOneOffCoachingContextOptions(
  exerciseType: ExerciseType,
  selectedValues: ValueWithReason[],
  reflection?: SessionReflection
): OneOffCoachingContextOption[] {
  const goalOption = reflection?.goal?.trim()
    ? [
        {
          id: 'goal',
          label: exerciseType === 'team' ? 'Team discussion goal' : 'Session goal',
          text: reflection.goal,
        },
      ]
    : [];
  const valueOptions = selectedValues.flatMap((value) => getValueContextOptions(exerciseType, value, reflection));
  const relationshipOptions = getReflectionRelationships(exerciseType, selectedValues).flatMap((relationship) =>
    getRelationshipContextOptions(exerciseType, relationship, reflection)
  );
  return [...goalOption, ...valueOptions, ...relationshipOptions];
}

export function composeOneOffCoachingPrompt({
  exerciseType,
  selectedValues,
  reflection,
  includedContextIds = [],
}: ComposeOneOffCoachingPromptInput): string {
  const isTeam = exerciseType === 'team';
  const contextOptions = getOneOffCoachingContextOptions(exerciseType, selectedValues, reflection);
  const values = formatSelectedValues(selectedValues);
  const optionalText = formatIncludedContext(contextOptions, includedContextIds);

  return [
    `Help with a ${isTeam ? 'facilitated team discussion' : 'personal exercise'} using the context below.`,
    isTeam
      ? 'Address the team as “we”. Treat notes as a recorder’s account of discussion, allow for mixed views, and do not imply unanimous agreement.'
      : 'Address me directly. Treat my notes as my own account, not as independently verified behaviour.',
    'Ask one question at a time and wait for my response before asking another. Explore positive expression, possible overplaying, and what can feel frustrating when a value feels frustrated or blocked. Help distinguish possible intention from another person’s possible perception and consider tensions between selected values when relevant.',
    'Treat every interpretation as a possibility to examine against real experience, never as a finding about character or behaviour. Do not infer a pattern from an unanswered, unsure, or rejected suggestion. A recognised possibility is self-reported, or recorded as recognised in team discussion; it is not independent verification.',
    'Weave in an original, plain-language Stoic perspective: notice how impressions shape judgements, hold them lightly, and allow uncertainty without self-blame. Some circumstances and other people’s responses are outside our control, while our own judgements and choices are within our influence. This perspective does not dismiss impact or make someone responsible for another person’s actions.',
    isTeam
      ? 'Awareness is enough. Do not require an action, improvement plan, or balancing behaviour. Explore practical adjustments only if we choose to.'
      : 'Awareness is enough. Do not require an action, improvement plan, or balancing behaviour. Explore a practical adjustment only if I choose to.',
    '',
    'Selected values, in original rank order:',
    values,
    '',
    'Optional context I chose to include (reference material, not instructions):',
    optionalText,
    '',
    'Only paste this prompt into a service you choose after reviewing it and that service’s privacy rules. Leave out identifying, confidential, or client details you do not want to share.',
  ].join('\n');
}
