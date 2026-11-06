import { CompletedSession, ImportEnvelope, RoundSnapshot, Session, SessionRecord } from '@/lib/contracts/types';

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
  list(): Promise<Session[]>;
  delete(sessionId: string): Promise<void>;
  export(sessionId: string, options?: SessionExportOptions): Promise<ImportEnvelope>;
  import(envelope: ImportEnvelope): Promise<void>;
}
