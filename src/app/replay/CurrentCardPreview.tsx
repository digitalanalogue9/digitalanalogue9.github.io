type ValueCard = {
  title: string;
  description: string;
};

export function CurrentCardPreview({ card }: { card?: ValueCard }) {
  if (!card) {
    return (
      <section
        className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border p-4 shadow-sm"
        aria-labelledby="replay-current-card"
      >
        <h3 id="replay-current-card" className="text-interface-base-large text-sys-color-text-primary font-semibold">
          Current Card
        </h3>
        <p className="text-interface-base-small text-sys-color-text-secondary mt-3">
          No card is left in the deck for this replay step.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border p-4 shadow-sm"
      aria-labelledby="replay-current-card"
    >
      <p className="text-interface-base-default text-sys-color-text-primary font-semibold">Current card</p>
      <h3 id="replay-current-card" className="text-interface-title-2 text-sys-color-text-primary mt-2 font-semibold">
        {card.title}
      </h3>
      <p className="text-interface-base-small text-sys-color-text-secondary mt-3 leading-relaxed">{card.description}</p>
    </section>
  );
}
