import type { ExerciseType } from '@/lib/contracts/types';
import type { ReflectionSummary as ReflectionSummaryData } from '@/lib/content/reflectionContent';
import { SummaryGroup } from '@/app/completed/SummaryGroup';

export function ReflectionSummary({
  summary,
  exerciseType,
}: {
  summary: ReflectionSummaryData;
  exerciseType: ExerciseType;
}) {
  const hasSummary =
    summary.recognisedPossibilities.length +
      summary.observations.length +
      summary.actions.length +
      summary.unconfirmedPossibilities.length >
    0;
  if (!hasSummary) return null;

  return (
    <section
      aria-labelledby="reflection-summary-heading"
      className="rounded-sys-radius-button-sm border-sys-color-border-default space-y-3 border p-4"
    >
      <h2
        id="reflection-summary-heading"
        className="text-interface-base-large text-sys-color-text-primary font-semibold"
      >
        Reflection summary
      </h2>
      <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
        Recognition is self-reported; unanswered suggestions remain open questions. Recorded notes describe the
        participant’s or team’s own account.
      </p>
      {summary.recognisedPossibilities.length > 0 && (
        <SummaryGroup
          title={exerciseType === 'team' ? 'Recognised in team discussion' : 'Self-reported recognition'}
          exerciseType={exerciseType}
          items={summary.recognisedPossibilities}
        />
      )}
      {summary.observations.length > 0 && (
        <SummaryGroup
          title={exerciseType === 'team' ? 'Recorder notes' : 'Observations'}
          exerciseType={exerciseType}
          items={summary.observations}
        />
      )}
      {summary.actions.length > 0 && (
        <SummaryGroup title="Chosen actions" exerciseType={exerciseType} items={summary.actions} />
      )}
      {summary.unconfirmedPossibilities.length > 0 && (
        <SummaryGroup
          title="Possibilities not confirmed"
          exerciseType={exerciseType}
          items={summary.unconfirmedPossibilities}
        />
      )}
    </section>
  );
}
