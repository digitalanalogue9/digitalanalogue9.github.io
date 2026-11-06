import {
  BEHAVIOUR_CONTENT_VERSION,
  behaviourScenarios,
  type BehaviourScenario,
  type ReflectionPossibility,
} from '@/lib/domain/behaviourScenarios';
import {
  createBehaviourResultsEnvelope,
  restoreBehaviourResultsEnvelope,
  type BehaviourResultsEnvelope,
  type ScenarioResultsOptions,
} from './behaviourScenarioResults';
import {
  composeBehaviourConversationPrompt,
  type ConversationPromptOptions,
  type ConversationPromptValuesConnection,
} from '@/lib/domain/behaviourPrompts';
import { composeBehaviourRecurringPrompt } from '@/lib/domain/behaviourRecurringPrompt';
import { getBehaviourReminderSettingsError, type BehaviourReminderSettings } from '@/lib/domain/behaviourReminder';
import type { CompletedSession } from '@/lib/contracts/types';

export type ScenarioAnswer = string | 'depends' | 'skip';
export type ReflectionResponse = 'worth-considering' | 'does-not-fit' | 'not-sure';
export type PossibilityReflection = { response?: ReflectionResponse; note?: string };
export type BehaviourConversationPromptOptions = Partial<Omit<ConversationPromptOptions, 'scenarios'>>;

export type AttemptScenario = BehaviourScenario & {
  answer?: ScenarioAnswer;
  optionalContext?: string;
  reveals?: ReflectionPossibility[];
  reflections?: Record<string, PossibilityReflection>;
};

export type BehaviourAttempt = {
  id: string;
  contentVersion: string;
  stage: 'active' | 'finished';
  createdAt: number;
  updatedAt: number;
  position: number;
  scenarios: AttemptScenario[];
  valuesConnections?: Record<string, BehaviourValueConnection>;
  reminderSettings?: BehaviourReminderSettings;
};

export type BehaviourValueConnection =
  | { state: 'unanswered'; scenarioId?: string }
  | { state: 'no-connection'; scenarioId?: string }
  | {
      state: 'connected';
      scenarioId: string;
      possibilityId: string;
      sourceSessionId: string;
      sourceExerciseType: 'personal' | 'team';
      sourceCompletedAt: number;
      value: { id: string; title: string; description: string };
      observation?: string;
    };

export type ValuesConnectionInput =
  | {
      state: 'connected';
      scenarioId: string;
      possibilityId: string;
      sourceSessionId: string;
      sourceExerciseType: 'personal' | 'team';
      completedSession: CompletedSession;
      valueId: string;
      observation?: string;
    }
  | { state: 'unanswered' | 'no-connection'; scenarioId: string };

function isConnectedValueConnectionConsistent(
  scenarioId: string,
  connection: BehaviourValueConnection,
  scenario: AttemptScenario
): boolean {
  return (
    connection.state === 'connected' &&
    hasOnlyConnectedValueKeys(connection) &&
    connection.scenarioId === scenarioId &&
    isScenarioResponseConnectionValid(connection, scenario) &&
    isConnectionSourceValid(connection) &&
    isSavedValueValid(connection.value) &&
    (connection.observation === undefined || typeof connection.observation === 'string')
  );
}

function hasOnlyConnectedValueKeys(connection: BehaviourValueConnection): boolean {
  return !Object.keys(connection).some(
    (key) =>
      ![
        'state',
        'scenarioId',
        'possibilityId',
        'sourceSessionId',
        'sourceExerciseType',
        'sourceCompletedAt',
        'value',
        'observation',
      ].includes(key)
  );
}

function isScenarioResponseConnectionValid(
  connection: Extract<BehaviourValueConnection, { state: 'connected' }>,
  scenario: AttemptScenario
): boolean {
  return (
    Boolean(scenario.reveals?.some((item) => item.id === connection.possibilityId)) &&
    Boolean(scenario.answer && scenario.answer !== 'depends' && scenario.answer !== 'skip')
  );
}

function isConnectionSourceValid(connection: Extract<BehaviourValueConnection, { state: 'connected' }>): boolean {
  return (
    typeof connection.sourceSessionId === 'string' &&
    typeof connection.sourceCompletedAt === 'number' &&
    (connection.sourceExerciseType === 'personal' || connection.sourceExerciseType === 'team')
  );
}

