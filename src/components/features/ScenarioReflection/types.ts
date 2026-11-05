import type { ScenarioAttempt } from '../../../lib/scenario-reflection/attemptStorage';

export type ScenarioViewProps = {
  attempt: ScenarioAttempt;
  saveError: boolean;
  updateAttempt: (update: Partial<ScenarioAttempt>) => boolean;
};
