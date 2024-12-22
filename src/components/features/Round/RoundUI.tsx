'use client';

import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { saveRound, updateSession, saveCompletedSession } from "@/lib/db/indexedDB";
import Results from "@/components/features/Exercise/components/Results";
import { useSession } from "@/components/features/Exercise/hooks/useSession";
import { useGameState } from "@/components/features/Exercise/hooks/useGameState";
import { useCommands } from "@/components/features/Exercise/hooks/useCommands";
import { RoundHeader } from './RoundHeader';
import { RoundActions } from './RoundActions';
import { CategoryGrid } from './CategoryGrid';
import { getImportantCards } from "@/components/features/Categories/utils/categoryUtils";
import { useRoundState } from './hooks/useRoundState';
import { useRoundHandlers } from './hooks/useRoundHandlers';
import { useRoundValidation } from './hooks/useRoundValidation';
import { useRoundStatus } from './hooks/useRoundStatus';
import { getRandomValues } from "@/components/features/Home/utils";
import { Categories, CategoryName, Value, ValueWithReason } from "@/lib/types";
import { StatusMessage } from './components/StatusMessage';
import { getCategoriesForRound } from "@/components/features/Categories/utils/categoryUtils";
import { MobileCategoryList } from './components/MobileCategoryList';
import { CoreValueReasoning } from "@/components/features/Exercise/components/CoreValueReasoning";
import { logRender, logStateUpdate, logEffect } from "@/lib/utils";

import { useMobile } from "@/lib/contexts/MobileContext";
import { Card } from "@/components/features/Cards/components";
import { motion } from 'framer-motion';
import { MoveCommand } from "@/components/features/Exercise/commands/MoveCommand";

/**
 * `RoundUI` is a memoized functional component that represents the user interface for a round in the Core Values Sorting Exercise.
 * It manages the state and behavior of the game, including handling card movements, validating rounds, and transitioning between rounds.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <RoundUI />
 * 
 * @remarks
 * This component uses various hooks to manage state and side effects, including:
 * - `useState` for managing local state variables.
 * - `useMemo` for memoizing calculations.
 * - `useCallback` for memoizing event handlers.
 * - `useEffect` for handling side effects.
 * 
 * The component conditionally renders different UI elements based on the current state, such as showing reasoning or results screens.
 * It also includes handlers for moving cards, dropping cards, and proceeding to the next round.
 * 
 * @hook
 * - `useSession` to access session-related data.
 * - `useGameState` to access game state data.
 * - `useCommands` to manage round commands.
 * - `useMobile` to determine if the user is on a mobile device.
 * - `useRoundState` to calculate the current state of the round.
 * - `useRoundValidation` to validate the current round.
 * - `useRoundStatus` to get the status of the current round.
 * - `useRoundHandlers` to get handlers for card movements and drops.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.isMobile - Indicates if the user is on a mobile device.
 * @param {Value | null} props.selectedMobileCard - The currently selected card on mobile.
 * @param {boolean} props.hasShownInstruction - Indicates if the instruction has been shown on mobile.
 * @param {boolean} props.showStatusDetails - Indicates if the status message details should be shown.
 * @param {CategoryName | null} props.activeDropZone - The currently active drop zone.
 * @param {boolean} props.showResults - Indicates if the results screen should be shown.
 * @param {boolean} props.shouldEndGame - Indicates if the game should end.
 * @param {boolean} props.showReasoning - Indicates if the reasoning screen should be shown.
 * @param {Value[]} props.finalValuesWithoutReasons - The final values without reasons.
 * @param {Function} props.setActiveDropZone - Sets the active drop zone.
 * @param {Function} props.setShowResults - Sets the show results state.
 * @param {Function} props.setShouldEndGame - Sets the should end game state.
 * @param {Function} props.setShowReasoning - Sets the show reasoning state.
 * @param {Function} props.setFinalValuesWithoutReasons - Sets the final values without reasons.
 * @param {Function} props.setSelectedMobileCard - Sets the selected mobile card.
 * @param {Function} props.setHasShownInstruction - Sets the has shown instruction state.
 * @param {Function} props.setShowStatusDetails - Sets the show status details state.
 * @param {Function} props.setRoundNumber - Sets the round number.
 * @param {Function} props.setCategories - Sets the categories.
 * @param {Function} props.setRemainingCards - Sets the remaining cards.
 * @param {Function} props.addCommand - Adds a command to the current round commands.
 * @param {Function} props.clearCommands - Clears the current round commands.
 * @param {Function} props.handleMoveCard - Handles moving a card within a category.
 * @param {Function} props.handleDrop - Handles dropping a card into a category.
 * @param {Function} props.handleMoveBetweenCategories - Handles moving a card between categories.
 * @param {Function} props.handleMobileDropWithZone - Handles dropping a card into a category on mobile.
 * @param {Function} props.handleNextRound - Handles proceeding to the next round.
 * @param {Function} props.handleReasoningComplete - Handles completing the reasoning step.
 */
