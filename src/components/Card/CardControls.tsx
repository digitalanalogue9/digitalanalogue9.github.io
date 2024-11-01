import { CardControlsProps } from './types';

export function CardControls({
  onMoveUp,
  onMoveDown,
  onShowMoveOptions,
  currentCategory
}: CardControlsProps) {
  return (
    <div className="flex gap-1">
      {onMoveUp && (
        <button
          onClick={onMoveUp}
          className="p-1 text-gray-600 hover:text-gray-800 rounded"
          aria-label="Move Up"
        >
          ↑
        </button>
      )}
      {onMoveDown && (
        <button
          onClick={onMoveDown}
          className="p-1 text-gray-600 hover:text-gray-800 rounded"
          aria-label="Move Down"
        >
          ↓
        </button>
      )}
      {currentCategory && (
        <button
          onClick={onShowMoveOptions}
          className="p-1 text-gray-600 hover:text-gray-800 rounded"
        >
          ⋮
        </button>
      )}
    </div>
  );
}
