import {
  CompletedSession,
  ImportEnvelope,
  RoundSnapshot,
  Session,
  SessionRecord,
  SessionReflection,
} from '@/lib/contracts/types';

export type SessionSavePayload = {
  session: Session;
  round: RoundSnapshot;
  completedSession?: CompletedSession;
};

export type SessionExportOptions = {
  includeReflection?: boolean;
};

export interface SessionRepository {
  create(payload: SessionSavePayload): Promise<void>;
  read(sessionId: string): Promise<SessionRecord | null>;
  saveRound(payload: SessionSavePayload): Promise<void>;
  saveReflectionDraft(sessionId: string, reflection: SessionReflection): Promise<void>;
  list(): Promise<Session[]>;
  delete(sessionId: string): Promise<void>;
  export(sessionId: string, options?: SessionExportOptions): Promise<ImportEnvelope>;
  import(envelope: ImportEnvelope): Promise<void>;
}
