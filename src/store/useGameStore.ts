'use client'

import { create } from 'zustand';
import { CategoryName } from "@/types/CategoryName";
import { Categories } from "@/types/Categories";
import { GameState } from './GameState';

const initialCategories: Categories = {
  'Very Important': [],
  'Quite Important': [],
  'Important': [],
  'Of Some Importance': [],
  'Not Important': []
};

const useGameStore = create<GameState>((set) => ({
  targetCoreValues: 0,
  currentRound: 1,
  remainingCards: [],
  categories: initialCategories,
  sessionId: '',
  setTargetCoreValues: (count) => set({ targetCoreValues: count }),
  setCurrentRound: (round) => set({ currentRound: round }),
  setRemainingCards: (cards) => set({ remainingCards: cards }),
  setCategories: (categories) => set({ categories }),
  setSessionId: (id) => set({ sessionId: id })
}));

export default useGameStore;
