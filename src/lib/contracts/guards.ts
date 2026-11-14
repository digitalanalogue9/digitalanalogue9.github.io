import { CATEGORY_ORDER, SCHEMA_VERSION } from './constants';
import {
  CategoryName,
  CompletedSession,
  ImportEnvelope,
  ReflectionResponse,
  RoundSnapshot,
  SchedulePreferences,
  Session,
  SessionReflection,
  ValueCard,
  WeeklyDay,
} from './types';

const CATEGORY_SET = new Set<string>(CATEGORY_ORDER);
const SESSION_STATUSES = new Set(['active', 'completed']);
const EXERCISE_TYPES = new Set(['personal', 'team']);
const REFLECTION_RESPONSES = new Set<ReflectionResponse>(['recognised', 'rejected', 'unsure']);
const SCHEDULE_FREQUENCIES = new Set(['daily', 'weekdays', 'weekly']);
const WEEKLY_DAYS = new Set<WeeklyDay>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

function hasString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function hasInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function isCategoryName(value: unknown): value is CategoryName {
  return typeof value === 'string' && CATEGORY_SET.has(value);
}

export function isValueCard(value: unknown): value is ValueCard {
  if (!isRecord(value)) return false;
  return hasString(value.id) && hasString(value.title) && hasString(value.description);
}

function isValueArray(value: unknown): value is ValueCard[] {
  return Array.isArray(value) && value.every((entry) => isValueCard(entry));
}

function isOptionalNonNegativeInteger(value: unknown): boolean {
  return value === undefined || (hasInteger(value) && value >= 0);
}

function isDropCommand(value: Record<string, unknown>): boolean {
  return (
    value.kind === 'drop' &&
    isOptionalNonNegativeInteger(value.toIndex) &&
    hasString(value.valueId) &&
    isCategoryName(value.toCategory)
  );
}

function isMoveCommand(value: Record<string, unknown>): boolean {
  return (
    value.kind === 'move' &&
    isOptionalNonNegativeInteger(value.fromIndex) &&
    isOptionalNonNegativeInteger(value.toIndex) &&
    hasString(value.valueId) &&
    isCategoryName(value.fromCategory) &&
    isCategoryName(value.toCategory)
  );
}

function isRoundCommand(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isDropCommand(value) || isMoveCommand(value);
}

function isCategoriesState(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return CATEGORY_ORDER.every((category) => isValueArray(value[category]));
}

export function isSession(value: unknown): value is Session {
  if (!isRecord(value)) return false;
  if (!hasString(value.id)) return false;
  if (!hasInteger(value.currentRoundNumber) || value.currentRoundNumber <= 0) return false;
  if (typeof value.status !== 'string' || !SESSION_STATUSES.has(value.status)) return false;

  return (
    value.version === SCHEMA_VERSION &&
    hasNumber(value.createdAt) &&
    hasNumber(value.updatedAt) &&
    hasInteger(value.targetCoreValues) &&
    value.targetCoreValues > 0 &&
    isValueArray(value.initialValues) &&
    typeof value.exerciseType === 'string' &&
    EXERCISE_TYPES.has(value.exerciseType)
  );
}

export function isRoundSnapshot(value: unknown, sessionId?: string): value is RoundSnapshot {
  if (!isRecord(value)) return false;
  return hasValidRoundSnapshotIdentity(value, sessionId) && hasValidRoundSnapshotContents(value);
}

function hasValidRoundSnapshotIdentity(value: Record<string, unknown>, sessionId?: string): boolean {
  return (
    value.version === SCHEMA_VERSION &&
    (sessionId === undefined || value.sessionId === sessionId) &&
    hasString(value.sessionId) &&
    hasInteger(value.roundNumber) &&
    value.roundNumber >= 1 &&
    hasInteger(value.targetCoreValues) &&
    value.targetCoreValues >= 1 &&
    hasNumber(value.createdAt) &&
    hasNumber(value.updatedAt)
  );
}

function hasValidRoundSnapshotContents(value: Record<string, unknown>): boolean {
  return (
    isValueArray(value.deck) &&
    isCategoriesState(value.categories) &&
    Array.isArray(value.activeCategories) &&
    value.activeCategories.every((category) => isCategoryName(category)) &&
    Array.isArray(value.commands) &&
    value.commands.every((command) => isRoundCommand(command)) &&
    (value.readyForReflection === undefined || typeof value.readyForReflection === 'boolean')
  );
}

