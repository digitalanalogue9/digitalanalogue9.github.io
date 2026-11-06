'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import { ExerciseType } from '@/lib/contracts/types';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { getGameConfig } from '@/lib/utils/config';
import { isBehaviourReflectionEnabled } from '@/lib/utils/config/featureFlags';
import type { BehaviourAttempt } from '@/lib/services/behaviourAttemptService';
import { getBehaviourAttemptServiceSingleton } from '@/lib/services/serviceSingleton';

type HomeOutletContext = {
  setHomeBackdrop?: (backdrop: 'overview' | 'values') => void;
};

export default function HomeClient({ initialPurposeChosen = false }: { initialPurposeChosen?: boolean }) {
  const navigate = useNavigate();
const outletContext = useOutletContext<HomeOutletContext>();
const setHomeBackdrop = outletContext?.setHomeBackdrop;
  const service = useExerciseService();
  const gameConfig = getGameConfig();
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();
  const [targetCoreValues, setTargetCoreValues] = useState(gameConfig.defaultCoreValues);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('personal');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purposeChosen, setPurposeChosen] = useState(initialPurposeChosen || !behaviourReflectionEnabled);
  const [scenarioAttempts, setScenarioAttempts] = useState<BehaviourAttempt[]>([]);
  const [scenarioLoadError, setScenarioLoadError] = useState<string | null>(null);
  const [unfinishedValues, setUnfinishedValues] = useState<Awaited<ReturnType<typeof service.listSessions>>>([]);
  const [valuesLoadError, setValuesLoadError] = useState<string | null>(null);

useEffect(() => {
setHomeBackdrop?.(purposeChosen ? 'values' : 'overview');
}, [purposeChosen, setHomeBackdrop]);

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

  const handleStart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsStarting(true);
    try {
      const record = await service.startSession({
        targetCoreValues,
        cardsInGame: gameConfig.maxCards,
        exerciseType,
      });
      navigate({
        pathname: '/exercise',
        search: `?${new URLSearchParams({ sessionId: record.session.id }).toString()}`,
      });
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : 'Failed to start session.');
      setIsStarting(false);
    }
  };

  if (!purposeChosen) {
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
            <button type="button" className="apc-button min-h-11" onClick={() => setPurposeChosen(true)}>
              Sort values
            </button>
          </article>
          {behaviourReflectionEnabled && (
            <article className="rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default flex flex-col items-start border p-6">
              <h3 className="text-interface-title-2 text-sys-color-text-primary font-semibold">
                Explore your behaviour
              </h3>
              <p className="text-interface-base-small text-sys-color-text-primary my-3 flex-1">
                <span className="block font-semibold">What do others see that I don’t?</span>
                Choose how you might respond to six situations, then consider possible intentions and perspectives.
                These are possibilities to reflect on, not facts about what others think.
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

  return (
    <div
      className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default space-y-8 border px-6 py-8 text-center shadow-sm sm:px-10 sm:py-10`}
    >
      <section className="mx-auto max-w-2xl space-y-5" aria-labelledby="home-heading">
        <h1 id="home-heading" className="text-interface-title-1 text-sys-color-text-primary font-semibold">
          Explore what matters to you
        </h1>
        <p className="text-interface-base-default text-sys-color-text-primary sm:text-interface-base-large leading-relaxed">
          Sort value cards to identify what matters to you. Your final values can be a starting point for reflecting on
          the choices you make and how you want to work with others.
        </p>
      </section>

      <form onSubmit={handleStart} className="mx-auto max-w-2xl space-y-7" aria-label="Start Core Values session">
        <fieldset className="space-y-4" disabled={isStarting}>
          <legend className="text-interface-title-1 text-sys-color-text-primary mx-auto max-w-xl font-semibold">
            Choose your focus
          </legend>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <label className="text-interface-base-large text-sys-color-text-primary inline-flex items-center gap-3">
              <input
                type="radio"
                name="exercise-type"
                value="personal"
                checked={exerciseType === 'personal'}
                onChange={() => setExerciseType('personal')}
                className="apc-selector__control"
              />
              <span>Personal values</span>
            </label>
            <label className="text-interface-base-large text-sys-color-text-primary inline-flex items-center gap-3">
              <input
                type="radio"
                name="exercise-type"
                value="team"
                checked={exerciseType === 'team'}
                onChange={() => setExerciseType('team')}
                className="apc-selector__control"
              />
              <span>Team-focused values</span>
            </label>
          </div>
          <p className="text-interface-base-small text-sys-color-text-primary">
            The team option uses values relevant to working together.
          </p>
        </fieldset>

        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          <label
            className="text-interface-title-1 text-sys-color-text-primary font-semibold"
            htmlFor="target-core-values"
          >
            Target number of core values
          </label>
          <p id="target-core-values-help" className="text-interface-base-small text-sys-color-text-primary">
            How many values would you like in your final set?
          </p>
          <input
            id="target-core-values"
            aria-describedby="target-core-values-help"
            type="number"
            min={1}
            max={gameConfig.maxCards}
            className="apc-field__control w-24 text-center not-focus:[appearance:textfield] focus:[&::-webkit-inner-spin-button]:opacity-100 [&:not(:focus)::-webkit-inner-spin-button]:appearance-none [&:not(:focus)::-webkit-outer-spin-button]:appearance-none"
            value={targetCoreValues}
            onChange={(event) => setTargetCoreValues(Number(event.target.value))}
            disabled={isStarting}
            required
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="submit" className="apc-button min-h-11 w-full sm:w-auto" disabled={isStarting}>
            {isStarting ? 'Starting...' : 'Start exercise'}
          </button>
          <button
            type="button"
            className="rounded-sys-radius-button-sm border-sys-color-border-strong text-interface-base-default text-sys-color-text-primary hover:bg-ref-color-brand-primary-hover inline-flex min-h-11 w-full items-center justify-center border px-4 py-2 font-normal transition-colors hover:text-white active:translate-y-px disabled:opacity-60 sm:w-auto"
            onClick={() => navigate('/history')}
            disabled={isStarting}
          >
            View history
          </button>
        </div>
      </form>
      <p className="text-interface-base-small text-sys-color-text-primary">Your progress is saved in this browser.</p>
      {error && (
        <p
          className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
          role="alert"
        >
          {error}
        </p>
      )}
      {behaviourReflectionEnabled && (
        <div className="flex justify-end">
          <button
            type="button"
            className="text-interface-base-small text-ref-color-brand-primary min-h-11 underline underline-offset-4 focus-visible:outline-2"
            onClick={() => setPurposeChosen(false)}
          >
            Back to exercises
          </button>
        </div>
      )}
    </div>
  );
}
