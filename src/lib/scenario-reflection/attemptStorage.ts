export const SCENARIO_ATTEMPTS_STORAGE_KEY = 'core-values-scenario-attempts-v1';

export type ScenarioChoice = string | 'depends' | 'skip';

export type ScenarioAttempt = {
  id: string;
  startedAt: number;
  updatedAt: number;
  position: number;
  status: 'active' | 'completed';
  answers: Record<string, ScenarioChoice>;
};

type ScenarioAttemptStore = { attempts: ScenarioAttempt[] };

function readStore(): ScenarioAttemptStore {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SCENARIO_ATTEMPTS_STORAGE_KEY) ?? 'null');
    if (
      parsed &&
      typeof parsed === 'object' &&
      'attempts' in parsed &&
      Array.isArray(parsed.attempts) &&
      parsed.attempts.every(isScenarioAttempt)
    ) {
      return parsed as ScenarioAttemptStore;
    }
  } catch {
    // An invalid local record should not prevent starting a new reflection.
  }
  return { attempts: [] };
}

function isScenarioAttempt(value: unknown): value is ScenarioAttempt {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'startedAt' in value &&
    typeof value.startedAt === 'number' &&
    'updatedAt' in value &&
    typeof value.updatedAt === 'number' &&
    'position' in value &&
    typeof value.position === 'number' &&
    'status' in value &&
    (value.status === 'active' || value.status === 'completed') &&
    'answers' in value &&
    typeof value.answers === 'object' &&
    value.answers !== null
  );
}

function writeStore(store: ScenarioAttemptStore): void {
  localStorage.setItem(SCENARIO_ATTEMPTS_STORAGE_KEY, JSON.stringify(store));
}

export function loadLatestScenarioAttempt(): ScenarioAttempt | null {
  return readStore().attempts.at(-1) ?? null;
}

export function startScenarioAttempt(): ScenarioAttempt {
  const now = Date.now();
  const attempt: ScenarioAttempt = {
    id: globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random().toString(36).slice(2)}`,
    startedAt: now,
    updatedAt: now,
    position: 0,
    status: 'active',
    answers: {},
  };
  const store = readStore();
  writeStore({ attempts: [...store.attempts, attempt].slice(-20) });
  return attempt;
}

export function saveScenarioAttempt(attempt: ScenarioAttempt): ScenarioAttempt {
  const saved = { ...attempt, updatedAt: Date.now() };
  const store = readStore();
  const index = store.attempts.findIndex(({ id }) => id === attempt.id);
  if (index < 0) throw new Error('Scenario reflection attempt was not found.');
  const attempts = [...store.attempts];
  attempts[index] = saved;
  writeStore({ attempts });
  return saved;
}
