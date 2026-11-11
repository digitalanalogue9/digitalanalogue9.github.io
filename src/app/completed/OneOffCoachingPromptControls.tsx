import type { Dispatch, SetStateAction } from 'react';
import type { OneOffCoachingContextOption } from '@/lib/content/oneOffCoachingPrompt';

const actionButtonClasses =
  'inline-flex min-h-11 items-center gap-2 rounded-sys-radius-button-sm border border-sys-color-border-strong px-4 py-2 text-interface-base-small font-semibold text-sys-color-text-primary transition-colors hover:bg-sys-color-surface-subtle disabled:opacity-60 md:min-h-9';

export function OneOffCoachingPromptControls({
  coachingPromptExpanded,
  setCoachingPromptExpanded,
  coachingContextOptions,
  includedCoachingContextIds,
  setIncludedCoachingContextIds,
  coachingPrompt,
  handleCopyCoachingPrompt,
  coachingCopyFeedback,
}: {
  coachingPromptExpanded: boolean;
  setCoachingPromptExpanded: Dispatch<SetStateAction<boolean>>;
  coachingContextOptions: OneOffCoachingContextOption[];
  includedCoachingContextIds: string[];
  setIncludedCoachingContextIds: Dispatch<SetStateAction<string[]>>;
  coachingPrompt: string;
  handleCopyCoachingPrompt: () => void;
  coachingCopyFeedback: string | null;
}) {
  return (
    <>
      <button
        type="button"
        aria-expanded={coachingPromptExpanded}
        className={`${actionButtonClasses} order-1`}
        onClick={() => setCoachingPromptExpanded((expanded) => !expanded)}
      >
        Preview one-off coaching prompt
      </button>
      {coachingPromptExpanded && (
        <div className="order-2 basis-full space-y-4 pt-3">
          <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
            Review the complete prompt before copying it into a service you choose. Optional text stays excluded until
            you select it.
          </p>
          <fieldset className="space-y-2">
            <legend className="text-interface-base-small text-sys-color-text-primary mb-2 font-semibold">
              Optional context (all off by default)
            </legend>
            {coachingContextOptions.length === 0 ? (
              <p className="text-interface-base-small text-sys-color-text-secondary">
                There is no optional context to include yet.
              </p>
            ) : (
              coachingContextOptions.map((option) => (
                <label
                  key={option.id}
                  className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-start gap-2 py-2"
                >
                  <input
                    type="checkbox"
                    checked={includedCoachingContextIds.includes(option.id)}
                    onChange={(event) => {
                      setIncludedCoachingContextIds((current) => {
                        if (event.target.checked) {
                          return [...current, option.id];
                        }
                        return current.filter((id) => {
                          return id !== option.id;
                        });
                      });
                    }}
                  />
                  <span>
                    {option.label}: <span className="text-sys-color-text-secondary">{option.text}</span>
                  </span>
                </label>
              ))
            )}
          </fieldset>
          <section aria-labelledby="coaching-prompt-preview-heading" className="space-y-2">
            <h3
              id="coaching-prompt-preview-heading"
              className="text-interface-base-small text-sys-color-text-primary font-semibold"
            >
              Exact prompt preview
            </h3>
            <pre className="rounded-sys-radius-button-sm border-sys-color-border-default bg-sys-color-surface-subtle text-interface-base-small text-sys-color-text-primary max-h-[32rem] overflow-auto border p-4 break-words whitespace-pre-wrap">
              {coachingPrompt}
            </pre>
            <button type="button" className={actionButtonClasses} onClick={() => void handleCopyCoachingPrompt()}>
              Copy preview
            </button>
            {coachingCopyFeedback && (
              <p className="text-interface-base-small text-sys-color-text-secondary" role="status">
                {coachingCopyFeedback}
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
