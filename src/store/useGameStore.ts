'use client'

import { create } from 'zustand';
import { CategoryName } from "@/types/CategoryName";
import { Categories } from "@/types/Categories";
import { GameState } from './GameState';
import { Value } from '@/types/Value';
import { getInitialRandomValues, getRandomValues } from '@/utils/valuesUtils';

const initialCategories: Categories = {
  'Very Important': [],
  'Quite Important': [],
  'Important': [],
  'Of Some Importance': [],
  'Not Important': []
};

export const useGameStore = create<GameState>((set) => ({
  targetCoreValues: 0,
  currentRound: 1,
  remainingCards: [],
  categories: initialCategories,
  sessionId: '',
  
  setTargetCoreValues: (count: number) => set({ targetCoreValues: count }),
  setCurrentRound: (round: number) => set({ currentRound: round }),
  setRemainingCards: (cards: Value[]) => set({ remainingCards: cards }),
  setCategories: (categories: Categories) => set({ categories }),
  setSessionId: (id: string) => set({ sessionId: id }),
  
  initializeGame: () => {
    const initialCards = getInitialRandomValues();
    set({
      currentRound: 1,
      remainingCards: initialCards,
      categories: initialCategories,
    });
  },
}));
