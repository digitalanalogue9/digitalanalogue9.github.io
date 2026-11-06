import { BEHAVIOUR_CONTENT_VERSION, behaviourScenarios, type BehaviourScenario } from '@/lib/domain/behaviourScenarios';
import { getBehaviourReminderSettingsError, type BehaviourReminderSettings } from '@/lib/domain/behaviourReminder';
import type { BehaviourAttempt, AttemptScenario } from './behaviourAttemptService';

export const BEHAVIOUR_RESULTS_FORMAT = 'core-values-scenario-results';
export const BEHAVIOUR_RESULTS_VERSION = 1;

export type ScenarioResultsOptions = {
  includePrivateText?: boolean;
  includeActiveProgress?: boolean;
  includeValuesConnections?: boolean;
};

export type BehaviourResultsEnvelope = {
  format: typeof BEHAVIOUR_RESULTS_FORMAT;
  version: typeof BEHAVIOUR_RESULTS_VERSION;
  attempt: unknown;
};

type PortableScenario = {
  id: string;
  prompt: string;
  context: string;
  responses: { id: string; label: string }[];
  answer?: string;
  optionalContext?: string;
  reveals?: unknown[];
  reflections?: Record<string, { response?: string; note?: string }>;
};

type RestorableAttempt = {
  id: string;
  contentVersion: typeof BEHAVIOUR_CONTENT_VERSION;
  stage: BehaviourAttempt['stage'];
  createdAt: number;
  updatedAt: number;
  position: number;
  scenarios: unknown[];
  valuesConnections?: unknown;
  reminderSettings?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function portableScenario(
  scenario: AttemptScenario,
  stage: BehaviourAttempt['stage'],
  options: ScenarioResultsOptions
): PortableScenario {
  const result: PortableScenario = {
    id: scenario.id,
    prompt: scenario.prompt,
    context: scenario.context,
    responses: scenario.responses.map(({ id, label }) => ({ id, label })),
  };
  if (scenario.answer !== undefined) result.answer = scenario.answer;
  if (options.includePrivateText && scenario.optionalContext !== undefined)
    result.optionalContext = scenario.optionalContext;
  if (stage === 'finished' && scenario.reveals) result.reveals = structuredClone(scenario.reveals);
  if (stage === 'finished' && scenario.reflections) {
    const reflections = structuredClone(scenario.reflections);
    if (!options.includePrivateText) {
      for (const reflection of Object.values(reflections)) delete reflection.note;
    }
    result.reflections = Object.fromEntries(
      Object.entries(reflections).filter(([, reflection]) => Object.keys(reflection).length > 0)
    );
    if (Object.keys(result.reflections).length === 0) delete result.reflections;
  }
  return result;
}

export function createBehaviourResultsEnvelope(
  attempt: BehaviourAttempt,
  options: ScenarioResultsOptions = {}
): BehaviourResultsEnvelope {
  if (attempt.stage === 'active' && !options.includeActiveProgress)
    throw new Error('Active scenario progress can be included only in an explicit full backup.');
  const valuesConnections = getPortableValuesConnections(attempt, options);
  return {
    format: BEHAVIOUR_RESULTS_FORMAT,
    version: BEHAVIOUR_RESULTS_VERSION,
    attempt: {
      id: attempt.id,
      contentVersion: attempt.contentVersion,
      stage: attempt.stage,
      createdAt: attempt.createdAt,
      updatedAt: attempt.updatedAt,
      position: attempt.position,
      scenarios: attempt.scenarios.map((scenario) => portableScenario(scenario, attempt.stage, options)),
      ...(valuesConnections ? { valuesConnections } : {}),
      ...(attempt.reminderSettings ? { reminderSettings: structuredClone(attempt.reminderSettings) } : {}),
    },
  };
}

function getPortableValuesConnections(
  attempt: BehaviourAttempt,
  options: ScenarioResultsOptions
): BehaviourAttempt['valuesConnections'] {
  if (!options.includeValuesConnections || !attempt.valuesConnections) return undefined;
  return Object.fromEntries(
    Object.entries(attempt.valuesConnections).map(([scenarioId, connection]) => [
      scenarioId,
      getPortableValueConnection(connection, options.includePrivateText === true),
    ])
  );
}

function getPortableValueConnection(
  connection: NonNullable<BehaviourAttempt['valuesConnections']>[string],
  includePrivateText: boolean
): NonNullable<BehaviourAttempt['valuesConnections']>[string] {
  const copy = structuredClone(connection);
  if (copy.state !== 'connected' || includePrivateText) return copy;
  const { observation: _observation, ...publicConnection } = copy;
  return publicConnection;
}

function isPrivateReflection(value: unknown): value is { response?: string; note?: string } {
  if (!isRecord(value) || !hasOnlyKeys(value, ['response', 'note'])) return false;
  return (
    (value.response === undefined ||
      ['worth-considering', 'does-not-fit', 'not-sure'].includes(String(value.response))) &&
    (value.note === undefined || typeof value.note === 'string')
  );
}

function isValuesConnections(value: unknown): value is NonNullable<BehaviourAttempt['valuesConnections']> {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([scenarioId, raw]) => isScenarioValueConnection(scenarioId, raw));
}

