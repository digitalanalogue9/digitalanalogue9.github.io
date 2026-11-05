import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { loadSession, type SessionRecord } from '../lib/db/canonicalSessionRepository';

export function ReplayRoute() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [record, setRecord] = useState<SessionRecord | null>(null);
  const [roundNumber, setRoundNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!sessionId) {
      setError('Choose a saved Session from history to replay it.');
      setLoading(false);
      return;
    }
    loadSession(sessionId)
      .then((loaded) => {
        if (cancelled) return;
        if (!loaded || loaded.session.status !== 'completed') {
          setError('This completed Session could not be replayed.');
          return;
        }
        setRecord(loaded);
        setRoundNumber(loaded.rounds[0]?.roundNumber ?? null);
      })
      .catch(() => !cancelled && setError('This Session history could not be loaded.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) return <p role="status">Loading Session replay…</p>;
  if (!record) {
    return (
      <section>
        <h1>Replay unavailable</h1>
        <p role="alert">{error || 'This Session history could not be replayed.'}</p>
        <Link to="/history">Back to history</Link>
      </section>
    );
  }

  const round = record.rounds.find((candidate) => candidate.roundNumber === roundNumber);
  const cards = new Map(record.session.initialValues.map((card) => [card.id, card]));

  return (
    <section aria-labelledby="replay-heading">
      <h1 id="replay-heading">Replay completed Session</h1>
      <p>{record.session.exerciseType === 'team' ? 'Team values' : 'Personal values'}</p>
      <nav aria-label="Saved rounds">
        {record.rounds.map((savedRound) => (
          <button
            key={savedRound.roundNumber}
            type="button"
            aria-pressed={savedRound.roundNumber === roundNumber}
            onClick={() => setRoundNumber(savedRound.roundNumber)}
          >
            Round {savedRound.roundNumber}
          </button>
        ))}
      </nav>
      {round && (
        <article aria-label={`Round ${round.roundNumber} choices`}>
          <h2>Round {round.roundNumber} choices</h2>
          {round.commands.length === 0 ? (
            <p>No sorting choices were saved for this round.</p>
          ) : (
            <ol>
              {round.commands.map((command, index) => {
                const card = cards.get(command.valueId);
                return (
                  <li key={`${command.valueId}-${index}`}>
                    {command.kind === 'drop'
                      ? `${card?.title ?? command.valueId} placed in ${command.toCategory}`
                      : `${card?.title ?? command.valueId} moved from ${command.fromCategory} to ${command.toCategory}`}
                  </li>
                );
              })}
            </ol>
          )}
          <h3>Round result</h3>
          <ul>
            {round.activeCategories.map((category) => (
              <li key={category}>
                <strong>{category}:</strong>{' '}
                {round.categories[category].map((card) => card.title).join(', ') || 'No values'}
              </li>
            ))}
          </ul>
        </article>
      )}
      <Link to={`/exercise?sessionId=${encodeURIComponent(record.session.id)}`}>Review completed Session</Link>
      <Link to="/history">Back to history</Link>
    </section>
  );
}
