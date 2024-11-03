import { Card } from '@/components/Card';

import { RoundActionsProps } from './RoundActionsProps';

export const RoundActions: React.FC<RoundActionsProps> = ({
  remainingCards,
  canProceedToNextRound,
  onNextRound,
  onDrop,
  isEndGame
}) => {
  console.log('RoundActions isEndGame:', isEndGame); // Debug log

  return (
    <button
      onClick={onNextRound}
      disabled={!canProceedToNextRound}
      className={`
        px-6 py-3
        rounded-lg
        font-medium
        transition-colors
        ${canProceedToNextRound
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
      `}
    >
      {isEndGame ? 'End Game' : 'Next Round'}
    </button>
  );
};

