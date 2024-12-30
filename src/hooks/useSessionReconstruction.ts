import { useState, useEffect } from 'react';
import { Categories, Value, DropCommandPayload, MoveCommandPayload } from "../lib/types";
import { getRoundsBySession } from "../lib/db/indexedDB";
import valuesData from '../data/values.json';
import { ReconstructedState } from '../lib/types'

export function useSessionReconstruction(sessionId: string | null) {
  const [reconstructedState, setReconstructedState] = useState<ReconstructedState | null>(null);
  useEffect(() => {
    if (!sessionId) return;
    const reconstructState = async () => {
      const rounds = await getRoundsBySession(sessionId);

      // Initialize categories
      let categories: Categories = {
        'Very Important': [],
        'Quite Important': [],
        'Important': [],
        'Of Some Importance': [],
        'Not Important': []
      };

      // Create a map of all possible values from values.json
      const allValues = new Map<string, Value>(valuesData.values.map(value => [value.id, value]));

      // Second pass: reconstruct categories
      for (const round of rounds) {
        for (const command of round.commands) {
          if (command.type === 'DROP') {
            const dropPayload = command.payload as DropCommandPayload;
            const value = allValues.get(dropPayload.cardId);
            if (value && dropPayload.category in categories) {
              categories[dropPayload.category] = [...(categories[dropPayload.category] ?? []), value];
            }
          } else if (command.type === 'MOVE') {
            const movePayload = command.payload as MoveCommandPayload;
            const value = allValues.get(movePayload.cardId);
            if (value && movePayload.fromCategory in categories && movePayload.toCategory in categories) {
              // Remove from source
              const sourceCategory = categories[movePayload.fromCategory] ?? [];
              categories[movePayload.fromCategory] = sourceCategory.filter(v => v.id !== movePayload.cardId);

              // Add to target
              const targetCategory = categories[movePayload.toCategory] ?? [];
              categories[movePayload.toCategory] = [...targetCategory, value];
            }
          }
        }
      }

      // Calculate remaining cards
      const usedCardIds = new Set(Object.values(categories).flatMap(cards => cards?.map(card => card.id) ?? []));
      const remainingCards = valuesData.values.filter(value => !usedCardIds.has(value.id));
      setReconstructedState({
        categories,
        currentRound: rounds.length,
        remainingCards
      });
    };
    reconstructState();
  }, [sessionId]);
  return reconstructedState;
}