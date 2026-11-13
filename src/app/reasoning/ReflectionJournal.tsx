import type {
  ExerciseType,
  RelationshipReflectionNotes,
  SessionReflection,
  ValueReflectionNotes,
  ValueWithReason,
} from '@/lib/contracts/types';
import type {
  ReflectionRelationship,
  ReflectionSummary as ReflectionSummaryData,
} from '@/lib/content/reflectionContent';
import { ReflectionSummary } from '@/app/reasoning/ReflectionSummary';
import { ReflectionValueList } from '@/app/reasoning/ReflectionValueList';

export function ReflectionJournal({
  selectedValues,
  exerciseType,
  reflection,
  relationships,
  summary,
  working,
  onGoalChange,
  onValueChange,
  onSuggestionChange,
  onRelationshipChange,
}: {
  selectedValues: ValueWithReason[];
  exerciseType: ExerciseType;
  reflection: SessionReflection;
  relationships: ReflectionRelationship[];
  summary: ReflectionSummaryData;
  working: boolean;
  onGoalChange: (value: string) => void;
  onValueChange: (valueId: string, field: keyof ValueReflectionNotes, value: string) => void;
  onSuggestionChange: (valueId: string, suggestionId: string, response: 'recognised' | 'rejected' | 'unsure') => void;
  onRelationshipChange: (relationshipId: string, field: keyof RelationshipReflectionNotes, value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-2" aria-labelledby="reflection-goal-heading">
        <h2
          id="reflection-goal-heading"
          className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl"
        >
          Session goal (optional)
        </h2>
        <label className="sr-only" htmlFor="reflection-goal">
          Session goal (optional)
        </label>
        <textarea
          id="reflection-goal"
          className="cv-field__control min-h-24 w-full resize-y"
          value={reflection.goal ?? ''}
          onChange={(event) => onGoalChange(event.target.value)}
          disabled={working}
        />
      </section>

      {relationships.length > 0 && (
        <section aria-labelledby="value-relationships-heading" className="space-y-3">
          <h2
            id="value-relationships-heading"
            className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl"
          >
            Values in context
          </h2>
          <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
            Selected values can complement each other or pull in different directions depending on the situation. These
            are possibilities to explore, not fixed opposites.
          </p>
          {relationships.map((relationship) => (
            <fieldset
              key={relationship.id}
              className="rounded-sys-radius-button-sm border-sys-color-border-default space-y-3 border p-4"
            >
              <legend className="text-interface-base-small text-sys-color-text-primary px-1 font-semibold">
                {relationship.title}
              </legend>
              <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
                {relationship[exerciseType]}
              </p>
              <label
                className="text-interface-base-small text-sys-color-text-primary block font-semibold"
                htmlFor={`relationship-observation-${relationship.id}`}
              >
                Observation (optional)
              </label>
              <textarea
                id={`relationship-observation-${relationship.id}`}
                className="cv-field__control min-h-20 w-full resize-y"
                value={reflection.relationships?.[relationship.id]?.observation ?? ''}
                onChange={(event) => onRelationshipChange(relationship.id, 'observation', event.target.value)}
                disabled={working}
              />
              <label
                className="text-interface-base-small text-sys-color-text-primary block font-semibold"
                htmlFor={`relationship-action-${relationship.id}`}
              >
                Practical action (optional)
              </label>
              <textarea
                id={`relationship-action-${relationship.id}`}
                className="cv-field__control min-h-20 w-full resize-y"
                value={reflection.relationships?.[relationship.id]?.action ?? ''}
                onChange={(event) => onRelationshipChange(relationship.id, 'action', event.target.value)}
                disabled={working}
              />
            </fieldset>
          ))}
        </section>
      )}

      <section aria-labelledby="selected-value-reflections-heading" className="space-y-4">
        <h2
          id="selected-value-reflections-heading"
          className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl"
        >
          Reflect on each value
        </h2>
        <ReflectionValueList
          selectedValues={selectedValues}
          exerciseType={exerciseType}
          reflection={reflection}
          working={working}
          updateValueReflection={onValueChange}
          updateSuggestionResponse={onSuggestionChange}
        />
      </section>

      <ReflectionSummary summary={summary} exerciseType={exerciseType} />
    </div>
  );
}
