import { Value, CategoryName } from '@/types';
import { Card } from '@/components/Card';

interface RoundActionsProps {
  remainingCards: Value[];
  canProceedToNextRound: boolean;
  onNextRound: () => void;
  onDrop: (card: Value, category: CategoryName) => void;
  isEndGame: boolean;
}

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
    <div className="flex flex-col items-center gap-4">
      {currentCard && (
        <div className="mb-4">
          <Card
            value={currentCard}  
            onDrop={(value) => {
              onDrop(value, value.sourceCategory as CategoryName);
            }}
          />
        </div>
      )}

      {remainingCards.length === 0 && (
        <button
          onClick={onNextRound}
          disabled={!canProceedToNextRound}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            canProceedToNextRound
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isEndGame ? 'Finish' : 'Next Round'}
        </button>
      )}
    </div>
  );
}
