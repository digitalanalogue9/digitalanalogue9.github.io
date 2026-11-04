import { openDB, type IDBPDatabase } from 'idb';

const STORES = {
  legacySessions: 'sessions',
  legacyRounds: 'rounds',
  legacyCompleted: 'completedSessions',
  sessions: 'canonicalSessions',
  rounds: 'canonicalRounds',
  completed: 'canonicalCompletedSessions',
  metadata: 'metadata',
} as const;
const MIGRATION_KEY = 'v4-session-canonical-migration-v1';
const DB_NAME = 'coreValuesData';
const DB_VERSION = 6;
const CATEGORIES = ['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important'] as const;
type Category = (typeof CATEGORIES)[number];
type ValueCard = { id: string; title: string; description: string };
type RoundCommand =
  | { kind: 'drop'; valueId: string; toCategory: Category; toIndex?: number }
  | {
      kind: 'move';
      valueId: string;
      fromCategory: Category;
      toCategory: Category;
      fromIndex?: number;
      toIndex?: number;
    };
export type Session = {
  id: string;
  version: 2;
  createdAt: number;
  updatedAt: number;
  exerciseType: 'personal' | 'team';
  targetCoreValues: number;
  initialValues: ValueCard[];
  currentRoundNumber: number;
  status: 'active' | 'completed';
};
export type RoundSnapshot = {
  version: 2;
  sessionId: string;
  roundNumber: number;
  targetCoreValues: number;
  deck: ValueCard[];
  categories: Record<Category, ValueCard[]>;
  activeCategories: Category[];
  commands: RoundCommand[];
  createdAt: number;
  updatedAt: number;
};
export type CompletedSession = {
  version: 2;
  sessionId: string;
  completedAt: number;
  finalValues: Array<ValueCard & { reason?: string }>;
};
export type SessionRecord = {
  session: Session;
  currentRound: RoundSnapshot;
  rounds: RoundSnapshot[];
  completedSession?: CompletedSession;
};
type LegacySession = {
  id: string;
  timestamp: number;
  currentRound: number;
  completed: boolean;
  targetCoreValues: number;
  exerciseType?: 'personal' | 'team';
  initialValues: unknown[];
  remainingValues: unknown[];
};
type MigrationMarker = {
  key: string;
  migratedAt: number;
  migratedSessions: number;
  skippedInvalidRecords: number;
};

let repositoryDb: Promise<IDBPDatabase> | undefined;
let migration: Promise<void> | undefined;

function openRepositoryDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORES.legacySessions)) {
        db.createObjectStore(STORES.legacySessions, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.legacyRounds)) {
        const rounds = db.createObjectStore(STORES.legacyRounds, { keyPath: ['sessionId', 'roundNumber'] });
        rounds.createIndex('sessionId', 'sessionId');
      }
      if (!db.objectStoreNames.contains(STORES.legacyCompleted)) {
        db.createObjectStore(STORES.legacyCompleted, { keyPath: 'sessionId' });
      }
      if (!db.objectStoreNames.contains(STORES.sessions)) db.createObjectStore(STORES.sessions, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORES.rounds)) {
        const rounds = db.createObjectStore(STORES.rounds, { keyPath: ['sessionId', 'roundNumber'] });
        rounds.createIndex('sessionId', 'sessionId');
      }
      if (!db.objectStoreNames.contains(STORES.completed))
        db.createObjectStore(STORES.completed, { keyPath: 'sessionId' });
      if (!db.objectStoreNames.contains(STORES.metadata)) db.createObjectStore(STORES.metadata, { keyPath: 'key' });
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isValue(value: unknown): value is ValueCard {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.title === 'string' &&
    typeof value.description === 'string'
  );
}

function toValues(values: unknown): ValueCard[] | null {
  if (!Array.isArray(values) || !values.every(isValue)) return null;
  const ids = values.map((value) => value.id);
  if (new Set(ids).size !== ids.length) return null;
  return values.map(({ id, title, description }) => ({ id, title, description }));
}

function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && CATEGORIES.includes(value as Category);
}

function emptyCategories(): Record<Category, ValueCard[]> {
  return Object.fromEntries(CATEGORIES.map((category) => [category, []])) as unknown as Record<Category, ValueCard[]>;
}

function toCategories(value: unknown): Record<Category, ValueCard[]> | null {
  if (!isRecord(value)) return null;
  const categories = emptyCategories();
  for (const category of CATEGORIES) {
    const values = value[category];
    if (values === undefined) continue;
    const parsed = toValues(values);
    if (!parsed) return null;
    categories[category] = parsed;
  }
  return categories;
}

