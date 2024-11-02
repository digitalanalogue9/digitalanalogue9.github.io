import { Card } from '@/components/Card';

import { RoundActionsProps } from './RoundActionsProps';

export function RoundActions({
  remainingCards,
  canProceedToNextRound,
  onNextRound,
  onDrop
}: RoundActionsProps) {
  return (
    <div className="h-[180px] flex flex-col items-center justify-center">
      {remainingCards.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="transform hover:scale-105 transition-transform">
            <Card
              value={remainingCards[0]}
              columnIndex={undefined}
              onDrop={() => { }}
              currentCategory={undefined}
            />
          </div>
        </div>
      ) : canProceedToNextRound ? (
        <div className="text-center">
          <button
            onClick={onNextRound}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Next Round
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button disabled
            onClick={onNextRound}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Next Round
          </button>
        </div>
      )}
    </div>
  );
}
