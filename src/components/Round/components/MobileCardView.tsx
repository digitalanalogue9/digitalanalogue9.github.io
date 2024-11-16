import React from 'react';
import { Value, CategoryName, Categories } from '@/types';
import { Card } from '@/components/Card';

interface MobileCardViewProps {
  cards: Value[];
  categorizedCards: Categories;
  onCardPlace: (card: Value, category: CategoryName) => void;
}

export const MobileCardView: React.FC<MobileCardViewProps> = ({
  cards,
  categorizedCards,
  onCardPlace,
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-4">
      <div className="space-y-4">
        {cards.map(card => (
          <div key={card.id} className="p-2">
            <Card value={card} />
          </div>
        ))}
      </div>
    </div>
  );
};
