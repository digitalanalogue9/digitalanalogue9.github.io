import type {
  BehaviourAttempt,
  PossibilityReflection,
  ReflectionResponse,
} from '@/lib/services/behaviourAttemptService';
import { nonExercisePageContainerClassName } from '@/app/layoutClasses';

type SaveStatus = 'saved' | 'saving' | 'error';

type BehaviourReflectionResultsProps = {
  attempt: BehaviourAttempt;
  isBusy: boolean;
  saveStatus: SaveStatus;
  error: string | null;
  retrySave: (() => Promise<void>) | null;
  onStartFresh: () => void;
  onContinuePrompt: () => void;
  onUpdateReflection: (
    scenarioId: string,
    possibilityId: string,
    response: ReflectionResponse | undefined,
    note: string
  ) => void;
  onRetrySave: () => void;
};

export function BehaviourReflectionResults({
  attempt,
  isBusy,
  saveStatus,
  error,
  retrySave,
  onStartFresh,
  onContinuePrompt,
  onUpdateReflection,
  onRetrySave,
}: BehaviourReflectionResultsProps) {
  const hasReveals = attempt.scenarios.some((scenario) => (scenario.reveals?.length ?? 0) > 0);

  return (
    <section
      className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default max-w-4xl space-y-7 border p-6 sm:p-10`}
      aria-labelledby="reveal-heading"
    >
      <h1 id="reveal-heading" className="text-interface-title-1 text-sys-color-text-primary font-semibold">
        Your reflections
      </h1>
      <p className="text-interface-base-small text-sys-color-text-primary max-w-prose">
        These are possibilities to consider, not conclusions about your behaviour or anyone else’s experience.
      </p>
      {!hasReveals && (
        <p className="rounded-sys-radius-card-sm bg-ref-color-brand-surface-secondary text-interface-base-default text-sys-color-text-primary p-5">
          You chose “It depends” or skipped each situation, so there are no tailored perspectives to show. You can leave
          it here or start a fresh reflection.
        </p>
      )}
      <div className="space-y-6">
        {attempt.scenarios
          .filter((scenario) => scenario.reveals?.length)
          .map((scenario) => (
            <article key={scenario.id} className="border-sys-color-border-default border-t pt-5">
              <h2 className="text-interface-title-2 text-sys-color-text-primary font-semibold">{scenario.prompt}</h2>
              <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
                <div className="space-y-4">
                  <p className="text-interface-base-small text-sys-color-text-primary">
                    <strong>Your choice:</strong>{' '}
                    {scenario.responses.find((response) => response.id === scenario.answer)?.label}
                  </p>
                  {scenario.reveals?.map((possibility) => (
                    <div key={possibility.id} className="space-y-2">
                      <p className="text-interface-base-default text-sys-color-text-primary">
                        <strong>Possible intention:</strong> {possibility.intention}
                      </p>
                      <p className="text-interface-base-default text-sys-color-text-primary">
                        <strong>Possible perception:</strong> {possibility.perception}
                      </p>
                      <p className="text-interface-base-small text-sys-color-text-primary">{possibility.question}</p>
                    </div>
                  ))}
                </div>
                <aside className="rounded-sys-radius-card-sm bg-ref-color-brand-surface-secondary space-y-4 p-4 sm:p-5">
                  <h3 className="text-interface-base-default text-sys-color-text-primary font-semibold">
                    Your reflection
                  </h3>
                  {scenario.reveals?.map((possibility) => {
                    const reflection: PossibilityReflection | undefined = scenario.reflections?.[possibility.id];
                    const groupName = `Reflection for: ${possibility.perception}`;
                    return (
                      <div key={possibility.id} className="space-y-3">
                        <fieldset className="space-y-2" aria-label={groupName}>
                          <legend className="text-interface-base-small text-sys-color-text-primary mb-2">
                            Does this feel worth considering?
                          </legend>
                          {(
                            [
                              ['worth-considering', 'Worth considering'],
                              ['does-not-fit', "Doesn't fit"],
                              ['not-sure', 'Not sure'],
                            ] as const
                          ).map(([value, label]) => (
                            <label
                              key={value}
                              className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3"
                            >
                              <input
                                className="apc-selector__control"
                                type="radio"
                                name={`reflection-${scenario.id}-${possibility.id}`}
                                value={value}
                                checked={reflection?.response === value}
                                onChange={() =>
                                  onUpdateReflection(scenario.id, possibility.id, value, reflection?.note ?? '')
                                }
                              />
                              {label}
                            </label>
                          ))}
                        </fieldset>
                        {reflection?.response && (
                          <button
                            type="button"
                            className="text-interface-base-small text-ref-color-brand-primary min-h-11 underline underline-offset-4 focus-visible:outline-2"
                            onClick={() =>
                              onUpdateReflection(scenario.id, possibility.id, undefined, reflection.note ?? '')
                            }
                          >
                            Clear response
                          </button>
                        )}
                        <label
                          className="text-interface-base-small text-sys-color-text-primary block font-semibold"
                          htmlFor={`reflection-note-${scenario.id}-${possibility.id}`}
                        >
                          Optional reflection note
                        </label>
                        <textarea
                          id={`reflection-note-${scenario.id}-${possibility.id}`}
                          className="apc-field__control min-h-24 w-full"
                          value={reflection?.note ?? ''}
                          onChange={(event) =>
                            onUpdateReflection(scenario.id, possibility.id, reflection?.response, event.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </aside>
              </div>
            </article>
          ))}
      </div>
      <div className="space-y-2" aria-live="polite">
        <p className="text-interface-base-small text-sys-color-text-primary" role="status">
          {saveStatus === 'saving'
            ? 'Saving reflection on this device…'
            : saveStatus === 'saved'
              ? 'Reflection saved on this device'
              : 'Reflection not saved yet'}
        </p>
        {retrySave && (
          <button
            type="button"
            className="text-interface-base-small text-ref-color-brand-primary min-h-11 underline underline-offset-4"
            onClick={onRetrySave}
          >
            Retry saving
          </button>
        )}
        {error && (
          <p role="alert" className="text-ref-color-rag-red-text">
            {error}
          </p>
        )}
      </div>
      <button type="button" className="apc-button min-h-11" onClick={onStartFresh} disabled={isBusy}>
        Start a fresh reflection
      </button>
      <button type="button" className="apc-button min-h-11" onClick={onContinuePrompt}>
        Continue with a conversation prompt
      </button>
    </section>
  );
}
