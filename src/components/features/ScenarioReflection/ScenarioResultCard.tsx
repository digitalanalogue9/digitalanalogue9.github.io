import type { Dispatch, SetStateAction } from 'react';
import type { ReflectionAnswer, ScenarioAttempt } from '../../../lib/scenario-reflection/attemptStorage';
import { behaviourScenarios } from '../../../lib/scenario-reflection/scenarios';
import type { ScenarioViewProps } from './types';
import type { SavedCompletedValues } from './useCompletedValues';

type Props = Pick<ScenarioViewProps, 'attempt' | 'updateAttempt'> & {
  scenario: (typeof behaviourScenarios)[number];
  selectedPromptIds: string[];
  setSelectedPromptIds: Dispatch<SetStateAction<string[]>>;
  savedValues: SavedCompletedValues[];
};
export function ScenarioResultCard({
  scenario,
  attempt,
  updateAttempt,
  selectedPromptIds,
  setSelectedPromptIds,
  savedValues,
}: Props) {
  const response = scenario.responses.find(({ id }) => id === attempt.answers[scenario.id]);
  function updateValueConnection(scenarioId: string, value: string, observation?: string): void {
    if (!attempt) return;
    const valueConnections: NonNullable<ScenarioAttempt['valueConnections']> = { ...attempt.valueConnections };
    if (!value) delete valueConnections[scenarioId];
    else valueConnections[scenarioId] = { value, ...(observation ? { observation } : {}) };
    updateAttempt({ valueConnections });
  }

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
            <p>A value connection is your choice to explore; it does not show that a value caused your response.</p>
          </fieldset>
        </>
      ) : (
        <p>It depends or skipped. No tailored perspectives are shown for this situation.</p>
      )}
    </article>
  );
}
