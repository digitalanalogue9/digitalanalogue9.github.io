'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import type {
  BehaviourAttempt,
  PossibilityReflection,
  ReflectionResponse,
} from '@/lib/services/behaviourAttemptService';
import { BehaviourPromptWorkspace } from '@/app/behaviour/BehaviourPromptWorkspace';
import { BehaviourReflectionResults } from '@/app/behaviour/BehaviourReflectionResults';
import { getBehaviourAttemptServiceSingleton } from '@/lib/services/serviceSingleton';

const service = getBehaviourAttemptServiceSingleton();

export default function BehaviourReflectionClient() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [attempt, setAttempt] = useState<BehaviourAttempt | null>(null);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [retrySave, setRetrySave] = useState<(() => Promise<void>) | null>(null);
  const [showPromptWorkspace, setShowPromptWorkspace] = useState(false);

  useEffect(() => {
    const attemptId = searchParams.get('attemptId');
    if (!attemptId) return;
    let active = true;
    service
      .loadAttempt(attemptId)
      .then((loaded) => {
        if (active) {
          setAttempt(loaded);
          setPosition(loaded.position);
        }
      })
      .catch(() => {
        if (active)
          setError(
            'This saved reflection could not be opened. It may have been removed or use an unsupported version.'
          );
      });
    return () => {
      active = false;
    };
  }, [searchParams]);

  const start = async () => {
    setIsBusy(true);
    setError(null);
    try {
      const started = await service.startAttempt();
      setAttempt(started);
      setSearchParams({ attemptId: started.id }, { replace: true });
      setPosition(0);
    } catch {
      setError('This scenario reflection could not be started. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  const updateAnswer = async (answer: string) => {
    if (!attempt) return;
    const activeScenario = attempt.scenarios[position];
    setAttempt({
      ...attempt,
      scenarios: attempt.scenarios.map((scenario, index) => (index === position ? { ...scenario, answer } : scenario)),
    });
    const persist = async () => {
      setSaveStatus('saving');
      try {
        const saved = await service.answer(attempt.id, activeScenario.id, answer);
        setAttempt(saved);
        setError(null);
        setSaveStatus('saved');
        setRetrySave(null);
      } catch {
        setSaveStatus('error');
        setError('Your choice remains on this page but could not be saved. Retry to keep it on this device.');
        setRetrySave(() => persist);
      }
    };
    await persist();
  };

  const updateContext = async (context: string) => {
    if (!attempt) return;
    const activeScenario = attempt.scenarios[position];
    setAttempt({
      ...attempt,
      scenarios: attempt.scenarios.map((scenario, index) =>
        index === position ? { ...scenario, optionalContext: context } : scenario
      ),
    });
    const persist = async () => {
      setSaveStatus('saving');
      try {
        const saved = await service.updateContext(attempt.id, activeScenario.id, context);
        setAttempt(saved);
        setError(null);
        setSaveStatus('saved');
        setRetrySave(null);
      } catch {
        setSaveStatus('error');
        setError('Your context remains on this page but could not be saved. Retry to keep it on this device.');
        setRetrySave(() => persist);
      }
    };
    await persist();
  };

  const goTo = async (nextPosition: number) => {
    if (!attempt) return;
    try {
      const saved = await service.setPosition(attempt.id, nextPosition);
      setAttempt(saved);
      setPosition(nextPosition);
      setError(null);
    } catch {
      setError('Your current situation could not be saved. Your choice remains on this page. Please try again.');
    }
  };

  const finish = async () => {
    if (!attempt) return;
    setIsBusy(true);
    try {
      setAttempt(await service.finishAttempt(attempt.id));
    } catch {
      setError('This reflection could not be finished. Your choices are still on this page. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };
  const updateReflection = async (
    scenarioId: string,
    possibilityId: string,
    response: ReflectionResponse | undefined,
    note: string
  ) => {
    if (!attempt) return;
    const updatedScenarios = attempt.scenarios.map((scenario) => {
      if (scenario.id !== scenarioId) return scenario;
      const reflections = { ...scenario.reflections };
      if (response === undefined && note.length === 0) delete reflections[possibilityId];
      else {
        const reflection: PossibilityReflection = {};
        if (response !== undefined) reflection.response = response;
        if (note.length > 0) reflection.note = note;
        reflections[possibilityId] = reflection;
      }
      return { ...scenario, reflections: Object.keys(reflections).length > 0 ? reflections : undefined };
    });
    setAttempt({ ...attempt, scenarios: updatedScenarios });
    const persist = async () => {
      setSaveStatus('saving');
      try {
        const saved = await service.updateReflection(attempt.id, scenarioId, possibilityId, response, note);
        setAttempt(saved);
        setError(null);
        setSaveStatus('saved');
        setRetrySave(null);
      } catch {
        setSaveStatus('error');
        setError('Your reflection remains on this page but could not be saved. Retry to keep it on this device.');
        setRetrySave(() => persist);
      }
    };
    await persist();
  };

  if (!attempt) {
    return (
      <section
        className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default flex max-w-3xl flex-col border p-6 text-center sm:p-10`}
        aria-labelledby="behaviour-heading"
      >
        <h1 id="behaviour-heading" className="text-interface-title-1 text-sys-color-text-primary mb-4 font-semibold">
          Scenario reflection
        </h1>
        <p className="text-interface-base-default text-sys-color-text-primary mx-auto mb-3 max-w-prose">
          Consider six everyday situations at work and choose what you would most likely do. These are hypothetical
          choices, not observations or an assessment.
        </p>
        <p className="text-interface-base-small text-sys-color-text-primary mx-auto mb-8 max-w-prose">
          You can choose “It depends” or skip any situation. Possible perspectives appear only after you choose to
          finish.
        </p>
        <button type="button" className="apc-button mx-auto min-h-11" onClick={start} disabled={isBusy}>
          {isBusy ? 'Starting…' : 'Begin scenarios'}
        </button>
        {error && (
          <p role="alert" className="text-ref-color-rag-red-text mt-4">
            {error}
          </p>
        )}
        <Link
          className="text-interface-base-small text-ref-color-brand-primary mt-8 min-h-11 self-end underline underline-offset-4 focus-visible:outline-2"
          to="/"
        >
          Back to exercises
        </Link>
      </section>
    );
  }

  if (attempt.stage === 'finished') {
    if (showPromptWorkspace) {
      return (
        <BehaviourPromptWorkspace
          attempt={attempt}
          composePrompt={(options) => {
            return service.composeConversationPrompt(attempt.id, options);
          }}
          composeRecurringPrompt={() => {
            return service.composeRecurringPrompt(attempt.id);
          }}
          saveReminderSettings={async (settings) => {
            setAttempt(await service.updateReminderSettings(attempt.id, settings));
          }}
          onSaveValuesConnection={async (connection) => {
            setAttempt(await service.setValuesConnection(attempt.id, connection));
          }}
          onBackToReflections={() => {
            setShowPromptWorkspace(false);
          }}
        />
      );
    }
    return (
      <BehaviourReflectionResults
        attempt={attempt}
        isBusy={isBusy}
        saveStatus={saveStatus}
        error={error}
        retrySave={retrySave}
        onStartFresh={start}
        onContinuePrompt={() => {
          setShowPromptWorkspace(true);
        }}
        onUpdateReflection={updateReflection}
        onRetrySave={() => void retrySave?.()}
      />
    );
  }
  const scenario = attempt.scenarios[position];
  return (
    <section
      className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default max-w-4xl border p-6 sm:p-10`}
      aria-labelledby="scenario-heading"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          className="text-interface-base-small text-ref-color-brand-primary underline underline-offset-4 focus-visible:outline-2"
          onClick={() => navigate('/')}
        >
          Exit reflection
        </button>
        <p className="text-interface-base-small text-sys-color-text-primary" aria-live="polite">
          Situation {position + 1} of {attempt.scenarios.length}
        </p>
      </div>
      <p className="text-interface-base-small text-sys-color-text-primary mb-3">{scenario.context}</p>
      <h1 id="scenario-heading" className="text-interface-title-1 text-sys-color-text-primary mb-6 font-semibold">
        {scenario.prompt}
      </h1>
      <fieldset className="space-y-3" disabled={isBusy}>
        <legend className="text-interface-base-default text-sys-color-text-primary mb-3 font-semibold">
          What would you most likely do?
        </legend>
        {scenario.responses.map((response) => (
          <label
            key={response.id}
            className="rounded-sys-radius-card-sm border-sys-color-border-default text-interface-base-default text-sys-color-text-primary hover:bg-ref-color-brand-surface-primary flex cursor-pointer items-start gap-3 border p-4"
          >
            <input
              className="apc-selector__control mt-1"
              type="radio"
              name={`scenario-${scenario.id}`}
              value={response.id}
              checked={scenario.answer === response.id}
              onChange={() => updateAnswer(response.id)}
            />
            <span>{response.label}</span>
          </label>
        ))}
        <label className="rounded-sys-radius-card-sm border-sys-color-border-default text-interface-base-default text-sys-color-text-primary hover:bg-ref-color-brand-surface-primary flex cursor-pointer items-center gap-3 border p-4">
          <input
            className="apc-selector__control"
            type="radio"
            name={`scenario-${scenario.id}`}
            value="depends"
            checked={scenario.answer === 'depends'}
            onChange={() => updateAnswer('depends')}
          />
          It depends
        </label>
        <label className="rounded-sys-radius-card-sm border-sys-color-border-default text-interface-base-default text-sys-color-text-primary hover:bg-ref-color-brand-surface-primary flex cursor-pointer items-center gap-3 border p-4">
          <input
            className="apc-selector__control"
            type="radio"
            name={`scenario-${scenario.id}`}
            value="skip"
            checked={scenario.answer === 'skip'}
            onChange={() => updateAnswer('skip')}
          />
          Skip this situation
        </label>
      </fieldset>
      <label
        htmlFor="scenario-context"
        className="text-interface-base-small text-sys-color-text-primary mt-6 block font-semibold"
      >
        Optional context
      </label>
      <textarea
        id="scenario-context"
        className="apc-field__control mt-2 min-h-24 w-full"
        value={scenario.optionalContext ?? ''}
        onChange={(event) => updateContext(event.target.value)}
        placeholder="Add anything that would shape your response"
      />
      <p className="text-interface-base-small text-sys-color-text-primary mt-2" role="status" aria-live="polite">
        {saveStatus === 'saving'
          ? 'Saving on this device…'
          : saveStatus === 'saved'
            ? 'Saved on this device'
            : 'Not saved yet'}
      </p>
      {retrySave && (
        <button
          type="button"
          className="text-interface-base-small text-ref-color-brand-primary mt-2 min-h-11 underline underline-offset-4"
          onClick={() => void retrySave()}
        >
          Retry saving
        </button>
      )}
      {error && (
        <p role="alert" className="text-ref-color-rag-red-text mt-4">
          {error}
        </p>
      )}
      <div className="mt-7 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          className="apc-button min-h-11"
          onClick={() => void goTo(Math.max(0, position - 1))}
          disabled={position === 0 || isBusy}
        >
          Previous
        </button>
        {position < attempt.scenarios.length - 1 ? (
          <button
            type="button"
            className="apc-button min-h-11"
            onClick={() => void goTo(position + 1)}
            disabled={isBusy}
          >
            Next situation
          </button>
        ) : (
          <button type="button" className="apc-button min-h-11" onClick={finish} disabled={isBusy}>
            {isBusy ? 'Finishing…' : 'Finish and see perspectives'}
          </button>
        )}
      </div>
    </section>
  );
}
