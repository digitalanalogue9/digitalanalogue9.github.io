'use client';

import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { emptyCategories } from '@/components/features/Categories/constants/categories';
import { saveRound } from '@/lib/db/indexedDB';
import { StoreState } from '@/lib/types';
import { shallow } from 'zustand/shallow';
import { SessionData } from '../types/StoreState';

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
      setSession: (session: SessionData) =>
        set({
          sessionId: session.sessionId,
          targetCoreValues: session.targetCoreValues,
          roundNumber: session.roundNumber,
        }),
      setSessionId: (id) =>
        set({
          sessionId: id,
        }),
      setRoundNumber: (round) =>
        set({
          roundNumber: round,
        }),
      setTargetCoreValues: (count) =>
        set({
          targetCoreValues: count,
        }),
      clearSession: () =>
        set({
          sessionId: '',
          targetCoreValues: 10,
          roundNumber: 1,
        }),
      // Game methods
      setRemainingCards: (cards) =>
        set({
          remainingCards: cards,
        }),
      setCategories: (categories) =>
        set({
          categories,
        }),
      setGameStarted: (started) =>
        set({
          isGameStarted: started,
        }),
      setShowInstructions: (show) =>
        set({
          showInstructions: show,
        }),
      resetGame: () =>
        set({
          roundNumber: 1,
          remainingCards: [],
          categories: emptyCategories,
          isGameStarted: false,
          showInstructions: false,
          commands: [],
          currentRound: null,
          currentRoundCommands: [],
        }),
      // Command methods
      addCommand: async (command) => {
        set((state) => ({
          commands: [...state.commands, command],
          currentRoundCommands: [...state.currentRoundCommands, command],
        }));
        const { currentRound, commands } = get();
        if (currentRound) {
          await saveRound(currentRound.sessionId, currentRound.roundNumber, commands, currentRound.availableCategories);
        }
      },
      clearCommands: () =>
        set({
          commands: [],
          currentRoundCommands: [],
        }),
    }),
    {
      name: 'Game Store',
    }
  ),
  shallow
);