function isSavedValueValid(value: Extract<BehaviourValueConnection, { state: 'connected' }>['value']): boolean {
  return (
    !Object.keys(value).some((key) => !['id', 'title', 'description'].includes(key)) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string'
  );
}

function hasValidPersistedReflection(
  reflection: PossibilityReflection | undefined,
  expectedPossibilityIds: Set<string>,
  id: string
): boolean {
  if (!expectedPossibilityIds.has(id) || typeof reflection !== 'object' || reflection === null) return false;
  const response = reflection.response;
  const hasValidResponse =
    response === undefined ||
    response === 'worth-considering' ||
    response === 'does-not-fit' ||
    response === 'not-sure';
  return hasValidResponse && (reflection.note === undefined || typeof reflection.note === 'string');
}

function hasValidPersistedReflections(
  reflections: AttemptScenario['reflections'],
  stage: BehaviourAttempt['stage'],
  expectedPossibilityIds: Set<string> | undefined
): boolean {
  if (stage !== 'finished' || !expectedPossibilityIds || typeof reflections !== 'object' || reflections === null)
    return false;
  return Object.entries(reflections).every(([id, reflection]) =>
    hasValidPersistedReflection(reflection, expectedPossibilityIds, id)
  );
}

function isScenarioSnapshotInvalid(
  scenario: AttemptScenario,
  index: number,
  stage: BehaviourAttempt['stage'],
  known: Map<string, BehaviourScenario>
): boolean {
  const original = known.get(scenario.id);
  if (!original || scenario.id !== behaviourScenarios[index].id) return true;
  const { answer, optionalContext, reveals, reflections, ...content } = scenario;
  if (JSON.stringify(content) !== JSON.stringify(original)) return true;
  if (!hasValidScenarioAnswer(answer, original)) return true;
  if (optionalContext !== undefined && typeof optionalContext !== 'string') return true;
  if (stage === 'active' && reveals !== undefined) return true;
  const expected = original.responses.find((response) => response.id === answer)?.possibilities;
  if (!hasValidPersistedReveals(reveals, expected, stage)) return true;
  return (
    reflections !== undefined &&
    !hasValidPersistedReflections(
      reflections,
      stage,
      expected ? new Set(expected.map((possibility) => possibility.id)) : undefined
    )
  );
}

function hasValidScenarioAnswer(answer: string | undefined, original: BehaviourScenario): boolean {
  return (
    answer === undefined ||
    answer === 'depends' ||
    answer === 'skip' ||
    original.responses.some((response) => response.id === answer)
  );
}

function hasValidPersistedReveals(
  reveals: AttemptScenario['reveals'],
  expected: BehaviourScenario['responses'][number]['possibilities'] | undefined,
  stage: BehaviourAttempt['stage']
): boolean {
  if (stage === 'active' && reveals !== undefined) return false;
  if (reveals !== undefined && (!expected || JSON.stringify(reveals) !== JSON.stringify(expected))) return false;
  return !(stage === 'finished' && expected && JSON.stringify(reveals) !== JSON.stringify(expected));
}

function getValuesConnectionsError(attempt: BehaviourAttempt): string | undefined {
  const connections = attempt.valuesConnections;
  if (connections === undefined) return undefined;
  if (attempt.stage !== 'finished' || typeof connections !== 'object' || connections === null)
    return 'Saved values connections are invalid.';
  for (const [scenarioId, connection] of Object.entries(connections)) {
    const scenario = attempt.scenarios.find((item) => item.id === scenarioId);
    if (!scenario || !connection || typeof connection !== 'object') return 'Saved values connection is invalid.';
    if (connection.state === 'unanswered' || connection.state === 'no-connection') {
      if (Object.keys(connection).some((key) => key !== 'state')) return 'Saved values connection is invalid.';
      continue;
    }
    if (!isConnectedValueConnectionConsistent(scenarioId, connection, scenario))
      return 'Saved values connection is inconsistent.';
  }
  return undefined;
}

function createSavedBehaviourValueConnection(
  scenario: AttemptScenario,
  connection: ValuesConnectionInput
): BehaviourValueConnection {
  if (connection.state === 'connected') return createConnectedBehaviourValueConnection(scenario, connection);
  if (connection.state !== 'unanswered' && connection.state !== 'no-connection') {
    throw new Error('Values connection state is invalid.');
  }
  return { state: connection.state };
}

