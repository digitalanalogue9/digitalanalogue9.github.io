import type { ScenarioChoice } from '../../../lib/scenario-reflection/attemptStorage';
import { behaviourScenarios } from '../../../lib/scenario-reflection/scenarios';
import type { ScenarioViewProps } from './types';

export function ScenarioQuestion({ attempt, saveError, updateAttempt }: ScenarioViewProps) {
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
      className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default mx-auto max-w-4xl space-y-6 border p-6 sm:p-10"
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
          <label
            key={response.id}
            className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default hover:border-ref-color-brand-primary flex gap-3 border p-4"
          >
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
          <label
            key={choice}
            className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default hover:border-ref-color-brand-primary flex gap-3 border p-4"
          >
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
