import type { CompletedSession } from '@/lib/contracts/types';
import { formatCompletedAt, normalizeCompletedValueReason } from '@/lib/utils/completedValuesExport';

export function CompletedValuesCard({
  completed,
  sessionReference,
}: {
  completed: CompletedSession;
  sessionReference: string;
}) {
  const completedAt = formatCompletedAt(completed.completedAt);

  return (
    <section aria-labelledby="completed-values-heading" className="print:break-inside-avoid">
      <div className="space-y-4 sm:space-y-6">
        <h2
          id="completed-values-heading"
          className="page-section-heading text-sys-color-text-primary text-3xl sm:text-4xl"
        >
          Your Core Values
        </h2>
        <dl className="text-interface-base-small text-sys-color-text-primary grid gap-4 md:grid-cols-2">
          <div className="min-w-0 md:flex md:items-baseline md:gap-2">
            <dt className="text-sys-color-text-secondary font-semibold tracking-wide uppercase">Completed</dt>
            <dd className="mt-1 min-w-0 md:mt-0 md:whitespace-nowrap">{completedAt}</dd>
          </div>
          <div className="min-w-0 md:flex md:items-baseline md:gap-2">
            <dt className="text-sys-color-text-secondary shrink-0 font-semibold tracking-wide whitespace-nowrap uppercase">
              Session reference
            </dt>
            <dd className="mt-1 min-w-0 md:mt-0 md:whitespace-nowrap">{sessionReference}</dd>
          </div>
        </dl>
      </div>

      <ol className="mt-8 space-y-5 sm:mt-12">
        {completed.finalValues.map((value, index) => {
          const reason = normalizeCompletedValueReason(value.reason);

          return (
            <li key={value.id} className="grid min-w-0 gap-3 py-1 print:break-inside-avoid">
              <div className="flex min-w-0 items-start gap-3">
                <span className="bg-ref-color-brand-primary text-interface-base-small inline-flex h-7 w-7 flex-shrink-0 items-center justify-center font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-interface-base-large text-sys-color-text-primary font-semibold [overflow-wrap:anywhere] break-words">
                    {value.title}
                  </h3>
                  <p className="text-interface-base-small text-sys-color-text-secondary mt-1 leading-6 [overflow-wrap:anywhere] break-words">
                    {value.description}
                  </p>
                  {reason && (
                    <p className="text-interface-base-small text-sys-color-text-secondary mt-1 leading-6 [overflow-wrap:anywhere] break-words">
                      {reason}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
