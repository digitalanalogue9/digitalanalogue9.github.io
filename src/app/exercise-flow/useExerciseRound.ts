import { useRef, useState } from 'react';
import { loadSession, saveSessionProgress, type RoundSnapshot } from '../../lib/db/canonicalSessionRepository';
import {
  advanceRoundState,
  applyRoundCommand,
  buildPreviousRoundReplayCommands,
  evaluateRoundTransition,
} from '../../lib/domain/roundEngine';
import type { RoundCommand } from '../../lib/contracts/types';
import { useSessionRecord } from './useSessionRecord';

export function useExerciseRound(sessionId: string | null, onReady: () => void) {
  const state = useSessionRecord(sessionId);
  const { record, setRecord, setError } = state;
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  async function updateRound(change: (round: RoundSnapshot) => { round: RoundSnapshot; ready?: boolean }) {
    if (!record || record.session.status !== 'active' || locked.current) return false;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      const result = change(record.currentRound);
      await saveSessionProgress(record.session.id, result.round);
      setRecord(await loadSession(record.session.id));
      if (result.ready) onReady();
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Your sorting choice could not be saved. Please try again.');
      return false;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  function command(command: RoundCommand) {
    return updateRound((round) => ({ round: applyRoundCommand(round, command, Date.now()) }));
  }
  function advance(earlyFinish: boolean) {
    return updateRound((round) => {
      const result = advanceRoundState(round, Date.now(), earlyFinish);
      return { round: result.round, ready: result.kind === 'ready-to-complete' };
    });
  }
  function replayPrevious() {
    return updateRound((round) => {
      const previous = record?.rounds.find((saved) => saved.roundNumber === round.roundNumber - 1);
      if (!previous) throw new Error('No previous round to replay.');
      const commands = buildPreviousRoundReplayCommands(round.deck, previous.commands, round.activeCategories);
      const now = Date.now();
      return { round: commands.reduce((current, command) => applyRoundCommand(current, command, now), round) };
    });
  }
  return {
    ...state,
    busy,
    command,
    advance,
    replayPrevious,
    transition: record ? evaluateRoundTransition(record.currentRound) : null,
  };
}
