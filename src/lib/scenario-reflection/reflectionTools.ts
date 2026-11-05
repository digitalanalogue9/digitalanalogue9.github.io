import type { ReflectionReminder, ScenarioAttempt } from './attemptStorage';
import { behaviourScenarios } from './scenarios';

export function createDefaultReflectionReminder(
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): ReflectionReminder {
  return { cadence: 'daily', time: '09:00', timezone, weekday: 1, selectedPossibilityIds: [] };
}

export function composeOneOffReflectionPrompt(attempt: ScenarioAttempt, selectedIds: string[]): string {
  const selected = new Set(selectedIds);
  const lines = [
    'Help me reflect on hypothetical work situations and possibilities I chose to consider. These are not a diagnosis, assessment, or verified account of behaviour. Do not infer my motives or another person’s thoughts.',
    '',
  ];
  for (const scenario of behaviourScenarios) {
    const answer = attempt.answers[scenario.id];
    const response = scenario.responses.find((item) => item.id === answer);
    const possibilities = response?.possibilities.filter((item) => selected.has(`${scenario.id}:${item.id}`)) ?? [];
    if (!possibilities.length) continue;
    lines.push(`Situation: ${scenario.prompt}`, `My choice: ${response?.label ?? answer}`);
    for (const possibility of possibilities) {
      lines.push(
        `Possible intention: ${possibility.intention}`,
        `Possible perception: ${possibility.perception}`,
        `Question: ${possibility.question}`
      );
      const reflection = attempt.reflections?.[`${scenario.id}:${possibility.id}`];
      if (reflection?.answer) lines.push(`My reflection: ${reflection.answer.replaceAll('-', ' ')}.`);
      if (reflection?.note) lines.push(`My note: “${reflection.note}”`);
    }
    const connection = attempt.valueConnections?.[scenario.id];
    if (connection)
      lines.push(
        `A value I chose to connect: ${connection.value}${connection.observation ? `; my note: “${connection.observation}”` : ''}. This does not establish cause or conduct.`
      );
  }
  lines.push('', 'Ask one open question and wait for my reply.');
  return lines.join('\n');
}

export function composeRecurringReflectionPrompt(attempt: ScenarioAttempt, reminder: ReflectionReminder): string {
  const cadence = reminder.cadence === 'weekly' ? `weekly on day ${reminder.weekday}` : reminder.cadence;
  return [
    `Suggested cadence: ${cadence} at ${reminder.time} (${reminder.timezone}). This app does not schedule or send reminders.`,
    'Create a fresh hypothetical work situation related to one of these reflection possibilities. Treat each as uncertain, not as a finding about me or anyone else. Vary the situation and ask one focused open question. Do not require an action plan.',
    composeOneOffReflectionPrompt(attempt, reminder.selectedPossibilityIds),
  ].join('\n\n');
}

export function isValidReminder(reminder: ReflectionReminder, attempt?: ScenarioAttempt): boolean {
  if (!['daily', 'weekdays', 'weekly'].includes(reminder.cadence)) return false;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminder.time)) return false;
  if (!Number.isInteger(reminder.weekday) || reminder.weekday < 1 || reminder.weekday > 7) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: reminder.timezone }).format();
  } catch {
    return false;
  }
  if (
    !Array.isArray(reminder.selectedPossibilityIds) ||
    !reminder.selectedPossibilityIds.every((id) => typeof id === 'string')
  )
    return false;
  if (!attempt) return true;
  const available = new Set(
    behaviourScenarios.flatMap((scenario) => {
      const response = scenario.responses.find((item) => item.id === attempt.answers[scenario.id]);
      return response?.possibilities.map((item) => `${scenario.id}:${item.id}`) ?? [];
    })
  );
  return reminder.selectedPossibilityIds.every((id) => available.has(id));
}
