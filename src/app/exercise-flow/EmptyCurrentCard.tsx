import { Check } from 'lucide-react';

export default function EmptyCurrentCard() {
  return (
    <section className="flex w-full justify-center" aria-labelledby="current-card-empty-heading">
      <div className="border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default w-full max-w-lg border p-5 text-center shadow-sm">
        <Check className="text-ref-color-brand-primary mx-auto h-6 w-6" strokeWidth={2} aria-hidden="true" />
        <h3
          id="current-card-empty-heading"
          className="text-sys-color-text-primary text-interface-title-3 mt-3 font-semibold"
        >
          No cards left in this round
        </h3>
        <p className="text-sys-color-text-secondary text-interface-base-small mt-2">
          Use the round actions when you are ready to continue.
        </p>
      </div>
    </section>
  );
}
