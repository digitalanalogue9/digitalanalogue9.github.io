// src/components/Replay/components/ReplayColumn.tsx
import { ReplayColumnProps } from './types';

export function ReplayColumn({ title, cards }: ReplayColumnProps) {
  const columnId = `replay-column-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div data-category={title} className="rounded-lg bg-white p-4 shadow" role="region" aria-labelledby={columnId}>
      <h3 id={columnId} className="mb-4 text-lg font-semibold">
        {title}
        <span
          className="ml-2 text-sm text-black"
          aria-label={`${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`}
        >
          ({cards.length})
        </span>
      </h3>

      <div className="space-y-2" role="list" aria-label={`Values in ${title} category`}>
        {cards.map((card) => (
          <article key={card.id} data-card-id={card.id} className="rounded-lg bg-yellow-100 p-3 shadow" role="listitem">
            <div className="space-y-1" role="group" aria-labelledby={`card-title-${card.id}`}>
              <h4 id={`card-title-${card.id}`} className="font-medium">
                {card.title}
              </h4>
              <p className="text-sm text-black" aria-label={`Description: ${card.description}`}>
                {card.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="py-4 text-center text-sm text-black" role="status" aria-label={`No cards in ${title} category`}>
          No cards in this category
        </div>
      )}
    </div>
  );
}
