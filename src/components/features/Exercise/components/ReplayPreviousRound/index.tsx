import React, { useCallback, useState } from 'react';
import { getRound, saveRound } from '@/lib/db/indexedDB';
import { CategoryName, DropCommandPayload, MoveCommandPayload, Value } from '@/lib/types';
import { DropCommand } from "@/components/features/Exercise/commands/DropCommand";
import { useMobile } from '@/lib/contexts/MobileContext';
import { ReplayPreviousRoundProps } from './types';

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
                const lastCommand = [...previousRound.commands]
                    .reverse()
                    .find(command => {
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
                                [targetCategory]: [...(currentCategories[targetCategory] || []), currentCard]
                            };
                            currentRemaining = currentRemaining.filter(card => card.id !== currentCard.id);

                            // Update the UI state
                            setCategories(currentCategories);
                            setRemainingCards(currentRemaining);

                            // Save the updated state
                            if (sessionId) {
                                await saveRound(sessionId, roundNumber, [command], currentCategories);
                            }

                            // Add a delay for visual feedback
                            await new Promise(resolve => setTimeout(resolve, 300));
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error replaying previous round:', error);
        } finally {
            setIsReplaying(false);
        }
    }, [sessionId, roundNumber, categories, remainingCards, setCategories, setRemainingCards, addCommand]);

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
            'Not Important'
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
            <div className="relative" role="region" aria-label="Round progression">
                <button
                    onClick={handleReplayPreviousRound}
                    disabled={isReplaying || remainingCards.length === 0}
                    className={`
                        rounded-full p-2 flex items-center justify-center
                        ${isReplaying || remainingCards.length === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        transition-colors duration-200
                    `}
                    aria-label={isReplaying ? "Replaying previous round..." : "Replay previous round's moves"}
                >
                    <span aria-hidden="true" className="text-lg">
                        {isReplaying ? '⏳' : '↺'}
                    </span>
                    <span className="sr-only">
                        {isReplaying ? "Replaying previous round..." : "Replay previous round's moves"}
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="h-24 sm:h-48 flex items-center justify-center" role="region" aria-label="Round progression">
            <div className="flex justify-center mt-4">
                <button 
                    onClick={handleReplayPreviousRound}
                    disabled={isReplaying || remainingCards.length === 0}
                    className={`
                        px-6 py-2 text-base
                        rounded-md text-white font-medium
                        ${isReplaying || remainingCards.length === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    `}
                    aria-label={isReplaying ? "Replaying previous round..." : "Replay previous round's moves"}
                >
                    {isReplaying ? 'Replaying...' : 'Replay Previous'}
                </button>
            </div>
        </div>
    );
};

export default ReplayPreviousRound;