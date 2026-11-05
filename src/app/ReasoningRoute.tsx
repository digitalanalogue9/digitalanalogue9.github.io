import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { completeSession } from '../lib/db/canonicalSessionRepository';
import { evaluateRoundTransition } from '../lib/domain/roundEngine';
import { useSessionRecord } from './exercise-flow/useSessionRecord';

export function ReasoningRoute() {
  const [params] = useSearchParams();
  const sessionId = params.get('sessionId');
  const { record, loading, error: loadError } = useSessionRecord(sessionId);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const navigate = useNavigate();
  const exerciseUrl = `/exercise?sessionId=${encodeURIComponent(sessionId ?? '')}`;
  async function finish() {
    if (!record || locked.current) return;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      const values = record.currentRound.categories['Very Important'].map((card) => ({
        ...card,
        ...(reasons[card.id]?.trim() ? { reason: reasons[card.id].trim() } : {}),
      }));
      await completeSession(record.session.id, values);
      navigate(exerciseUrl, { replace: true });
    } catch {
      setError('Your completed exercise could not be saved. Please try again.');
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  if (loading) return <p role="status">Loading your values…</p>;
  if (record?.session.status === 'completed') return <Navigate to={exerciseUrl} replace />;
  if (!record || !evaluateRoundTransition(record.currentRound).canComplete)
    return (
      <section>
        <h1>Reflection unavailable</h1>
        <p role="alert">{loadError || 'Finish sorting your values before adding optional reasons.'}</p>
        <Link to={sessionId ? exerciseUrl : '/history'}>Return to your exercise</Link>
      </section>
    );
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void finish();
      }}
    >
      <h1>Reflect on your choices</h1>
      <p>
        You can add a short note about why each final value matters to you. These notes are optional and saved with the
        completed Session in this browser.
      </p>
      {record.currentRound.categories['Very Important'].map((card) => (
        <div key={card.id}>
          <label htmlFor={`reason-${card.id}`}>{card.title}</label>
          <p>{card.description}</p>
          <textarea
            id={`reason-${card.id}`}
            value={reasons[card.id] ?? ''}
            disabled={busy}
            onChange={(event) => setReasons({ ...reasons, [card.id]: event.target.value })}
          />
        </div>
      ))}
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={busy}>
        Complete exercise
      </button>
      <Link to={exerciseUrl}>Back to sorting</Link>
    </form>
  );
}
