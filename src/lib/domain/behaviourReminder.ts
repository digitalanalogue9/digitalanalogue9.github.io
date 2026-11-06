export type BehaviourReminderCadence = 'daily' | 'weekdays' | 'weekly';

export type BehaviourReminderSchedule = {
  cadence: BehaviourReminderCadence;
  time: string;
  timezone: string;
  /** ISO weekday: Monday = 1 through Sunday = 7. */
  weekday: number;
};

export type BehaviourReminderSettings = {
  schedule: BehaviourReminderSchedule;
  selectedPossibilityIds: string[];
  includeOptionalContext: boolean;
  includeReflectionResponses: boolean;
  includeReflectionNotes: boolean;
  includeValuesConnections: boolean;
  includeConnectionObservations: boolean;
};

export function createDefaultBehaviourReminderSchedule(
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): BehaviourReminderSchedule {
  return { cadence: 'daily', time: '09:00', timezone, weekday: 1 };
}

export function createDefaultBehaviourReminderSettings(
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): BehaviourReminderSettings {
  return {
    schedule: createDefaultBehaviourReminderSchedule(timezone),
    selectedPossibilityIds: [],
    includeOptionalContext: false,
    includeReflectionResponses: false,
    includeReflectionNotes: false,
    includeValuesConnections: false,
    includeConnectionObservations: false,
  };
}

export function isValidIanaTimeZone(timezone: string): boolean {
  if (!timezone.trim()) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

export function isValidBehaviourReminderSchedule(schedule: BehaviourReminderSchedule): boolean {
  return (
    ['daily', 'weekdays', 'weekly'].includes(schedule.cadence) &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.time) &&
    isValidIanaTimeZone(schedule.timezone) &&
    Number.isInteger(schedule.weekday) &&
    schedule.weekday >= 1 &&
    schedule.weekday <= 7
  );
}

export function isValidBehaviourReminderSettings(
  value: unknown,
  allowedPossibilityIds: readonly string[]
): value is BehaviourReminderSettings {
  return getBehaviourReminderSettingsError(value, allowedPossibilityIds) === undefined;
}

const reminderSettingKeys = [
  'schedule',
  'selectedPossibilityIds',
  'includeOptionalContext',
  'includeReflectionResponses',
  'includeReflectionNotes',
  'includeValuesConnections',
  'includeConnectionObservations',
];
const reminderScheduleKeys = ['cadence', 'time', 'timezone', 'weekday'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function hasReminderSettingFields(settings: Record<string, unknown>): boolean {
  return (
    Array.isArray(settings.selectedPossibilityIds) &&
    typeof settings.includeOptionalContext === 'boolean' &&
    typeof settings.includeReflectionResponses === 'boolean' &&
    typeof settings.includeReflectionNotes === 'boolean' &&
    typeof settings.includeValuesConnections === 'boolean' &&
    typeof settings.includeConnectionObservations === 'boolean'
  );
}

function isReminderScheduleRecord(
  value: unknown
): value is Record<string, unknown> & { cadence: string; time: string; timezone: string; weekday: number } {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, reminderScheduleKeys) &&
    typeof value.cadence === 'string' &&
    typeof value.time === 'string' &&
    typeof value.timezone === 'string' &&
    typeof value.weekday === 'number'
  );
}

function hasOnlyAvailablePossibilityIds(value: unknown, allowedPossibilityIds: readonly string[]): boolean {
  return (
    Array.isArray(value) &&
    value.every((id) => typeof id === 'string' && allowedPossibilityIds.includes(id)) &&
    new Set(value).size === value.length
  );
}

export function getBehaviourReminderSettingsError(
  value: unknown,
  allowedPossibilityIds: readonly string[]
): string | undefined {
  if (!isRecord(value)) return 'Reminder settings are malformed.';
  if (!hasOnlyKeys(value, reminderSettingKeys)) return 'Reminder settings contain unsupported data.';
  if (!hasReminderSettingFields(value)) return 'Reminder settings are malformed.';
  const schedule = value.schedule;
  if (!isReminderScheduleRecord(schedule)) return 'Reminder schedule is malformed.';
  if (!isValidIanaTimeZone(schedule.timezone)) return 'Reminder time zone is invalid.';
  if (!isValidBehaviourReminderSchedule(schedule as unknown as BehaviourReminderSchedule))
    return 'Reminder cadence, time, or day is invalid.';
  if (!hasOnlyAvailablePossibilityIds(value.selectedPossibilityIds, allowedPossibilityIds))
    return 'A selected reflection possibility is not available for this attempt.';
  return undefined;
}
