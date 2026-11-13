import { useEffect, useState, type ChangeEvent } from 'react';
import type { CompletedSession } from '@/lib/contracts/types';
import { getExerciseServiceSingleton } from '@/lib/services/serviceSingleton';
import type {
  BehaviourAttempt,
  BehaviourValueConnection,
  ValuesConnectionInput,
} from '@/lib/services/behaviourAttemptService';

type SavedValuesResult = { sessionId: string; exerciseType: 'personal' | 'team'; completedSession: CompletedSession };

export function BehaviourValuesConnectionPicker({
  attempt,
  onSave,
}: {
  attempt: BehaviourAttempt;
  onSave: (connection: ValuesConnectionInput) => Promise<void>;
}) {
  const [results, setResults] = useState<SavedValuesResult[]>([]);
  const [status, setStatus] = useState('');
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const service = getExerciseServiceSingleton();
      const sessions = await service.listSessions();
      const completed = await Promise.all(
        sessions
          .filter((session) => session.status === 'completed')
          .map(async (session) => {
            const record = await service.loadSession(session.id);
            return record.completedSession
              ? { sessionId: session.id, exerciseType: session.exerciseType, completedSession: record.completedSession }
              : null;
          })
      );
      if (active) setResults(completed.filter((result): result is SavedValuesResult => result !== null));
    };
    void load().catch(() => {
      if (active) setLoadingError(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const persist = async (connection: ValuesConnectionInput) => {
    try {
      await onSave(connection);
      setStatus(
        connection.state === 'connected'
          ? 'Chosen public value connection saved.'
          : connection.state === 'no-connection'
            ? 'No connection saved.'
            : 'Connection choice saved as unanswered.'
      );
    } catch {
      setStatus('Connection could not be saved. Please try again.');
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-interface-base-small text-sys-color-text-primary">
        After seeing the perspectives, you may choose a saved completed values result and decide whether a value
        connects to your response. No connection is suggested.
      </p>
      {attempt.scenarios
        .filter((scenario) => scenario.answer && scenario.answer !== 'depends' && scenario.answer !== 'skip')
        .map((scenario) => {
          const saved = attempt.valuesConnections?.[scenario.id];
          const savedState =
            saved?.state === 'connected'
              ? `Saved connection: ${saved.value.title}`
              : saved?.state === 'no-connection'
                ? 'No connection saved'
                : saved?.state === 'unanswered'
                  ? 'Connection choice left unanswered'
                  : 'No connection saved yet';
          return (
            <details
              key={scenario.id}
              name="values-connection-editor"
              className="border-sys-color-border-default border-t pt-4"
            >
              <summary
                aria-label={`Edit value connection for ${scenario.prompt}. ${savedState}`}
                className="text-interface-base-small text-sys-color-text-primary cursor-pointer space-y-2 rounded-sm py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="block">{scenario.prompt}</span>
                <span className="block font-normal">{savedState}</span>
              </summary>
              <div className="space-y-3 pt-2 pb-4">
                <ConnectionEditor scenario={scenario} results={results} existing={saved} onSave={persist} />
              </div>
            </details>
          );
        })}
      {loadingError && (
        <p className="text-interface-base-small text-ref-color-rag-red-text" role="alert">
          Saved values could not be loaded.
        </p>
      )}
      {status && (
        <p className="text-interface-base-small text-sys-color-text-primary" role="status">
          {status}
        </p>
      )}
    </div>
  );
}

function ConnectionEditor({
  scenario,
  results,
  existing,
  onSave,
}: {
  scenario: BehaviourAttempt['scenarios'][number];
  results: SavedValuesResult[];
  existing: BehaviourValueConnection | undefined;
  onSave: (connection: ValuesConnectionInput) => Promise<void>;
}) {
  const [sourceSessionId, setSourceSessionId] = useState('');
  const [valueId, setValueId] = useState('');
  const [possibilityId, setPossibilityId] = useState('');
  const [observation, setObservation] = useState('');
  const source = results.find((result) => result.sessionId === sourceSessionId);
  const values = source?.completedSession.finalValues ?? [];
  const scenarioId = scenario.id;
  const handlePossibilityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPossibilityId(event.target.value);
  };
  const handleValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValueId(event.target.value);
  };
  const handleObservationChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setObservation(event.target.value);
  };
  const possibilityOptions = (scenario.reveals ?? []).map((possibility) => (
    <option key={possibility.id} value={possibility.id}>
      {possibility.perception}
    </option>
  ));

  const saveConnected = () => {
    const value = values.find((item) => item.id === valueId);
    if (!source || !value || !possibilityId) return;
    void onSave({
      state: 'connected',
      scenarioId,
      possibilityId,
      sourceSessionId: source.sessionId,
      sourceExerciseType: source.exerciseType,
      completedSession: source.completedSession,
      valueId: value.id,
      ...(observation ? { observation } : {}),
    });
  };
  const saveNoConnection = () => {
    void onSave({ scenarioId, state: 'no-connection' });
  };
  const saveUnanswered = () => {
    void onSave({ scenarioId, state: 'unanswered' });
  };

  return (
    <div className="space-y-3">
      <label
        className="text-interface-base-small text-sys-color-text-primary block"
        htmlFor={`value-source-${scenarioId}`}
      >
        Saved completed values result
      </label>
      <select
        id={`value-source-${scenarioId}`}
        className="cv-field__control min-h-11 w-full"
        value={sourceSessionId}
        onChange={(event) => {
          setSourceSessionId(event.target.value);
          setValueId('');
        }}
      >
        <option value="">Choose a saved result to explore</option>
        {results.map((result) => (
          <option key={result.sessionId} value={result.sessionId}>
            {result.exerciseType === 'team' ? 'Team-focused' : 'Personal'} values ·{' '}
            {new Date(result.completedSession.completedAt).toISOString().slice(0, 10)}
          </option>
        ))}
      </select>
      <label
        className="text-interface-base-small text-sys-color-text-primary block"
        htmlFor={`value-choice-${scenarioId}`}
      >
        Value you chose
      </label>
      <select
        id={`value-choice-${scenarioId}`}
        className="cv-field__control min-h-11 w-full"
        value={valueId}
        onChange={handleValueChange}
        disabled={!source}
      >
        <option value="">Choose a public value</option>
        {values.map((value) => (
          <option key={value.id} value={value.id}>
            {value.title}
          </option>
        ))}
      </select>
      <label
        className="text-interface-base-small text-sys-color-text-primary block"
        htmlFor={`reflection-choice-${scenarioId}`}
      >
        Reflection possibility you chose to connect
      </label>
      <select
        id={`reflection-choice-${scenarioId}`}
        className="cv-field__control min-h-11 w-full"
        value={possibilityId}
        onChange={handlePossibilityChange}
      >
        <option value="">Choose a possibility</option>
        {possibilityOptions}
      </select>
      <label
        className="text-interface-base-small text-sys-color-text-primary block"
        htmlFor={`connection-observation-${scenarioId}`}
      >
        Optional observation about this connection
      </label>
      <textarea
        id={`connection-observation-${scenarioId}`}
        className="cv-field__control min-h-20 w-full"
        value={observation}
        onChange={handleObservationChange}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="cv-button min-h-11"
          onClick={saveConnected}
          disabled={!source || !valueId || !possibilityId}
        >
          Save chosen connection
        </button>
        <button type="button" className="cv-link min-h-11 underline" onClick={saveNoConnection}>
          No connection
        </button>
        <button type="button" className="cv-link min-h-11 underline" onClick={saveUnanswered}>
          Leave unanswered
        </button>
      </div>
      {existing?.state === 'connected' && (
        <p className="text-interface-base-small text-sys-color-text-primary">
          Saved connection: {existing.value.title}
        </p>
      )}
    </div>
  );
}
