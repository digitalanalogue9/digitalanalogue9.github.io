// src/components/Round/components/StatusMessage.tsx
'use client';

import { ReactNode } from 'react';
import { StatusMessageProps } from '@/components/features/Round/types';
import { useMobile } from "@/lib/contexts/MobileContext";
/**
 * StatusMessage component displays a status message with optional details.
 * It adapts its layout based on the device type (mobile or desktop).
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.status - The status object containing the status text and type.
 * @param {boolean} props.isNearingCompletion - Flag indicating if the task is nearing completion.
 * @param {boolean} props.hasTooManyImportantCards - Flag indicating if there are too many important cards.
 * @param {boolean} props.hasNotEnoughImportantCards - Flag indicating if there are not enough important cards.
 * @param {boolean} props.hasEnoughCards - Flag indicating if there are enough cards.
 * @param {number} props.targetCoreValues - The target number of core values.
 * @param {boolean} props.canProceedToNextRound - Flag indicating if the user can proceed to the next round.
 * @param {Array} props.remainingCards - The array of remaining cards.
 * @param {boolean} [props.showDetails=true] - Flag indicating if the details should be shown.
 * @param {number} props.totalActiveCards - The total number of active cards.
 * @param {boolean} props.hasTargetCoreValuesInVeryImportant - Flag indicating if the target core values are in the "Very Important" category.
 * @param {Function} props.setShowDetails - Function to toggle the visibility of the details.
 *
 * @returns {ReactNode} The rendered StatusMessage component.
 */
export const StatusMessage = ({
  status,
  isNearingCompletion,
  hasTooManyImportantCards,
  hasNotEnoughImportantCards,
  hasEnoughCards,
  targetCoreValues,
  canProceedToNextRound,
  remainingCards,
  showDetails = true,
  totalActiveCards,
  hasTargetCoreValuesInVeryImportant,
  setShowDetails
}: StatusMessageProps): ReactNode => {
  const {
    isMobile
  } = useMobile();
  const handleButtonClick = () => {
    if (setShowDetails) {
      setShowDetails(!showDetails); // Toggle the details visibility
    }
  };
  const messageContent = <div role="status">
    <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium leading-tight text-center`} aria-live="polite">
      {status.text}
    </p>
    {isNearingCompletion && (hasTooManyImportantCards || hasNotEnoughImportantCards) && <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight text-center`} aria-live="polite">
      You need exactly {targetCoreValues} values in Very Important
    </p>}
    {totalActiveCards === targetCoreValues && !hasTargetCoreValuesInVeryImportant && (
      <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight text-center`} aria-live="polite">
        You need exactly {targetCoreValues} values in Very Important
      </p>
    )}
    {!hasEnoughCards && <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight text-center`} aria-live="polite">
      You must keep at least {targetCoreValues} values outside of Not Important
    </p>}
  </div>;
  if (isMobile) {
    return <div className="relative" role="status" aria-live="polite">
      <button onClick={handleButtonClick} className={`
            rounded-full p-2 flex items-center justify-center
            ${!canProceedToNextRound && remainingCards.length === 0 ? 'bg-red-100 text-red-800' : status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${status.type === 'warning' ? 'focus:ring-yellow-500' : status.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-blue-500'}
          `} aria-expanded={showDetails} aria-label={`Game status: ${status.text}. ${showDetails ? 'Hide details' : 'Show details'}`}>
        <span aria-hidden="true">
          {status.type === 'warning' ? '⚠️' : status.type === 'success' ? '✅' : 'ℹ️'}
        </span>
        <span className="sr-only">{status.text}</span>
      </button>

      {showDetails && <div className="absolute right-0 top-full mt-2 z-50 w-64 p-4 rounded-lg shadow-lg bg-white border" role="tooltip" aria-label="Status details">
        {messageContent}
      </div>}
    </div>;
  }

  // Desktop version - always show
  return <div className={`
        relative
        p-3 sm:p-4
        min-h-[5rem]
        h-full
        w-full
        flex flex-col justify-center 
        rounded-lg 
        overflow-hidden
        ${!canProceedToNextRound && remainingCards.length === 0 ? 'bg-red-100 text-red-800' : status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
      `} role="status" aria-live="polite">
    <div className="space-y-1">
      {messageContent}
    </div>
  </div>;
};