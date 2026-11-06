import { ScenarioQuestion } from './ScenarioQuestion';
import { ScenarioResults } from './ScenarioResults';
import { useScenarioAttempt } from './useScenarioAttempt';

export function ScenarioReflectionRoute() {
  const { attempt, saveError, begin, updateAttempt } = useScenarioAttempt();
  if (!attempt) {
    return (
      <section
        aria-labelledby="scenario-intro-heading"
        className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default mx-auto max-w-3xl space-y-6 border p-6 sm:p-10"
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

  if (attempt.status === 'completed')
    return (
      <ScenarioResults
        key={attempt.id}
        attempt={attempt}
        saveError={saveError}
        updateAttempt={updateAttempt}
        begin={begin}
      />
    );
  return <ScenarioQuestion attempt={attempt} saveError={saveError} updateAttempt={updateAttempt} />;
}
export default ScenarioReflectionRoute;
