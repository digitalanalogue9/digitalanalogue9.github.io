import type { ExerciseType, SessionReflection, ValueReflectionNotes, ValueWithReason } from '@/lib/contracts/types';
import { getReflectionContent } from '@/lib/content/reflectionContent';

export function ReflectionValueList({
  selectedValues,
  exerciseType,
  reflection,
  working,
  updateValueReflection,
  updateSuggestionResponse,
}: {
  selectedValues: ValueWithReason[];
  exerciseType: ExerciseType;
  reflection: SessionReflection;
  working: boolean;
  updateValueReflection: (valueId: string, field: keyof ValueReflectionNotes, value: string) => void;
  updateSuggestionResponse: (
    valueId: string,
    suggestionId: string,
    response: 'recognised' | 'rejected' | 'unsure'
  ) => void;
}) {
  return (
    <ol className="space-y-5">
      {selectedValues.map((value, index) => {
        const content = getReflectionContent(exerciseType, value);
        return (
          <li
            key={value.id}
            className="rounded-sys-radius-button-sm border-sys-color-border-default space-y-3 border p-4"
          >
            <details open={index === 0}>
              <summary className="text-interface-base-large text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-11 cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-2">
                {index + 1}. {value.title}
              </summary>
              <p className="text-interface-base-small text-sys-color-text-secondary leading-6">{value.description}</p>
              <div className="text-interface-base-small text-sys-color-text-secondary space-y-1 leading-6">
                <p className="font-semibold">Questions to consider</p>
                {content.questions[exerciseType].map((question) => (
                  <p key={question}>{question}</p>
                ))}
              </div>
              {content.possibilities.length > 0 && (
                <div className="space-y-3">
                  <p className="text-interface-base-small text-sys-color-text-primary font-semibold">
                    Possibilities to consider
                  </p>
                  {content.possibilities.map((possibility) => {
                    const response = reflection.values[value.id]?.suggestions?.[possibility.id];
                    const labels =
                      exerciseType === 'team'
                        ? ['Recognised in discussion', 'Not recognised', 'Mixed views / unsure']
                        : ['I recognise this', "I don't recognise this", 'Not sure'];
                    return (
                      <fieldset
                        key={possibility.id}
                        className="rounded-sys-radius-button-sm border-sys-color-border-default border p-3"
                      >
                        <legend className="text-interface-base-small text-sys-color-text-primary px-1 font-semibold">
                          {possibility[exerciseType]}
                        </legend>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                          {(['recognised', 'rejected', 'unsure'] as const).map((option, optionIndex) => (
                            <label
                              key={option}
                              className="text-interface-base-small text-sys-color-text-primary inline-flex min-h-11 items-center gap-2"
                            >
                              <input
                                type="radio"
                                name={`reflection-${value.id}-${possibility.id}`}
                                value={option}
                                checked={response === option}
                                onChange={() => updateSuggestionResponse(value.id, possibility.id, option)}
                                disabled={working}
                              />
                              {labels[optionIndex]}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>
              )}
              <div>
                <label
                  htmlFor={`reflection-observation-${value.id}`}
                  className="text-interface-base-small text-sys-color-text-primary mb-1 block font-semibold"
                >
                  Observation (optional)
                </label>
                <textarea
                  id={`reflection-observation-${value.id}`}
                  aria-label={`Observation for ${value.title}`}
                  className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-default text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-24 w-full border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
                  value={reflection.values[value.id]?.observation ?? ''}
                  onChange={(event) => updateValueReflection(value.id, 'observation', event.target.value)}
                  disabled={working}
                />
              </div>
              <div>
                <label
                  htmlFor={`reflection-action-${value.id}`}
                  className="text-interface-base-small text-sys-color-text-primary mb-1 block font-semibold"
                >
                  Practical action (optional)
                </label>
                <textarea
                  id={`reflection-action-${value.id}`}
                  aria-label={`Action for ${value.title}`}
                  className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-default text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-24 w-full border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
                  value={reflection.values[value.id]?.action ?? ''}
                  onChange={(event) => updateValueReflection(value.id, 'action', event.target.value)}
                  disabled={working}
                />
              </div>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
