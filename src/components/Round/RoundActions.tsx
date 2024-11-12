import { Value, CategoryName } from '@/types';
import { Card } from '@/components/Card';
import { RoundActionsProps } from './RoundActionsProps';
import { useMobile } from '@/contexts/MobileContext';

export function RoundActions({
  remainingCards,
  canProceedToNextRound,
  onNextRound,
  onDrop,
  isEndGame
}: RoundActionsProps) {

  // Make sure we display the first card if there are remaining cards
  const currentCard = remainingCards.length > 0 ? remainingCards[0] : null;
  const isMobile = useMobile();
  return (
    <div className="flex flex-col items-center h-24 sm:h-48">
      <div className="flex items-center justify-center h-full">
        {currentCard ? (
          <div className={isMobile ? 'scale-75' : 'scale-100'}>
            <Card
              value={currentCard}
              onDrop={(value) => onDrop(value, value.sourceCategory as CategoryName)}
            />
          </div>
        ) : (
          <button
            onClick={onNextRound}
            disabled={!canProceedToNextRound}
            className={`
              ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-6 py-2 text-base'}
              rounded-md text-white font-medium
              ${canProceedToNextRound
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isEndGame ? 'Finish' : 'Next Round'}
          </button>
        )}
      </div>
    </div>
  );
}