export function isCompletedSession(value: unknown, sessionId?: string): value is CompletedSession {
  if (!isRecord(value)) return false;
  if (value.version !== SCHEMA_VERSION) return false;
  if (sessionId !== undefined && value.sessionId !== sessionId) return false;
  if (!hasString(value.sessionId)) return false;
  if (!hasNumber(value.completedAt)) return false;
  if (value.completedBy !== undefined && !hasString(value.completedBy)) return false;
  if (!Array.isArray(value.finalValues)) return false;

  if (
    !value.finalValues.every((entry) => {
      if (!isRecord(entry) || !isValueCard(entry)) return false;
      const reason = (entry as Record<string, unknown>).reason;
      if (reason === undefined) return true;
      return typeof reason === 'string';
    })
  )
    return false;
  if (value.reflection !== undefined && !isSessionReflection(value.reflection, value.finalValues)) return false;
  return true;
}

function isSchedulePreferences(value: unknown): value is SchedulePreferences {
  if (!isRecord(value)) return false;
  if (!Object.keys(value).every((key) => ['frequency', 'localTime', 'timeZone', 'weeklyDay'].includes(key)))
    return false;
  if (typeof value.frequency !== 'string' || !SCHEDULE_FREQUENCIES.has(value.frequency)) return false;
  if (typeof value.localTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.localTime)) return false;
  if (!hasString(value.timeZone)) return false;

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value.timeZone });
  } catch {
    return false;
  }

  if (value.frequency === 'weekly') {
    return typeof value.weeklyDay === 'string' && WEEKLY_DAYS.has(value.weeklyDay as WeeklyDay);
  }
  return value.weeklyDay === undefined;
}

export function isSessionReflection(value: unknown, finalValues?: ValueCard[]): value is SessionReflection {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.values)) return false;
  if (
    !Object.keys(value).every((key) =>
      ['version', 'values', 'goal', 'relationships', 'schedulePreferences'].includes(key)
    )
  )
    return false;
  if (value.goal !== undefined && typeof value.goal !== 'string') return false;
  if (value.schedulePreferences !== undefined && !isSchedulePreferences(value.schedulePreferences)) return false;
  if (value.relationships !== undefined) {
    if (!isRecord(value.relationships)) return false;
    if (
      !Object.entries(value.relationships).every(
        ([, notes]) =>
          isRecord(notes) &&
          Object.keys(notes).every((key) => key === 'observation' || key === 'action') &&
          (notes.observation === undefined || typeof notes.observation === 'string') &&
          (notes.action === undefined || typeof notes.action === 'string')
      )
    )
      return false;
  }
  const selectedValueIds = finalValues ? new Set(finalValues.map((entry) => entry.id)) : null;
  return Object.entries(value.values).every(([valueId, notes]) => {
    if (selectedValueIds && !selectedValueIds.has(valueId)) return false;
    if (!isRecord(notes)) return false;
    if (!Object.keys(notes).every((key) => key === 'observation' || key === 'action' || key === 'suggestions'))
      return false;
    if (notes.suggestions !== undefined) {
      if (!isRecord(notes.suggestions)) return false;
      if (
        !Object.entries(notes.suggestions).every(
          ([suggestionId, response]) =>
            hasString(suggestionId) &&
            typeof response === 'string' &&
            REFLECTION_RESPONSES.has(response as ReflectionResponse)
        )
      )
        return false;
    }
    return (
      (notes.observation === undefined || typeof notes.observation === 'string') &&
      (notes.action === undefined || typeof notes.action === 'string')
    );
  });
}

export function validateImportEnvelope(payload: unknown): payload is ImportEnvelope {
  if (!isRecord(payload)) return false;
  if (payload.version !== SCHEMA_VERSION) return false;
  if (!hasNumber(payload.exportedAt)) return false;
  if (!isSession(payload.session)) return false;
  if (!Array.isArray(payload.rounds) || payload.rounds.length === 0) return false;

  const roundNumbers = new Set<number>();
  for (const round of payload.rounds) {
    if (!isRoundSnapshot(round, payload.session.id)) return false;
    roundNumbers.add(round.roundNumber);
  }
  if (!roundNumbers.has(payload.session.currentRoundNumber)) return false;

  if (payload.completedSession === undefined) {
    return payload.session.status !== 'completed';
  }

  return payload.session.status === 'completed' && isCompletedSession(payload.completedSession, payload.session.id);
}
