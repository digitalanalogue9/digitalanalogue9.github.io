import React, { useCallback, useState } from 'react';
import { getRound, saveRound } from '@/lib/db/indexedDB';
import { Categories, CategoryName, DropCommandPayload, MoveCommandPayload } from '@/lib/types';
import { DropCommand } from '@/components/features/Exercise/commands/DropCommand';
import { useMobile } from '@/lib/contexts/MobileContext';
import { ReplayPreviousRoundProps } from './types';
import { Command } from '../../commands/Command';

const ReplayPreviousRound: React.FC<ReplayPreviousRoundProps> = ({
  sessionId,
  roundNumber,
  categories,
  remainingCards,
  setCategories,
  setRemainingCards,
  addCommand,
}) => {
  const [isReplaying, setIsReplaying] = useState(false);
  const { isMobile } = useMobile();

  // in useRoundHandlers.ts
  const saveRoundData = useCallback(
    async (command: Command, updatedCategories: Categories) => {
      if (!sessionId) return;
      try {
        // Get current round from database to ensure we have all commands
        const currentRound = await getRound(sessionId, roundNumber);
        const existingCommands = currentRound?.commands || [];

        // Save with all commands plus the new one
        await saveRound(sessionId, roundNumber, [...existingCommands, command], updatedCategories);
      } catch (error) {
        console.error('Failed to save round data:', error);
      }
    },
    [sessionId, roundNumber]
  );

  const handleReplayPreviousRound = useCallback(async () => {
    if (!sessionId || roundNumber <= 1) return;

    try {
      setIsReplaying(true);

      // Get previous round data
      const previousRound = await getRound(sessionId, roundNumber - 1);
      if (!previousRound?.commands) return;

      // Create a copy of the current state to work with
      let currentCategories = { ...categories };
      let currentRemaining = [...remainingCards];
      // Process each remaining card
      for (const currentCard of remainingCards) {
        // Find last command for current card
        const lastCommand = [...previousRound.commands].reverse().find((command) => {
          const payload = command.payload as DropCommandPayload | MoveCommandPayload;
          return payload.cardId === currentCard.id;
        });

        if (lastCommand) {
          let category: CategoryName | null = null;
          if (lastCommand.type === 'DROP') {
            category = (lastCommand.payload as DropCommandPayload).category;
          } else if (lastCommand.type === 'MOVE') {
            category = (lastCommand.payload as MoveCommandPayload).toCategory;
          }

          if (category) {
            const targetCategory = findBestMatchingCategory(category, Object.keys(categories) as CategoryName[]);
            if (targetCategory) {
              // Create and add the drop command
              const command = new DropCommand(currentCard, targetCategory);
              await addCommand(command);

              // Update the local state copies
              currentCategories = {
                ...currentCategories,
                [targetCategory]: [...(currentCategories[targetCategory] || []), currentCard],
              };
              currentRemaining = currentRemaining.filter((card) => card.id !== currentCard.id);

              // Update the UI state
              setCategories(currentCategories);
              setRemainingCards(currentRemaining);

              // Save the updated state
              await saveRoundData(command, currentCategories);

              // Add a delay for visual feedback
              await new Promise((resolve) => setTimeout(resolve, 300));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error replaying previous round:', error);
    } finally {
      setIsReplaying(false);
    }
  }, [sessionId, roundNumber, categories, remainingCards, saveRoundData, setCategories, setRemainingCards, addCommand]);

  const findBestMatchingCategory = (
    originalCategory: CategoryName,
    availableCategories: CategoryName[]
  ): CategoryName | null => {
    if (availableCategories.includes(originalCategory)) {
      return originalCategory;
    }

    const categoryPriority: CategoryName[] = [
      'Very Important',
      'Quite Important',
      'Important',
      'Of Some Importance',
      'Not Important',
    ];

    // Find the next available category that comes after the original in priority
    const originalIndex = categoryPriority.indexOf(originalCategory);
    if (originalIndex !== -1) {
      // Look for the next available category after the original
      for (let i = originalIndex + 1; i < categoryPriority.length; i++) {
        if (availableCategories.includes(categoryPriority[i])) {
          return categoryPriority[i];
        }
      }
    }

    // If no category found after original, use the highest available
    for (const category of categoryPriority) {
      if (availableCategories.includes(category)) {
        return category;
      }
    }

    return null;
  };

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-1" role="region" aria-label="Round progression">
        <button
          type="button"
          onClick={handleReplayPreviousRound}
          disabled={isReplaying || remainingCards.length === 0}
          className={`flex h-16 w-16 items-center justify-center rounded-full p-2 ${
            isReplaying || remainingCards.length === 0
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label={isReplaying ? 'Replaying previous round...' : "Replay previous round's moves"}
        >
          <span aria-hidden="true" className="text-lg">
            {isReplaying ? '⏳' : '↺'}
          </span>
        </button>
        <span className="text-xs text-black">{isReplaying ? 'Replaying' : 'Tap to replay'}</span>
      </div>
    );
  }

  return (
    <div className="flex h-24 items-center justify-center sm:h-48" role="region" aria-label="Round progression">
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={handleReplayPreviousRound}
          disabled={isReplaying || remainingCards.length === 0}
          className={`rounded-md px-6 py-2 text-base font-medium text-white ${
            isReplaying || remainingCards.length === 0
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label={isReplaying ? 'Replaying previous round...' : "Replay previous round's moves"}
        >
          {isReplaying ? 'Replaying...' : 'Replay Previous'}
        </button>
      </div>
    </div>
  );
};

export default ReplayPreviousRound;