function isScenarioValueConnection(scenarioId: string, raw: unknown): boolean {
  if (!behaviourScenarios.some((scenario) => scenario.id === scenarioId) || !isRecord(raw)) return false;
  if (raw.state === 'unanswered' || raw.state === 'no-connection') return hasOnlyKeys(raw, ['state']);
  return isConnectedScenarioValue(scenarioId, raw);
}

function isConnectedScenarioValue(scenarioId: string, raw: Record<string, unknown>): boolean {
  const keys = [
    'state',
    'scenarioId',
    'possibilityId',
    'sourceSessionId',
    'sourceExerciseType',
    'sourceCompletedAt',
    'value',
    'observation',
  ];
  return (
    raw.state === 'connected' &&
    hasOnlyKeys(raw, keys) &&
    raw.scenarioId === scenarioId &&
    typeof raw.possibilityId === 'string' &&
    typeof raw.sourceSessionId === 'string' &&
    raw.sourceSessionId.length > 0 &&
    (raw.sourceExerciseType === 'personal' || raw.sourceExerciseType === 'team') &&
    typeof raw.sourceCompletedAt === 'number' &&
    Number.isFinite(raw.sourceCompletedAt) &&
    isConnectedValueSnapshot(raw.value) &&
    (raw.observation === undefined || typeof raw.observation === 'string')
  );
}

function isConnectedValueSnapshot(value: unknown): boolean {
  if (!isRecord(value) || !hasOnlyKeys(value, ['id', 'title', 'description'])) return false;
  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.title === 'string' &&
    value.title.length > 0 &&
    typeof value.description === 'string' &&
    value.description.length > 0
  );
}

function hasValidPortableScenarioShape(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['id', 'prompt', 'context', 'responses', 'answer', 'optionalContext', 'reveals', 'reflections'])
  );
}

function hasAuthoredScenarioContent(value: Record<string, unknown>, authored: BehaviourScenario): boolean {
  return (
    value.id === authored.id &&
    value.prompt === authored.prompt &&
    value.context === authored.context &&
    Array.isArray(value.responses)
  );
}

function hasAuthoredResponses(value: unknown[], authored: BehaviourScenario): boolean {
  return (
    value.length === authored.responses.length &&
    value.every((item, index) => {
      if (!isRecord(item) || !hasOnlyKeys(item, ['id', 'label'])) return false;
      return item.id === authored.responses[index].id && item.label === authored.responses[index].label;
    })
  );
}

function hasValidScenarioChoice(answer: unknown, authored: BehaviourScenario): boolean {
  if (answer === undefined || answer === 'depends' || answer === 'skip') return true;
  return typeof answer === 'string' && authored.responses.some((response) => response.id === answer);
}

function validateScenarioRevealState(
  value: Record<string, unknown>,
  selected: BehaviourScenario['responses'][number] | undefined,
  stage: BehaviourAttempt['stage']
): void {
  if (stage === 'active' && (value.reveals !== undefined || value.reflections !== undefined)) {
    throw new Error('Active scenario backups cannot include unrevealed interpretations.');
  }
  if (stage !== 'finished') return;
  if (!selected && (value.reveals !== undefined || value.reflections !== undefined)) {
    throw new Error('Scenario backup cannot include reflections for a choice without a reveal.');
  }
  if (selected && JSON.stringify(value.reveals) !== JSON.stringify(selected.possibilities)) {
    throw new Error('Scenario backup reveals do not match the selected choice.');
  }
}

function validateScenarioReflections(
  value: Record<string, unknown>,
  selected: BehaviourScenario['responses'][number] | undefined
): void {
  if (value.reflections === undefined) return;
  if (!isRecord(value.reflections)) throw new Error('Scenario backup contains an invalid reflection response.');
  const selectedPossibilities = new Set(selected?.possibilities.map((possibility) => possibility.id) ?? []);
  const hasInvalidReflection = Object.entries(value.reflections).some(
    ([id, reflection]) => !selectedPossibilities.has(id) || !isPrivateReflection(reflection)
  );
  if (hasInvalidReflection) throw new Error('Scenario backup contains an invalid reflection response.');
}

function validateScenarioSnapshot(
  value: unknown,
  authored: BehaviourScenario,
  stage: BehaviourAttempt['stage']
): PortableScenario {
  if (!hasValidPortableScenarioShape(value)) throw new Error('Scenario backup contains an invalid situation.');
  if (!hasAuthoredScenarioContent(value, authored))
    throw new Error('Scenario backup content does not match its authored version.');
  if (!hasAuthoredResponses(value.responses as unknown[], authored))
    throw new Error('Scenario backup responses do not match their authored version.');
  if (!hasValidScenarioChoice(value.answer, authored)) throw new Error('Scenario backup contains an invalid choice.');
  if (value.optionalContext !== undefined && typeof value.optionalContext !== 'string')
    throw new Error('Scenario backup context must be text.');
  const selected = authored.responses.find((response) => response.id === value.answer);
  validateScenarioRevealState(value, selected, stage);
  validateScenarioReflections(value, selected);
  return value as unknown as PortableScenario;
}

