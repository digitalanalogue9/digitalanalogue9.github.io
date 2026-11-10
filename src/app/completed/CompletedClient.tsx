'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import { ReflectionValueList } from '@/app/completed/ReflectionValueList';
import { RecurringReflectionControls } from '@/app/completed/RecurringReflectionControls';
import { OneOffCoachingPromptControls } from '@/app/completed/OneOffCoachingPromptControls';
import { CompletedValuesCard } from '@/app/completed/CompletedValuesCard';
import { isReflectionFirstResultsEnabled } from '@/app/completed/reflectionFirstResults';
import { ReflectionSummary } from '@/app/completed/ReflectionSummary';
import type {
  CompletedSession,
  ExerciseType,
  RelationshipReflectionNotes,
  SchedulePreferences,
  SessionReflection,
  ValueReflectionNotes,
} from '@/lib/contracts/types';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { downloadCompletedValuesHtml, downloadJsonFile, printCompletedValues } from '@/lib/utils/completedValuesExport';

const actionButtonClasses =
  'inline-flex min-h-11 items-center gap-2 rounded-sys-radius-button-sm border border-sys-color-border-strong px-4 py-2 text-interface-base-small font-semibold text-sys-color-text-primary transition-colors hover:bg-sys-color-surface-subtle disabled:opacity-60 md:min-h-9';

function getDefaultSchedulePreferences(): SchedulePreferences {
  return {
    frequency: 'daily',
    localTime: '09:00',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };
}

