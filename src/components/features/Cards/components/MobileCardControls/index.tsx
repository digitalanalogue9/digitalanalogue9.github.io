import { ChevronUpIcon, ChevronDownIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

import { MobileCardControlsProps } from './types';

/**
 * MobileCardControls component provides a set of controls for navigating and moving items within and across categories.
 */
export function MobileCardControls({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  canMoveToPrevCategory,
  canMoveToNextCategory,
  onMoveToPrevCategory,
  onMoveToNextCategory,
}: MobileCardControlsProps) {
  return (
    <div className="mt-2 flex justify-end gap-2 px-2">
      <div className="flex flex-col gap-1">
        {canMoveToPrevCategory && (
          <button
            onClick={onMoveToPrevCategory}
            className="rounded-full bg-blue-100 p-2 text-blue-800 hover:bg-blue-200"
            aria-label="Move to previous category"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {canMoveUp && (
          <button
            onClick={onMoveUp}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
            aria-label="Move up within category"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        )}
        {canMoveDown && (
          <button
            onClick={onMoveDown}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
            aria-label="Move down within category"
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {canMoveToNextCategory && (
          <button
            onClick={onMoveToNextCategory}
            className="rounded-full bg-blue-100 p-2 text-blue-800 hover:bg-blue-200"
            aria-label="Move to next category"
          >
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
