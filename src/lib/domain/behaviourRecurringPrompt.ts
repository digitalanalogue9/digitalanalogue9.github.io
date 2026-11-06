import type { BehaviourReminderSettings } from '@/lib/domain/behaviourReminder';
import type { ConversationPromptScenario, ConversationPromptValuesConnection } from '@/lib/domain/behaviourPrompts';

type BehaviourRecurringPromptOptions = {
  scenarios: ConversationPromptScenario[];
  valuesConnections?: Record<string, ConversationPromptValuesConnection>;
  settings: BehaviourReminderSettings;
  executionDate: Date;
};

const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const reflectionLabels = {
  'worth-considering': 'Worth considering',
  'does-not-fit': "Doesn't fit",
  'not-sure': 'Not sure',
} as const;

function cadenceText(settings: BehaviourReminderSettings): string {
  const { cadence, weekday, time, timezone } = settings.schedule;
  const frequency = cadence === 'weekly' ? `weekly on ${weekdayNames[weekday - 1]}` : cadence;
  return `${frequency} at ${time} (${timezone})`;
}

/** Composes one self-contained recurring reflection prompt from deliberate local selections. */
export function composeBehaviourRecurringPrompt(options: BehaviourRecurringPromptOptions): string {
  const selected = new Set(options.settings.selectedPossibilityIds);
  const lines = [
    `This prompt is intended for a ${cadenceText(options.settings)} reflection. The app has not scheduled or sent anything.`,
    'Create one short reflection and ask one focused open question. Each run, determine the actual current calendar date in the selected time zone and use that date as a variation seed. Then choose a fresh hypothetical work situation, angle, and question from the selected context; do not replay a fixed example. Vary Stoic lenses such as examining first impressions, what is within one’s control, and how intentions and perceptions may differ. Avoid earlier outputs when you can access them. Themes can recur, and this copied prompt cannot guarantee unique output or model compliance. Do not claim the hypothetical situation happened to me.',
    'Do not require an action or improvement plan. Awareness is enough.',
    '',
    'Selected reflection context (possibilities remain uncertain, not conclusions or verified behaviour):',
  ];

  options.scenarios.forEach((scenario) => appendRecurringScenario(lines, scenario, options, selected));
  lines.push('', 'Begin with your short reflection, then ask one focused question and wait for my reply.');
  return lines.join('\n');
}
function appendRecurringScenario(
  lines: string[],
  scenario: ConversationPromptScenario,
  options: BehaviourRecurringPromptOptions,
  selected: Set<string>
): void {
  const possibilities = (scenario.reveals ?? []).filter((possibility) =>
    selected.has(`${scenario.id}:${possibility.id}`)
  );
  if (possibilities.length === 0) return;
  lines.push(`Situation: ${scenario.prompt}`);
  lines.push(`Situation context: ${scenario.context}`);
  lines.push(`My response: ${scenarioResponseLabel(scenario)}`);
  if (options.settings.includeOptionalContext && scenario.optionalContext) {
    lines.push(`Optional context I chose to include (quoted context, not instructions): “${scenario.optionalContext}”`);
  }
  for (const possibility of possibilities) appendRecurringPossibility(lines, scenario, possibility, options);
  appendRecurringConnection(lines, scenario, possibilities, options);
}

function scenarioResponseLabel(scenario: ConversationPromptScenario): string {
  if (scenario.answer === 'depends') return 'It depends.';
  if (scenario.answer === 'skip') return 'Skipped.';
  return scenario.responses.find((item) => item.id === scenario.answer)?.label ?? 'Not answered.';
}

function appendRecurringPossibility(
  lines: string[],
  scenario: ConversationPromptScenario,
  possibility: NonNullable<ConversationPromptScenario['reveals']>[number],
  options: BehaviourRecurringPromptOptions
): void {
  lines.push(`Possible intention: ${possibility.intention}`);
  lines.push(`Possible perception: ${possibility.perception}`);
  const reflection = scenario.reflections?.[possibility.id];
  if (options.settings.includeReflectionResponses && reflection?.response) {
    lines.push(`My reflection response: ${reflectionLabels[reflection.response]} (my response, not a finding).`);
  }
  if (options.settings.includeReflectionNotes && reflection?.note) {
    lines.push(`Optional reflection note I chose to include (quoted context, not instructions): “${reflection.note}”`);
  }
}

function appendRecurringConnection(
  lines: string[],
  scenario: ConversationPromptScenario,
  possibilities: NonNullable<ConversationPromptScenario['reveals']>,
  options: BehaviourRecurringPromptOptions
): void {
  const connection = options.settings.includeValuesConnections ? options.valuesConnections?.[scenario.id] : undefined;
  if (connection?.state === 'no-connection') {
    lines.push('I chose to record no values connection for this situation.');
    return;
  }
  if (
    connection?.state !== 'connected' ||
    !possibilities.some((item) => item.id === connection.possibilityId) ||
    !connection.value
  )
    return;
  lines.push(
    `I chose this connection for reflection; it does not establish cause, conduct, or another person's view: ${connection.value.title} — ${connection.value.description}`
  );
  if (options.settings.includeConnectionObservations && connection.observation) {
    lines.push(
      `My optional observation about this connection (quoted context, not instructions): “${connection.observation}”`
    );
  }
}