function activeCategories(cardsInRound: number, target: number): Category[] {
  const ratio = cardsInRound / target;
  if (ratio <= 1.5) return ['Very Important', 'Not Important'];
  if (ratio <= 2) return ['Very Important', 'Quite Important', 'Not Important'];
  if (ratio <= 3) return ['Very Important', 'Quite Important', 'Important', 'Not Important'];
  return [...CATEGORIES];
}

function toCommand(value: unknown): RoundCommand | null {
  if (!isRecord(value) || !isRecord(value.payload)) return null;
  const payload = value.payload;
  const valueId = payload.cardId;
  if (typeof valueId !== 'string' || valueId.length === 0) return null;
  if (value.type === 'DROP' && isCategory(payload.category)) {
    return { kind: 'drop', valueId, toCategory: payload.category };
  }
  if (value.type === 'MOVE' && isCategory(payload.fromCategory) && isCategory(payload.toCategory)) {
    return {
      kind: 'move',
      valueId,
      fromCategory: payload.fromCategory,
      toCategory: payload.toCategory,
      ...(Number.isInteger(payload.fromIndex) && Number(payload.fromIndex) >= 0
        ? { fromIndex: Number(payload.fromIndex) }
        : {}),
      ...(Number.isInteger(payload.toIndex) && Number(payload.toIndex) >= 0
        ? { toIndex: Number(payload.toIndex) }
        : {}),
    };
  }
  return null;
}

function toLegacyRound(
  round: unknown,
  sessionId: string
): {
  roundNumber: number;
  timestamp: number;
  commands: RoundCommand[];
  categories: Record<Category, ValueCard[]>;
} | null {
  if (
    !isRecord(round) ||
    round.sessionId !== sessionId ||
    !Number.isInteger(round.roundNumber) ||
    Number(round.roundNumber) < 1 ||
    typeof round.timestamp !== 'number' ||
    !Number.isFinite(round.timestamp) ||
    !Array.isArray(round.commands)
  )
    return null;
  const categories = toCategories(round.availableCategories);
  const commands = round.commands.map(toCommand);
  if (!categories || commands.some((command) => command === null)) return null;
  return {
    roundNumber: Number(round.roundNumber),
    timestamp: round.timestamp,
    commands: commands as RoundCommand[],
    categories,
  };
}

function buildRound(
  session: LegacySession,
  legacyRound: NonNullable<ReturnType<typeof toLegacyRound>>,
  sourceValues: ValueCard[]
): RoundSnapshot | null {
  const categorized = new Set<string>();
  const flattened = CATEGORIES.flatMap((category) => legacyRound.categories[category]);
  for (const card of flattened) {
    if (categorized.has(card.id) || !sourceValues.some((source) => source.id === card.id)) return null;
    categorized.add(card.id);
  }
  const deck = sourceValues.filter((card) => !categorized.has(card.id));
  const commandValueIds = new Set(sourceValues.map((card) => card.id));
  if (legacyRound.commands.some((command) => !commandValueIds.has(command.valueId))) return null;
  return {
    version: 2,
    sessionId: session.id,
    roundNumber: legacyRound.roundNumber,
    targetCoreValues: session.targetCoreValues,
    deck,
    categories: legacyRound.categories,
    activeCategories: activeCategories(sourceValues.length, session.targetCoreValues),
    commands: legacyRound.commands,
    createdAt: legacyRound.timestamp,
    updatedAt: legacyRound.timestamp,
  };
}

