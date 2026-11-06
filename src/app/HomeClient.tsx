'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { isBehaviourReflectionEnabled } from '@/lib/utils/config/featureFlags';
import type { BehaviourAttempt } from '@/lib/services/behaviourAttemptService';
import { getBehaviourAttemptServiceSingleton } from '@/lib/services/serviceSingleton';

export default function HomeClient() {
  const navigate = useNavigate();
  const service = useExerciseService();
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();
  const [scenarioAttempts, setScenarioAttempts] = useState<BehaviourAttempt[]>([]);
  const [scenarioLoadError, setScenarioLoadError] = useState<string | null>(null);
  const [unfinishedValues, setUnfinishedValues] = useState<Awaited<ReturnType<typeof service.listSessions>>>([]);
  const [valuesLoadError, setValuesLoadError] = useState<string | null>(null);

  const refreshScenarioAttempts = async () => {
    try {
      setScenarioAttempts(await getBehaviourAttemptServiceSingleton().listAttempts());
      setScenarioLoadError(null);
    } catch {
      setScenarioLoadError('Saved scenario reflections could not be loaded. Try refreshing this page.');
    }
  };

  useEffect(() => {
    if (behaviourReflectionEnabled) {
      void refreshScenarioAttempts();
    }
    void service
      .listSessions()
      .then((sessions) => {
        setUnfinishedValues(sessions.filter((savedSession) => savedSession.status === 'active'));
        setValuesLoadError(null);
      })
      .catch(() => {
        setValuesLoadError('Saved values exercises could not be loaded. Try refreshing this page.');
      });
  }, [behaviourReflectionEnabled, service]);

  return (
    <div
      className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default space-y-8 border px-6 py-8 sm:px-10 sm:py-10`}
    >
      <section className="mx-auto max-w-2xl space-y-4 text-center" aria-labelledby="home-heading">
        <h1 id="home-heading" className="text-interface-title-1 text-sys-color-text-primary font-semibold">
          Core Values
        </h1>
        <h2 className="text-interface-title-2 text-sys-color-text-primary font-normal">
          Choose what you want to explore
        </h2>
        <p className="text-interface-base-default text-sys-color-text-primary">
          Choose the reflection that fits what you want to explore today. Each exercise can stand on its own.
        </p>
      </section>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        <article className="rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default flex flex-col items-start border p-6">
          <h3 className="text-interface-title-2 text-sys-color-text-primary font-semibold">Explore your values</h3>
          <p className="text-interface-base-small text-sys-color-text-primary my-3 flex-1">
            <span className="block font-semibold">What matters to me?</span>
            Sort value cards by importance and narrow them to a core set. Choose a personal set or a team-focused set
            designed to support conversations about what matters when working together.
          </p>
          <button type="button" className="apc-button min-h-11" onClick={() => navigate('/exercise')}>
            Sort values
          </button>
        </article>
        {behaviourReflectionEnabled && (
          <article className="rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default flex flex-col items-start border p-6">
            <h3 className="text-interface-title-2 text-sys-color-text-primary font-semibold">Explore your behaviour</h3>
            <p className="text-interface-base-small text-sys-color-text-primary my-3 flex-1">
              <span className="block font-semibold">What do others see that I don’t?</span>
              Choose how you might respond to six situations, then consider possible intentions and perspectives. These
              are possibilities to reflect on, not facts about what others think.
            </p>
            <button type="button" className="apc-button min-h-11" onClick={() => navigate('/behaviour')}>
              Explore your behaviour
            </button>
          </article>
        )}
      </div>
      <div className="text-center">
        <button
          type="button"
          className="text-interface-base-small text-ref-color-brand-primary min-h-11 underline underline-offset-4 focus-visible:outline-2"
          onClick={() => navigate('/history')}
        >
          View all exercise history
        </button>
      </div>
      {(unfinishedValues.length > 0 || valuesLoadError) && (
        <section className="mx-auto w-full max-w-4xl space-y-3 text-left" aria-labelledby="values-resume-heading">
          <h2 id="values-resume-heading" className="text-interface-title-2 text-sys-color-text-primary font-semibold">
            Unfinished values exercises
          </h2>
          {valuesLoadError && <p role="alert">{valuesLoadError}</p>}
          {unfinishedValues.map((savedSession) => (
            <article
              key={savedSession.id}
              className="rounded-sys-radius-card-sm border-sys-color-border-default flex flex-wrap items-center justify-between gap-3 border p-4"
            >
              <div>
                <h3 className="text-sys-color-text-primary font-semibold">
                  {savedSession.exerciseType === 'team' ? 'Team-focused values exercise' : 'Personal values exercise'}
                </h3>
                <p className="text-interface-base-small text-sys-color-text-primary">
                  Updated {new Date(savedSession.updatedAt).toLocaleDateString()} · Round{' '}
                  {savedSession.currentRoundNumber}
                </p>
              </div>
              <a className="apc-button min-h-11" href={`/exercise?sessionId=${encodeURIComponent(savedSession.id)}`}>
                Resume {savedSession.exerciseType === 'team' ? 'team-focused' : 'personal'} values
              </a>
            </article>
          ))}
        </section>
      )}
      {behaviourReflectionEnabled && (scenarioAttempts.length > 0 || scenarioLoadError) && (
        <section className="mx-auto w-full max-w-4xl space-y-3 text-left" aria-labelledby="scenario-history-heading">
          <h2
            id="scenario-history-heading"
            className="text-interface-title-2 text-sys-color-text-primary font-semibold"
          >
            Scenario reflections
          </h2>
          {scenarioLoadError && <p role="alert">{scenarioLoadError}</p>}
          {scenarioAttempts.map((attempt) => (
            <article
              key={attempt.id}
              className="rounded-sys-radius-card-sm border-sys-color-border-default flex flex-wrap items-center justify-between gap-3 border p-4"
            >
              <div>
                <h3 className="text-sys-color-text-primary font-semibold">
                  {attempt.stage === 'active' ? 'Unfinished scenario reflection' : 'Completed scenario reflection'}
                </h3>
                <p className="text-interface-base-small text-sys-color-text-primary">
                  {attempt.stage === 'active'
                    ? `Situation ${attempt.position + 1} of ${attempt.scenarios.length}`
                    : 'Possible perspectives ready to revisit'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="apc-button min-h-11"
                  onClick={() => navigate(`/behaviour?attemptId=${encodeURIComponent(attempt.id)}`)}
                >
                  {attempt.stage === 'active' ? 'Resume' : 'Review'}
                </button>
                <button
                  type="button"
                  className="border-sys-color-border-strong text-interface-base-small text-sys-color-text-primary min-h-11 rounded border px-3"
                  onClick={async () => {
                    await getBehaviourAttemptServiceSingleton().deleteAttempt(attempt.id);
                    await refreshScenarioAttempts();
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