export default function CompletedClient({ sessionId }: { sessionId: string }) {
  const service = useExerciseService();
  const reflectionFirstResultsEnabled = isReflectionFirstResultsEnabled();
  const [completed, setCompleted] = useState<CompletedSession | null>(null);
  const [reflection, setReflection] = useState<SessionReflection>({ version: 1, values: {} });
  const [exerciseType, setExerciseType] = useState<ExerciseType>('personal');
  const [sessionReference, setSessionReference] = useState(sessionId);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [reflectionDirty, setReflectionDirty] = useState(false);
  const [schedulePreferences, setSchedulePreferences] = useState<SchedulePreferences>(getDefaultSchedulePreferences);
  const [includedCoachingContextIds, setIncludedCoachingContextIds] = useState<string[]>([]);
  const [includedRecurringContextIds, setIncludedRecurringContextIds] = useState<string[]>([]);
  const [coachingCopyFeedback, setCoachingCopyFeedback] = useState<string | null>(null);
  const [recurringCopyFeedback, setRecurringCopyFeedback] = useState<string | null>(null);
  const [coachingPromptExpanded, setCoachingPromptExpanded] = useState(false);
  const [recurringPromptExpanded, setRecurringPromptExpanded] = useState(false);
  const loadSequenceRef = useRef(0);

  const loadSession = useCallback(async () => {
    const requestSequence = ++loadSequenceRef.current;
    if (!sessionId) {
      setLoadError('Missing session id.');
      setCompleted(null);
      setSessionReference(sessionId);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);
    setActionError(null);
    setCompleted(null);
    setSessionReference(sessionId);

    try {
      const record = await service.loadSession(sessionId);
      if (requestSequence !== loadSequenceRef.current) return;
      if (!record.completedSession) {
        throw new Error('Completed values are unavailable for this session.');
      }
      setCompleted(record.completedSession);
      setReflection(record.completedSession.reflection ?? { version: 1, values: {} });
      setSchedulePreferences(
        record.completedSession.reflection?.schedulePreferences ?? getDefaultSchedulePreferences()
      );
      setIncludedCoachingContextIds([]);
      setIncludedRecurringContextIds([]);
      setCoachingCopyFeedback(null);
      setRecurringCopyFeedback(null);
      setReflectionDirty(false);
      setExerciseType(record.session.exerciseType);
      setSessionReference(record.session.id);
    } catch (loadError) {
      if (requestSequence !== loadSequenceRef.current) return;
      setLoadError(loadError instanceof Error ? loadError.message : 'Failed to load completed values.');
    } finally {
      if (requestSequence === loadSequenceRef.current) {
        setLoading(false);
      }
    }
  }, [service, sessionId]);

  const handleSaveReflection = useCallback(async () => {
    setWorking(true);
    setActionError(null);
    try {
      const saved = await service.saveReflection(sessionId, { ...reflection, schedulePreferences });
      setCompleted(saved);
      setReflection(saved.reflection ?? { version: 1, values: {} });
      setReflectionDirty(false);
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Reflection could not be saved.');
    } finally {
      setWorking(false);
    }
  }, [service, sessionId, reflection, schedulePreferences]);

  const updateSchedulePreferences = (next: SchedulePreferences) => {
    setSchedulePreferences(next);
    setReflectionDirty(true);
  };

  const updateValueReflection = useCallback((valueId: string, field: keyof ValueReflectionNotes, value: string) => {
    setReflectionDirty(true);
    setReflection((current) => ({
      ...current,
      values: {
        ...current.values,
        [valueId]: { ...current.values[valueId], [field]: value },
      },
    }));
  }, []);

  const updateSuggestionResponse = useCallback(
    (valueId: string, suggestionId: string, response: 'recognised' | 'rejected' | 'unsure') => {
      setReflectionDirty(true);
      setReflection((current) => {
        const valueNotes = current.values[valueId] ?? {};
        return {
          ...current,
          values: {
            ...current.values,
            [valueId]: {
              ...valueNotes,
              suggestions: { ...valueNotes.suggestions, [suggestionId]: response },
            },
          },
        };
      });
    },
    []
  );

  const updateRelationshipReflection = useCallback(
    (relationshipId: string, field: keyof RelationshipReflectionNotes, value: string) => {
      setReflectionDirty(true);
      setReflection((current) => ({
        ...current,
        relationships: {
          ...current.relationships,
          [relationshipId]: { ...current.relationships?.[relationshipId], [field]: value },
        },
      }));
    },
    []
  );

  useEffect(() => {
    void loadSession();
    return () => {
      loadSequenceRef.current += 1;
    };
  }, [loadSession]);

  const handlePrint = useCallback(() => {
    if (!completed) return;
    setActionError(null);
    try {
      printCompletedValues(sessionReference, completed);
    } catch (printError) {
      setActionError(printError instanceof Error ? printError.message : 'Print failed.');
    }
  }, [completed, sessionReference]);

  const handleExportHtml = useCallback(() => {
    if (!completed) return;
    setActionError(null);
    try {
      downloadCompletedValuesHtml(sessionReference, completed);
    } catch (exportError) {
      setActionError(exportError instanceof Error ? exportError.message : 'HTML export failed.');
    }
  }, [completed, sessionReference]);

  const handleExportJson = useCallback(async () => {
    setWorking(true);
    setActionError(null);
    try {
      const payload = await service.exportSession(sessionId);
      downloadJsonFile(`core-values-${sessionReference}`, payload);
    } catch (exportError) {
      setActionError(exportError instanceof Error ? exportError.message : 'JSON export failed.');
    } finally {
      setWorking(false);
    }
  }, [service, sessionId, sessionReference]);

  if (loading) {
    return (
      <div className={`${nonExercisePageContainerClassName} space-y-4`} role="status" aria-live="polite">
        <div className="border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default border p-6 shadow-sm">
          <div className="bg-sys-color-surface-subtle rounded-sys-radius-button-sm h-4 w-32 animate-pulse motion-reduce:animate-none" />
          <div className="bg-sys-color-surface-subtle rounded-sys-radius-button-sm mt-3 h-8 w-72 animate-pulse motion-reduce:animate-none" />
          <div className="bg-sys-color-surface-subtle rounded-sys-radius-button-sm mt-5 h-40 animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  if (loadError || !completed) {
    return (
      <div
        className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border p-6 shadow-sm`}
      >
        <p
          className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
          role="alert"
        >
          {loadError ?? 'Completed values are unavailable for this session.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/history" className="apc-button text-sys-color-text-inverse min-h-11 no-underline md:min-h-10">
            Open History
          </Link>
          <Link
            to={{ pathname: '/exercise', search: `?${new URLSearchParams({ sessionId }).toString()}` }}
            className="rounded-sys-radius-button-sm border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle inline-flex min-h-11 items-center border px-4 py-2 no-underline transition-colors motion-reduce:transition-none md:min-h-9"
          >
            Back to Board
          </Link>
        </div>
      </div>
    );
  }

  const replaySearch = `?${new URLSearchParams({ sessionId }).toString()}`;
  const coachingContextOptions = service.getOneOffCoachingContextOptions(
    exerciseType,
    completed.finalValues,
    reflection
  );
  const coachingPrompt = service.composeOneOffCoachingPrompt({
    exerciseType,
    selectedValues: completed.finalValues,
    reflection,
    includedContextIds: includedCoachingContextIds,
  });
  const recurringContextOptions = service.getRecurringReflectionContextOptions(
    exerciseType,
    completed.finalValues,
    reflection
  );
  const recurringPrompt = service.composeRecurringReflectionPrompt({
    exerciseType,
    selectedValues: completed.finalValues,
    reflection,
    schedulePreferences,
    includedContextIds: includedRecurringContextIds,
  });
  const handleCopyCoachingPrompt = async () => {
    setCoachingCopyFeedback(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(coachingPrompt);
      setCoachingCopyFeedback('Copied the preview.');
    } catch (copyError) {
      setCoachingCopyFeedback(
        copyError instanceof Error ? `Could not copy preview: ${copyError.message}` : 'Could not copy preview.'
      );
    }
  };
  const handleCopyRecurringPrompt = async () => {
    setRecurringCopyFeedback(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(recurringPrompt);
      setRecurringCopyFeedback('Copied the preview.');
    } catch (copyError) {
      setRecurringCopyFeedback(
        copyError instanceof Error ? `Could not copy preview: ${copyError.message}` : 'Could not copy preview.'
      );
    }
  };

  const sessionGoalEditor = (
    <div>
      <label
        htmlFor="reflection-goal"
        className="text-interface-base-small text-sys-color-text-primary mb-1 block font-semibold"
      >
        Session goal (optional)
      </label>
      <textarea
        id="reflection-goal"
        aria-label="Session goal"
        className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-default text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-20 w-full border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
        value={reflection.goal ?? ''}
        onChange={(event) => {
          setReflectionDirty(true);
          setReflection((current) => ({ ...current, goal: event.target.value }));
        }}
        disabled={working}
      />
    </div>
  );

  return (
    <div className={`${nonExercisePageContainerClassName} space-y-4`}>
      <div className="print:hidden"></div>
      {!reflectionFirstResultsEnabled && (
        <CompletedValuesCard completed={completed} sessionReference={sessionReference} />
      )}

      <details
        open={reflectionFirstResultsEnabled}
        className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border shadow-sm print:hidden"
      >
        <summary
          aria-label="Reflect on your values"
          className="text-interface-base-large text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-11 cursor-pointer p-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Reflect on your values
        </summary>
        <div className="border-sys-color-border-default space-y-5 border-t p-4 sm:p-6">
          <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
            Reflection is optional and saved on this device with this completed session. Your notes are not included in
            the standard JSON export. To back up saved notes, choose Export reflection backup in{' '}
            <Link to="/history">History</Link>.
          </p>
          {reflectionFirstResultsEnabled ? (
            <details className="rounded-sys-radius-button-sm border-sys-color-border-default border p-3">
              <summary
                aria-label="Session goal (optional)"
                className="text-interface-base-small text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-11 cursor-pointer py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Session goal (optional)
              </summary>
              <div className="pt-3">{sessionGoalEditor}</div>
            </details>
          ) : (
            sessionGoalEditor
          )}
          <ReflectionSummary
            summary={service.getReflectionSummary(exerciseType, completed.finalValues, reflection)}
            exerciseType={exerciseType}
          />
          {service.getReflectionRelationships(exerciseType, completed.finalValues).length > 0 && (
            <section aria-labelledby="value-relationships-heading" className="space-y-3">
              <h2
                id="value-relationships-heading"
                className="text-interface-base-large text-sys-color-text-primary font-semibold"
              >
                Values in context
              </h2>
              <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
                Selected values can complement each other or pull in different directions depending on the situation.
                These are possibilities to explore, not fixed opposites.
              </p>
              {service.getReflectionRelationships(exerciseType, completed.finalValues).map((relationship) => (
                <fieldset
                  key={relationship.id}
                  className="rounded-sys-radius-button-sm border-sys-color-border-default space-y-3 border p-4"
                >
                  <legend className="text-interface-base-small text-sys-color-text-primary px-1 font-semibold">
                    {relationship.title}
                  </legend>
                  <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
                    {relationship[exerciseType]}
                  </p>
                  <label
                    className="text-interface-base-small text-sys-color-text-primary block font-semibold"
                    htmlFor={`relationship-observation-${relationship.id}`}
                  >
                    Observation (optional)
                  </label>
                  <textarea
                    id={`relationship-observation-${relationship.id}`}
                    aria-label={`Observation for ${relationship.title}`}
                    className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-default text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-20 w-full border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
                    value={reflection.relationships?.[relationship.id]?.observation ?? ''}
                    onChange={(event) =>
                      updateRelationshipReflection(relationship.id, 'observation', event.target.value)
                    }
                    disabled={working}
                  />
                  <label
                    className="text-interface-base-small text-sys-color-text-primary block font-semibold"
                    htmlFor={`relationship-action-${relationship.id}`}
                  >
                    Practical action (optional)
                  </label>
                  <textarea
                    id={`relationship-action-${relationship.id}`}
                    aria-label={`Action for ${relationship.title}`}
                    className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-default text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-20 w-full border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
                    value={reflection.relationships?.[relationship.id]?.action ?? ''}
                    onChange={(event) => updateRelationshipReflection(relationship.id, 'action', event.target.value)}
                    disabled={working}
                  />
                </fieldset>
              ))}
            </section>
          )}
          <ReflectionValueList
            selectedValues={completed.finalValues}
            exerciseType={exerciseType}
            reflection={reflection}
            working={working}
            updateValueReflection={updateValueReflection}
            updateSuggestionResponse={updateSuggestionResponse}
          />
          <button
            type="button"
            className={actionButtonClasses}
            onClick={() => void handleSaveReflection()}
            disabled={working}
          >
            {working ? 'Saving reflection…' : 'Save reflection'}
          </button>
          {reflectionDirty ? (
            <p className="text-interface-base-small text-sys-color-text-secondary" role="status">
              Unsaved changes. Save to keep these notes on this device.
            </p>
          ) : completed.reflection ? (
            <p className="text-interface-base-small text-sys-color-text-secondary" role="status">
              Reflection saved on this device.
            </p>
          ) : null}
          <OneOffCoachingPromptControls
            coachingPromptExpanded={coachingPromptExpanded}
            setCoachingPromptExpanded={setCoachingPromptExpanded}
            coachingContextOptions={coachingContextOptions}
            includedCoachingContextIds={includedCoachingContextIds}
            setIncludedCoachingContextIds={setIncludedCoachingContextIds}
            coachingPrompt={coachingPrompt}
            handleCopyCoachingPrompt={() => void handleCopyCoachingPrompt()}
            coachingCopyFeedback={coachingCopyFeedback}
          />
        </div>
        <RecurringReflectionControls
          recurringPromptExpanded={recurringPromptExpanded}
          setRecurringPromptExpanded={setRecurringPromptExpanded}
          schedulePreferences={schedulePreferences}
          updateSchedulePreferences={updateSchedulePreferences}
          working={working}
          recurringContextOptions={recurringContextOptions}
          includedRecurringContextIds={includedRecurringContextIds}
          setIncludedRecurringContextIds={setIncludedRecurringContextIds}
          recurringPrompt={recurringPrompt}
          handleCopyRecurringPrompt={() => void handleCopyRecurringPrompt()}
          recurringCopyFeedback={recurringCopyFeedback}
        />
      </details>

      {reflectionFirstResultsEnabled && (
        <details className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border shadow-sm">
          <summary
            aria-label="Original results"
            className="text-interface-base-large text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-11 cursor-pointer p-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Original results
          </summary>
          <div className="border-sys-color-border-default border-t p-4 sm:p-6">
            <CompletedValuesCard completed={completed} sessionReference={sessionReference} />
          </div>
        </details>
      )}

      <section className="rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border p-4 shadow-sm print:hidden">
        {actionError && (
          <p
            className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text mb-3 px-3 py-2"
            role="alert"
          >
            {actionError}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" className={actionButtonClasses} onClick={handlePrint}>
            <Printer className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Print
          </button>
          <button
            type="button"
            className={actionButtonClasses}
            onClick={() => void handleExportJson()}
            disabled={working}
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Export JSON
          </button>
          <button type="button" className={actionButtonClasses} onClick={handleExportHtml}>
            <FileText className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Export HTML
          </button>
          <Link to="/history" className="apc-button text-sys-color-text-inverse min-h-11 no-underline md:min-h-10">
            Open History
          </Link>
          <Link
            to={{ pathname: '/replay', search: replaySearch }}
            className="rounded-sys-radius-button-sm border-sys-color-border-strong text-interface-base-small text-sys-color-text-primary hover:bg-sys-color-surface-subtle inline-flex min-h-11 items-center border px-4 py-2 font-semibold no-underline transition-colors motion-reduce:transition-none md:min-h-9"
          >
            Replay Session
          </Link>
        </div>
      </section>
    </div>
  );
}
