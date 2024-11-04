import { Value, CategoryName } from '@/types';
import { Card } from '@/components/Card';
import { RoundActionsProps } from './RoundActionsProps';

export function RoundActions({
  remainingCards,
  canProceedToNextRound,
  onNextRound,
  onDrop,
  isEndGame
}: RoundActionsProps) {
  // Make sure we display the first card if there are remaining cards
  const currentCard = remainingCards.length > 0 ? remainingCards[0] : null;

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 h-32 sm:h-48"> {/* Adjusted height */}
      <div className="flex items-center justify-center h-full">
        {currentCard ? (
          <div className="scale-90 sm:scale-100"> {/* Scale down on small screens */}
            <Card
              value={currentCard}  
              onDrop={(value) => {
                onDrop(value, value.sourceCategory as CategoryName);
              }}
            />
          </div>
        ) : (
          <button
            onClick={onNextRound}
            disabled={!canProceedToNextRound}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-md text-white font-medium text-sm sm:text-base ${
              canProceedToNextRound
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isEndGame ? 'Finish' : 'Next Round'}
          </button>
        )}
      </div>
    </div>
  );
}
