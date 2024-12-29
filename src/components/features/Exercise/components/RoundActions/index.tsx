// src/components/Round/RoundActions.tsx
import { CategoryName } from "@/lib/types";
import { Card } from "@/components/features/Cards/components";
import { RoundActionsPropsWithActiveZone } from './types';
import { useMobile } from "@/lib/contexts/MobileContext";

/**
 * Component that renders actions for the current round in the game.
 */
export function RoundActions({
  remainingCards,
  canProceedToNextRound,
  onNextRound,
  onDrop,
  isEndGame,
  onActiveDropZoneChange,
  selectedMobileCard,
  onMobileCardSelect,
  setShowDetails
}: RoundActionsPropsWithActiveZone) {
  const {
    isMobile
  } = useMobile();
  const currentCard = remainingCards.length > 0 ? remainingCards[0] : null;
  const handleCardClick = () => {
    if (isMobile) {
      setShowDetails?.(false);
      onMobileCardSelect?.(currentCard);
    }
  };
  if (!currentCard) {
    return <div className="h-24 sm:h-48 flex items-center justify-center" role="region" aria-label="Round progression">
      <div className="flex justify-center mt-4">
        <button onClick={onNextRound} disabled={!canProceedToNextRound} className={`
              ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-6 py-2 text-base'}
              rounded-md text-white font-medium
              ${canProceedToNextRound ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `} aria-label={isEndGame ? 'Complete exercise' : 'Proceed to next round'}>
          {isEndGame ? 'Finish' : 'Next Round'}
        </button>
      </div>
    </div>;
  }
  if (isMobile) {
    return <div className="flex flex-col items-center h-32 mb-2" role="region" aria-label="Current value card">
      <div className={`
            flex items-center justify-center cursor-pointer
            transform transition-all duration-200
            scale-[0.7]
          `} role="button" tabIndex={0} onClick={handleCardClick} onKeyPress={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }} aria-label={`${selectedMobileCard ? 'Selected card' : 'Select card'}: ${currentCard.title}`}>
        <Card value={currentCard} onClick={handleCardClick} selectedMobileCard={!!selectedMobileCard} // Add this line
        />
      </div>
    </div>;
  }
  return <div className="flex flex-col items-center h-48" role="region" aria-label="Current value card">
    <div className="flex items-center justify-center h-full" aria-live="polite">
      <Card value={currentCard} onDrop={value => onDrop(value, value.sourceCategory as CategoryName)} onActiveDropZoneChange={onActiveDropZoneChange} />
    </div>
  </div>;
}