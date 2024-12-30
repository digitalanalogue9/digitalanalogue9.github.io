'use client';

import { useCallback } from 'react';
import { useStore } from "../../../..//lib/store/store";
import { Value, CategoryName } from "../../../..//lib/types";
import { getRound, saveRound } from "../../../..//lib/db/indexedDB";
import { DropCommand } from "../../../..//components/features/Exercise/commands/DropCommand";
import { MoveCommand } from "../../../..//components/features/Exercise/commands/MoveCommand";
import { shallow } from 'zustand/shallow';
/**
 * Custom hook that provides command handling functionalities for the Exercise feature.
 *
 * @returns {Object} An object containing the following properties and methods:
 * - `handleDrop`: A function to handle the drop action, which adds a new DropCommand.
 * - `handleMoveBetweenCategories`: A function to handle moving a value between categories, which adds a new MoveCommand.
 * - `handleMoveWithinCategory`: A function to handle moving a value within a category, which adds a new MoveCommand.
 * - `loadCommands`: A function to load commands for the current round from the server.
 * - `currentRoundCommands`: The list of commands for the current round.
 * - `addCommand`: A function to add a new command to the state.
 * - `clearCommands`: A function to clear all commands from the state.
 */
export function useCommands() {
  const state = useStore(state => ({
    addCommand: state.addCommand,
    currentRound: state.currentRound,
    commands: state.commands,
    clearCommands: state.clearCommands,
    roundNumber: state.roundNumber,
    currentRoundCommands: state.currentRoundCommands
  }), shallow);
  
  const handleDrop = useCallback(async (value: Value, category: CategoryName) => {
    const command = new DropCommand(value, category);
    await state.addCommand(command);
  }, [state]);
  
  const handleMoveBetweenCategories = useCallback(async (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => {
    const command = new MoveCommand(value, fromCategory, toCategory);
    await state.addCommand(command);
  }, [state]);
  
  const handleMoveWithinCategory = useCallback(async (category: CategoryName, fromIndex: number, toIndex: number, value: Value) => {
    const command = new MoveCommand(value, category, category, fromIndex, toIndex);
    await state.addCommand(command);
  }, [state]);
  
  const loadCommands = useCallback(async () => {
    if (state.currentRound) {
      const savedRound = await getRound(state.currentRound.sessionId, state.roundNumber);
      if (savedRound) {
        useStore.setState({
          currentRound: {
            sessionId: state.currentRound.sessionId,
            roundNumber: state.roundNumber,
            commands: savedRound.commands,
            availableCategories: state.currentRound.availableCategories,
            timestamp: savedRound.timestamp
          }
        });
      }
    }
  }, [state]);
  return {
    handleDrop,
    handleMoveBetweenCategories,
    handleMoveWithinCategory,
    loadCommands,
    currentRoundCommands: state.currentRoundCommands,
    addCommand: state.addCommand,
    clearCommands: state.clearCommands
  };
}