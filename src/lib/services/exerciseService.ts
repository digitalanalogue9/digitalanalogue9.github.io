import teamValuesData from '@/data/team-values.json';
import valuesData from '@/data/values.json';
import { DEFAULT_CARDS_IN_GAME, DEFAULT_TARGET_CORE_VALUES, SCHEMA_VERSION } from '@/lib/contracts/constants';
import { isSessionReflection, validateImportEnvelope } from '@/lib/contracts/guards';
import {
  CompletedSession,
  ImportEnvelope,
  RoundCommand,
  RoundSnapshot,
  RoundTransitionResult,
  Session,
  SessionRecord,
  SessionReflection,
  ValueCard,
  ValueWithReason,
  ExerciseType,
} from '@/lib/contracts/types';
import {
  advanceRoundState,
  applyRoundCommand,
  buildPreviousRoundReplayCommands,
  createInitialRoundSnapshot,
  evaluateRoundTransition,
  normalizeRoundForCompletion,
} from '@/lib/domain/roundEngine';
import { SessionExportOptions, SessionRepository } from '@/lib/repository/sessionRepository';
import {
  getReflectionContent,
  getReflectionRelationships,
  getReflectionSummary,
  ReflectionContent,
  ReflectionRelationship,
  ReflectionSummary,
} from '@/lib/content/reflectionContent';
import { composeOneOffCoachingPrompt, getOneOffCoachingContextOptions } from '@/lib/content/oneOffCoachingPrompt';
import type { ComposeOneOffCoachingPromptInput, OneOffCoachingContextOption } from '@/lib/content/oneOffCoachingPrompt';
import {
  composeRecurringReflectionPrompt,
  getRecurringReflectionContextOptions,
} from '@/lib/content/recurringReflectionPrompt';
import type { ComposeRecurringReflectionPromptInput } from '@/lib/content/recurringReflectionPrompt';
import { generateSessionSlug } from '@/lib/utils/sessionName';

export type StartSessionInput = {
  targetCoreValues?: number;
  cardsInGame?: number;
  exerciseType?: ExerciseType;
};

export type ApplyCommandInput = {
  session: Session;
  round: RoundSnapshot;
  command: RoundCommand;
};

export type ApplyCommandResult = {
  session: Session;
  round: RoundSnapshot;
  transition: RoundTransitionResult;
};

export type AdvanceRoundInput = {
  session: Session;
  round: RoundSnapshot;
  earlyFinish?: boolean;
};

export type AdvanceRoundResult =
  | {
      kind: 'next-round';
      session: Session;
      round: RoundSnapshot;
      transition: RoundTransitionResult;
    }
  | {
      kind: 'ready-to-complete';
      session: Session;
      round: RoundSnapshot;
      finalValues: ValueCard[];
      transition: RoundTransitionResult;
    };

export type ReplayPreviousRoundInput = {
  session: Session;
  round: RoundSnapshot;
};

export type ReplayPreviousRoundResult = {
  session: Session;
  round: RoundSnapshot;
};

export type CompleteSessionInput = {
  session: Session;
  round: RoundSnapshot;
  reasonsById: Record<string, string>;
  completedBy?: string;
};

function hasKnownSuggestionReferences(
  reflection: SessionReflection,
  exerciseType: ExerciseType,
  finalValues: ValueCard[]
): boolean {
  return Object.entries(reflection.values).every(([valueId, notes]) => {
    if (!notes.suggestions) return true;
    const value = finalValues.find((entry) => entry.id === valueId);
    if (!value) return false;
    const knownSuggestionIds = new Set(
      getReflectionContent(exerciseType, value).possibilities.map((possibility) => possibility.id)
    );
    return Object.keys(notes.suggestions).every((suggestionId) => knownSuggestionIds.has(suggestionId));
  });
}

function hasKnownRelationshipReferences(
  reflection: SessionReflection,
  exerciseType: ExerciseType,
  finalValues: ValueCard[]
): boolean {
  const knownRelationshipIds = new Set(getReflectionRelationships(exerciseType, finalValues).map(({ id }) => id));
  return Object.keys(reflection.relationships ?? {}).every((relationshipId) =>
    knownRelationshipIds.has(relationshipId)
  );
}

