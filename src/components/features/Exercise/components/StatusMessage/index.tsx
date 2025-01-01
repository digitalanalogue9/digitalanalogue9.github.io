// src/components/Round/components/StatusMessage.tsx
'use client';

import { ReactNode } from 'react';
import { StatusMessageProps } from './types';
import { useMobile } from '@/lib/contexts/MobileContext';

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
  setShowDetails,
}: StatusMessageProps): ReactNode => {
  const { isMobile } = useMobile();
  const handleButtonClick = () => {
    if (setShowDetails) {
      setShowDetails(!showDetails); // Toggle the details visibility
    }
  };
  const messageContent = (
    <div role="status">
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-center font-medium leading-tight`} aria-live="polite">
        {status.text}
      </p>
      {isNearingCompletion && (hasTooManyImportantCards || hasNotEnoughImportantCards) && (
        <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} text-center leading-tight`} aria-live="polite">
          You need exactly {targetCoreValues} values in Very Important
        </p>
      )}
      {totalActiveCards === targetCoreValues && !hasTargetCoreValuesInVeryImportant && (
        <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} text-center leading-tight`} aria-live="polite">
          You need exactly {targetCoreValues} values in Very Important
        </p>
      )}
      {!hasEnoughCards && (
        <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} text-center leading-tight`} aria-live="polite">
          You must keep at least {targetCoreValues} values outside of Not Important
        </p>
      )}
    </div>
  );
  if (isMobile) {
    return (
      <div className="relative" role="status" aria-live="polite">
        <button
          type="button"
          onClick={handleButtonClick}
          className={`flex h-16 w-16 items-center justify-center rounded-full p-2 ${!canProceedToNextRound && remainingCards.length === 0 ? 'bg-red-100 text-red-800' : status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${status.type === 'warning' ? 'focus:ring-yellow-500' : status.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-blue-500'} `}
          aria-expanded={showDetails}
          aria-controls="status-details"
          aria-label={`Game status: ${status.text}. ${showDetails ? 'Hide details' : 'Show details'}`}
        >
          <span aria-hidden="true">{status.type === 'warning' ? '⚠️' : status.type === 'success' ? '✅' : 'ℹ️'}</span>
          <span className="sr-only">{status.text}</span>
        </button>
        {showDetails && (
          <div
            className="absolute right-0 top-full z-50 w-64 rounded-lg border bg-white p-4 shadow-lg"
            id="status-details"
            role="tooltip"
            aria-label="Status details"
          >
            {messageContent}
          </div>
        )}
        <span className="text-xs text-black">Information</span>
      </div>
    );
  }

  // Desktop version - always show
  return (
    <div
      className={`relative flex h-full min-h-[5rem] w-full flex-col justify-center overflow-hidden rounded-lg p-3 sm:p-4 ${!canProceedToNextRound && remainingCards.length === 0 ? 'bg-red-100 text-red-800' : status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} `}
      role="status"
      aria-live="polite"
    >
      <div className="space-y-1">{messageContent}</div>
    </div>
  );
};
