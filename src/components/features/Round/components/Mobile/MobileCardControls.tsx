import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';

import { MobileCardControlsProps } from '@/components/features/Round/types';

/**
 * MobileCardControls component provides a set of controls for navigating and moving items within and across categories.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.canMoveUp - Indicates if the item can be moved up within the category.
 * @param {boolean} props.canMoveDown - Indicates if the item can be moved down within the category.
 * @param {Function} props.onMoveUp - Callback function to handle the move up action.
 * @param {Function} props.onMoveDown - Callback function to handle the move down action.
 * @param {boolean} props.canMoveToPrevCategory - Indicates if the item can be moved to the previous category.
 * @param {boolean} props.canMoveToNextCategory - Indicates if the item can be moved to the next category.
 * @param {Function} props.onMoveToPrevCategory - Callback function to handle the move to the previous category action.
 * @param {Function} props.onMoveToNextCategory - Callback function to handle the move to the next category action.
 *
 * @returns {JSX.Element} The rendered component.
 */
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
