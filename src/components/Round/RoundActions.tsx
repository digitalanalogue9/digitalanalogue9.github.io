import { Value, CategoryName } from '@/types';
import { Card } from '@/components/Card';
import { RoundActionsProps } from './RoundActionsProps';
import { useMobile } from '@/contexts/MobileContext';

interface RoundActionsPropsWithActiveZone extends RoundActionsProps {
  onActiveDropZoneChange?: (category: CategoryName | null) => void;
  selectedMobileCard?: Value | null;
  onMobileCardSelect?: (card: Value | null) => void;
}

export function RoundActions({
  remainingCards,
  canProceedToNextRound,
  onNextRound,
  onDrop,
  isEndGame,
  onActiveDropZoneChange,
  selectedMobileCard,
  onMobileCardSelect
}: RoundActionsPropsWithActiveZone) {
  const { isMobile } = useMobile();
  const currentCard = remainingCards.length > 0 ? remainingCards[0] : null;

  
  if (!currentCard) {
    return (
      <div 
        className="flex flex-col items-center h-24 sm:h-48"
        role="region"
        aria-label="Round progression"
      >
        <div className="flex items-center justify-center h-full">
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
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label={isEndGame ? 'Complete exercise' : 'Proceed to next round'}
          >
            {isEndGame ? 'Finish' : 'Next Round'}
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div 
        className="flex flex-col items-center h-32 mb-2"
        role="region"
        aria-label="Current value card"
      >
        {!selectedMobileCard && (
          <div 
            className="flex items-center justify-center cursor-pointer transform transition-transform active:scale-95 scale-[0.7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            role="button"
            tabIndex={0}
            onClick={() => onMobileCardSelect?.(currentCard)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onMobileCardSelect?.(currentCard);
              }
            }}
            aria-label={`Select value card: ${currentCard.title}`}
          >
            <Card value={currentCard} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center h-48"
      role="region"
      aria-label="Current value card"
    >
      <div 
        className="flex items-center justify-center h-full"
        aria-live="polite"
      >
        <Card
          value={currentCard}
          onDrop={(value) => onDrop(value, value.sourceCategory as CategoryName)}
          onActiveDropZoneChange={onActiveDropZoneChange}
        />
      </div>
    </div>
  );
}