function buildCanonicalRecord(
  candidate: unknown,
  legacyRounds: unknown[],
  legacyCompleted: unknown
): SessionRecord | null {
  if (!isRecord(candidate)) return null;
  const session = candidate as unknown as LegacySession;
  const initialValues = toValues(session.initialValues);
  const currentValues = toValues(session.remainingValues);
  if (
    !initialValues ||
    !currentValues ||
    typeof session.id !== 'string' ||
    !session.id ||
    typeof session.timestamp !== 'number' ||
    !Number.isFinite(session.timestamp) ||
    !Number.isInteger(session.currentRound) ||
    session.currentRound < 1 ||
    !Number.isInteger(session.targetCoreValues) ||
    session.targetCoreValues < 1 ||
    typeof session.completed !== 'boolean' ||
    (session.exerciseType !== undefined && session.exerciseType !== 'personal' && session.exerciseType !== 'team')
  )
    return null;

  const sortedRounds = legacyRounds
    .map((round) => toLegacyRound(round, session.id))
    .sort((left, right) => {
      if (!left || !right) return 0;
      return left.roundNumber - right.roundNumber;
    });
  if (!sortedRounds.length || sortedRounds.some((round) => round === null)) return null;
  const rounds = sortedRounds as NonNullable<(typeof sortedRounds)[number]>[];
  if (
    rounds.some((round, index) => round.roundNumber !== index + 1) ||
    !rounds.some((round) => round.roundNumber === session.currentRound)
  )
    return null;

  const canonicalRounds: RoundSnapshot[] = [];
  for (const legacyRound of rounds) {
    const sourceValues =
      legacyRound.roundNumber === 1
        ? initialValues
        : rounds[legacyRound.roundNumber - 2]
          ? CATEGORIES.filter((category) => category !== 'Not Important').flatMap(
              (category) => rounds[legacyRound.roundNumber - 2].categories[category]
            )
          : [];
    // `remainingValues` stores the round's starting cards during an active
    // Session, but completion replaces it with final values. Merge it with
    // the saved categories so completed rounds retain cards no longer listed
    // in that field. Category state also includes cards already sorted in an
    // active round.
    const roundValues =
      legacyRound.roundNumber === session.currentRound
        ? [
            ...new Map(
              [
                ...currentValues,
                ...CATEGORIES.flatMap((category) => legacyRound.categories[category]),
                ...legacyRound.commands
                  .map((command) => initialValues.find((value) => value.id === command.valueId))
                  .filter((value): value is ValueCard => Boolean(value)),
              ].map((card) => [card.id, card])
            ).values(),
          ]
        : sourceValues;
    const snapshot = buildRound(session, legacyRound, roundValues);
    if (!snapshot) return null;
    canonicalRounds.push(snapshot);
  }

  let completedSession: CompletedSession | undefined;
  if (session.completed) {
    if (!isRecord(legacyCompleted) || legacyCompleted.sessionId !== session.id) return null;
    const finalValues = toValues(legacyCompleted.finalValues);
    if (
      !finalValues ||
      finalValues.some((value, index) => {
        const entry = (legacyCompleted.finalValues as unknown[])[index];
        return !isRecord(entry) || (entry.reason !== undefined && typeof entry.reason !== 'string');
      })
    )
      return null;
    completedSession = {
      version: 2,
      sessionId: session.id,
      completedAt:
        typeof legacyCompleted.timestamp === 'number' && Number.isFinite(legacyCompleted.timestamp)
          ? legacyCompleted.timestamp
          : session.timestamp,
      finalValues: finalValues.map((value, index) => {
        const reason = (legacyCompleted.finalValues as Array<Record<string, unknown>>)[index].reason;
        return { ...value, ...(typeof reason === 'string' ? { reason } : {}) };
      }),
    };
  }

  const currentRound = canonicalRounds.find((round) => round.roundNumber === session.currentRound);
  if (!currentRound) return null;
  return {
    session: {
      id: session.id,
      version: 2,
      createdAt: session.timestamp,
      updatedAt: Math.max(
        session.timestamp,
        ...canonicalRounds.map((round) => round.updatedAt),
        completedSession?.completedAt ?? 0
      ),
      exerciseType: session.exerciseType ?? 'personal',
      targetCoreValues: session.targetCoreValues,
      initialValues,
      currentRoundNumber: session.currentRound,
      status: session.completed ? 'completed' : 'active',
    },
    currentRound,
    rounds: canonicalRounds,
    completedSession,
  };
}

async function initRepositoryDb(): Promise<IDBPDatabase> {
  repositoryDb ??= (async () => {
    const db = await openRepositoryDb();
    await migrateLegacySessions(db);
    return db;
  })().catch((error) => {
    repositoryDb = undefined;
    throw error;
  });
  return repositoryDb;
}

export async function migrateLegacySessions(existingDb?: IDBPDatabase): Promise<void> {
  migration ??= (async () => {
    const db = existingDb ?? (await openRepositoryDb());
    if (await db.get(STORES.metadata, MIGRATION_KEY)) return;
    let migratedSessions = 0;
    let skippedInvalidRecords = 0;
    const sessions = (await db.getAll(STORES.legacySessions)) as unknown[];
    for (const candidate of sessions) {
      if (!isRecord(candidate) || typeof candidate.id !== 'string') {
        skippedInvalidRecords += 1;
        continue;
      }
      if (await db.get(STORES.sessions, candidate.id)) continue;
      const rounds = (await db.getAllFromIndex(STORES.legacyRounds, 'sessionId', candidate.id)) as unknown[];
      const completed = await db.get(STORES.legacyCompleted, candidate.id);
      const record = buildCanonicalRecord(candidate, rounds, completed);
      if (!record) {
        skippedInvalidRecords += 1;
        continue;
      }
      const tx = db.transaction([STORES.sessions, STORES.rounds, STORES.completed], 'readwrite');
      await tx.objectStore(STORES.sessions).put(record.session);
      for (const round of record.rounds) await tx.objectStore(STORES.rounds).put(round);
      if (record.completedSession) await tx.objectStore(STORES.completed).put(record.completedSession);
      await tx.done;
      migratedSessions += 1;
    }
    const marker: MigrationMarker = {
      key: MIGRATION_KEY,
      migratedAt: Date.now(),
      migratedSessions,
      skippedInvalidRecords,
    };
    await db.put(STORES.metadata, marker);
  })().catch((error) => {
    migration = undefined;
    throw error;
  });
  await migration;
}

