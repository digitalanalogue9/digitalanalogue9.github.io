import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CompletedExercise } from './exercise-flow/CompletedExercise';
import { ExerciseBoard } from './exercise-flow/ExerciseBoard';
import { ExerciseInstructions } from './exercise-flow/ExerciseInstructions';
import { ExerciseStart } from './exercise-flow/ExerciseStart';
import { useExerciseRound } from './exercise-flow/useExerciseRound';

export function ExerciseRoute() {
  const [params] = useSearchParams();
  const sessionId = params.get('sessionId');
  const navigate = useNavigate();
  const { record, loading, error, busy, command, advance, replayPrevious, transition } = useExerciseRound(
    sessionId,
    () => navigate(`/reasoning?sessionId=${encodeURIComponent(sessionId!)}`)
  );
  if (!sessionId) return <ExerciseStart />;
  if (loading) return <p role="status">Loading saved exercise…</p>;
  if (!record)
    return (
      <section>
        <h1>Exercise unavailable</h1>
        <p role="alert">{error || 'This saved exercise could not be opened.'}</p>
        <Link to="/history">View saved exercises</Link>
      </section>
    );
  if (record.session.status === 'completed') return <CompletedExercise record={record} />;
  const round = record.currentRound;
  return (
    <section aria-labelledby="exercise-heading">
      <h1 id="exercise-heading">Sort your values</h1>
      <p>
        {record.session.exerciseType === 'team' ? 'Team values' : 'Personal values'} · Round {round.roundNumber}:{' '}
        {round.deck.length} cards to sort
      </p>
      {round.roundNumber === 1 && <ExerciseInstructions key={sessionId} />}
      <ExerciseBoard key={round.roundNumber} round={round} busy={busy} onCommand={command} />
      <p role="status">{transition?.message}</p>
      {round.roundNumber > 1 && round.deck.length > 0 && (
        <button type="button" disabled={busy} onClick={() => void replayPrevious()}>
          Replay previous round
        </button>
      )}
      {transition?.canComplete ? (
        <button type="button" disabled={busy} onClick={() => void advance(false)}>
          Complete exercise
        </button>
      ) : (
        <>
          {transition?.canAdvance && (
            <button type="button" disabled={busy} onClick={() => void advance(false)}>
              Continue to next round
            </button>
          )}
          {transition?.canEarlyFinish && (
            <button type="button" disabled={busy} onClick={() => void advance(true)}>
              Finish early
            </button>
          )}
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <Link to="/history">Save and return to history</Link>
    </section>
  );
}
