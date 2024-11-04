import { ReactNode, useState, useEffect } from 'react';
import { StatusMessageProps } from './StatusMessageProps';

export const StatusMessage = ({
  status,
  isNearingCompletion,
  hasTooManyImportantCards,
  hasNotEnoughImportantCards,
  hasEnoughCards,
  targetCoreValues,
  canProceedToNextRound,
  remainingCards
}: StatusMessageProps): ReactNode => {
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const messageContent = (
    <>
      <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium leading-tight`}>
        {status.text}
      </p>
      {isNearingCompletion && (hasTooManyImportantCards || hasNotEnoughImportantCards) && (
        <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight`}>
          You need exactly {targetCoreValues} values in Very Important
        </p>
      )}
      {!hasEnoughCards && (
        <p className={`mt-1 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight`}>
          You must keep at least {targetCoreValues} values outside of Not Important
        </p>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`
            rounded-full p-2 flex items-center justify-center
            ${!canProceedToNextRound && remainingCards.length === 0
              ? 'bg-red-100 text-red-800'
              : status.type === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : status.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
            }
          `}
        >
          {status.type === 'warning' ? '⚠️' : status.type === 'success' ? '✅' : 'ℹ️'}
        </button>

        {showDetails && (
          <div className="absolute right-0 top-full mt-2 z-50 w-64 p-4 rounded-lg shadow-lg bg-white border">
            {messageContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`
      relative
      p-3 sm:p-4
      min-h-[5rem]
      h-auto
      flex flex-col justify-center 
      rounded-lg 
      overflow-hidden
      ${!canProceedToNextRound && remainingCards.length === 0
        ? 'bg-red-50 text-red-800'
        : status.type === 'warning'
          ? 'bg-yellow-100 text-yellow-800'
          : status.type === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
      }
    `}>
      <div className="space-y-1">
        {messageContent}
      </div>
    </div>
  );
};
