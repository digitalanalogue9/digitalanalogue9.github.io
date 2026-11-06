import type { CompletedSession } from '@/lib/contracts/types';
import { formatCompletedAt, getCompletedBy, normalizeCompletedValueReason } from '@/lib/utils/completedValuesExport';

export function CompletedValuesCard({
  completed,
  sessionReference,
}: {
  completed: CompletedSession;
  sessionReference: string;
}) {
  const completedBy = getCompletedBy(completed);
  const completedAt = formatCompletedAt(completed.completedAt);

  return (
    <section className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border shadow-sm print:border-0 print:shadow-none">
      <div className="border-ref-color-brand-primary border-b-2 p-6 sm:flex sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h1 className="text-interface-title-1 text-sys-color-text-primary mt-1 font-semibold">
            Your <span className="text-ref-color-brand-primary">Core Values</span>
          </h1>
        </div>
      </div>

      <dl className="border-sys-color-border-default text-interface-base-small grid gap-4 border-b p-6 sm:grid-cols-3">
        <div>
          <dt className="text-sys-color-text-secondary font-semibold tracking-wide uppercase">Completed</dt>
          <dd className="text-sys-color-text-primary mt-1">{completedAt}</dd>
        </div>
        <div>
          <dt className="text-sys-color-text-secondary font-semibold tracking-wide uppercase">Completed by</dt>
          <dd className="text-sys-color-text-primary mt-1">{completedBy}</dd>
        </div>
        <div>
          <dt className="text-sys-color-text-secondary font-semibold tracking-wide uppercase">Session reference</dt>
          <dd className="text-sys-color-text-primary mt-1 break-all">{sessionReference}</dd>
        </div>
      </dl>

      <ol className="space-y-3 p-6">
        {completed.finalValues.map((value, index) => {
          const reason = normalizeCompletedValueReason(value.reason);

          return (
            <li
              key={value.id}
              className="rounded-sys-radius-button-sm border-sys-color-border-default grid gap-3 border p-4 print:break-inside-avoid"
            >
              <div className="flex items-start gap-3">
                <span className="bg-ref-color-brand-primary text-interface-base-small inline-flex h-7 w-7 flex-shrink-0 items-center justify-center font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-interface-base-large text-sys-color-text-primary font-semibold">{value.title}</h2>
                  <p className="text-interface-base-small text-sys-color-text-secondary mt-1 leading-6">
                    {value.description}
                  </p>
                  {reason && (
                    <p className="text-interface-base-small text-sys-color-text-secondary mt-1 leading-6">{reason}</p>
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