function createConnectedBehaviourValueConnection(
  scenario: AttemptScenario,
  connection: Extract<ValuesConnectionInput, { state: 'connected' }>
): BehaviourValueConnection {
  if (!scenario.reveals?.some((item) => item.id === connection.possibilityId)) {
    throw new Error('Reflection possibility is not part of this scenario.');
  }
  if (!scenario.answer || scenario.answer === 'depends' || scenario.answer === 'skip') {
    throw new Error('A value can be connected only to a chosen response.');
  }
  const sourceValue = connection.completedSession.finalValues.find((item) => item.id === connection.valueId);
  if (
    connection.completedSession.version !== 2 ||
    connection.completedSession.sessionId !== connection.sourceSessionId ||
    !sourceValue ||
    !sourceValue.title.trim() ||
    !sourceValue.description.trim() ||
    !Number.isFinite(connection.completedSession.completedAt)
  ) {
    throw new Error('Saved value result is incomplete or inconsistent.');
  }
  return {
    state: 'connected',
    scenarioId: scenario.id,
    possibilityId: connection.possibilityId,
    sourceSessionId: connection.sourceSessionId,
    sourceExerciseType: connection.sourceExerciseType,
    sourceCompletedAt: connection.completedSession.completedAt,
    value: { id: sourceValue.id, title: sourceValue.title, description: sourceValue.description },
    ...(connection.observation ? { observation: connection.observation } : {}),
  };
}

