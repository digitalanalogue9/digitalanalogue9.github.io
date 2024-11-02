// CardControls.tsx
import { Value } from '@/types';
import { CardControlsProps } from './types';

interface ExtendedCardControlsProps extends CardControlsProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function CardControls({
  onMoveUp,
  onMoveDown,
  onShowMoveOptions,
  currentCategory,
  isExpanded,
  onToggleExpand,
  value  // Add this prop
}: ExtendedCardControlsProps & { value: Value }) {  // Add Value to props
  return (
    <div className="flex gap-0 items-center text-gray-600">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand?.();
        }}
        className="p-1 hover:text-gray-900 rounded text-xs 
                 hover:bg-gray-100 transition-colors"
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        {isExpanded ? '▼' : '▶'}
      </button>
      {onMoveUp && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="p-1 hover:text-gray-900 rounded text-xs 
                   hover:bg-gray-100 transition-colors"
          aria-label="Move Up"
        >
          ↑
        </button>
      )}
      {onMoveDown && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="p-1 hover:text-gray-900 rounded text-xs 
                   hover:bg-gray-100 transition-colors"
          aria-label="Move Down"
        >
          ↓
        </button>
      )}
      {currentCategory && (
        <button
          id={`options-${value.id}`}  // Add this id
          onClick={(e) => {
            e.stopPropagation();
            onShowMoveOptions();
          }}
          className="p-1 hover:text-gray-900 rounded text-xs 
                   hover:bg-gray-100 transition-colors"
        >
          ⋮
        </button>
      )}
    </div>
  );
}
