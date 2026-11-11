import { useEffect, useRef, useState } from 'react';
import {
  createDefaultBehaviourReminderSettings,
  isValidBehaviourReminderSettings,
  type BehaviourReminderSettings,
} from '@/lib/domain/behaviourReminder';
import { composeBehaviourRecurringPrompt } from '@/lib/domain/behaviourRecurringPrompt';
import type {
  BehaviourAttempt,
  BehaviourConversationPromptOptions,
  ValuesConnectionInput,
} from '@/lib/services/behaviourAttemptService';
import { composeBehaviourConversationPrompt } from '@/lib/domain/behaviourPrompts';
import { BehaviourReminderSettings as BehaviourReminderSettingsControls } from '@/app/behaviour/BehaviourReminderSettings';
import { BehaviourValuesConnectionPicker } from '@/app/behaviour/BehaviourValuesConnectionPicker';
import { BehaviourPromptPreview } from '@/app/behaviour/BehaviourPromptPreview';

type PromptMode = 'conversation' | 'recurring';

export type BehaviourPromptWorkspaceProps = {
  attempt: BehaviourAttempt;
  composePrompt?: (options: BehaviourConversationPromptOptions) => Promise<string>;
  composeRecurringPrompt?: () => Promise<string>;
  saveReminderSettings?: (settings: BehaviourReminderSettings) => Promise<void>;
  onBackToReflections?: () => void;
  onSaveValuesConnection?: (connection: ValuesConnectionInput) => Promise<void>;
};