export interface ExerciseService {
  startSession(input?: StartSessionInput): Promise<SessionRecord>;
  loadSession(sessionId: string): Promise<SessionRecord>;
  applyCommand(input: ApplyCommandInput): Promise<ApplyCommandResult>;
  advanceRound(input: AdvanceRoundInput): Promise<AdvanceRoundResult>;
  replayPreviousRound(input: ReplayPreviousRoundInput): Promise<ReplayPreviousRoundResult>;
  completeSession(input: CompleteSessionInput): Promise<CompletedSession>;
  getReflectionContent(exerciseType: ExerciseType, value: ValueCard): ReflectionContent;
  getReflectionRelationships(exerciseType: ExerciseType, selectedValues: ValueCard[]): ReflectionRelationship[];
  getReflectionSummary(
    exerciseType: ExerciseType,
    selectedValues: ValueCard[],
    reflection?: SessionReflection
  ): ReflectionSummary;
  getOneOffCoachingContextOptions(
    exerciseType: ExerciseType,
    selectedValues: ValueWithReason[],
    reflection?: SessionReflection
  ): OneOffCoachingContextOption[];
  composeOneOffCoachingPrompt(input: ComposeOneOffCoachingPromptInput): string;
  getRecurringReflectionContextOptions(
    exerciseType: ExerciseType,
    selectedValues: ValueWithReason[],
    reflection?: SessionReflection
  ): OneOffCoachingContextOption[];
  composeRecurringReflectionPrompt(input: ComposeRecurringReflectionPromptInput): string;
  saveReflection(sessionId: string, reflection: SessionReflection): Promise<CompletedSession>;
  listSessions(): Promise<Session[]>;
  deleteSession(sessionId: string): Promise<void>;
  exportSession(sessionId: string, options?: SessionExportOptions): Promise<ImportEnvelope>;
  importSession(envelope: unknown): Promise<void>;
}

function pickValues(cardsInGame: number, exerciseType: ExerciseType): ValueCard[] {
  const allValues = (exerciseType === 'team' ? teamValuesData.values : valuesData.values) as ValueCard[];
  const shuffled = [...allValues];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const item = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = item;
  }
  return shuffled.slice(0, cardsInGame);
}

export class ExerciseServiceImpl implements ExerciseService {
  constructor(private readonly repository: SessionRepository) {}

  async startSession(input: StartSessionInput = {}): Promise<SessionRecord> {
    const targetCoreValues = input.targetCoreValues ?? DEFAULT_TARGET_CORE_VALUES;
    const cardsInGame = input.cardsInGame ?? DEFAULT_CARDS_IN_GAME;
    const exerciseType = input.exerciseType ?? 'personal';
    if (targetCoreValues < 1 || targetCoreValues > cardsInGame) {
      throw new Error(`targetCoreValues (${targetCoreValues}) must be between 1 and cardsInGame (${cardsInGame})`);
    }
    const now = Date.now();
    const existingSessions = await this.repository.list();
    const sessionId = generateSessionSlug(
      existingSessions.map((session) => session.id),
      String(now)
    );
    const initialValues = pickValues(cardsInGame, exerciseType);

    const session: Session = {
      id: sessionId,
      version: SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      exerciseType,
      targetCoreValues,
      initialValues,
      currentRoundNumber: 1,
      status: 'active',
    };

    const initialRound = createInitialRoundSnapshot(sessionId, initialValues, targetCoreValues, now);
    await this.repository.create({
      session,
      round: initialRound,
    });

    return {
      session,
      currentRound: initialRound,
      rounds: [initialRound],
    };
  }

  async loadSession(sessionId: string): Promise<SessionRecord> {
    const record = await this.repository.read(sessionId);
    if (!record) {
      throw new Error('Session not found');
    }
    return record;
  }

  async applyCommand(input: ApplyCommandInput): Promise<ApplyCommandResult> {
    const now = Date.now();
    const nextRound = applyRoundCommand(input.round, input.command, now);
    const nextSession: Session = {
      ...input.session,
      updatedAt: now,
    };

    await this.repository.saveRound({
      session: nextSession,
      round: nextRound,
    });

    return {
      session: nextSession,
      round: nextRound,
      transition: evaluateRoundTransition(nextRound),
    };
  }

  async advanceRound(input: AdvanceRoundInput): Promise<AdvanceRoundResult> {
    const now = Date.now();
    const advanced = advanceRoundState(input.round, now, Boolean(input.earlyFinish));

    if (advanced.kind === 'ready-to-complete') {
      const nextSession: Session = {
        ...input.session,
        updatedAt: now,
      };
      await this.repository.saveRound({
        session: nextSession,
        round: advanced.round,
      });
      return {
        kind: 'ready-to-complete',
        session: nextSession,
        round: advanced.round,
        finalValues: advanced.finalValues,
        transition: evaluateRoundTransition(advanced.round),
      };
    }

    const nextSession: Session = {
      ...input.session,
      currentRoundNumber: advanced.round.roundNumber,
      updatedAt: now,
    };
    await this.repository.saveRound({
      session: nextSession,
      round: advanced.round,
    });
    return {
      kind: 'next-round',
      session: nextSession,
      round: advanced.round,
      transition: evaluateRoundTransition(advanced.round),
    };
  }

  async replayPreviousRound(input: ReplayPreviousRoundInput): Promise<ReplayPreviousRoundResult> {
    const { session, round } = input;
    if (round.roundNumber <= 1) {
      throw new Error('No previous round to replay.');
    }

    const record = await this.repository.read(session.id);
    if (!record) {
      throw new Error('Session not found');
    }

    const previousRound = record.rounds.find((r) => r.roundNumber === round.roundNumber - 1);
    if (!previousRound) {
      throw new Error(`Previous round ${round.roundNumber - 1} not found.`);
    }

    const commands = buildPreviousRoundReplayCommands(round.deck, previousRound.commands, round.activeCategories);

    const now = Date.now();
    let updatedRound = round;
    for (const command of commands) {
      updatedRound = applyRoundCommand(updatedRound, command, now);
    }

    const nextSession: Session = { ...session, updatedAt: now };
    await this.repository.saveRound({ session: nextSession, round: updatedRound });

    return { session: nextSession, round: updatedRound };
  }

