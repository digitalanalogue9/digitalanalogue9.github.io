import { useEffect, useState } from 'react';
import {
  loadLatestScenarioAttempt,
  saveScenarioAttempt,
  startScenarioAttempt,
  type ScenarioAttempt,
  type ScenarioChoice,
} from '../../../lib/scenario-reflection/attemptStorage';
import { behaviourScenarios } from '../../../lib/scenario-reflection/scenarios';

export function ScenarioReflectionRoute() {
  const [attempt, setAttempt] = useState<ScenarioAttempt | null>(null);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    setAttempt(loadLatestScenarioAttempt());
  }, []);

  function begin(): void {
    try {
      setAttempt(startScenarioAttempt());
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
                        <p>
                          <strong>Possible intention:</strong> {possibility.intention}
                        </p>
                        <p>
                          <strong>Possible perception:</strong> {possibility.perception}
                        </p>
                        <p>{possibility.question}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>It depends or skipped. No tailored perspectives are shown for this situation.</p>
                )}
              </article>
            );
          })}
        </div>
        <button type="button" onClick={begin}>
          Start a fresh reflection
        </button>
      </section>
    );
  }

  const scenario = behaviourScenarios[attempt.position];
  const setChoice = (choice: ScenarioChoice) => {
    updateAttempt({ answers: { ...attempt.answers, [scenario.id]: choice } });
  };

  function goNext(): void {
    updateAttempt({ position: attempt.position + 1 });
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
