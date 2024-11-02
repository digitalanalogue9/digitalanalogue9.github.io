import { useState, useCallback } from 'react';
import { Categories, Value, Command, CategoryName } from '@/types';
import { getEnvBoolean } from '@/utils/config';
import { DropCommandPayload, MoveCommandPayload } from '@/types';
import { getCategoriesForRound } from '@/utils/categoryUtils';

const debug = getEnvBoolean('debug', false);

interface AnimatingCard {
    value: Value;
    sourcePos: { x: number, y: number };
    targetPos: { x: number, y: number };
}

export const useReplayState = (initialCards: Value[] = [], roundNumber: number = 1) => {
    const [remainingCards, setRemainingCards] = useState<Value[]>(initialCards);
    const [categories, setCategories] = useState<Categories>(getCategoriesForRound(roundNumber));
    const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);

    const executeCommand = useCallback((command: Command) => {
        switch (command.type) {
            case 'DROP': {
                const payload = command.payload as DropCommandPayload;
                const cardToMove = remainingCards.find(c => c.id === payload.cardId);
                const categoryValues = categories[payload.category] || [];
                
                if (cardToMove && categoryValues !== undefined) {
                    setCategories(prev => {
                        const newCategories = { ...prev };
                        newCategories[payload.category] = [...categoryValues, cardToMove];
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
                    console.warn(`Card with id ${payload.cardId} not found in remaining cards or invalid category`);
                }
                break;
            }
            case 'MOVE': {
                const payload = command.payload as MoveCommandPayload;
                const fromCategoryValues = categories[payload.fromCategory] || [];
                const toCategoryValues = categories[payload.toCategory] || [];

                if (fromCategoryValues && toCategoryValues) {
                    setCategories(prev => {
                        const newCategories = { ...prev };
                        const card = fromCategoryValues.find(c => c.id === payload.cardId);
        
                        if (card) {
                            newCategories[payload.fromCategory] = fromCategoryValues.filter(c => c.id !== payload.cardId);
                            newCategories[payload.toCategory] = [...toCategoryValues, card];
                        } else if (debug) {
                            console.warn(`Card with id ${payload.cardId} not found in category ${payload.fromCategory}`);
                        }
        
                        return newCategories;
                    });
        
                    if (command.sourcePosition && command.targetPosition) {
                        const card = fromCategoryValues.find(c => c.id === payload.cardId);
                        if (card) {
                            setAnimatingCard({
                                value: card,
                                sourcePos: command.sourcePosition,
                                targetPos: command.targetPosition
                            });
                        }
                    }
                }
                break;
            }
        }
    }, [categories, remainingCards]); 
    
    const resetCategories = useCallback(() => {
        setCategories(getCategoriesForRound(roundNumber));
        setRemainingCards(initialCards);
        setAnimatingCard(null);
    }, [initialCards, roundNumber]);

    return {
        categories,
        remainingCards,
        animatingCard,
        executeCommand,
        resetCategories,
        setAnimatingCard
    };
};
