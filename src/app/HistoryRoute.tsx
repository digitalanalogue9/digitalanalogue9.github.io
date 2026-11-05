import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportSessionData, importSessionData, listSessions, type Session } from '../lib/db/canonicalSessionRepository';

export function HistoryRoute() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refreshSessions() {
    setSessions(await listSessions());
  }

  async function importBackup(file?: File) {
    if (!file) return;
    setError('');
    setNotice('');
    try {
      await importSessionData(JSON.parse(await file.text()));
      await refreshSessions();
      setNotice('Session backup imported.');
    } catch {
      setError('This Session backup could not be imported.');
    }
  }

  async function exportBackup(session: Session, legacy = false) {
    try {
      const payload = legacy
        ? await exportSessionData(session.id, { format: 'legacy' })
        : await exportSessionData(session.id, { format: 'canonical' });
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${session.id}${legacy ? '-legacy' : ''}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('This Session backup could not be exported.');
    }
  }

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
      {notice && <p role="status">{notice}</p>}
      <label>
        Import a Session backup
        <input
          aria-label="Import a Session backup"
          type="file"
          accept="application/json,.json"
          onChange={(event) => void importBackup(event.target.files?.[0])}
        />
      </label>
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
              {session.status === 'completed' && (
                <Link to={`/replay?sessionId=${encodeURIComponent(session.id)}`}>Replay choices</Link>
              )}
              <button type="button" onClick={() => void exportBackup(session)}>
                Export backup
              </button>
              <button type="button" onClick={() => void exportBackup(session, true)}>
                Export legacy backup
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/exercise">Start a new exercise</Link>
    </section>
  );
}
