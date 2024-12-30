// src/components/Round/components/StatusMessage.tsx
'use client';

import { ReactNode } from 'react';
import { StatusMessageProps } from './types';
import { useMobile } from "@/components/common/MobileProvider";

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
  const { isMobile } = useMobile();
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
      <button type="button" onClick={handleButtonClick} className={`
            w-16 h-16 rounded-full p-2 flex items-center justify-center
            ${!canProceedToNextRound && remainingCards.length === 0 ? 'bg-red-100 text-red-800' : status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${status.type === 'warning' ? 'focus:ring-yellow-500' : status.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-blue-500'}
          `} aria-expanded={showDetails} aria-controls="status-details" aria-label={`Game status: ${status.text}. ${showDetails ? 'Hide details' : 'Show details'}`}>
        <span aria-hidden="true">
          {status.type === 'warning' ? '⚠️' : status.type === 'success' ? '✅' : 'ℹ️'}
        </span>
        <span className="sr-only">{status.text}</span>
      </button>

      {showDetails && <div className="absolute right-0 top-full mt-2 z-50 w-64 p-4 rounded-lg shadow-lg bg-white border" id="status-details" role="tooltip" aria-label="Status details">
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