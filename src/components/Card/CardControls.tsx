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

  const buttonBaseClass = "p-1.5 text-gray-600 hover:text-gray-900 rounded text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors touch-none select-none";

  return (
    <div 
      className="flex gap-0 items-center justify-end min-w-[120px] ml-auto"
      onTouchStart={(e: ReactTouchEvent) => e.stopPropagation()}
      onClick={(e: ReactMouseEvent) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => onToggleExpand?.())}
        onTouchStart={(e) => handleButtonClick(e, () => onToggleExpand?.())}
        className={buttonBaseClass}
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        <span className="inline-block w-4 text-center">
          {isExpanded ? '▼' : '▶︎'}
        </span>
      </button>

      {onMoveUp && (
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, onMoveUp)}
          onTouchStart={(e) => handleButtonClick(e, onMoveUp)}
          className={buttonBaseClass}
          aria-label="Move Up"
        >
          <span className="inline-block w-4 text-center">↑</span>
        </button>
      )}

      {onMoveDown && (
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, onMoveDown)}
          onTouchStart={(e) => handleButtonClick(e, onMoveDown)}
          className={buttonBaseClass}
          aria-label="Move Down"
        >
          <span className="inline-block w-4 text-center">↓</span>
        </button>
      )}

      {currentCategory && (
        <button
          type="button"
          id={`options-${value.id}`}
          onClick={(e) => handleButtonClick(e, onShowMoveOptions)}
          onTouchStart={(e) => handleButtonClick(e, onShowMoveOptions)}
          className={buttonBaseClass}
          aria-label="More options"
        >
          <span className="inline-block w-4 text-center">⋮</span>
        </button>
      )}
    </div>
  );
}
