import {
  CompletedSession,
  ImportEnvelope,
  RoundSnapshot,
  Session,
  SessionRecord,
  SessionReflection,
} from '@/lib/contracts/types';
import { SessionExportOptions, SessionRepository, SessionSavePayload } from '@/lib/repository/sessionRepository';

type MemoryRecord = {
  session: Session;
  rounds: Map<number, RoundSnapshot>;
  completedSession?: CompletedSession;
  reflectionDraft?: SessionReflection;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class InMemorySessionRepository implements SessionRepository {
  private readonly records = new Map<string, MemoryRecord>();

  async create(payload: SessionSavePayload): Promise<void> {
    this.records.set(payload.session.id, {
      session: clone(payload.session),
      rounds: new Map<number, RoundSnapshot>([[payload.round.roundNumber, clone(payload.round)]]),
      completedSession: payload.completedSession ? clone(payload.completedSession) : undefined,
    });
  }

  async read(sessionId: string): Promise<SessionRecord | null> {
    const record = this.records.get(sessionId);
    if (!record) return null;

    const rounds = Array.from(record.rounds.values()).sort((left, right) => left.roundNumber - right.roundNumber);
    const currentRound =
      rounds.find((round) => round.roundNumber === record.session.currentRoundNumber) ?? rounds[rounds.length - 1];

    if (!currentRound) return null;

    return {
      session: clone(record.session),
      currentRound: clone(currentRound),
      rounds: clone(rounds),
      completedSession: record.completedSession ? clone(record.completedSession) : undefined,
      reflectionDraft: record.reflectionDraft ? clone(record.reflectionDraft) : undefined,
    };
  }

  async saveRound(payload: SessionSavePayload): Promise<void> {
    const existing = this.records.get(payload.session.id);
    if (!existing) {
      await this.create(payload);
      return;
    }

    existing.session = clone(payload.session);
    existing.rounds.set(payload.round.roundNumber, clone(payload.round));
    if (payload.completedSession) {
      existing.completedSession = clone(payload.completedSession);
      existing.reflectionDraft = undefined;
    }
  }

  async saveReflectionDraft(sessionId: string, reflection: SessionReflection): Promise<void> {
    const existing = this.records.get(sessionId);
    if (!existing) throw new Error('Session not found');
    existing.reflectionDraft = clone(reflection);
  }

  async list(): Promise<Session[]> {
    return Array.from(this.records.values())
      .map((record) => clone(record.session))
      .sort((left, right) => right.updatedAt - left.updatedAt);
  }

  async delete(sessionId: string): Promise<void> {
    this.records.delete(sessionId);
  }

  async export(sessionId: string, options: SessionExportOptions = {}): Promise<ImportEnvelope> {
    const record = await this.read(sessionId);
    if (!record) {
      throw new Error('Session not found');
    }

    const completedSession =
      record.completedSession && options.includeReflection === false
        ? (({ reflection: _reflection, ...sessionWithoutReflection }) => sessionWithoutReflection)(
            record.completedSession
          )
        : record.completedSession;
    return {
      version: record.session.version,
      exportedAt: Date.now(),
      session: record.session,
      rounds: record.rounds,
      completedSession,
      ...(record.reflectionDraft ? { reflectionDraft: record.reflectionDraft } : {}),
    };
  }

  async import(envelope: ImportEnvelope): Promise<void> {
    const rounds = new Map<number, RoundSnapshot>();
    for (const round of envelope.rounds) {
      rounds.set(round.roundNumber, clone(round));
    }

    this.records.set(envelope.session.id, {
      session: clone(envelope.session),
      rounds,
      completedSession: envelope.completedSession ? clone(envelope.completedSession) : undefined,
      reflectionDraft: envelope.reflectionDraft ? clone(envelope.reflectionDraft) : undefined,
    });
  }
}