const RoundUI = memo(function RoundUI() {
  logRender('RoundUI');

  // State
  const [activeDropZone, setActiveDropZone] = useState<CategoryName | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [shouldEndGame, setShouldEndGame] = useState<boolean>(false);
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const [finalValuesWithoutReasons, setFinalValuesWithoutReasons] = useState<Value[]>([]);
  const [selectedMobileCard, setSelectedMobileCard] = useState<Value | null>(null);
  const [hasShownInstruction, setHasShownInstruction] = useState<boolean>(false);
  const [showStatusDetails, setShowStatusDetails] = useState(true); // New state for status message visibility

  // Hooks
  const {
    sessionId,
    roundNumber,
    targetCoreValues,
    setRoundNumber
  } = useSession();
  const {
    remainingCards,
    categories,
    setCategories,
    setRemainingCards
  } = useGameState();
  const {
    currentRoundCommands,
    addCommand,
    clearCommands
  } = useCommands();
  const {
    isMobile
  } = useMobile();

  // Memoized calculations
  const activeCards = useMemo(() => {
    logEffect('Calculate activeCards', [categories]);
    return Object.entries(categories).filter(([category]) => category !== 'Not Important').reduce((sum, [_, cards]) => {
      return sum + ((cards as Array<any>)?.length || 0); // Replace `any` with the appropriate type if known
    }, 0);
  }, [categories]);
  const roundState = useRoundState(categories, remainingCards, targetCoreValues);
  const validateRound = useRoundValidation({
    remainingCards,
    targetCoreValues,
    hasMinimumNotImportant: roundState.hasMinimumNotImportant,
    hasEnoughCards: roundState.hasEnoughCards,
    isNearingCompletion: roundState.isNearingCompletion,
    veryImportantCount: roundState.veryImportantCount,
    totalActiveCards: roundState.totalActiveCards,
    categories
  });
  
  const hasTargetCoreValuesInVeryImportant = useMemo(() => {
    return roundState.veryImportantCount === targetCoreValues;
  }, [roundState.veryImportantCount, targetCoreValues]);
  const status = useRoundStatus({
    remainingCards,
    targetCoreValues,
    hasMinimumNotImportant: roundState.hasMinimumNotImportant,
    hasEnoughCards: roundState.hasEnoughCards,
    isNearingCompletion: roundState.isNearingCompletion,
    veryImportantCount: roundState.veryImportantCount,
    totalActiveCards: activeCards,
    hasTargetCoreValuesInVeryImportant,
    categories
  });

  // Handlers
  const {
    handleMoveCard,
    handleDrop,
    handleMoveBetweenCategories
  } = useRoundHandlers(categories, setCategories, remainingCards, setRemainingCards, roundState.validCategories, roundState.activeCategories, sessionId, roundNumber, currentRoundCommands, addCommand, clearCommands, targetCoreValues, setRoundNumber, setShowResults, setShowStatusDetails);
  const handleMobileDropWithZone = useCallback((card: Value, category: CategoryName) => {
    logStateUpdate('handleMobileDropWithZone', {
      card,
      category
    }, 'RoundUI');
    setActiveDropZone(category);
    handleDrop(card, category);
    setSelectedMobileCard(null);
    setHasShownInstruction(true); // Add this line
    setTimeout(() => setActiveDropZone(null), 1000);
  }, [handleDrop]);
  const handleNextRound = useCallback(async () => {
    try {
      logStateUpdate('handleNextRound', {
        roundNumber
      }, 'RoundUI');
      if (!validateRound()) {
        console.error('Cannot proceed: round validation failed');
        return;
      }
      if (sessionId) {
        await saveRound(sessionId, roundNumber, currentRoundCommands, categories);
      }

      // Check if we have exactly the target number in Very Important
      // const hasExactTargetInVeryImportant = (categories['Very Important']?.length || 0) === targetCoreValues;
      if (shouldEndGame) {
        if (sessionId) {
          const finalValues = categories['Very Important'] || [];
          await updateSession(sessionId, {
            remainingValues : finalValues
          });          
          setFinalValuesWithoutReasons(finalValues);
          setShowReasoning(true);
          return;
        }
      }

      // If not ending game, prepare for next round
      // Get all cards from non-Not Important categories
      const cardsForNextRound = Object.entries(categories).filter(([category]) => category !== 'Not Important').flatMap(([_, cards]) => cards || []);
      if (cardsForNextRound.length < targetCoreValues) {
        console.error('Not enough cards to proceed');
        return;
      }

      clearCommands();
      const nextRound = roundNumber + 1;
      if (sessionId) {
        await updateSession(sessionId, {
          currentRound: nextRound,
          remainingValues : cardsForNextRound
        });
      }
      
      const nextCategories = getCategoriesForRound(cardsForNextRound.length, targetCoreValues);
      if (sessionId) {
        await saveRound(sessionId, nextRound, [], nextCategories);
      }
      setRoundNumber(nextRound);
      setCategories(nextCategories);
      setRemainingCards(getRandomValues(cardsForNextRound as Value[]));
    } catch (error) {
      console.error('Failed to handle next round:', error);
    }
  }, [validateRound, sessionId, roundNumber, currentRoundCommands, categories, shouldEndGame, targetCoreValues, clearCommands, setRoundNumber, setCategories, setRemainingCards]);
  
  const handleReasoningComplete = useCallback(async (valuesWithReasons: ValueWithReason[]) => {
    logStateUpdate('handleReasoningComplete', {
      valuesWithReasons
    }, 'RoundUI');
    if (sessionId) {
      const session = {
        timestamp: Date.now(),
        targetCoreValues,
        currentRound: roundNumber,
        completed: true
      };
      await updateSession(sessionId, session);
      await saveCompletedSession(sessionId, valuesWithReasons);
    }
    const finalCategories = Object.entries(categories).filter(([category]) => category !== 'Not Important').reduce((acc, [category, cards]) => {
      acc[category] = cards as Value[] | undefined;
      return acc;
    }, {} as Categories);
    setCategories(finalCategories);
    setShowReasoning(false);
    setShowResults(true);
  }, [sessionId, targetCoreValues, roundNumber, categories, setCategories]);

  // Effects
  useEffect(() => {
    // Only end game if we have exactly the target number in Very Important
    const hasExactTargetInVeryImportant = (categories['Very Important']?.length || 0) === targetCoreValues;
    setShouldEndGame(hasExactTargetInVeryImportant && remainingCards.length === 0);
  }, [categories, targetCoreValues, remainingCards.length]);

  // Conditional rendering
  if (showReasoning) {
    return <CoreValueReasoning values={finalValuesWithoutReasons} onComplete={handleReasoningComplete} />;
  }
  if (showResults) {
    return <Results />;
  }
  return <div className={`
        flex flex-col h-full overflow-hidden
        ${isMobile && selectedMobileCard ? 'bg-gray-100' : ''}
        transition-colors duration-200
      `} role="application" aria-label="Core Values Sorting Exercise">
    {/* Game Header - Stays visible but faded when card selected */}
    <div className="flex-shrink-0 relative" // Added relative positioning
      role="banner">
      {/* Selection instruction overlay */}
      {isMobile && selectedMobileCard && !hasShownInstruction && <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 text-center" aria-live="polite">
        <p className="text-sm text-blue-700 font-medium bg-white/90 py-1 px-2 rounded-full inline-block">
          Tap a category to place this card
        </p>
      </div>}

      <div className={`
        transition-opacity duration-200
        ${isMobile && selectedMobileCard ? 'opacity-30' : 'opacity-100'}
      `}>
        <RoundHeader targetCoreValues={targetCoreValues} roundNumber={roundNumber} remainingCardsCount={remainingCards.length} />
      </div>
    </div>

    {/* Game Actions - Card remains visible when selected */}
    <div className={`
          flex-shrink-0
          ${isMobile && selectedMobileCard ? 'relative z-20' : ''}
        `} role="region" aria-label="Game controls">
      {isMobile ? <div className="px-2 py-1 mb-4">
        <div className="flex items-center justify-center gap-4"> {/* Changed to horizontal layout with center alignment */}
          <div className="flex-1" /> {/* Spacer */}
          <RoundActions remainingCards={remainingCards} canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant} onNextRound={handleNextRound} onDrop={handleDrop} isEndGame={shouldEndGame} selectedMobileCard={selectedMobileCard} onMobileCardSelect={setSelectedMobileCard} setShowDetails={setShowStatusDetails} />
          <div role="status" aria-live="polite" className={`
          transition-opacity duration-200 flex-1 flex justify-end
          ${selectedMobileCard ? 'opacity-30' : 'opacity-100'}
        `}>
            <StatusMessage status={status()} isNearingCompletion={roundState.isNearingCompletion} 
            hasTooManyImportantCards={roundState.hasTooManyImportantCards} hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards} 
            hasEnoughCards={roundState.hasEnoughCards} targetCoreValues={targetCoreValues} canProceedToNextRound={validateRound()} 
            remainingCards={remainingCards} showDetails={showStatusDetails} setShowDetails={setShowStatusDetails} 
            totalActiveCards={activeCards} hasTargetCoreValuesInVeryImportant={hasTargetCoreValuesInVeryImportant} />
          </div>
        </div>
      </div> : <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4" role="region" aria-label="Game controls and status">
          <div /> {/* Empty first column */}
          <div> {/* Middle column */}
            <RoundActions remainingCards={remainingCards} canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant} onNextRound={handleNextRound} onDrop={handleDrop} isEndGame={shouldEndGame} />
          </div>
          <div> {/* Third column */}
            <StatusMessage status={status()} totalActiveCards={activeCards} hasTargetCoreValuesInVeryImportant={hasTargetCoreValuesInVeryImportant} isNearingCompletion={roundState.isNearingCompletion} hasTooManyImportantCards={roundState.hasTooManyImportantCards} hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards} hasEnoughCards={roundState.hasEnoughCards} targetCoreValues={targetCoreValues} canProceedToNextRound={validateRound()} remainingCards={remainingCards} />
          </div>
        </div>
      </div>}
    </div>

    {/* Scrollable Game Content */}
    <div className="flex-1 overflow-auto" role="region" aria-label="Value categories">
      {isMobile ? <div className="h-full flex flex-col pb-16 pt-4"> {/* Added pt-2 for top padding */}
        <MobileCategoryList categories={roundState.visibleCategories} activeDropZone={activeDropZone} onDrop={handleMobileDropWithZone} onMoveWithinCategory={handleMoveCard} onMoveBetweenCategories={handleMoveBetweenCategories} selectedCard={selectedMobileCard} onCardSelect={setSelectedMobileCard} />
      </div> : <div className="w-full">
        <CategoryGrid categories={roundState.visibleCategories} onDrop={handleDrop} onMoveWithinCategory={handleMoveCard} onMoveBetweenCategories={handleMoveBetweenCategories} />
      </div>}
    </div>
  </div>;
});
export default RoundUI;