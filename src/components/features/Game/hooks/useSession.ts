'use client';

import { useStore } from "@/lib/store/store";
import { shallow } from 'zustand/shallow';
export function useSession() {
  const state = useStore(state => ({
    sessionId: state.sessionId,
    roundNumber: state.roundNumber,
    targetCoreValues: state.targetCoreValues,
    setSession: state.setSession,
    setSessionId: state.setSessionId,
    setRoundNumber: state.setRoundNumber,
    setTargetCoreValues: state.setTargetCoreValues,
    clearSession: state.clearSession
  }), shallow);
  return state;
}