// src/components/Round/components/MobileCardView.tsx
import React from 'react';
import { Card } from "@/components/features/Cards/components";
import { MobileCardViewProps} from './types';

/**
 * MobileCardView component displays a list of value cards in a mobile-friendly view.
 * It shows the cards in a scrollable container and provides accessibility features.
 */
export const MobileCardView: React.FC<MobileCardViewProps> = ({
  cards,
  categorizedCards,
  onCardPlace
}) => {
  return <div className="fixed inset-0 bg-white z-50 overflow-auto p-4" role="dialog" aria-label="Value cards selection">
      <div className="space-y-4" role="list" aria-label="Available value cards">
        {cards.map(card => <div key={card.id} className="p-2" role="listitem">
            <Card value={card} aria-label={`Value card: ${card.title}`} />
          </div>)}
      </div>
      
      {cards.length === 0 && <div className="text-center text-black py-4" role="status" aria-live="polite">
          No cards available
        </div>}
    </div>;
};