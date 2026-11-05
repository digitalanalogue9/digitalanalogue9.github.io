import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import personalValues from '../../data/values.json';
import teamValues from '../../data/team-values.json';
import { createSession } from '../../lib/db/canonicalSessionRepository';

export function ExerciseStart() {
  const navigate = useNavigate();
  const [target, setTarget] = useState(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function start(exerciseType: 'personal' | 'team') {
    setBusy(true);
    setError('');
    try {
      const initialValues = (exerciseType === 'team' ? teamValues.values : personalValues.values).map(
        ({ id, title, description }) => ({ id, title, description })
      );
      const record = await createSession({ initialValues, targetCoreValues: target, exerciseType });
      navigate(`/exercise?sessionId=${encodeURIComponent(record.session.id)}`);
    } catch {
      setError('The exercise could not be started. Choose a valid whole-number target and try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-labelledby="exercise-start-heading">
      <h1 id="exercise-start-heading">Start an exercise</h1>
      <p>Sort value cards into categories to identify the values that matter most to you.</p>
      <label htmlFor="target-core-values">Target number of core values</label>
      <input
        id="target-core-values"
        type="number"
        min={1}
        max={35}
        value={target}
        onChange={(event) => setTarget(Number(event.target.value))}
      />
      <div>
        <button type="button" disabled={busy} onClick={() => void start('personal')}>
          Start personal exercise
        </button>
        <button type="button" disabled={busy} onClick={() => void start('team')}>
          Start team values exercise
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      <p>Sessions are saved in this browser so you can resume them later.</p>
    </section>
  );
}