export function BehaviourPromptWorkspace({
  attempt,
  composePrompt,
  composeRecurringPrompt,
  saveReminderSettings,
  onBackToReflections,
  onSaveValuesConnection,
}: BehaviourPromptWorkspaceProps) {
  const [mode, setMode] = useState<PromptMode>('conversation');
  const [selectedPossibilities, setSelectedPossibilities] = useState<string[]>([]);
  const [includeContext, setIncludeContext] = useState(false);
  const [includeResponses, setIncludeResponses] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [includeValuesConnections, setIncludeValuesConnections] = useState(false);
  const [includeConnectionObservations, setIncludeConnectionObservations] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<BehaviourReminderSettings>(
    () => attempt.reminderSettings ?? createDefaultBehaviourReminderSettings()
  );
  const [savedReminderSettingsKey, setSavedReminderSettingsKey] = useState(() =>
    attempt.reminderSettings ? JSON.stringify(attempt.reminderSettings) : ''
  );
  const reminderSettingsKey = JSON.stringify(reminderSettings);
  const hasUnsavedReminderSettings = reminderSettingsKey !== savedReminderSettingsKey;
  const [isSavingReminderSettings, setIsSavingReminderSettings] = useState(false);
  const [reminderSettingsError, setReminderSettingsError] = useState('');
  const [hasEditedReminderSettings, setHasEditedReminderSettings] = useState(false);
  const [reminderSaveRetry, setReminderSaveRetry] = useState(0);
  const reminderSaveRequest = useRef(0);
  const savingReminderSettingsKey = useRef('');
  const [prompt, setPrompt] = useState(() =>
    composeBehaviourConversationPrompt({
      scenarios: attempt.scenarios,
      selectedPossibilityIds: [],
      includeOptionalContext: false,
      includeReflectionResponses: false,
      includeReflectionNotes: false,
      includeValuesConnections: false,
      includeConnectionObservations: false,
    })
  );
  const [isUpdatingPreview, setIsUpdatingPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const requestId = useRef(0);
  const recurringSelected = reminderSettings.selectedPossibilityIds;

  useEffect(() => {
    if (mode !== 'recurring' || !hasEditedReminderSettings || reminderSettingsKey === savedReminderSettingsKey) return;
    const allowedPossibilities = attempt.scenarios.flatMap((scenario) => {
      return (scenario.reveals ?? []).map((possibility) => {
        return `${scenario.id}:${possibility.id}`;
      });
    });
    if (!isValidBehaviourReminderSettings(reminderSettings, allowedPossibilities)) {
      setReminderSettingsError('Correct the recurring prompt preferences before they can be saved.');
      setIsSavingReminderSettings(false);
      return;
    }
    if (savingReminderSettingsKey.current === reminderSettingsKey) return;
    const requestId = ++reminderSaveRequest.current;
    const requestKey = reminderSettingsKey;
    savingReminderSettingsKey.current = requestKey;
    setIsSavingReminderSettings(true);
    setReminderSettingsError('');
    if (!saveReminderSettings) {
      savingReminderSettingsKey.current = '';
      setReminderSettingsError(
        'Your recurring prompt preferences remain on this page but could not be saved. Retry to keep them on this device.'
      );
      setIsSavingReminderSettings(false);
      return;
    }
    void saveReminderSettings(reminderSettings)
      .then(() => {
        if (reminderSaveRequest.current !== requestId) return;
        setSavedReminderSettingsKey(requestKey);
      })
      .catch(() => {
        if (reminderSaveRequest.current !== requestId) return;
        setReminderSettingsError(
          'Your recurring prompt preferences remain on this page but could not be saved. Retry to keep them on this device.'
        );
      })
      .finally(() => {
        if (savingReminderSettingsKey.current === requestKey) savingReminderSettingsKey.current = '';
        if (reminderSaveRequest.current === requestId) setIsSavingReminderSettings(false);
      });
  }, [
    attempt.scenarios,
    hasEditedReminderSettings,
    mode,
    reminderSettings,
    reminderSettingsKey,
    reminderSaveRetry,
    saveReminderSettings,
    savedReminderSettingsKey,
  ]);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    if (mode === 'recurring') {
      setPreviewError('');
      if (recurringSelected.length === 0) {
        setPrompt('');
        setIsUpdatingPreview(false);
        return;
      }
      if (hasUnsavedReminderSettings) {
        setPrompt('');
        setIsUpdatingPreview(false);
        return;
      }
      setIsUpdatingPreview(true);
      const compose = composeRecurringPrompt
        ? composeRecurringPrompt()
        : Promise.resolve(
            composeBehaviourRecurringPrompt({
              scenarios: attempt.scenarios,
              valuesConnections: attempt.valuesConnections,
              settings: reminderSettings,
              executionDate: new Date(),
            })
          );
      compose
        .then((text) => {
          if (requestId.current === currentRequest) setPrompt(text);
        })
        .catch(() => {
          if (requestId.current === currentRequest)
            setPreviewError(
              'The recurring prompt could not be created. Check your saved reminder choices and try again.'
            );
        })
        .finally(() => {
          if (requestId.current === currentRequest) setIsUpdatingPreview(false);
        });
      return;
    }

    if (!composePrompt) {
      setPrompt(
        composeBehaviourConversationPrompt({
          scenarios: attempt.scenarios,
          selectedPossibilityIds: selectedPossibilities,
          includeOptionalContext: includeContext,
          includeReflectionResponses: includeResponses,
          includeReflectionNotes: includeNotes,
          includeValuesConnections,
          includeConnectionObservations,
          valuesConnections: attempt.valuesConnections,
        })
      );
      setPreviewError('');
      return;
    }
    setIsUpdatingPreview(true);
    setPreviewError('');
    composePrompt({
      selectedPossibilityIds: selectedPossibilities,
      includeOptionalContext: includeContext,
      includeReflectionResponses: includeResponses,
      includeReflectionNotes: includeNotes,
      includeValuesConnections,
      includeConnectionObservations,
    })
      .then((text) => {
        if (requestId.current === currentRequest) setPrompt(text);
      })
      .catch(() => {
        if (requestId.current === currentRequest)
          setPreviewError('This prompt could not be updated. Your attempt remains saved on this device; try again.');
      })
      .finally(() => {
        if (requestId.current === currentRequest) setIsUpdatingPreview(false);
      });
  }, [
    attempt.scenarios,
    attempt.valuesConnections,
    composePrompt,
    composeRecurringPrompt,
    mode,
    selectedPossibilities,
    includeContext,
    includeResponses,
    includeNotes,
    includeValuesConnections,
    includeConnectionObservations,
    reminderSettings,
    reminderSettingsKey,
    hasUnsavedReminderSettings,
    recurringSelected.length,
  ]);

  const togglePossibility = (id: string) => {
    if (mode === 'recurring') {
      const selected = reminderSettings.selectedPossibilityIds;
      const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
      setReminderSettings({ ...reminderSettings, selectedPossibilityIds: next });
      setHasEditedReminderSettings(true);
      setReminderSettingsError('');
      return;
    }
    setSelectedPossibilities((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      return [...current, id];
    });
  };

  const updateReminderSetting = (updates: Partial<BehaviourReminderSettings>) => {
    setReminderSettings((current) => ({ ...current, ...updates }));
    setHasEditedReminderSettings(true);
    setReminderSettingsError('');
  };

  const selectedForCurrentMode = mode === 'recurring' ? recurringSelected : selectedPossibilities;
  const canCopy =
    Boolean(prompt) &&
    !isUpdatingPreview &&
    !previewError &&
    (mode !== 'recurring' || (!hasUnsavedReminderSettings && recurringSelected.length > 0));

  return (
    <section
      className="rounded-sys-radius-card-md border-sys-color-border-default bg-sys-color-surface-default mx-auto max-w-7xl border p-5 sm:p-8"
      aria-labelledby="conversation-prompt-heading"
    >
      <header className="mb-7 max-w-prose">
        {onBackToReflections && (
          <button
            type="button"
            className="apc-link mb-5 min-h-11 underline underline-offset-4"
            onClick={onBackToReflections}
          >
            Back to your reflections
          </button>
        )}
        <h1
          id="conversation-prompt-heading"
          className="text-interface-title-1 text-sys-color-text-primary font-semibold"
        >
          Continue this reflection
        </h1>
        <p className="page-intro max-w-prose">
          Choose what to include, then review and copy the complete text for a conversational service. Nothing is sent
          from this app.
        </p>
        <div className="mt-5 flex flex-wrap gap-3" role="group" aria-label="Prompt type">
          <button
            type="button"
            className="apc-button min-h-11"
            aria-pressed={mode === 'conversation'}
            onClick={() => setMode('conversation')}
          >
            Conversation prompt
          </button>
          <button
            type="button"
            className="apc-button min-h-11"
            aria-pressed={mode === 'recurring'}
            onClick={() => setMode('recurring')}
          >
            Recurring prompt
          </button>
        </div>
      </header>

      <div className="grid items-start gap-6 border-t border-[var(--editorial-line)] pt-8 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.4fr)]">
        <aside
          className="rounded-sys-radius-card-sm bg-ref-color-brand-surface-secondary space-y-6 p-5"
          aria-label="Prompt sharing choices"
        >
          <section aria-labelledby="possibilities-heading">
            <h2 id="possibilities-heading" className="text-interface-title-3 text-sys-color-text-primary font-semibold">
              Choose possibilities
            </h2>
            <p className="text-interface-base-small text-sys-color-text-primary mt-2">
              They remain possibilities to consider, even when you marked one as worth considering. Choose separately
              for this {mode === 'recurring' ? 'recurring reflection' : 'conversation prompt'}.
            </p>
            <div className="mt-4 space-y-4">
              {attempt.scenarios.flatMap((scenario) => {
                return (scenario.reveals ?? []).map((possibility) => {
                  const id = `${scenario.id}:${possibility.id}`;
                  return (
                    <label
                      key={id}
                      className="text-interface-base-small text-sys-color-text-primary flex min-h-11 cursor-pointer items-start gap-3"
                    >
                      <input
                        className="apc-checkbox__control mt-0.5 shrink-0"
                        type="checkbox"
                        checked={selectedForCurrentMode.includes(id)}
                        onChange={() => togglePossibility(id)}
                      />
                      <span>
                        <span className="block font-semibold">{scenario.prompt}</span>
                        <span className="mt-1 block">{possibility.perception}</span>
                      </span>
                    </label>
                  );
                });
              })}
              {!attempt.scenarios.some((scenario) => scenario.reveals?.length) && (
                <p className="text-interface-base-small text-sys-color-text-primary rounded-sys-radius-card-sm bg-sys-color-surface-default p-4">
                  No tailored possibilities were revealed for this attempt. The prompt will still include all six
                  situations and your response states.
                </p>
              )}
            </div>
          </section>

          {mode === 'conversation' ? (
            <>
              <fieldset className="border-sys-color-border-default space-y-3 border-t pt-5">
                <legend className="text-interface-base-default text-sys-color-text-primary mb-2 font-semibold">
                  Optional private details
                </legend>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={includeContext}
                    onChange={(event) => setIncludeContext(event.target.checked)}
                  />
                  Include optional context
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={includeResponses}
                    onChange={(event) => setIncludeResponses(event.target.checked)}
                  />
                  Include reflection response attribution
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(event) => setIncludeNotes(event.target.checked)}
                  />
                  Include reflection notes
                </label>
                <p className="text-interface-base-small text-sys-color-text-primary">
                  Your name, account details, and attempt identifier are never included.
                </p>
              </fieldset>
              <fieldset className="border-sys-color-border-default space-y-3 border-t pt-5">
                <legend className="text-interface-base-default text-sys-color-text-primary mb-2 font-semibold">
                  Values connections
                </legend>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={includeValuesConnections}
                    onChange={(event) => setIncludeValuesConnections(event.target.checked)}
                  />
                  Include my chosen public value connections
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={includeConnectionObservations}
                    onChange={(event) => setIncludeConnectionObservations(event.target.checked)}
                  />
                  Include my optional connection observations
                </label>
                {onSaveValuesConnection && (
                  <BehaviourValuesConnectionPicker attempt={attempt} onSave={onSaveValuesConnection} />
                )}
              </fieldset>
            </>
          ) : (
            <>
              <BehaviourReminderSettingsControls
                value={reminderSettings.schedule}
                onChange={(schedule) => updateReminderSetting({ schedule })}
              />
              <fieldset className="border-sys-color-border-default space-y-3 border-t pt-5">
                <legend className="text-interface-base-default text-sys-color-text-primary mb-2 font-semibold">
                  What to include
                </legend>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={reminderSettings.includeOptionalContext}
                    onChange={(event) => updateReminderSetting({ includeOptionalContext: event.target.checked })}
                  />
                  Include optional situation context
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={reminderSettings.includeReflectionResponses}
                    onChange={(event) => updateReminderSetting({ includeReflectionResponses: event.target.checked })}
                  />
                  Include my reflection responses
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={reminderSettings.includeReflectionNotes}
                    onChange={(event) => updateReminderSetting({ includeReflectionNotes: event.target.checked })}
                  />
                  Include my private reflection notes
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={reminderSettings.includeValuesConnections}
                    onChange={(event) => updateReminderSetting({ includeValuesConnections: event.target.checked })}
                  />
                  Include my chosen public value connections
                </label>
                <label className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-3">
                  <input
                    className="apc-checkbox__control shrink-0"
                    type="checkbox"
                    checked={reminderSettings.includeConnectionObservations}
                    onChange={(event) => updateReminderSetting({ includeConnectionObservations: event.target.checked })}
                  />
                  Include my optional connection observations
                </label>
                {onSaveValuesConnection && (
                  <BehaviourValuesConnectionPicker attempt={attempt} onSave={onSaveValuesConnection} />
                )}
              </fieldset>
              {reminderSettingsError && (
                <button
                  type="button"
                  className="apc-link min-h-11 underline underline-offset-4"
                  onClick={() => setReminderSaveRetry((value) => value + 1)}
                >
                  Retry saving prompt preferences
                </button>
              )}
              {reminderSettingsError && (
                <p className="text-ref-color-rag-red-text" role="alert">
                  {reminderSettingsError}
                </p>
              )}
              <p className="text-interface-base-small text-sys-color-text-primary" role="status" aria-live="polite">
                {isSavingReminderSettings
                  ? 'Saving prompt preferences on this device…'
                  : reminderSettingsError
                    ? 'Prompt preferences not saved yet.'
                    : hasUnsavedReminderSettings
                      ? 'Prompt preferences are not saved yet.'
                      : 'Prompt preferences saved on this device.'}
              </p>
              <p className="text-interface-base-small text-sys-color-text-primary rounded-sys-radius-card-sm bg-sys-color-surface-default p-4">
                This app has not scheduled or sent anything. In Microsoft 365 Copilot, create an agent using this
                reflection context, then run it manually once (a suggested prompt can help). After the response appears,
                use its menu to make it recurring, then set cadence, interval, time, and time zone in your Copilot
                experience and confirm those settings there. For another service, follow its own setup steps. This app
                cannot verify or update an external recurrence. When your context changes, update and review the prompt,
                then replace the recurrence in that service.
              </p>
            </>
          )}
        </aside>

        <BehaviourPromptPreview
          mode={mode}
          prompt={prompt}
          isUpdating={isUpdatingPreview}
          error={previewError}
          canCopy={canCopy}
          hasUnsavedReminderSettings={hasUnsavedReminderSettings}
          hasSelectedPossibility={recurringSelected.length > 0}
        />
      </div>
    </section>
  );
}
