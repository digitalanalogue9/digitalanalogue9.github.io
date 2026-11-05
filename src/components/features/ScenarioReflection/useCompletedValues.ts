import { useEffect, useState } from 'react';
import { listSessions, loadSession, type CompletedSession } from '../../../lib/db/canonicalSessionRepository';

export type SavedCompletedValues = {
  sessionId: string;
  exerciseType: 'personal' | 'team';
  completed: CompletedSession;
};
export function useCompletedValues() {
  const [savedValues, setSavedValues] = useState<SavedCompletedValues[]>([]);
  useEffect(() => {
    let cancelled = false;
    void listSessions()
      .then(async (sessions) => {
        const completed = await Promise.all(
          sessions
            .filter((session) => session.status === 'completed')
            .map(async (session) => {
              const record = await loadSession(session.id);
              return record?.completedSession
                ? { sessionId: session.id, exerciseType: session.exerciseType, completed: record.completedSession }
                : null;
            })
        );
        if (!cancelled) setSavedValues(completed.filter((item): item is NonNullable<typeof item> => item !== null));
      })
      .catch(() => !cancelled && setSavedValues([]));
    return () => {
      cancelled = true;
    };
  }, []);
  return savedValues;
}
