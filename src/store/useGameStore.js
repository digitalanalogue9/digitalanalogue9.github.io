import { create } from 'zustand'

const useGameStore = create((set) => ({
  targetCoreValues: 0,
  currentRound: 1,
  remainingCards: [],
  categories: {
    'Very Important': [],
    'Quite Important': [],
    'Important': [],
    'Of Some Importance': [],
    'Not Important': []
  },
  sessionId: '',
  setTargetCoreValues: (count) => set({ targetCoreValues: count }),
  setCurrentRound: (round) => set({ currentRound: round }),
  setRemainingCards: (cards) => set({ remainingCards: cards }),
  setCategories: (categories) => set({ categories }),
  setSessionId: (id) => set({ sessionId: id })
}))

export default useGameStore