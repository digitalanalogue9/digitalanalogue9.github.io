'use client';

import { useStore } from "@/lib/store/store";
import { shallow } from 'zustand/shallow';
/**
 * Custom hook that provides the game state and actions from the store.
 *
 * @returns {object} The current game state and actions:
 * - `remainingCards`: The number of remaining cards.
 * - `categories`: The categories available in the game.
 * - `isGameStarted`: A boolean indicating if the game has started.
 * - `showInstructions`: A boolean indicating if the instructions should be shown.
 * - `commands`: The list of commands in the game.
 * - `currentRound`: The current round of the game.
 * - `addCommand`: Function to add a command.
 * - `setRemainingCards`: Function to set the remaining cards.
 * - `setCategories`: Function to set the categories.
 * - `setGameStarted`: Function to set the game started state.
 * - `setShowInstructions`: Function to set the show instructions state.
 * - `resetGame`: Function to reset the game.
 * - `clearCommands`: Function to clear the commands.
 */
export function useGameState() {
  const state = useStore(state => ({
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
  }), shallow);
  return state;
}