'use client'

import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import { emptyCategories } from '@/constants/categories'
import { saveRoundCommands } from '@/db/indexedDB'
import { Value, Categories, Command, Round } from '@/types'
import { shallow } from 'zustand/shallow'

interface StoreState {
  // Session state
  sessionId: string
  roundNumber: number
  targetCoreValues: number
  
  // Game state
  remainingCards: Value[]
  categories: Categories
  isGameStarted: boolean
  showInstructions: boolean
  commands: Command[]
  currentRound: Round | null
  currentRoundCommands: Command[]

  // Session methods
  setSession: (session: { sessionId: string; targetCoreValues: number; roundNumber: number }) => void
  setSessionId: (id: string) => void
  setRoundNumber: (round: number) => void
  setTargetCoreValues: (count: number) => void
  clearSession: () => void

  // Game methods
  setRemainingCards: (cards: Value[]) => void
  setCategories: (categories: Categories) => void
  setGameStarted: (started: boolean) => void
  setShowInstructions: (show: boolean) => void
  resetGame: () => void

  // Command methods
  addCommand: (command: Command) => Promise<void>
  clearCommands: () => void
}

export const useStore = createWithEqualityFn<StoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sessionId: '',
      roundNumber: 1,
      targetCoreValues: 10,
      remainingCards: [],
      categories: emptyCategories,
      isGameStarted: false,
      showInstructions: false,
      commands: [],
      currentRound: null,
      currentRoundCommands: [],

      // Session methods
      setSession: (session) => set({
        sessionId: session.sessionId,
        targetCoreValues: session.targetCoreValues,
        roundNumber: session.roundNumber,
      }),
      setSessionId: (id) => set({ sessionId: id }),
      setRoundNumber: (round) => set({ roundNumber: round }),
      setTargetCoreValues: (count) => set({ targetCoreValues: count }),
      clearSession: () => set({
        sessionId: '',
        targetCoreValues: 10,
        roundNumber: 1
      }),

      // Game methods
      setRemainingCards: (cards) => set({ remainingCards: cards }),
      setCategories: (categories) => set({ categories }),
      setGameStarted: (started) => set({ isGameStarted: started }),
      setShowInstructions: (show) => set({ showInstructions: show }),
      resetGame: () => set({
        roundNumber: 1,
        remainingCards: [],
        categories: emptyCategories,
        isGameStarted: false,
        showInstructions: false,
        commands: [],
        currentRound: null,
        currentRoundCommands: []
      }),

      // Command methods
      addCommand: async (command) => {
        set((state) => ({
          commands: [...state.commands, command],
          currentRoundCommands: [...state.currentRoundCommands, command]
        }))
        
        const { currentRound, commands } = get()
        if (currentRound) {
          await saveRoundCommands({
            sessionId: currentRound.sessionId,
            roundNumber: currentRound.roundNumber,
            commands,
            timestamp: Date.now()
          })
        }
      },
      clearCommands: () => set({ commands: [], currentRoundCommands: [] })
    }),
    {
      name: 'Game Store'
    }
  ),
  shallow
)
