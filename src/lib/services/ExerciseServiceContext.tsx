import { ExerciseServiceImpl } from './exerciseService';
import type { SessionRepository } from '../repository/sessionRepository';
import {
  deleteSession,
  importSessionData,
  listSessions,
  loadSession,
  saveCanonicalSession,
} from '../db/canonicalSessionRepository';

const repository: SessionRepository = {
  create: saveCanonicalSession,
  saveRound: saveCanonicalSession,
  read: loadSession,
  list: listSessions,
  delete: deleteSession,
  import: async (payload) => {
    await importSessionData(payload);
  },
  export: async (id, options = {}) => {
    const record = await loadSession(id);
    if (!record) throw new Error('Session not found.');
    const completedSession = record.completedSession ? { ...record.completedSession } : undefined;
    if (completedSession && options.includeReflection === false) delete completedSession.reflection;
    return {
      version: 2,
      exportedAt: Date.now(),
      session: record.session,
      rounds: record.rounds,
      ...(completedSession ? { completedSession } : {}),
    };
  },
};

class PersonalExerciseService extends ExerciseServiceImpl {
  override async importSession(payload: unknown): Promise<void> {
    // Keep the personal site's supported pre-migration backup format.
    if (payload && typeof payload === 'object' && !('version' in payload)) {
      await importSessionData(payload);
      return;
    }
    await super.importSession(payload);
  }
}

const service = new PersonalExerciseService(repository);
export function useExerciseService() {
  return service;
}
export function getExerciseServiceSingleton() {
  return service;
}
