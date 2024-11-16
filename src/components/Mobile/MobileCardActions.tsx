import React from 'react';
import { Value, CategoryName } from '@/types';

interface MobileCardActionsProps {
  card: Value;
  category?: CategoryName;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveBetweenCategories: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const MobileCardActions: React.FC<MobileCardActionsProps> = ({
  onMoveUp,
  onMoveDown,
  onMoveBetweenCategories,
  canMoveUp,
  canMoveDown,
  category
}) => {
  if (!category) return null;

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className={`p-2 rounded ${
          canMoveUp ? 'bg-blue-100 active:bg-blue-200' : 'bg-gray-100'
        }`}
      >
        ↑
      </button>
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className={`p-2 rounded ${
          canMoveDown ? 'bg-blue-100 active:bg-blue-200' : 'bg-gray-100'
        }`}
      >
        ↓
      </button>
      <button
        onClick={onMoveBetweenCategories}
        className="p-2 rounded bg-blue-100 active:bg-blue-200 flex-grow"
      >
        Move to...
      </button>
    </div>
  );
};