export async function listSessions(): Promise<Session[]> {
  const db = await initRepositoryDb();
  return ((await db.getAll(STORES.sessions)) as Session[]).sort((left, right) => right.updatedAt - left.updatedAt);
}

export async function createSession(input: {
  initialValues: ValueCard[];
  targetCoreValues: number;
  exerciseType: 'personal' | 'team';
}): Promise<SessionRecord> {
  if (
    !input.initialValues.length ||
    input.targetCoreValues < 1 ||
    input.targetCoreValues > input.initialValues.length
  ) {
    throw new Error('The exercise needs at least one value and a valid target.');
  }
  const db = await initRepositoryDb();
  const createdAt = Date.now();
  const id = crypto.randomUUID();
  const categories = emptyCategories();
  const round: RoundSnapshot = {
    version: 2,
    sessionId: id,
    roundNumber: 1,
    targetCoreValues: input.targetCoreValues,
    deck: [...input.initialValues],
    categories,
    activeCategories: activeCategories(input.initialValues.length, input.targetCoreValues),
    commands: [],
    createdAt,
    updatedAt: createdAt,
  };
  const session: Session = {
    id,
    version: 2,
    createdAt,
    updatedAt: createdAt,
    exerciseType: input.exerciseType,
    targetCoreValues: input.targetCoreValues,
    initialValues: [...input.initialValues],
    currentRoundNumber: 1,
    status: 'active',
  };
  const tx = db.transaction([STORES.sessions, STORES.rounds], 'readwrite');
  await tx.objectStore(STORES.sessions).put(session);
  await tx.objectStore(STORES.rounds).put(round);
  await tx.done;
  return { session, currentRound: round, rounds: [round] };
}

export async function saveSessionProgress(sessionId: string, round: RoundSnapshot): Promise<void> {
  const db = await initRepositoryDb();
  const existing = (await db.get(STORES.sessions, sessionId)) as Session | undefined;
  if (!existing || existing.status === 'completed' || round.sessionId !== sessionId) {
    throw new Error('This exercise is no longer active.');
  }
  const updatedAt = Date.now();
  const session: Session = {
    ...existing,
    currentRoundNumber: round.roundNumber,
    updatedAt,
  };
  const tx = db.transaction([STORES.sessions, STORES.rounds], 'readwrite');
  await tx.objectStore(STORES.sessions).put(session);
  await tx.objectStore(STORES.rounds).put({ ...round, updatedAt });
  await tx.done;
}

export async function loadSession(sessionId: string): Promise<SessionRecord | null> {
  const db = await initRepositoryDb();
  const session = (await db.get(STORES.sessions, sessionId)) as Session | undefined;
  if (!session) return null;
  const rounds = (await db.getAllFromIndex(STORES.rounds, 'sessionId', sessionId)) as RoundSnapshot[];
  rounds.sort((left, right) => left.roundNumber - right.roundNumber);
  const currentRound = rounds.find((round) => round.roundNumber === session.currentRoundNumber);
  if (!currentRound) return null;
  const completedSession = (await db.get(STORES.completed, sessionId)) as CompletedSession | undefined;
  return { session, currentRound, rounds, ...(completedSession ? { completedSession } : {}) };
}

export async function completeSession(
  sessionId: string,
  finalValues: Array<ValueCard & { reason?: string }>
): Promise<void> {
  const db = await initRepositoryDb();
  const record = await loadSession(sessionId);
  if (!record) throw new Error('Session was not found');
  const completedAt = Date.now();
  const session = { ...record.session, status: 'completed' as const, updatedAt: completedAt };
  const completedSession: CompletedSession = { version: 2, sessionId, completedAt, finalValues };
  const tx = db.transaction([STORES.sessions, STORES.completed], 'readwrite');
  await tx.objectStore(STORES.sessions).put(session);
  await tx.objectStore(STORES.completed).put(completedSession);
  await tx.done;
}

export async function closeSessionRepository(): Promise<void> {
  (await repositoryDb)?.close();
  repositoryDb = undefined;
  migration = undefined;
}

export async function hasCanonicalSession(sessionId: string): Promise<boolean> {
  const db = await initRepositoryDb();
  return Boolean(await db.get(STORES.sessions, sessionId));
}