export interface BehaviourAttemptRepository {
  create(attempt: BehaviourAttempt): Promise<void>;
  read(id: string): Promise<BehaviourAttempt | null>;
  save(attempt: BehaviourAttempt): Promise<void>;
  list(): Promise<BehaviourAttempt[]>;
  delete(id: string): Promise<void>;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class InMemoryBehaviourAttemptRepository implements BehaviourAttemptRepository {
  private readonly attempts = new Map<string, BehaviourAttempt>();

  async create(attempt: BehaviourAttempt): Promise<void> {
    this.attempts.set(attempt.id, clone(attempt));
  }

  async read(id: string): Promise<BehaviourAttempt | null> {
    const attempt = this.attempts.get(id);
    return attempt ? clone(attempt) : null;
  }

  async save(attempt: BehaviourAttempt): Promise<void> {
    if (!this.attempts.has(attempt.id)) throw new Error('Scenario attempt not found.');
    this.attempts.set(attempt.id, clone(attempt));
  }

  async list(): Promise<BehaviourAttempt[]> {
    return [...this.attempts.values()].map(clone).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async delete(id: string): Promise<void> {
    this.attempts.delete(id);
  }
}

export class BehaviourAttemptService {
  private nextId = 1;
  private readonly writeTails = new Map<string, Promise<void>>();

  constructor(private readonly repository: BehaviourAttemptRepository) {}

  async startAttempt(): Promise<BehaviourAttempt> {
    const now = Date.now();
    const attempt: BehaviourAttempt = {
      id: `scenario-${now}-${this.nextId++}`,
      contentVersion: BEHAVIOUR_CONTENT_VERSION,
      stage: 'active',
      createdAt: now,
      updatedAt: now,
      position: 0,
      scenarios: behaviourScenarios.map((scenario) => clone(scenario)),
    };
    await this.repository.create(attempt);
    return clone(attempt);
  }

  async loadAttempt(id: string): Promise<BehaviourAttempt> {
    const attempt = await this.repository.read(id);
    if (!attempt) throw new Error('Scenario attempt not found.');
    this.validate(attempt);
    return attempt;
  }

  async listAttempts(): Promise<BehaviourAttempt[]> {
    const attempts = await this.repository.list();
    attempts.forEach((attempt) => this.validate(attempt));
    return attempts;
  }

  async deleteAttempt(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exportAttempt(id: string, options: ScenarioResultsOptions = {}): Promise<BehaviourResultsEnvelope> {
    const attempt = await this.loadAttempt(id);
    return createBehaviourResultsEnvelope(attempt, options);
  }

  async composeConversationPrompt(id: string, options: BehaviourConversationPromptOptions = {}): Promise<string> {
    const attempt = await this.loadAttempt(id);
    if (attempt.stage !== 'finished') throw new Error('The scenario reflection is not finished yet.');
    return composeBehaviourConversationPrompt({
      scenarios: attempt.scenarios,
      selectedPossibilityIds: options.selectedPossibilityIds ?? [],
      includeOptionalContext: options.includeOptionalContext ?? false,
      includeReflectionResponses: options.includeReflectionResponses ?? false,
      includeReflectionNotes: options.includeReflectionNotes ?? false,
      valuesConnections: attempt.valuesConnections as Record<string, ConversationPromptValuesConnection> | undefined,
      includeValuesConnections: options.includeValuesConnections ?? false,
      includeConnectionObservations: options.includeConnectionObservations ?? false,
    });
  }

  async updateReminderSettings(id: string, settings: BehaviourReminderSettings): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage !== 'finished')
        throw new Error('Reminder settings can be saved only for a finished scenario reflection.');
      const error = this.reminderSettingsError(settings, attempt);
      if (error) throw new Error(error);
      attempt.reminderSettings = clone(settings);
      attempt.updatedAt = Date.now();
      await this.repository.save(attempt);
      return attempt;
    });
  }

  async composeRecurringPrompt(id: string, executionDate = new Date()): Promise<string> {
    const attempt = await this.loadAttempt(id);
    if (attempt.stage !== 'finished') throw new Error('The scenario reflection is not finished yet.');
    const settings = attempt.reminderSettings;
    if (!settings) throw new Error('Save reminder preferences before creating a recurring prompt.');
    const settingsError = this.reminderSettingsError(settings, attempt);
    if (settingsError) throw new Error(settingsError);
    if (settings.selectedPossibilityIds.length === 0)
      throw new Error('Choose at least one reflection possibility to include.');
    return composeBehaviourRecurringPrompt({
      scenarios: attempt.scenarios,
      valuesConnections: attempt.valuesConnections as Record<string, ConversationPromptValuesConnection> | undefined,
      settings,
      executionDate,
    });
  }

  private hasValidReminderSettings(value: unknown, attempt: BehaviourAttempt): value is BehaviourReminderSettings {
    return this.reminderSettingsError(value, attempt) === undefined;
  }

  private reminderSettingsError(value: unknown, attempt: BehaviourAttempt): string | undefined {
    const allowed = attempt.scenarios.flatMap((scenario) => {
      return (scenario.reveals ?? []).map((possibility) => {
        return `${scenario.id}:${possibility.id}`;
      });
    });
    if (attempt.stage !== 'finished') return 'Reminder settings can be saved only for a finished scenario reflection.';
    return getBehaviourReminderSettingsError(value, allowed);
  }

  async restoreAttempt(envelope: unknown): Promise<BehaviourAttempt> {
    const attempt = restoreBehaviourResultsEnvelope(envelope);
    this.validate(attempt);
    return this.serializeWrite(attempt.id, async () => {
      const existing = await this.repository.read(attempt.id);
      if (existing) await this.repository.save(attempt);
      else await this.repository.create(attempt);
      return clone(attempt);
    });
  }

  async setPosition(id: string, position: number): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage !== 'active') throw new Error('Finished scenario position cannot be changed.');
      if (!Number.isInteger(position) || position < 0 || position >= attempt.scenarios.length)
        throw new Error('Invalid scenario position.');
      attempt.position = position;
      attempt.updatedAt = Date.now();
      await this.repository.save(attempt);
      return attempt;
    });
  }

  async answer(id: string, scenarioId: string, answer: ScenarioAnswer, context?: string): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage !== 'active') throw new Error('Finished scenario choices cannot be changed.');
      const scenario = attempt.scenarios.find((item) => item.id === scenarioId);
      if (!scenario) throw new Error('Scenario not found.');
      if (answer !== 'depends' && answer !== 'skip' && !scenario.responses.some((response) => response.id === answer)) {
        throw new Error('Response not found for scenario.');
      }
      scenario.answer = answer;
      if (context !== undefined) {
        if (context.length === 0) delete scenario.optionalContext;
        else scenario.optionalContext = context;
      }
      attempt.updatedAt = Date.now();
      await this.repository.save(attempt);
      return attempt;
    });
  }

  async updateContext(id: string, scenarioId: string, context: string): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage !== 'active') throw new Error('Finished scenario reflections cannot be changed.');
      const scenario = attempt.scenarios.find((item) => item.id === scenarioId);
      if (!scenario) throw new Error('Scenario not found.');
      if (context.length === 0) delete scenario.optionalContext;
      else scenario.optionalContext = context;
      attempt.updatedAt = Date.now();
      await this.repository.save(attempt);
      return attempt;
    });
  }

  async finishAttempt(id: string): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage === 'finished') return attempt;
      attempt.stage = 'finished';
      attempt.updatedAt = Date.now();
      for (const scenario of attempt.scenarios) {
        const selected = scenario.responses.find((response) => response.id === scenario.answer);
        if (selected) scenario.reveals = clone(selected.possibilities);
      }
      await this.repository.save(attempt);
      return attempt;
    });
  }

  async updateReflection(
    id: string,
    scenarioId: string,
    possibilityId: string,
    response: ReflectionResponse | undefined,
    note: string
  ): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage !== 'finished')
        throw new Error('Finished scenario reflections can be updated only after finishing.');
      if (!['worth-considering', 'does-not-fit', 'not-sure', undefined].includes(response))
        throw new Error('Invalid reflection response.');
      const scenario = attempt.scenarios.find((item) => item.id === scenarioId);
      const possibility = scenario?.reveals?.find((item) => item.id === possibilityId);
      if (!scenario || !possibility) throw new Error('Reflection possibility is not part of this scenario.');
      if (typeof note !== 'string') throw new Error('Reflection note must be text.');

      const entry: PossibilityReflection = {};
      if (response !== undefined) entry.response = response;
      if (note.length > 0) entry.note = note;
      scenario.reflections ??= {};
      if (response === undefined && note.length === 0) {
        delete scenario.reflections[possibilityId];
        if (Object.keys(scenario.reflections).length === 0) delete scenario.reflections;
      } else {
        scenario.reflections[possibilityId] = entry;
      }
      attempt.updatedAt = Date.now();
      await this.repository.save(attempt);
      return attempt;
    });
  }

  async setValuesConnection(id: string, connection: ValuesConnectionInput): Promise<BehaviourAttempt> {
    return this.serializeWrite(id, async () => {
      const attempt = await this.loadAttempt(id);
      if (attempt.stage !== 'finished')
        throw new Error('Values can be connected only after finishing the scenario reflection.');
      const scenario = attempt.scenarios.find((item) => item.id === connection.scenarioId);
      if (!scenario) throw new Error('Scenario not found.');
      const saved = createSavedBehaviourValueConnection(scenario, connection);
      attempt.valuesConnections ??= {};
      attempt.valuesConnections[scenario.id] = saved;
      attempt.updatedAt = Date.now();
      await this.repository.save(attempt);
      return attempt;
    });
  }

  private async serializeWrite<T>(id: string, write: () => Promise<T>): Promise<T> {
    const previous = this.writeTails.get(id) ?? Promise.resolve();
    let release!: () => void;
    const tail = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.writeTails.set(id, tail);
    await previous;
    try {
      return await write();
    } finally {
      release();
      if (this.writeTails.get(id) === tail) this.writeTails.delete(id);
    }
  }

  private validate(attempt: BehaviourAttempt): void {
    if (attempt.contentVersion !== BEHAVIOUR_CONTENT_VERSION)
      throw new Error('This saved scenario version is not supported.');
    if (attempt.stage !== 'active' && attempt.stage !== 'finished')
      throw new Error('This saved scenario stage is invalid.');
    if (!Number.isInteger(attempt.position) || attempt.position < 0 || attempt.position >= attempt.scenarios.length)
      throw new Error('This saved scenario position is invalid.');
    const known = new Map(behaviourScenarios.map((scenario) => [scenario.id, scenario]));
    if (
      attempt.scenarios.length !== behaviourScenarios.length ||
      attempt.scenarios.some((scenario, index) => isScenarioSnapshotInvalid(scenario, index, attempt.stage, known))
    )
      throw new Error('This saved scenario content is inconsistent.');
    const valuesConnectionsError = getValuesConnectionsError(attempt);
    if (valuesConnectionsError) throw new Error(valuesConnectionsError);
    if (attempt.reminderSettings !== undefined && !this.hasValidReminderSettings(attempt.reminderSettings, attempt))
      throw new Error('Saved reminder settings are invalid.');
  }
}
