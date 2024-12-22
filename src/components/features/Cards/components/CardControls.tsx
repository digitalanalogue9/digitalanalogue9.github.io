// src/components/Card/CardControls.tsx
import { TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { Value } from "@/lib/types";
import { ExtendedCardControlsProps } from '@/components/features/Cards/types';

export function CardControls({
  onMoveUp,
  onMoveDown,
  onShowMoveOptions,
  currentCategory,
  isExpanded,
  onToggleExpand,
  value
}: ExtendedCardControlsProps) {
  const handleButtonClick = (e: ReactMouseEvent<HTMLButtonElement> | ReactTouchEvent<HTMLButtonElement>, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };
  /*
  const buttonBaseClass = `
    p-1.5 text-black hover:text-black rounded text-sm 
    hover:bg-gray-100 active:bg-gray-200 transition-colors touch-none select-none
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
  `;
  */
  const buttonBaseClass = `
    p-1.5 rounded text-sm bg-blue-100
    text-black
    hover:bg-blue-300
    active:bg-blue-300 
    transition-colors touch-none select-none
    focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
  `;
  return (
    <div 
      role="toolbar"
      aria-label={`Controls for ${value.title}`}
      onTouchStart={(e: ReactTouchEvent) => e.stopPropagation()}
      onClick={(e: ReactMouseEvent) => e.stopPropagation()}
    >
      <div className="flex gap-1.5" role="group" aria-label="Card actions">
        <button
          type="button"
          onClick={e => handleButtonClick(e, () => onToggleExpand?.())}
          onTouchStart={e => handleButtonClick(e, () => onToggleExpand?.())}
          className={buttonBaseClass}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} card details`}
          aria-expanded={isExpanded}
          aria-controls={`description-${value.id}`}
        >
          <span className="inline-block w-4 text-center" aria-hidden="true">
            {isExpanded ? '▼' : '▶︎'}
          </span>
        </button>

        {onMoveUp && <button type="button" onClick={e => handleButtonClick(e, onMoveUp)} onTouchStart={e => handleButtonClick(e, onMoveUp)} className={buttonBaseClass} aria-label={`Move ${value.title} up in ${currentCategory}`}>
          <span className="inline-block w-4 text-center" aria-hidden="true">
            ↑
          </span>
        </button>}

        {onMoveDown && <button type="button" onClick={e => handleButtonClick(e, onMoveDown)} onTouchStart={e => handleButtonClick(e, onMoveDown)} className={buttonBaseClass} aria-label={`Move ${value.title} down in ${currentCategory}`}>
          <span className="inline-block w-4 text-center" aria-hidden="true">
            ↓
          </span>
        </button>}

        {currentCategory && <button type="button" id={`options-${value.id}`} onClick={e => handleButtonClick(e, onShowMoveOptions)} onTouchStart={e => handleButtonClick(e, onShowMoveOptions)} className={buttonBaseClass} aria-label={`Show move options for ${value.title}`} aria-haspopup="true">
          <span className="inline-block w-4 text-center" aria-hidden="true">
            ⋮
          </span>
        </button>}
      </div>
    </div>);
}