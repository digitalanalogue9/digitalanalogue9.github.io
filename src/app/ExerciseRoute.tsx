import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ExerciseBoard } from './exercise-flow/ExerciseBoard';
import { ExerciseInstructions } from './exercise-flow/ExerciseInstructions';
import { ExerciseStart } from './exercise-flow/ExerciseStart';
import { useExerciseRound } from './exercise-flow/useExerciseRound';

export function ExerciseRoute() {
  const [params] = useSearchParams();
  const sessionId = params.get('sessionId');
  const navigate = useNavigate();
  const { record, loading, error, busy, command, advance, replayPrevious } = useExerciseRound(sessionId, () =>
    navigate(`/reasoning?sessionId=${encodeURIComponent(sessionId!)}`)
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
  if (record.session.status === 'completed')
    return <Navigate to={`/completed?sessionId=${encodeURIComponent(record.session.id)}`} replace />;
  const round = record.currentRound;
  return (
    <section aria-labelledby="exercise-heading" className="app-exercise space-y-5">
      <h1 id="exercise-heading" className="sr-only">
        Sort your values
      </h1>
      {round.roundNumber === 1 && <ExerciseInstructions key={sessionId} />}
      <ExerciseBoard
        key={round.roundNumber}
        round={round}
        busy={busy}
        onCommand={command}
        onAdvance={(earlyFinish) => void advance(earlyFinish)}
        onReplayPrevious={() => void replayPrevious()}
        error={error}
      />
      <div className="text-center">
        <Link to="/history">Save and come back later</Link>
      </div>
    </section>
  );
}