  async completeSession(input: CompleteSessionInput): Promise<CompletedSession> {
    const now = Date.now();
    const completedRound = normalizeRoundForCompletion(input.round, now);
    const completedBy = input.completedBy?.trim();
    const finalValues = completedRound.categories['Very Important'].map((value) => {
      const reason = input.reasonsById[value.id];
      const withReason: ValueWithReason = {
        ...value,
        reason: reason ? reason.trim() : undefined,
      };
      return withReason;
    });

    const completedSession: CompletedSession = {
      version: SCHEMA_VERSION,
      sessionId: input.session.id,
      completedAt: now,
      ...(completedBy ? { completedBy } : {}),
      finalValues,
    };

    const nextSession: Session = {
      ...input.session,
      status: 'completed',
      updatedAt: now,
    };

    await this.repository.saveRound({
      session: nextSession,
      round: completedRound,
      completedSession,
    });

    return completedSession;
  }

  async saveReflection(sessionId: string, reflection: SessionReflection): Promise<CompletedSession> {
    const record = await this.repository.read(sessionId);
    if (!record?.completedSession) {
      throw new Error('Completed values are unavailable for this session.');
    }
    if (
      !isSessionReflection(reflection, record.completedSession.finalValues) ||
      !hasKnownSuggestionReferences(reflection, record.session.exerciseType, record.completedSession.finalValues) ||
      !hasKnownRelationshipReferences(reflection, record.session.exerciseType, record.completedSession.finalValues)
    ) {
      throw new Error('Reflection data is invalid for this session.');
    }

    const completedSession: CompletedSession = { ...record.completedSession, reflection };
    const session: Session = { ...record.session, updatedAt: Date.now() };
    await this.repository.saveRound({ session, round: record.currentRound, completedSession });
    return completedSession;
  }

  getReflectionContent(exerciseType: ExerciseType, value: ValueCard): ReflectionContent {
    return getReflectionContent(exerciseType, value);
  }

  getReflectionRelationships(exerciseType: ExerciseType, selectedValues: ValueCard[]): ReflectionRelationship[] {
    return getReflectionRelationships(exerciseType, selectedValues);
  }

  getReflectionSummary(
    exerciseType: ExerciseType,
    selectedValues: ValueCard[],
    reflection?: SessionReflection
  ): ReflectionSummary {
    return getReflectionSummary(exerciseType, selectedValues, reflection);
  }
  getOneOffCoachingContextOptions(
    exerciseType: ExerciseType,
    selectedValues: ValueWithReason[],
    reflection?: SessionReflection
  ): OneOffCoachingContextOption[] {
    return getOneOffCoachingContextOptions(exerciseType, selectedValues, reflection);
  }
  composeOneOffCoachingPrompt(input: ComposeOneOffCoachingPromptInput): string {
    return composeOneOffCoachingPrompt(input);
  }
  getRecurringReflectionContextOptions(
    exerciseType: ExerciseType,
    selectedValues: ValueWithReason[],
    reflection?: SessionReflection
  ): OneOffCoachingContextOption[] {
    return getRecurringReflectionContextOptions(exerciseType, selectedValues, reflection);
  }
  composeRecurringReflectionPrompt(input: ComposeRecurringReflectionPromptInput): string {
    return composeRecurringReflectionPrompt(input);
  }

  async listSessions(): Promise<Session[]> {
    return this.repository.list();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.repository.delete(sessionId);
  }

  async exportSession(sessionId: string, options: SessionExportOptions = {}): Promise<ImportEnvelope> {
    return this.repository.export(sessionId, options);
  }

  async importSession(envelope: unknown): Promise<void> {
    if (
      typeof envelope === 'object' &&
      envelope !== null &&
      'version' in envelope &&
      (envelope as Record<string, unknown>).version !== SCHEMA_VERSION
    ) {
      throw new Error(
        `Cannot import: session uses schema version ${String((envelope as Record<string, unknown>).version)}, expected ${SCHEMA_VERSION}`
      );
    }
    if (!validateImportEnvelope(envelope)) {
      throw new Error('Import payload is invalid');
    }
    if (
      envelope.completedSession?.reflection &&
      (!hasKnownSuggestionReferences(
        envelope.completedSession.reflection,
        envelope.session.exerciseType,
        envelope.completedSession.finalValues
      ) ||
        !hasKnownRelationshipReferences(
          envelope.completedSession.reflection,
          envelope.session.exerciseType,
          envelope.completedSession.finalValues
        ))
    ) {
      throw new Error('Import payload is invalid');
    }
    await this.repository.import(envelope);
  }
}
