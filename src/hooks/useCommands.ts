'use client'

import { useCallback } from 'react'
import { useStore } from '@/store/store'
import { Value, CategoryName } from '@/types'
import { getRound, saveRound } from '@/db/indexedDB'
import { DropCommand } from '@/commands/DropCommand'
import { MoveCommand } from '@/commands/MoveCommand'
import { shallow } from 'zustand/shallow'

export function useCommands() {
  const state = useStore((state) => ({
    addCommand: state.addCommand,
    currentRound: state.currentRound,
    commands: state.commands,
    clearCommands: state.clearCommands,
    roundNumber: state.roundNumber,
    currentRoundCommands: state.currentRoundCommands
  }), shallow)

  const handleDrop = useCallback(
    async (value: Value, category: CategoryName) => {
      const command = new DropCommand(value, category)
      await state.addCommand(command)
    },
    [state]
  )

  const handleMoveBetweenCategories = useCallback(
    async (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => {
      const command = new MoveCommand(value, fromCategory, toCategory)
      await state.addCommand(command)
    },
    [state]
  )

  const handleMoveWithinCategory = useCallback(
    async (
      category: CategoryName,
      fromIndex: number,
      toIndex: number,
      value: Value
    ) => {
      const command = new MoveCommand(
        value,
        category,
        category,
        fromIndex,
        toIndex
      )
      await state.addCommand(command)
    },
    [state]
  )

  const loadCommands = useCallback(
    async () => {
      if (state.currentRound) {
        const savedRound = await getRound(
          state.currentRound.sessionId,
          state.roundNumber
        );
        if (savedRound) {
          useStore.setState({
            currentRound: {
              sessionId: state.currentRound.sessionId,
              roundNumber: state.roundNumber,
              commands: savedRound.commands,
              availableCategories : state.currentRound.availableCategories,
              timestamp: savedRound.timestamp
            }
          })
        }
      }
    },
    [state]
  )

  return {
    handleDrop,
    handleMoveBetweenCategories,
    handleMoveWithinCategory,
    loadCommands,
    currentRoundCommands: state.currentRoundCommands,
    addCommand: state.addCommand,
    clearCommands: state.clearCommands
  }
}
