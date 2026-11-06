import { SCHEMA_VERSION } from '@/lib/contracts/constants';
import {
  CategoryName,
  CompletedSession,
  ImportEnvelope,
  RoundSnapshot,
  Session,
  ValueCard,
} from '@/lib/contracts/types';

const categoryOrder: CategoryName[] = [
  'Very Important',
  'Quite Important',
  'Important',
  'Of Some Importance',
  'Not Important',
];

export function makeValueCards(count = 6): ValueCard[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `value-${index + 1}`,
    title: `Value ${index + 1}`,
    description: `Description ${index + 1}`,
  }));
}

export function makeSession(params: Partial<Session> = {}): Session {
  const now = Date.now();
  return {
    id: params.id ?? 'session-1',
    version: SCHEMA_VERSION,
    createdAt: params.createdAt ?? now,
    updatedAt: params.updatedAt ?? now,
    exerciseType: params.exerciseType ?? 'personal',
    targetCoreValues: params.targetCoreValues ?? 3,
    initialValues: params.initialValues ?? makeValueCards(6),
    currentRoundNumber: params.currentRoundNumber ?? 1,
    status: params.status ?? 'active',
  };
}

export function makeCompletedSession(sessionId: string, values: ValueCard[] = makeValueCards(3)): CompletedSession {
  return {
    version: SCHEMA_VERSION,
    sessionId,
    completedAt: Date.now(),
    finalValues: values.map((value) => ({
      ...value,
      reason: `Reason for ${value.title}`,
    })),
  };
}

function createInitialRound(session: Session, now: number): RoundSnapshot {
  const categories = categoryOrder.reduce(
    (acc, category) => {
      acc[category] = [];
      return acc;
    },
    {} as Record<CategoryName, ValueCard[]>
  );

  return {
    version: SCHEMA_VERSION,
    sessionId: session.id,
    roundNumber: 1,
    targetCoreValues: session.targetCoreValues,
    deck: [...session.initialValues],
    categories,
    activeCategories: [...categoryOrder],
    commands: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function makeImportEnvelope(
  params: {
    session?: Session;
    completedSession?: CompletedSession;
  } = {}
): ImportEnvelope {
  const session = params.session ?? makeSession();
  const now = Date.now();

  return {
    version: SCHEMA_VERSION,
    exportedAt: now,
    session,
    rounds: [createInitialRound(session, now)],
    completedSession: params.completedSession,
  };
}
