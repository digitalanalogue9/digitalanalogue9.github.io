import { useState } from 'react';
import { behaviourScenarios } from '../../../lib/scenario-reflection/scenarios';
import { ScenarioResultCard } from './ScenarioResultCard';
import { ScenarioPromptTools } from './ScenarioPromptTools';
import { useCompletedValues } from './useCompletedValues';
import type { ScenarioViewProps } from './types';

export function ScenarioResults({
  attempt,
  saveError,
  updateAttempt,
  begin,
}: ScenarioViewProps & { begin: () => void }) {
  const [selectedPromptIds, setSelectedPromptIds] = useState(attempt.reminder?.selectedPossibilityIds ?? []);
  const savedValues = useCompletedValues();
  return (
    <section
      aria-labelledby="scenario-results-heading"
      className="mx-auto max-w-4xl space-y-6 rounded-lg border bg-white p-6 sm:p-10"
    >
      <h1 id="scenario-results-heading">Your scenario reflections</h1>
      <p>These are possibilities to consider, not conclusions about your behaviour or anyone else’s experience.</p>
      <div className="space-y-6">
        {behaviourScenarios.map((scenario) => (
          <ScenarioResultCard
            key={scenario.id}
            scenario={scenario}
            attempt={attempt}
            updateAttempt={updateAttempt}
            selectedPromptIds={selectedPromptIds}
            setSelectedPromptIds={setSelectedPromptIds}
            savedValues={savedValues}
          />
        ))}
      </div>
      <ScenarioPromptTools
        attempt={attempt}
        saveError={saveError}
        updateAttempt={updateAttempt}
        selectedPromptIds={selectedPromptIds}
      />
      <button type="button" onClick={begin}>
        Start a fresh reflection
      </button>
    </section>
  );
}
