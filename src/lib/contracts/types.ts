import { CATEGORY_ORDER, SCHEMA_VERSION } from './constants';

export type SchemaVersion = typeof SCHEMA_VERSION;
export type CategoryName = (typeof CATEGORY_ORDER)[number];

export type ExerciseType = 'personal' | 'team';
export type SessionStatus = 'active' | 'completed';

export type ValueCard = {
  id: string;
  title: string;
  description: string;
};

export type ValueWithReason = ValueCard & {
  reason?: string;
};

export type ValueReflectionNotes = {
  observation?: string;
  action?: string;
  suggestions?: Record<string, ReflectionResponse>;
};

export type RelationshipReflectionNotes = {
  observation?: string;
  action?: string;
};

export type ReflectionResponse = 'recognised' | 'rejected' | 'unsure';

export type ScheduleFrequency = 'daily' | 'weekdays' | 'weekly';

export type WeeklyDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type SchedulePreferences = {
  frequency: ScheduleFrequency;
  localTime: string;
  timeZone: string;
  weeklyDay?: WeeklyDay;
};

export type SessionReflection = {
  version: 1;
  values: Record<string, ValueReflectionNotes>;
  goal?: string;
  relationships?: Record<string, RelationshipReflectionNotes>;
  schedulePreferences?: SchedulePreferences;
};

export type DropCommand = {
  kind: 'drop';
  valueId: string;
  toCategory: CategoryName;
  toIndex?: number;
};

export type MoveCommand = {
  kind: 'move';
  valueId: string;
  fromCategory: CategoryName;
  toCategory: CategoryName;
  fromIndex?: number;
  toIndex?: number;
};

export type RoundCommand = DropCommand | MoveCommand;

export type CategoriesState = Record<CategoryName, ValueCard[]>;

export type Session = {
  id: string;
  version: SchemaVersion;
  createdAt: number;
  updatedAt: number;
  exerciseType: ExerciseType;
  targetCoreValues: number;
  initialValues: ValueCard[];
  currentRoundNumber: number;
  status: SessionStatus;
};

export type RoundSnapshot = {
  version: SchemaVersion;
  sessionId: string;
  roundNumber: number;
  targetCoreValues: number;
  deck: ValueCard[];
  categories: CategoriesState;
  activeCategories: CategoryName[];
  commands: RoundCommand[];
  readyForReflection?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type CompletedSession = {
  version: SchemaVersion;
  sessionId: string;
  completedAt: number;
  completedBy?: string;
  finalValues: ValueWithReason[];
  reflection?: SessionReflection;
};

export type ImportEnvelope = {
  version: SchemaVersion;
  exportedAt: number;
  session: Session;
  rounds: RoundSnapshot[];
  completedSession?: CompletedSession;
};

export type SessionRecord = {
  session: Session;
  currentRound: RoundSnapshot;
  rounds: RoundSnapshot[];
  completedSession?: CompletedSession;
};

export type RoundTransitionResult = {
  canAdvance: boolean;
  canComplete: boolean;
  canEarlyFinish: boolean;
  message: string;
};
