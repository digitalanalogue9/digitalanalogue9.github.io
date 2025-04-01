'use client';

import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { saveRound, updateSession, saveCompletedSession, getRound } from '@/lib/db/indexedDB';
import Results from '@/components/features/Exercise/components/Results';
import { useSession } from '@/components/features/Exercise/hooks/useSession';
import { useGameState } from '@/components/features/Exercise/hooks/useGameState';
import { useCommands } from '@/components/features/Exercise/hooks/useCommands';
import { RoundHeader } from '../RoundHeader';
import { RoundActions } from '../RoundActions';
import { getRandomValues } from '@/components/features/Home/utils';
import { Categories, CategoryName, Value, ValueWithReason } from '@/lib/types';
import { Category } from '@/lib/types/Category'; // Instead of from '@/lib/types'
import { getCategoriesForRound } from '@/components/features/Categories/utils/categoryUtils';
import { CoreValueReasoning } from '@/components/features/Exercise/components/CoreValueReasoning';
import { logRender, logStateUpdate, logEffect } from '@/lib/utils';
import { useMobile } from '@/lib/contexts/MobileContext';
import { useRoundState } from '../../hooks/useRoundState';
import { useRoundValidation } from '../../hooks/useRoundValidation';
import { useRoundStatus } from '../../hooks/useRoundStatus';
import { useRoundHandlers } from '../../hooks/useRoundHandlers';
import ReplayPreviousRound from '../ReplayPreviousRound';
import { StatusMessage } from '../StatusMessage';
import { MobileCategoryList } from '@/components/features/Categories/components/MobileCategoryList';
import { CategoryGrid } from '@/components/features/Categories/components/CategoryGrid';
import { MoveCommand } from '../../commands/MoveCommand';

