// src/components/Replay/components/ReplayColumn.tsx
import { Value, CategoryName } from '@/types';

interface ReplayColumnProps {
    title: CategoryName;
    cards: Value[];
}

export function ReplayColumn({ title, cards }: ReplayColumnProps) {
    const columnId = `replay-column-${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div 
        data-category={title} 
        className="bg-white rounded-lg shadow p-4"
        role="region"
        aria-labelledby={columnId}
      >
        <h3 
          id={columnId}
          className="text-lg font-semibold mb-4"
        >
          {title}
          <span 
            className="ml-2 text-sm text-gray-500"
            aria-label={`${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`}
          >
            ({cards.length})
          </span>
        </h3>

        <div 
          className="space-y-2"
          role="list"
          aria-label={`Values in ${title} category`}
        >
          {cards.map((card) => (
            <article
              key={card.id}
              data-card-id={card.id}
              className="bg-yellow-50 rounded-lg p-3 shadow"
              role="listitem"
            >
              <div 
                className="space-y-1"
                role="group"
                aria-labelledby={`card-title-${card.id}`}
              >
                <h4 
                  id={`card-title-${card.id}`}
                  className="font-medium"
                >
                  {card.title}
                </h4>
                <p 
                  className="text-sm text-gray-600"
                  aria-label={`Description: ${card.description}`}
                >
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {cards.length === 0 && (
          <div 
            className="text-gray-500 text-sm text-center py-4"
            role="status"
            aria-label={`No cards in ${title} category`}
          >
            No cards in this category
          </div>
        )}
      </div>
    );
}
