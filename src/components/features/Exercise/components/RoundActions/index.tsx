// src/components/Round/RoundActions.tsx
import { CategoryName } from '@/lib/types';
import { Card } from '@/components/features/Cards/components';
import { RoundActionsPropsWithActiveZone } from './types';
import { useMobile } from '@/lib/contexts/MobileContext';
import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';

/**
 * Component that renders actions for the current round in the game.
 */
export function RoundActions({
  remainingCards,
  targetCoreValues,
  canProceedToNextRound,
  onNextRound,
  onEarlyFinish,
  onDrop,
  isEndGame,
  onActiveDropZoneChange,
  selectedMobileCard,
  onMobileCardSelect,
  setShowDetails,
}: RoundActionsPropsWithActiveZone) {
  const [showFinishModal, setShowFinishModal] = useState(false);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  const currentCard = remainingCards.length > 0 ? remainingCards[0] : null;
  const handleCardClick = () => {
    if (isMobile) {
      setShowDetails?.(false);
      onMobileCardSelect?.(currentCard);
    }
  };

  // Add this function
  const handleFinishClick = () => {
    setShowFinishModal(true);
  };

  if (!currentCard) {
    return (
      <>
        <div className="flex h-44 items-center justify-center" role="region" aria-label="Round progression">
          <div className="flex flex-col space-y-2">
            <button
              onClick={onNextRound}
              disabled={!canProceedToNextRound}
              className={` ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-6 py-2 text-base'} rounded-md font-medium text-white ${canProceedToNextRound ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label={isEndGame ? 'Complete exercise' : 'Proceed to next round'}
            >
              {isEndGame ? 'Finish' : 'Next Round'}
            </button>
            {!isEndGame && (
              <button
                onClick={handleFinishClick}
                disabled={!canProceedToNextRound}
                className={` ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-6 py-2 text-base'} rounded-md font-medium text-white ${canProceedToNextRound ? 'bg-gray-600 hover:bg-gray-700' : 'cursor-not-allowed bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
              >
                Finish Early
              </button>
            )}
          </div>
        </div>
        <Modal
          isOpen={showFinishModal}
          onClose={() => setShowFinishModal(false)}
          title="Are you sure you want to finish the exercise early? "
        >
          <div className="space-y-4">
            <div className={`${styles.paragraph} text-black`}>
              This will:
              <ul className={`${styles.paragraph} list-disc space-y-2 pl-5`}>
                <li>
                  Select the top {targetCoreValues} cards from your highest priority categories (you may want to cancel
                  finishing early and move the card order around)
                </li>
                <li>Move all other cards to Not Important</li>
              </ul>
            </div>
            <div className={`${styles.paragraph} text-black`}>
              If you want to continue normally instead:
              <ul className={`${styles.paragraph} list-disc space-y-2 pl-5`}>
                <li>Click &quot;Cancel&quot; to close this dialog</li>
                <li>Click &quot;Next Round&quot; to continue with a reduced set of cards (discarding Not Important cards)</li>
                <li>Use the &quot;Replay Previous&quot; button to quickly sort remaining cards</li>
              </ul>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowFinishModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onEarlyFinish();
                  setShowFinishModal(false);
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
  if (isMobile) {
    return (
      <div className="flex h-44 flex-col items-center" role="region" aria-label="Current value card">
        <div
          className={`flex scale-[0.7] transform cursor-pointer items-center justify-center transition-all duration-200`}
          role="button"
          tabIndex={0}
          onClick={handleCardClick}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCardClick();
            }
          }}
          aria-label={`${selectedMobileCard ? 'Selected card' : 'Select card'}: ${currentCard.title}`}
        >
          <Card
            value={currentCard}
            onClick={handleCardClick}
            selectedMobileCard={!!selectedMobileCard} // Add this line
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-44 flex-col items-center" role="region" aria-label="Current value card">
      <div className="flex h-full items-center justify-center" aria-live="polite">
        <Card
          value={currentCard}
          onDrop={(value) => onDrop(value, value.sourceCategory as CategoryName)}
          onActiveDropZoneChange={onActiveDropZoneChange}
        />
      </div>
    </div>
  );
}
