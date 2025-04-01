// src/components/Replay/components/MobileReplayCategories.tsx
import { Categories, CategoryName, Value } from '@/lib/types';

export function MobileReplayCategory({ title, cards }: { title: CategoryName; cards: Value[] }) {
  const categoryId = `mobile-replay-category-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div
      data-category={title}
      className="rounded-lg border border-gray-200 bg-white p-2"
      role="region"
      aria-labelledby={categoryId}
    >
      <div className="flex items-center justify-between">
        <h3 id={categoryId} className="truncate text-xs font-medium sm:text-sm">
          {title}
        </h3>
        <span
          className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs"
          aria-label={`${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`}
        >
          {cards.length}
        </span>
      </div>
      {cards.length > 0 && (
        <div className="mt-1 space-y-1" role="list" aria-label={`Values in ${title}`}>
          {cards.map((card) => (
            <div key={card.id} className="truncate text-xs text-black" role="listitem" aria-label={card.title}>
              {card.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export function MobileReplayCategories({ categories }: { categories: Categories }) {
  return (
    <div className="w-full space-y-1" role="region" aria-label="Value categories replay view">
      <div className="w-full" role="group" aria-label="Primary category">
        <MobileReplayCategory title="Very Important" cards={categories['Very Important'] || []} />
      </div>

      <div className="grid grid-cols-2 gap-1" role="group" aria-label="Secondary categories">
        <MobileReplayCategory title="Quite Important" cards={categories['Quite Important'] || []} />
        <MobileReplayCategory title="Important" cards={categories['Important'] || []} />
      </div>

      <div className="grid grid-cols-2 gap-1" role="group" aria-label="Additional categories">
        <MobileReplayCategory title="Of Some Importance" cards={categories['Of Some Importance'] || []} />
        <MobileReplayCategory title="Not Important" cards={categories['Not Important'] || []} />
      </div>
    </div>
  );
}
