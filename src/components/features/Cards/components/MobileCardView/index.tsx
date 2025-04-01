// src/components/Round/components/MobileCardView.tsx
import React from 'react';
import { Card } from '@/components/features/Cards/components';
import { MobileCardViewProps } from './types';

/**
 * MobileCardView component displays a list of value cards in a mobile-friendly view.
 * It shows the cards in a scrollable container and provides accessibility features.
 */
export const MobileCardView: React.FC<MobileCardViewProps> = ({ cards }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-white p-4" role="dialog" aria-label="Value cards selection">
      <div className="space-y-4" role="list" aria-label="Available value cards">
        {cards.map((card) => (
          <div key={card.id} className="p-2" role="listitem">
            <Card value={card} aria-label={`Value card: ${card.title}`} />
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="py-4 text-center text-black" role="status" aria-live="polite">
          No cards available
        </div>
      )}
    </div>
  );
};
