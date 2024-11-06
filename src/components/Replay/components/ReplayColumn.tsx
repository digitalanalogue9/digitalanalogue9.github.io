import { Value, CategoryName } from '@/types';

interface ReplayColumnProps {
    title: CategoryName;
    cards: Value[];
}

export function ReplayColumn({ title, cards }: ReplayColumnProps) {
    return (
      <div data-category={title} className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              data-card-id={card.id}
              className="bg-yellow-50 rounded-lg p-3 shadow"
            >
              <h4 className="font-medium">{card.title}</h4>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
