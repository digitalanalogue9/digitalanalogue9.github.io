import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';

interface MobileCardControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveToPrevCategory: boolean;
  canMoveToNextCategory: boolean;
  onMoveToPrevCategory: () => void;
  onMoveToNextCategory: () => void;
}

export function MobileCardControls({ 
  canMoveUp, 
  canMoveDown, 
  onMoveUp, 
  onMoveDown,
  canMoveToPrevCategory,
  canMoveToNextCategory,
  onMoveToPrevCategory,
  onMoveToNextCategory
}: MobileCardControlsProps) {
  return (
    <div className="flex justify-end gap-2 mt-2 px-2">
      <div className="flex flex-col gap-1">
        {canMoveToPrevCategory && (
          <button
            onClick={onMoveToPrevCategory}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
            aria-label="Move to previous category"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {canMoveUp && (
          <button
            onClick={onMoveUp}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Move up within category"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>
        )}
        {canMoveDown && (
          <button
            onClick={onMoveDown}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Move down within category"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {canMoveToNextCategory && (
          <button
            onClick={onMoveToNextCategory}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
            aria-label="Move to next category"
          >
            <ArrowDownIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