function getRestorableAttempt(value: unknown): RestorableAttempt {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ['format', 'version', 'attempt']) ||
    value.format !== BEHAVIOUR_RESULTS_FORMAT ||
    value.version !== BEHAVIOUR_RESULTS_VERSION
  )
    throw new Error('This scenario backup format or version is not supported.');
  const raw = value.attempt;
  if (
    !isRecord(raw) ||
    !hasOnlyKeys(raw, [
      'id',
      'contentVersion',
      'stage',
      'createdAt',
      'updatedAt',
      'position',
      'scenarios',
      'valuesConnections',
      'reminderSettings',
    ])
  )
    throw new Error('Scenario backup is malformed.');
  if (raw.contentVersion !== BEHAVIOUR_CONTENT_VERSION)
    throw new Error('This scenario content version is not supported.');
  if (raw.stage !== 'active' && raw.stage !== 'finished') throw new Error('Scenario backup stage is invalid.');
  if (!hasValidAttemptMetadata(raw)) throw new Error('Scenario backup metadata is invalid.');
  return raw as unknown as RestorableAttempt;
}

function hasValidAttemptMetadata(raw: Record<string, unknown>): boolean {
  return (
    typeof raw.id === 'string' &&
    raw.id.trim().length > 0 &&
    Number.isFinite(raw.createdAt) &&
    Number.isFinite(raw.updatedAt) &&
    (raw.createdAt as number) >= 0 &&
    (raw.updatedAt as number) >= (raw.createdAt as number) &&
    Number.isInteger(raw.position) &&
    Array.isArray(raw.scenarios) &&
    raw.scenarios.length === behaviourScenarios.length
  );
}

function restoreScenario(
  source: unknown,
  authored: BehaviourScenario,
  stage: BehaviourAttempt['stage']
): AttemptScenario {
  const portable = validateScenarioSnapshot(source, authored, stage);
  const scenario: AttemptScenario = structuredClone(authored);
  if (portable.answer !== undefined) scenario.answer = portable.answer;
  if (portable.optionalContext !== undefined) scenario.optionalContext = portable.optionalContext;
  if (portable.reveals !== undefined)
    scenario.reveals = structuredClone(portable.reveals) as AttemptScenario['reveals'];
  if (portable.reflections !== undefined)
    scenario.reflections = structuredClone(portable.reflections) as AttemptScenario['reflections'];
  return scenario;
}

function restoreScenarios(raw: RestorableAttempt): AttemptScenario[] {
  return behaviourScenarios.map((authored, index) => restoreScenario(raw.scenarios[index], authored, raw.stage));
}

function restoreValuesConnections(value: unknown): BehaviourAttempt['valuesConnections'] {
  if (value === undefined) return undefined;
  if (!isValuesConnections(value)) throw new Error('Scenario backup contains invalid values connections.');
  return structuredClone(value);
}

function restoreReminderSettings(
  raw: RestorableAttempt,
  scenarios: AttemptScenario[]
): BehaviourReminderSettings | undefined {
  if (raw.reminderSettings === undefined) return undefined;
  if (raw.stage !== 'finished') {
    throw new Error(
      'Scenario backup contains invalid reminder settings: Reminder settings can be restored only for a finished scenario reflection.'
    );
  }
  const allowedPossibilityIds = scenarios.flatMap((scenario) =>
    (scenario.reveals ?? []).map((possibility) => `${scenario.id}:${possibility.id}`)
  );
  const error = getBehaviourReminderSettingsError(raw.reminderSettings, allowedPossibilityIds);
  if (error) throw new Error(`Scenario backup contains invalid reminder settings: ${error}`);
  return structuredClone(raw.reminderSettings) as BehaviourReminderSettings;
}

export function restoreBehaviourResultsEnvelope(value: unknown): BehaviourAttempt {
  const raw = getRestorableAttempt(value);
  const scenarios = restoreScenarios(raw);
  const valuesConnections = restoreValuesConnections(raw.valuesConnections);
  const reminderSettings = restoreReminderSettings(raw, scenarios);
  if (raw.position < 0 || raw.position >= scenarios.length) throw new Error('Scenario backup position is invalid.');
  return {
    id: raw.id,
    contentVersion: BEHAVIOUR_CONTENT_VERSION,
    stage: raw.stage,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    position: raw.position,
    scenarios,
    ...(valuesConnections ? { valuesConnections } : {}),
    ...(reminderSettings ? { reminderSettings } : {}),
  };
}
