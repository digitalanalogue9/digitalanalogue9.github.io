import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  saveSessionReflection,
  type SessionRecord,
  type SessionReflection,
} from '../../lib/db/canonicalSessionRepository';
import { ReflectionValueList } from './ReflectionValueList';
import type { ReflectionResponse, ValueReflectionNotes } from '../../lib/contracts/types';

export function CompletedExercise({ record }: { record: SessionRecord }) {
  const [reflection, setReflection] = useState<SessionReflection>(
    record.completedSession?.reflection ?? { version: 1, values: {} }
  );
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const values = record.completedSession?.finalValues ?? [];
  function updateNotes(valueId: string, notes: ValueReflectionNotes) {
    setNotice('');
    setReflection({ ...reflection, values: { ...reflection.values, [valueId]: notes } });
  }
  function updateSuggestion(valueId: string, suggestionId: string, response: ReflectionResponse) {
    const notes = reflection.values[valueId];
    updateNotes(valueId, { ...notes, suggestions: { ...notes?.suggestions, [suggestionId]: response } });
  }
  async function save() {
    setBusy(true);
    setError('');
    try {
      await saveSessionReflection(record.session.id, reflection);
      setNotice('Reflection saved on this device.');
    } catch {
      setError('Your reflection could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-labelledby="completed-heading">
      <h1 id="completed-heading">Exercise complete</h1>
      <h2>Your core values</h2>
      <ul>
        {values.map((card) => (
          <li key={card.id}>
            <strong>{card.title}</strong>
            {card.reason && <p>{card.reason}</p>}
          </li>
        ))}
      </ul>
      <section aria-labelledby="values-reflection-heading">
        <h2 id="values-reflection-heading">Reflect on your values</h2>
        <p>
          These possibilities are prompts for consideration. Recognition is self-reported and notes describe your own
          account.
        </p>
        <label>
          Optional reflection goal
          <textarea
            value={reflection.goal ?? ''}
            disabled={busy}
            onChange={(event) => {
              setNotice('');
              setReflection({ ...reflection, goal: event.target.value });
            }}
          />
        </label>
        <ReflectionValueList
          selectedValues={values}
          exerciseType={record.session.exerciseType}
          reflection={reflection}
          working={busy}
          updateValueReflection={(id, field, value) => updateNotes(id, { ...reflection.values[id], [field]: value })}
          updateSuggestionResponse={updateSuggestion}
        />
        <button type="button" disabled={busy} onClick={() => void save()}>
          Save reflection
        </button>
        {notice && <p role="status">{notice}</p>}
        {error && <p role="alert">{error}</p>}
      </section>
      <Link to={`/replay?sessionId=${encodeURIComponent(record.session.id)}`}>Replay saved rounds</Link>
      <Link to="/history">Back to history</Link>
    </section>
  );
}
