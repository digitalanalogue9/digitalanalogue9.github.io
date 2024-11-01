'use client'

import {useStore} from '@/store/store'

export function useGameState() {
  const state = useStore((state) => ({
    remainingCards: state.remainingCards,
    categories: state.categories,
    isGameStarted: state.isGameStarted,
    showInstructions: state.showInstructions,
    commands: state.commands,
    currentRound: state.currentRound,
    addCommand: state.addCommand,
    setRemainingCards: state.setRemainingCards,
    setCategories: state.setCategories,
    setGameStarted: state.setGameStarted,
    setShowInstructions: state.setShowInstructions,
    resetGame: state.resetGame,
    clearCommands: state.clearCommands
  }))
  
  return state
}
