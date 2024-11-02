import { CardControlsProps } from './types';

export function CardControls({
  onMoveUp,
  onMoveDown,
  onShowMoveOptions,
  currentCategory
}: CardControlsProps) {
  return (
    <div className="flex gap-0.5 sm:gap-1 mt-1 sm:mt-2">
      {onMoveUp && (
        <button
          onClick={onMoveUp}
          className="p-1 text-gray-600 hover:text-gray-800 rounded text-xs sm:text-sm"
          aria-label="Move Up"
        >
          ↑
        </button>
      )}
      {onMoveDown && (
        <button
          onClick={onMoveDown}
          className="p-1 text-gray-600 hover:text-gray-800 rounded text-xs sm:text-sm"
          aria-label="Move Down"
        >
          ↓
        </button>
      )}
      {currentCategory && (
        <button
          onClick={onShowMoveOptions}
          className="p-1 text-gray-600 hover:text-gray-800 rounded text-xs sm:text-sm"
        >
          ⋮
        </button>
      )}
    </div>
  );
}
