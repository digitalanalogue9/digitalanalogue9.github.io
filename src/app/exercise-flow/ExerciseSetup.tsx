'use client';

import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import type { ExerciseType } from '@/lib/contracts/types';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { getGameConfig } from '@/lib/utils/config';

export function ExerciseSetup() {
  const navigate = useNavigate();
  const service = useExerciseService();
  const gameConfig = getGameConfig();
  const [targetCoreValues, setTargetCoreValues] = useState(gameConfig.defaultCoreValues);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('personal');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div
      className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default space-y-8 border px-6 py-8 text-center shadow-sm sm:px-10 sm:py-10`}
    >
      <section className="mx-auto max-w-2xl space-y-5" aria-labelledby="exercise-setup-heading">
        <h1 id="exercise-setup-heading" className="text-interface-title-1 text-sys-color-text-primary font-semibold">
          Set up your values exercise
        </h1>
        <p className="text-interface-base-default text-sys-color-text-primary sm:text-interface-base-large leading-relaxed">
          Sort value cards by importance, then choose how many values you would like to finish with.
        </p>
      </section>

      <form onSubmit={handleStart} className="mx-auto max-w-2xl space-y-7" aria-label="Set up values exercise">
        <fieldset className="space-y-4" disabled={isStarting}>
          <legend className="text-interface-title-1 text-sys-color-text-primary mx-auto max-w-xl font-semibold">
            Choose your set
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
            The team-focused set is an individual exercise about what matters to you at work. You can use your choices
            to start a conversation with others.
          </p>
        </fieldset>

        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          <label
            className="text-interface-title-1 text-sys-color-text-primary font-semibold"
            htmlFor="target-core-values"
          >
            How many values would you like to finish with?
          </label>
          <p id="target-core-values-help" className="text-interface-base-small text-sys-color-text-primary">
            Choose a target number for your final set.
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
    </div>
  );
}
