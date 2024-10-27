'use client'

import { create } from "zustand";
import { CategoryName } from "@/types/CategoryName";
import { Categories } from "@/types/Categories";
import { GameState } from "./GameState";
import { Value } from "@/types/Value";
import { getInitialRandomValues, getRandomValues } from "@/utils/valuesUtils";
import { getEnvNumber } from "@/utils/envUtils";

const initialCategories: Categories = {
  'Very Important': [],
  'Quite Important': [],
  'Important': [],
  'Of Some Importance': [],
  'Not Important': []
};

export const useGameStore = create<GameState>((set : any) => ({
  targetCoreValues: 0,
  currentRound: 1,
  remainingCards: [],
  categories: initialCategories,
  sessionId: '',
  
  setTargetCoreValues: (count: number) => set({ targetCoreValues: count }),
  setCurrentRound: (round: number) => set({ currentRound: round }),
  setRemainingCards: (cards: Value[]) => {
    const maxCards = getEnvNumber('maxCards', 35);
    console.log('setRemainingCards called with length:', cards.length);
    console.log('setRemainingCards maxCards:', maxCards);
    const limitedCards = cards.slice(0, maxCards);
    console.log('setRemainingCards setting length:', limitedCards.length);
    set({ remainingCards: limitedCards });
  },
  setCategories: (categories: Categories) => set({ categories }),
  setSessionId: (id: string) => set({ sessionId: id }),
  
  initializeGame: () => {
    const maxCards = getEnvNumber('maxCards', 35);
    console.log('initializeGame maxCards:', maxCards);
    
    const initialCards = getInitialRandomValues();
    console.log('initializeGame initialCards length:', initialCards.length);
    
    const shuffledCards = getRandomValues(initialCards);
    console.log('initializeGame shuffledCards length:', shuffledCards.length);
    
    const slicedCards = shuffledCards.slice(0, maxCards);
    console.log('initializeGame slicedCards length:', slicedCards.length);
    
    set({
      currentRound: 1,
      remainingCards: slicedCards,
      categories: initialCategories,
    });

    // Verify after set
    console.log('initializeGame after set - remainingCards length:', slicedCards.length);
  },
}));
