import { useState, useCallback } from 'react';
import { Categories } from '@/types/Categories';
import { Value } from '@/types/Value';
import { Command } from '@/types/Command';
import { CategoryName } from '@/types/CategoryName';
import { getEnvBoolean } from '@/utils/config';
import { DropCommandPayload, MoveCommandPayload } from '@/types';

const debug = getEnvBoolean('debug', false);

interface AnimatingCard {
    value: Value;
    sourcePos: { x: number, y: number };
    targetPos: { x: number, y: number };
}

export const useReplayState = (initialCards: Value[] = []) => {
    const [remainingCards, setRemainingCards] = useState<Value[]>(initialCards);
    const [categories, setCategories] = useState<Categories>({
        'Very Important': [],
        'Quite Important': [],
        'Important': [],
        'Of Some Importance': [],
        'Not Important': []
    });
    const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);

    const executeCommand = useCallback((command: Command) => {
        switch (command.type) {
            case 'DROP': {
                const payload = command.payload as DropCommandPayload;
                const cardToMove = remainingCards.find(c => c.id === payload.cardId);
                
                if (cardToMove) {
                    setCategories(prev => {
                        const newCategories = { ...prev };
                        newCategories[payload.category] = [...newCategories[payload.category], cardToMove];
                        return newCategories;
                    });

                    setRemainingCards(prev => prev.filter(c => c.id !== payload.cardId));

                    if (command.sourcePosition && command.targetPosition) {
                        setAnimatingCard({
                            value: cardToMove,
                            sourcePos: command.sourcePosition,
                            targetPos: command.targetPosition
                        });
                    }
                } else if (debug) {
                    console.warn(`Card with id ${payload.cardId} not found in remaining cards`);
                }
                break;
            }
            case 'MOVE': {
                const payload = command.payload as MoveCommandPayload;
                setCategories(prev => {
                    const newCategories = { ...prev };
                    const card = newCategories[payload.fromCategory].find(
                        c => c.id === payload.cardId
                    );
    
                    if (card) {
                        newCategories[payload.fromCategory] = newCategories[payload.fromCategory]
                            .filter(c => c.id !== payload.cardId);
                        newCategories[payload.toCategory] = [...newCategories[payload.toCategory], card];
                    } else if (debug) {
                        console.warn(`Card with id ${payload.cardId} not found in category ${payload.fromCategory}`);
                    }
    
                    return newCategories;
                });
    
                if (command.sourcePosition && command.targetPosition) {
                    const card = categories[payload.fromCategory].find(
                        c => c.id === payload.cardId
                    );
                    if (card) {
                        setAnimatingCard({
                            value: card,
                            sourcePos: command.sourcePosition,
                            targetPos: command.targetPosition
                        });
                    }
                }
                break;
            }
        }
    }, [categories, remainingCards]); // Removed debug from dependencies
    
    const resetCategories = useCallback(() => {
        setCategories({
            'Very Important': [],
            'Quite Important': [],
            'Important': [],
            'Of Some Importance': [],
            'Not Important': []
        });
        setRemainingCards(initialCards);
        setAnimatingCard(null);
    }, [initialCards]);

    return {
        categories,
        remainingCards,
        animatingCard,
        executeCommand,
        resetCategories,
        setAnimatingCard
    };
};
