import { ReactNode } from 'react';

interface StatusMessageProps {
  status: { text: string; type: 'info' | 'warning' | 'success' };
  isNearingCompletion: boolean;
  hasTooManyImportantCards: boolean;
  hasNotEnoughImportantCards: boolean;
  hasEnoughCards: boolean;
  targetCoreValues: number;
  canProceedToNextRound: boolean;
  remainingCards: any[];
}

export const StatusMessage = ({
  status,
  isNearingCompletion,
  hasTooManyImportantCards,
  hasNotEnoughImportantCards,
  hasEnoughCards,
  targetCoreValues,
  canProceedToNextRound,
  remainingCards
}: StatusMessageProps): ReactNode => (
  <div className={`
    p-4 sm:p-6
    min-h-[5rem] sm:h-28
    flex flex-col justify-center 
    rounded-lg 
    ${!canProceedToNextRound && remainingCards.length === 0
      ? 'bg-red-50 text-red-800'
      : status.type === 'warning'
        ? 'bg-yellow-100 text-yellow-800'
        : status.type === 'success'
          ? 'bg-green-100 text-green-800'
          : 'bg-blue-100 text-blue-800'
    }
  `}>
    <p className="text-base sm:text-lg font-medium">{status.text}</p>
    {isNearingCompletion && (hasTooManyImportantCards || hasNotEnoughImportantCards) && (
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm">
        You need exactly {targetCoreValues} values in Very Important
      </p>
    )}
    {!hasEnoughCards && (
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm">
        You must keep at least {targetCoreValues} values outside of Not Important
      </p>
    )}
  </div>
);
