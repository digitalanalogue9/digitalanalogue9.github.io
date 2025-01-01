'use client';

import { useStore } from '@/lib/store/store';
import { shallow } from 'zustand/shallow';
/**
 * Custom hook to manage session state.
 *
 * This hook provides access to session-related state and actions from the store.
 * It uses shallow comparison to optimize re-renders.
 *
 * @returns {Object} An object containing session state and actions:
 * - `sessionId`: The current session ID.
 * - `roundNumber`: The current round number.
 * - `targetCoreValues`: The target core values for the session.
 * - `setSession`: Function to set the session.
 * - `setSessionId`: Function to set the session ID.
 * - `setRoundNumber`: Function to set the round number.
 * - `setTargetCoreValues`: Function to set the target core values.
 * - `clearSession`: Function to clear the session.
 */
export function useSession() {
  const state = useStore(
    (state) => ({
      sessionId: state.sessionId,
      roundNumber: state.roundNumber,
      targetCoreValues: state.targetCoreValues,
      setSession: state.setSession,
      setSessionId: state.setSessionId,
      setRoundNumber: state.setRoundNumber,
      setTargetCoreValues: state.setTargetCoreValues,
      clearSession: state.clearSession,
    }),
    shallow
  );
  return state;
}