/**
 * `RoundUI` is a memoized functional component that represents the user interface for a round in the Core Values Sorting Exercise.
 * It manages the state and behavior of the game, including handling card movements, validating rounds, and transitioning between rounds.
 *
 * @component
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
  const { sessionId, roundNumber, targetCoreValues, setRoundNumber } = useSession();
  const { remainingCards, categories, setCategories, setRemainingCards } = useGameState();
  const { currentRoundCommands, addCommand, clearCommands } = useCommands();
  const { isMobile } = useMobile();

  // Memoized calculations
  const activeCards = useMemo(() => {
    logEffect('Calculate activeCards', [categories]);
    return Object.entries(categories)
      .filter(([category]) => category !== 'Not Important')
      .reduce((sum, [_, cards]) => {
        return sum + ((cards as Array<unknown>)?.length || 0); 
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
    categories,
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
    categories,
  });

  // Handlers
  const { handleMoveCard, handleDrop, handleMoveBetweenCategories } = useRoundHandlers(
    categories,
    setCategories,
    remainingCards,
    setRemainingCards,
    roundState.validCategories,
    roundState.activeCategories,
    sessionId,
    roundNumber,
    currentRoundCommands,
    addCommand,
    clearCommands,
    targetCoreValues,
    setRoundNumber,
    setShowResults,
    setShowStatusDetails
  );
  const handleMobileDropWithZone = useCallback(
    (card: Value, category: CategoryName) => {
      logStateUpdate(
        'handleMobileDropWithZone',
        {
          card,
          category,
        },
        'RoundUI'
      );
      setActiveDropZone(category);
      handleDrop(card, category);
      setSelectedMobileCard(null);
      setHasShownInstruction(true); // Add this line
      setTimeout(() => setActiveDropZone(null), 1000);
    },
    [handleDrop]
  );

  const categoryNameToEnum = (name: CategoryName): Category => {
    switch (name) {
      case 'Very Important':
        return Category.VERY_IMPORTANT;
      case 'Quite Important':
        return Category.QUITE_IMPORTANT;
      case 'Important':
        return Category.IMPORTANT;
      case 'Of Some Importance':
        return Category.OF_SOME_IMPORTANCE;
      case 'Not Important':
        return Category.NOT_IMPORTANT;
      default:
        throw new Error(`Invalid category name: ${name}`);
    }
  };

  const handleEarlyFinish = useCallback(async () => {
    try {
      // Helper function to move a card between categories
      const moveCard = async (
        card: Value,
        fromCategory: CategoryName,
        toCategory: CategoryName,
        currentCategories: Categories
      ) => {
        // Skip if card is already in the target category
        if (fromCategory === toCategory) return currentCategories;

        // Get fresh state for each operation
        const fromCards = currentCategories[fromCategory] || [];
        const toCards = currentCategories[toCategory] || [];

        // Skip if card isn't in the source category
        if (!fromCards.some((c) => c.title === card.title)) return currentCategories;

        const command = new MoveCommand(card, fromCategory, toCategory);

        // Create new categories state with the move
        const updatedCategories = { ...currentCategories };

        // Remove from source category
        updatedCategories[fromCategory] = fromCards.filter((c) => c.title !== card.title);

        // Create the updated card with the new category
        const updatedCard = {
          ...card,
          category: categoryNameToEnum(toCategory),
        };

        // Add to destination category
        updatedCategories[toCategory] = [...toCards, updatedCard];

        // Add command and save to database
        await addCommand(command);

        const currentRound = await getRound(sessionId, roundNumber);
        const existingCommands = currentRound?.commands || [];
        await saveRound(sessionId, roundNumber, [...existingCommands, command], updatedCategories);

        return updatedCategories;
      };

      // First, collect cards from each category in priority order
      const categoryPriority: CategoryName[] = [
        'Very Important',
        'Quite Important',
        'Important',
        'Of Some Importance',
        'Not Important',
      ];

      const cardsToPromote: Value[] = [];
      const cardsToDemote: Value[] = [];

      // Collect cards while preserving their current categories
      for (const category of categoryPriority) {
        const cardsInCategory = (categories[category] || []).map((card) => ({
          ...card,
          category: categoryNameToEnum(category),
        }));

        if (category === 'Very Important') {
          // Keep all Very Important cards where they are
          cardsToPromote.push(...cardsInCategory);
        } else {
          const spaceLeft = targetCoreValues - cardsToPromote.length;
          if (spaceLeft > 0) {
            // Take cards up to the space left
            const [toPromote, toDemote] = [cardsInCategory.slice(0, spaceLeft), cardsInCategory.slice(spaceLeft)];
            cardsToPromote.push(...toPromote);
            cardsToDemote.push(...toDemote);
          } else {
            cardsToDemote.push(...cardsInCategory);
          }
        }
      }

      // Move cards to their final positions
      let currentCategories = { ...categories };

      // Process promotions
      for (const card of cardsToPromote) {
        currentCategories = await moveCard(card, card.category!, 'Very Important', currentCategories);
        setCategories(currentCategories);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Process demotions
      for (const card of cardsToDemote) {
        currentCategories = await moveCard(card, card.category!, 'Not Important', currentCategories);
        setCategories(currentCategories);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Update session with final values and show reasoning
      const finalValues = currentCategories['Very Important'] || [];
      await updateSession(sessionId, { remainingValues: finalValues });
      setFinalValuesWithoutReasons(finalValues);
      setShowReasoning(true);
    } catch (error) {
      console.error('Failed to handle early finish:', error);
    }
  }, [
    categories,
    targetCoreValues,
    sessionId,
    roundNumber,
    setCategories,
    addCommand,
    setFinalValuesWithoutReasons,
    setShowReasoning,
  ]);

  const handleNextRound = useCallback(async () => {
    try {
      logStateUpdate('handleNextRound', { roundNumber }, 'RoundUI');
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
          await updateSession(sessionId, { remainingValues: finalValues });
          setFinalValuesWithoutReasons(finalValues);
          setShowReasoning(true);
          return;
        }
      }

      // If not ending game, prepare for next round
      // Get all cards from non-Not Important categories
      const cardsForNextRound = Object.entries(categories)
        .filter(([category]) => category !== 'Not Important')
        .flatMap(([_, cards]) => cards || []);
      if (cardsForNextRound.length < targetCoreValues) {
        console.error('Not enough cards to proceed');
        return;
      }

      clearCommands();
      const nextRound = roundNumber + 1;
      if (sessionId) {
        await updateSession(sessionId, {
          currentRound: nextRound,
          remainingValues: cardsForNextRound,
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
  }, [
    validateRound,
    sessionId,
    roundNumber,
    currentRoundCommands,
    categories,
    shouldEndGame,
    targetCoreValues,
    clearCommands,
    setRoundNumber,
    setCategories,
    setRemainingCards,
  ]);

  const handleReasoningComplete = useCallback(
    async (valuesWithReasons: ValueWithReason[]) => {
      logStateUpdate(
        'handleReasoningComplete',
        {
          valuesWithReasons,
        },
        'RoundUI'
      );
      if (sessionId) {
        const session = {
          timestamp: Date.now(),
          targetCoreValues,
          currentRound: roundNumber,
          completed: true,
        };
        await updateSession(sessionId, session);
        await saveCompletedSession(sessionId, valuesWithReasons);
      }
      const finalCategories = Object.entries(categories)
        .filter(([category]) => category !== 'Not Important')
        .reduce((acc, [category, cards]) => {
          acc[category] = cards as Value[] | undefined;
          return acc;
        }, {} as Categories);
      setCategories(finalCategories);
      setShowReasoning(false);
      setShowResults(true);
    },
    [sessionId, targetCoreValues, roundNumber, categories, setCategories]
  );

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
  return (
    <div
      className={`flex h-full flex-col overflow-hidden ${isMobile && selectedMobileCard ? 'bg-gray-100' : ''} transition-colors duration-200`}
      role="application"
      aria-label="Core Values Sorting Exercise"
    >
      {/* Game Header - Stays visible but faded when card selected */}
      <div
        className="relative flex-shrink-0" // Added relative positioning
        role="banner"
      >
        {/* Selection instruction overlay */}
        {isMobile && selectedMobileCard && !hasShownInstruction && (
          <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center" aria-live="polite">
            <p className="inline-block rounded-full bg-white/90 px-2 py-1 text-sm font-medium text-blue-700">
              Tap a category to place this card
            </p>
          </div>
        )}

        <div
          className={`transition-opacity duration-200 ${isMobile && selectedMobileCard ? 'opacity-30' : 'opacity-100'} `}
        >
          <RoundHeader
            targetCoreValues={targetCoreValues}
            roundNumber={roundNumber}
            remainingCardsCount={remainingCards.length}
          />
        </div>
      </div>

      {/* Game Actions - Card remains visible when selected */}
      <div
        className={`flex-shrink-0 ${isMobile && selectedMobileCard ? 'relative z-20' : ''} `}
        role="region"
        aria-label="Game controls"
      >
        {isMobile ? (
          <div className="px-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex items-center justify-center">
                {roundNumber > 1 && remainingCards.length > 0 ? (
                  <ReplayPreviousRound
                    sessionId={sessionId}
                    roundNumber={roundNumber}
                    categories={categories}
                    remainingCards={remainingCards}
                    setCategories={setCategories}
                    setRemainingCards={setRemainingCards}
                    addCommand={addCommand}
                  />
                ) : (
                  <div />
                )}
              </div>
              <div className="flex items-center justify-center">
                <RoundActions
                  remainingCards={remainingCards}
                  targetCoreValues={targetCoreValues}
                  canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
                  onNextRound={handleNextRound}
                  onEarlyFinish={handleEarlyFinish}
                  onDrop={handleDrop}
                  isEndGame={shouldEndGame}
                  selectedMobileCard={selectedMobileCard}
                  onMobileCardSelect={setSelectedMobileCard}
                  setShowDetails={setShowStatusDetails}
                />
              </div>
              <div className="flex items-center justify-center">
                <div
                  role="status"
                  aria-live="polite"
                  className={`transition-opacity duration-200 ${selectedMobileCard ? 'opacity-30' : 'opacity-100'}`}
                >
                  <StatusMessage
                    status={status()}
                    isNearingCompletion={roundState.isNearingCompletion}
                    hasTooManyImportantCards={roundState.hasTooManyImportantCards}
                    hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
                    hasEnoughCards={roundState.hasEnoughCards}
                    targetCoreValues={targetCoreValues}
                    canProceedToNextRound={validateRound()}
                    remainingCards={remainingCards}
                    showDetails={showStatusDetails}
                    setShowDetails={setShowStatusDetails}
                    totalActiveCards={activeCards}
                    hasTargetCoreValuesInVeryImportant={hasTargetCoreValuesInVeryImportant}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto">
            <div
              className="grid grid-cols-3 gap-2 p-2 sm:gap-4 sm:p-4"
              role="region"
              aria-label="Game controls and status"
            >
              <div className="flex items-center justify-center">
                {roundNumber > 1 && remainingCards.length > 0 ? (
                  <ReplayPreviousRound
                    sessionId={sessionId}
                    roundNumber={roundNumber}
                    categories={categories}
                    remainingCards={remainingCards}
                    setCategories={setCategories}
                    setRemainingCards={setRemainingCards}
                    addCommand={addCommand}
                  />
                ) : (
                  <div className="h-24" />
                )}
              </div>
              <div className="flex items-center justify-center">
                <RoundActions
                  remainingCards={remainingCards}
                  targetCoreValues={targetCoreValues}
                  canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
                  onNextRound={handleNextRound}
                  onEarlyFinish={handleEarlyFinish}
                  onDrop={handleDrop}
                  isEndGame={shouldEndGame}
                />
              </div>
              <div className="flex items-center justify-center">
                <StatusMessage
                  status={status()}
                  totalActiveCards={activeCards}
                  hasTargetCoreValuesInVeryImportant={hasTargetCoreValuesInVeryImportant}
                  isNearingCompletion={roundState.isNearingCompletion}
                  hasTooManyImportantCards={roundState.hasTooManyImportantCards}
                  hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
                  hasEnoughCards={roundState.hasEnoughCards}
                  targetCoreValues={targetCoreValues}
                  canProceedToNextRound={validateRound()}
                  remainingCards={remainingCards}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Game Content */}
      <div className="flex-1 overflow-auto" role="region" aria-label="Value categories">
        {isMobile ? (
          <div className="flex h-full flex-col pb-16 pt-4">
            {' '}
            {/* Added pt-2 for top padding */}
            <MobileCategoryList
              categories={roundState.visibleCategories}
              activeDropZone={activeDropZone}
              onDrop={handleMobileDropWithZone}
              onMoveWithinCategory={handleMoveCard}
              onMoveBetweenCategories={handleMoveBetweenCategories}
              selectedCard={selectedMobileCard}
              onCardSelect={setSelectedMobileCard}
            />
          </div>
        ) : (
          <div className="w-full">
            <CategoryGrid
              categories={roundState.visibleCategories}
              onDrop={handleDrop}
              onMoveWithinCategory={handleMoveCard}
              onMoveBetweenCategories={handleMoveBetweenCategories}
            />
          </div>
        )}
      </div>
    </div>
  );
});
export default RoundUI;
