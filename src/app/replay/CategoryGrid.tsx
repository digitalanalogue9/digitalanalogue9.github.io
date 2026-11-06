import type { RoundSnapshot } from '@/lib/contracts/types';

type CategoryName = RoundSnapshot['activeCategories'][number];

export function CategoryGrid({
  activeCategories,
  snapshot,
}: {
  activeCategories: CategoryName[];
  snapshot: RoundSnapshot;
}) {
  const columnClassByCount: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
  };
  const gridColumnClass = columnClassByCount[activeCategories.length] ?? 'md:grid-cols-5';

  return (
    <div className={`grid grid-cols-1 gap-3 ${gridColumnClass}`}>
      {activeCategories.map((category) => (
        <article
          key={`${snapshot.roundNumber}-${category}`}
          className="rounded-sys-radius-button-sm border-sys-color-border-default border p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-interface-base-small text-sys-color-text-primary font-semibold">{category}</h4>
            <span className="rounded-ref-radius-999 bg-sys-color-surface-warm text-interface-tiny-label text-sys-color-text-primary px-2 py-0.5 font-semibold">
              {snapshot.categories[category].length}
            </span>
          </div>
          <ul className="text-interface-base-small text-sys-color-text-secondary mt-2 space-y-1">
            {snapshot.categories[category].map((value) => (
              <li key={`${snapshot.roundNumber}-${category}-${value.id}`}>{value.title}</li>
            ))}
            {snapshot.categories[category].length === 0 && <li className="text-sys-color-text-secondary">None</li>}
          </ul>
        </article>
      ))}
    </div>
  );
}
