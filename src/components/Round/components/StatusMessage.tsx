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
      <p className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} font-medium`}>
        {status.text}
      </p>
      {isNearingCompletion && (hasTooManyImportantCards || hasNotEnoughImportantCards) && (
        <p className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          You need exactly {targetCoreValues} values in Very Important
        </p>
      )}
      {!hasEnoughCards && (
        <p className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
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
      {messageContent}
    </div>
  );
};
