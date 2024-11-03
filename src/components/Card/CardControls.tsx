import { TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { Value } from '@/types';
import { CardControlsProps } from './types';

interface ExtendedCardControlsProps extends CardControlsProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  value: Value;
}

export function CardControls({
  onMoveUp,
  onMoveDown,
  onShowMoveOptions,
  currentCategory,
  isExpanded,
  onToggleExpand,
  value
}: ExtendedCardControlsProps) {
  const handleButtonClick = (
    e: ReactMouseEvent<HTMLButtonElement> | ReactTouchEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  return (
    <div 
      className="flex gap-0 items-center text-gray-600"
      onTouchStart={(e: ReactTouchEvent) => e.stopPropagation()}
      onClick={(e: ReactMouseEvent) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => onToggleExpand?.())}
        onTouchStart={(e) => handleButtonClick(e, () => onToggleExpand?.())}
        className="p-2 hover:text-gray-900 rounded text-sm 
                 hover:bg-gray-100 active:bg-gray-200 transition-colors
                 touch-none select-none"
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        {isExpanded ? '▼' : '▶'}
      </button>

      {onMoveUp && (
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, onMoveUp)}
          onTouchStart={(e) => handleButtonClick(e, onMoveUp)}
          className="p-2 hover:text-gray-900 rounded text-sm
                   hover:bg-gray-100 active:bg-gray-200 transition-colors
                   touch-none select-none"
          aria-label="Move Up"
        >
          ↑
        </button>
      )}

      {onMoveDown && (
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, onMoveDown)}
          onTouchStart={(e) => handleButtonClick(e, onMoveDown)}
          className="p-2 hover:text-gray-900 rounded text-sm
                   hover:bg-gray-100 active:bg-gray-200 transition-colors
                   touch-none select-none"
          aria-label="Move Down"
        >
          ↓
        </button>
      )}

      {currentCategory && (
        <button
          type="button"
          id={`options-${value.id}`}
          onClick={(e) => handleButtonClick(e, onShowMoveOptions)}
          onTouchStart={(e) => handleButtonClick(e, onShowMoveOptions)}
          className="p-2 hover:text-gray-900 rounded text-sm
                   hover:bg-gray-100 active:bg-gray-200 transition-colors
                   touch-none select-none"
          aria-label="More options"
        >
          ⋮
        </button>
      )}
    </div>
  );
}
