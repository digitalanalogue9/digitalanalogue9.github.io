import { BEHAVIOUR_CONTENT_VERSION, behaviourScenarios } from '../domain/behaviourScenarios';
import {
  BehaviourAttemptService,
  type BehaviourAttempt,
  type BehaviourAttemptRepository,
  type AttemptScenario,
} from './behaviourAttemptService';
import { SCENARIO_ATTEMPTS_STORAGE_KEY, type ScenarioAttempt } from '../scenario-reflection/attemptStorage';
export { getExerciseServiceSingleton } from './ExerciseServiceContext';

export const BEHAVIOUR_ATTEMPTS_STORAGE_KEY = 'core-values-behaviour-attempts-v2';

type Store = { version: 1; attempts: BehaviourAttempt[] };
function readStore(): Store {
  const raw = localStorage.getItem(BEHAVIOUR_ATTEMPTS_STORAGE_KEY);
  if (raw) {
    const value = JSON.parse(raw) as Store;
    if (value.version !== 1 || !Array.isArray(value.attempts))
      throw new Error('Saved scenario reflections could not be read.');
    return value;
  }
  const legacy = JSON.parse(localStorage.getItem(SCENARIO_ATTEMPTS_STORAGE_KEY) ?? '{"attempts":[]}') as {
    attempts: ScenarioAttempt[];
  };
  if (!Array.isArray(legacy.attempts)) throw new Error('Saved scenario reflections could not be read.');
  const attempts = legacy.attempts.map((old): BehaviourAttempt => ({
    id: old.id,
    contentVersion: BEHAVIOUR_CONTENT_VERSION,
    stage: old.status === 'completed' ? 'finished' : 'active',
    createdAt: old.startedAt,
    updatedAt: old.updatedAt,
    position: old.position,
    scenarios: behaviourScenarios.map((template): AttemptScenario => {
      const scenario: AttemptScenario = structuredClone(template);
      const answer = old.answers[scenario.id];
      if (answer !== undefined) scenario.answer = answer;
      const response = scenario.responses.find((item) => item.id === answer);
      if (old.status === 'completed' && response) scenario.reveals = structuredClone(response.possibilities);
      const reflections = Object.fromEntries(
        (response?.possibilities ?? []).flatMap((possibility) => {
          const note = old.reflections?.[`${scenario.id}:${possibility.id}`];
          return note
            ? [
                [
                  possibility.id,
                  { ...(note.answer ? { response: note.answer } : {}), ...(note.note ? { note: note.note } : {}) },
                ],
              ]
            : [];
        })
      );
      if (Object.keys(reflections).length) scenario.reflections = reflections;
      const connection = old.valueConnections?.[scenario.id];
      if (connection)
        scenario.optionalContext = `Previously recorded value connection: ${connection.value}${connection.observation ? `\n${connection.observation}` : ''}`;
      return scenario;
    }),
    ...(old.reminder
      ? {
          reminderSettings: {
            schedule: {
              cadence: old.reminder.cadence,
              time: old.reminder.time,
              timezone: old.reminder.timezone,
              weekday: old.reminder.weekday,
            },
            selectedPossibilityIds: old.reminder.selectedPossibilityIds,
            includeOptionalContext: false,
            includeReflectionResponses: false,
            includeReflectionNotes: false,
            includeValuesConnections: false,
            includeConnectionObservations: false,
          },
        }
      : {}),
  }));
  const store: Store = { version: 1, attempts };
  // Keep the original records intact; the new store is also the one-time migration marker.
  localStorage.setItem(BEHAVIOUR_ATTEMPTS_STORAGE_KEY, JSON.stringify(store));
  return store;
}
function writeStore(store: Store) {
  localStorage.setItem(BEHAVIOUR_ATTEMPTS_STORAGE_KEY, JSON.stringify(store));
}
const repository: BehaviourAttemptRepository = {
  create: async (attempt) => {
    const store = readStore();
    if (store.attempts.some(({ id }) => id === attempt.id))
      throw new Error('A reflection with this ID already exists.');
    writeStore({ ...store, attempts: [...store.attempts, attempt] });
  },
  read: async (id) => readStore().attempts.find((attempt) => attempt.id === id) ?? null,
  save: async (attempt) => {
    const store = readStore();
    if (!store.attempts.some(({ id }) => id === attempt.id)) throw new Error('Scenario attempt not found.');
    writeStore({ ...store, attempts: store.attempts.map((saved) => (saved.id === attempt.id ? attempt : saved)) });
  },
  list: async () => readStore().attempts.sort((a, b) => b.updatedAt - a.updatedAt),
  delete: async (id) => {
    const store = readStore();
    writeStore({ ...store, attempts: store.attempts.filter((attempt) => attempt.id !== id) });
  },
};
const behaviourService = new BehaviourAttemptService(repository);
export function getBehaviourAttemptServiceSingleton() {
  return behaviourService;
}
