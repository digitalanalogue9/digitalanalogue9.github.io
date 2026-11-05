import { useState } from 'react';
import {
  loadLatestScenarioAttempt,
  saveScenarioAttempt,
  startScenarioAttempt,
  type ScenarioAttempt,
} from '../../../lib/scenario-reflection/attemptStorage';

export function useScenarioAttempt() {
  const [attempt, setAttempt] = useState<ScenarioAttempt | null>(loadLatestScenarioAttempt);
  const [saveError, setSaveError] = useState(false);
  function begin() {
    try {
      setAttempt(startScenarioAttempt());
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }
  function updateAttempt(update: Partial<ScenarioAttempt>) {
    if (!attempt) return false;
    const next = { ...attempt, ...update };
    try {
      setAttempt(saveScenarioAttempt(next));
      setSaveError(false);
      return true;
    } catch {
      setAttempt(next);
      setSaveError(true);
      return false;
    }
  }
  return { attempt, saveError, begin, updateAttempt };
}
