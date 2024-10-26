'use client'

import { create } from 'zustand';
import { Value, Categories, CategoryName } from '../types';

interface GameState {
  targetCoreValues: number;
  currentRound: number;
  remainingCards: Value[];
  categories: Categories;
  sessionId: string;
  setTargetCoreValues: (count: number) => void;
  setCurrentRound: (round: number) => void;
  setRemainingCards: (cards: Value[]) => void;
  setCategories: (categories: Categories) => void;
  setSessionId: (id: string) => void;
}

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
