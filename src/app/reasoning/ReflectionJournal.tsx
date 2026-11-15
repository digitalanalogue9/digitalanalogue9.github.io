import type { ExerciseType, SessionReflection, ValueReflectionNotes, ValueWithReason } from '@/lib/contracts/types';
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
  onValueChange,
  onSuggestionChange,
}: {
  selectedValues: ValueWithReason[];
  exerciseType: ExerciseType;
  reflection: SessionReflection;
  relationships: ReflectionRelationship[];
  summary: ReflectionSummaryData;
  working: boolean;
  onValueChange: (valueId: string, field: keyof ValueReflectionNotes, value: string) => void;
  onSuggestionChange: (valueId: string, suggestionId: string, response: 'recognised' | 'rejected' | 'unsure') => void;
}) {
  return (
    <div className="space-y-8">
      {relationships.length > 0 && (
        <section aria-labelledby="value-relationships-heading" className="space-y-3">
          <h2
            id="value-relationships-heading"
            className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl"
          >
            Balancing your values
          </h2>
          <p className="text-interface-base-default text-sys-color-text-secondary leading-6">
            Selected values can complement each other or pull in different directions depending on the situation. These
            are possibilities to explore, not fixed opposites.
          </p>
          {relationships.map((relationship) => (
            <article
              key={relationship.id}
              className="rounded-sys-radius-button-sm border-sys-color-border-default space-y-3 border p-4"
            >
              <h3 className="text-interface-base-default text-sys-color-text-primary font-semibold">
                {relationship.title}
              </h3>
              <p className="text-interface-base-default text-sys-color-text-secondary leading-6">
                {relationship[exerciseType]}
              </p>
            </article>
          ))}
        </section>
      )}

      <section aria-labelledby="selected-value-reflections-heading" className="space-y-5 sm:space-y-6">
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
