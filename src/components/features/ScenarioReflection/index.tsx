import { useEffect, useState } from 'react';
import {
  loadLatestScenarioAttempt,
  saveScenarioAttempt,
  startScenarioAttempt,
  type ScenarioAttempt,
  type ScenarioChoice,
} from '../../../lib/scenario-reflection/attemptStorage';
import type { ReflectionAnswer, ReflectionReminder } from '../../../lib/scenario-reflection/attemptStorage';
import { behaviourScenarios } from '../../../lib/scenario-reflection/scenarios';
import {
  composeOneOffReflectionPrompt,
  composeRecurringReflectionPrompt,
  createDefaultReflectionReminder,
  isValidReminder,
} from '../../../lib/scenario-reflection/reflectionTools';
import { listSessions, loadSession, type CompletedSession } from '../../../lib/db/canonicalSessionRepository';

export function ScenarioReflectionRoute() {
  const [attempt, setAttempt] = useState<ScenarioAttempt | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [savedValues, setSavedValues] = useState<
    Array<{ sessionId: string; exerciseType: 'personal' | 'team'; completed: CompletedSession }>
  >([]);
  const [selectedPromptIds, setSelectedPromptIds] = useState<string[]>([]);
  const [promptPreview, setPromptPreview] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [reminder, setReminder] = useState<ReflectionReminder>(() => createDefaultReflectionReminder());

  useEffect(() => {
    const latest = loadLatestScenarioAttempt();
    setAttempt(latest);
    if (latest?.reminder) {
      setReminder(latest.reminder);
      setSelectedPromptIds(latest.reminder.selectedPossibilityIds);
    }
    void listSessions()
      .then(async (sessions) => {
        const completed = await Promise.all(
          sessions
            .filter((session) => session.status === 'completed')
            .map(async (session) => {
              const record = await loadSession(session.id);
              return record?.completedSession
                ? { sessionId: session.id, exerciseType: session.exerciseType, completed: record.completedSession }
                : null;
            })
        );
        setSavedValues(completed.filter((item): item is NonNullable<typeof item> => item !== null));
      })
      .catch(() => setSavedValues([]));
  }, []);

  function begin(): void {
    try {
      setAttempt(startScenarioAttempt());
      setSelectedPromptIds([]);
      setPromptPreview('');
      setReminder(createDefaultReflectionReminder());
      setCopyStatus('');
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }

  function updateAttempt(update: Partial<ScenarioAttempt>): void {
    if (!attempt) return;
    try {
      const saved = saveScenarioAttempt({ ...attempt, ...update });
      setAttempt(saved);
      setSaveError(false);
    } catch {
      setAttempt({ ...attempt, ...update });
      setSaveError(true);
    }
  }

  function updateValueConnection(scenarioId: string, value: string, observation?: string): void {
    if (!attempt) return;
    const valueConnections: NonNullable<ScenarioAttempt['valueConnections']> = { ...attempt.valueConnections };
    if (!value) delete valueConnections[scenarioId];
    else valueConnections[scenarioId] = { value, ...(observation ? { observation } : {}) };
    updateAttempt({ valueConnections });
  }

  if (!attempt) {
    return (
      <section
        aria-labelledby="scenario-intro-heading"
        className="mx-auto max-w-3xl space-y-6 rounded-lg border bg-white p-6 sm:p-10"
      >
        <h1 id="scenario-intro-heading">Scenario reflection</h1>
        <p>
          Consider six everyday situations at work and choose what you would most likely do. These are hypothetical
          choices, not observations of conduct or a validated assessment.
        </p>
        <p>
          You can choose “It depends” or skip any situation. Possible intentions and perceptions appear when you finish.
        </p>
        <button type="button" onClick={begin}>
          Begin scenarios
        </button>
        {saveError && <p role="alert">This reflection could not be saved on this device. Please try again.</p>}
      </section>
    );
  }

  if (attempt.status === 'completed') {
    return (
      <section
        aria-labelledby="scenario-results-heading"
        className="mx-auto max-w-4xl space-y-6 rounded-lg border bg-white p-6 sm:p-10"
      >
        <h1 id="scenario-results-heading">Your scenario reflections</h1>
        <p>These are possibilities to consider, not conclusions about your behaviour or anyone else’s experience.</p>
        <div className="space-y-6">
          {behaviourScenarios.map((scenario) => {
            const answer = attempt.answers[scenario.id];
            const response = scenario.responses.find(({ id }) => id === answer);
            return (
              <article key={scenario.id} className="border-t pt-5">
                <h2>{scenario.prompt}</h2>
                {response ? (
                  <>
                    <p>
                      <strong>Your choice:</strong> {response.label}
                    </p>
                    {response.possibilities.map((possibility) => (
                      <div key={possibility.id} className="mt-3 space-y-2">
                        <label className="block">
                          Include in a prompt
                          <input
                            type="checkbox"
                            className="ml-2"
                            checked={selectedPromptIds.includes(`${scenario.id}:${possibility.id}`)}
                            onChange={(event) =>
                              setSelectedPromptIds(
                                event.target.checked
                                  ? [...selectedPromptIds, `${scenario.id}:${possibility.id}`]
                                  : selectedPromptIds.filter((id) => id !== `${scenario.id}:${possibility.id}`)
                              )
                            }
                          />
                        </label>
                        <p>
                          <strong>Possible intention:</strong> {possibility.intention}
                        </p>
                        <p>
                          <strong>Possible perception:</strong> {possibility.perception}
                        </p>
                        <p>{possibility.question}</p>
                        <label className="block">
                          Your reflection
                          <select
                            aria-label={`Your reflection for ${possibility.id}`}
                            className="ml-2 border p-1"
                            value={attempt.reflections?.[`${scenario.id}:${possibility.id}`]?.answer ?? ''}
                            onChange={(event) => {
                              const key = `${scenario.id}:${possibility.id}`;
                              const reflections = {
                                ...attempt.reflections,
                                [key]: {
                                  ...attempt.reflections?.[key],
                                  ...(event.target.value
                                    ? { answer: event.target.value as ReflectionAnswer }
                                    : { answer: undefined }),
                                },
                              };
                              updateAttempt({ reflections });
                            }}
                          >
                            <option value="">Not answered</option>
                            <option value="worth-considering">Worth considering</option>
                            <option value="does-not-fit">Doesn’t fit</option>
                            <option value="not-sure">Not sure</option>
                          </select>
                        </label>
                        <label className="block">
                          Optional note
                          <textarea
                            className="mt-1 block w-full border p-2"
                            value={attempt.reflections?.[`${scenario.id}:${possibility.id}`]?.note ?? ''}
                            onChange={(event) => {
                              const key = `${scenario.id}:${possibility.id}`;
                              updateAttempt({
                                reflections: {
                                  ...attempt.reflections,
                                  [key]: { ...attempt.reflections?.[key], note: event.target.value },
                                },
                              });
                            }}
                          />
                        </label>
                      </div>
                    ))}
                    <fieldset className="mt-3 space-y-2 border-t pt-3">
                      <legend>Optional value connection</legend>
                      <label className="block">
                        Saved completed values
                        <select
                          className="ml-2 border p-1"
                          aria-label={`Saved completed values for ${scenario.id}`}
                          value={attempt.valueConnections?.[scenario.id]?.value ?? ''}
                          onChange={(event) =>
                            updateValueConnection(
                              scenario.id,
                              event.target.value,
                              attempt.valueConnections?.[scenario.id]?.observation
                            )
                          }
                        >
                          <option value="">No value chosen</option>
                          {savedValues.flatMap((result) =>
                            result.completed.finalValues.map((value) => (
                              <option
                                key={`${result.sessionId}:${value.id}`}
                                value={`${value.title} (${result.exerciseType === 'team' ? 'team-focused' : 'personal'})`}
                              >
                                {value.title} · {result.exerciseType === 'team' ? 'Team-focused' : 'Personal'}
                              </option>
                            ))
                          )}
                        </select>
                      </label>
                      <label className="block">
                        Optional note about this connection
                        <textarea
                          className="mt-1 block w-full border p-2"
                          value={attempt.valueConnections?.[scenario.id]?.observation ?? ''}
                          onChange={(event) =>
                            updateValueConnection(
                              scenario.id,
                              attempt.valueConnections?.[scenario.id]?.value ?? '',
                              event.target.value
                            )
                          }
                        />
                      </label>
                      <p>
                        A value connection is your choice to explore; it does not show that a value caused your
                        response.
                      </p>
                    </fieldset>
                  </>
                ) : (
                  <p>It depends or skipped. No tailored perspectives are shown for this situation.</p>
                )}
              </article>
            );
          })}
        </div>
        <section aria-labelledby="reflection-prompts-heading" className="space-y-3 border-t pt-5">
          <h2 id="reflection-prompts-heading">Reflection prompts</h2>
          <p>
            Choose possibilities above to create a one-off prompt. Prompts are for consideration, not diagnosis or
            verified findings.
          </p>
          <button
            type="button"
            onClick={() => setPromptPreview(composeOneOffReflectionPrompt(attempt, selectedPromptIds))}
          >
            Create one-off prompt
          </button>
          <fieldset className="space-y-2 border-t pt-3">
            <legend>Recurring prompt preferences</legend>
            <p>
              This app does not schedule or send reminders. These saved preferences shape a prompt you can copy into
              another service.
            </p>
            <label>
              Cadence{' '}
              <select
                value={reminder.cadence}
                onChange={(event) =>
                  setReminder({ ...reminder, cadence: event.target.value as ReflectionReminder['cadence'] })
                }
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label className="ml-3">
              Time{' '}
              <input
                type="time"
                value={reminder.time}
                onChange={(event) => setReminder({ ...reminder, time: event.target.value })}
              />
            </label>
            <label className="ml-3">
              Time zone{' '}
              <input
                value={reminder.timezone}
                onChange={(event) => setReminder({ ...reminder, timezone: event.target.value })}
              />
            </label>
            {reminder.cadence === 'weekly' && (
              <label className="ml-3">
                Day (1 Monday–7 Sunday){' '}
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={reminder.weekday}
                  onChange={(event) => setReminder({ ...reminder, weekday: Number(event.target.value) })}
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => {
                const next = { ...reminder, selectedPossibilityIds: selectedPromptIds };
                if (!isValidReminder(next, attempt)) {
                  setSaveError(true);
                  return;
                }
                updateAttempt({ reminder: next });
                setReminder(next);
                setSaveError(false);
              }}
            >
              Save reminder preferences
            </button>
            <button
              type="button"
              onClick={() => {
                const settings = attempt.reminder ?? { ...reminder, selectedPossibilityIds: selectedPromptIds };
                setPromptPreview(composeRecurringReflectionPrompt(attempt, settings));
              }}
            >
              Create recurring prompt
            </button>
          </fieldset>
          {saveError && <p role="alert">Reminder preferences could not be saved. Check the time and time zone.</p>}
          {promptPreview && (
            <label className="block">
              Prompt preview
              <textarea readOnly className="mt-1 block min-h-48 w-full border p-2" value={promptPreview} />
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(promptPreview)
                    .then(() => setCopyStatus('Prompt copied.'))
                    .catch(() => setCopyStatus('Copy was unavailable. Select and copy the prompt text.'));
                }}
              >
                Copy prompt
              </button>
              {copyStatus && <span role="status">{copyStatus}</span>}
            </label>
          )}
        </section>
        <button type="button" onClick={begin}>
          Start a fresh reflection
        </button>
      </section>
    );
  }

  const scenario = behaviourScenarios[attempt.position];
  const activePosition = attempt.position;
  const setChoice = (choice: ScenarioChoice) => {
    updateAttempt({ answers: { ...attempt.answers, [scenario.id]: choice } });
  };

  function goNext(): void {
    updateAttempt({ position: activePosition + 1 });
  }

  function finish(): void {
    updateAttempt({ status: 'completed' });
  }

  return (
    <section
      aria-labelledby="scenario-heading"
      className="mx-auto max-w-4xl space-y-6 rounded-lg border bg-white p-6 sm:p-10"
    >
      <div className="flex flex-wrap justify-between gap-3">
        <a href="/">Exit reflection</a>
        <p aria-live="polite">
          Situation {attempt.position + 1} of {behaviourScenarios.length}
        </p>
      </div>
      <p>{scenario.context}</p>
      <h1 id="scenario-heading">{scenario.prompt}</h1>
      <fieldset className="space-y-3">
        <legend>What would you most likely do?</legend>
        {scenario.responses.map((response) => (
          <label key={response.id} className="flex gap-3 rounded border p-4">
            <input
              type="radio"
              name={`scenario-${scenario.id}`}
              value={response.id}
              checked={attempt.answers[scenario.id] === response.id}
              onChange={() => setChoice(response.id)}
            />
            {response.label}
          </label>
        ))}
        {(['depends', 'skip'] as const).map((choice) => (
          <label key={choice} className="flex gap-3 rounded border p-4">
            <input
              type="radio"
              name={`scenario-${scenario.id}`}
              value={choice}
              checked={attempt.answers[scenario.id] === choice}
              onChange={() => setChoice(choice)}
            />
            {choice === 'depends' ? 'It depends' : 'Skip this situation'}
          </label>
        ))}
      </fieldset>
      <p role="status">{saveError ? 'Not saved on this device' : 'Saved on this device'}</p>
      {saveError && <p role="alert">Your choice remains on this page but could not be saved on this device.</p>}
      {attempt.position < behaviourScenarios.length - 1 ? (
        <button type="button" onClick={goNext}>
          Next situation
        </button>
      ) : (
        <button type="button" onClick={finish}>
          Finish and see reflections
        </button>
      )}
    </section>
  );
}

export default ScenarioReflectionRoute;
