import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listSessions, type Session } from '../lib/db/canonicalSessionRepository';

export function HistoryRoute() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    listSessions()
      .then((saved) => !cancelled && setSessions(saved))
      .catch(() => !cancelled && setError('Saved exercises could not be loaded.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p role="status">Loading saved exercises…</p>;
  return (
    <section aria-labelledby="history-heading">
      <h1 id="history-heading">Your previous Core Values exercises</h1>
      {error && <p role="alert">{error}</p>}
      {sessions.length === 0 ? (
        <p role="status">No saved exercises yet.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <strong>{session.exerciseType === 'team' ? 'Team values' : 'Personal values'}</strong>
              <span>
                {' '}
                · Round {session.currentRoundNumber} · {session.status}
              </span>
              <Link to={`/exercise?sessionId=${encodeURIComponent(session.id)}`}>
                {session.status === 'completed' ? 'Review exercise' : 'Resume exercise'}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/exercise">Start a new exercise</Link>
    </section>
  );
}
