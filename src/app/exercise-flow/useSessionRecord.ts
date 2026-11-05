import { useEffect, useState } from 'react';
import { loadSession, type SessionRecord } from '../../lib/db/canonicalSessionRepository';

export function useSessionRecord(sessionId: string | null) {
  const [record, setRecord] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    setRecord(null);
    setError('');
    setLoading(Boolean(sessionId));
    if (sessionId) {
      loadSession(sessionId)
        .then((saved) => {
          if (cancelled) return;
          setRecord(saved);
          if (!saved) setError('This saved exercise could not be opened.');
        })
        .catch(() => !cancelled && setError('Your saved exercise could not be loaded.'))
        .finally(() => !cancelled && setLoading(false));
    }
    return () => {
      cancelled = true;
    };
  }, [sessionId]);
  return { record, setRecord, loading, error, setError };
}
