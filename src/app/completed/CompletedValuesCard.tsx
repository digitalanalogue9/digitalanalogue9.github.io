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
    <section aria-label="Selected core values" className="print:break-inside-avoid">
      <ol className="space-y-5">
        {completed.finalValues.map((value, index) => {
          const reason = normalizeCompletedValueReason(value.reason);

          return (
            <li key={value.id} className="grid min-w-0 gap-3 py-1 print:break-inside-avoid">
              <div className="flex min-w-0 items-start gap-3">
                <span className="bg-ref-color-brand-primary text-interface-base-small inline-flex h-7 w-7 flex-shrink-0 items-center justify-center font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-interface-base-large text-sys-color-text-primary font-semibold [overflow-wrap:anywhere] break-words">
                    {value.title}
                  </h2>
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
      <div className="mt-8">
        <dl className="text-interface-base-small text-sys-color-text-primary flex flex-wrap justify-end gap-x-6 gap-y-2 text-right">
          <div className="flex min-w-0 flex-col items-end gap-x-2 sm:flex-row sm:items-baseline">
            <dt className="text-sys-color-text-secondary shrink-0 font-semibold tracking-wide whitespace-nowrap uppercase">
              Session reference
            </dt>
            <dd className="min-w-0 break-words">{sessionReference}</dd>
          </div>
          <div className="flex min-w-0 flex-col items-end gap-x-2 sm:flex-row sm:items-baseline">
            <dt className="text-sys-color-text-secondary font-semibold tracking-wide uppercase">Completed</dt>
            <dd>{completedAt}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
