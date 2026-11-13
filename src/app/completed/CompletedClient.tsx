'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import { RecurringReflectionControls } from '@/app/completed/RecurringReflectionControls';
import { CompletedValuesCard } from '@/app/completed/CompletedValuesCard';
import type { CompletedSession, ExerciseType, SessionReflection } from '@/lib/contracts/types';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { downloadCompletedValuesHtml, downloadJsonFile, printCompletedValues } from '@/lib/utils/completedValuesExport';

const primaryActionButtonClasses = 'cv-button min-h-11 text-interface-base-small md:min-h-10';
const secondaryActionButtonClasses = `${primaryActionButtonClasses} cv-button--secondary`;

export default function CompletedClient({ sessionId }: { sessionId: string }) {
  const service = useExerciseService();
  const [completed, setCompleted] = useState<CompletedSession | null>(null);
  const [reflection, setReflection] = useState<SessionReflection>({ version: 1, values: {} });
  const [exerciseType, setExerciseType] = useState<ExerciseType>('personal');
  const [sessionReference, setSessionReference] = useState(sessionId);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [includedRecurringContextIds, setIncludedRecurringContextIds] = useState<string[]>([]);
  const [recurringCopyFeedback, setRecurringCopyFeedback] = useState<string | null>(null);
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
      setIncludedRecurringContextIds([]);
      setRecurringCopyFeedback(null);
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
          <Link to="/history" className={`${primaryActionButtonClasses} no-underline`}>
            Open History
          </Link>
          <Link
            to={{ pathname: '/exercise', search: `?${new URLSearchParams({ sessionId }).toString()}` }}
            className={`${secondaryActionButtonClasses} no-underline`}
          >
            Back to Board
          </Link>
        </div>
      </div>
    );
  }

  const replaySearch = `?${new URLSearchParams({ sessionId }).toString()}`;
  const recurringContextOptions = service.getRecurringReflectionContextOptions(
    exerciseType,
    completed.finalValues,
    reflection
  );
  const recurringPrompt = service.composeRecurringReflectionPrompt({
    exerciseType,
    selectedValues: completed.finalValues,
    reflection,
    includedContextIds: includedRecurringContextIds,
  });
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

  return (
    <div className="app-page-panel mx-auto w-full max-w-4xl space-y-8">
      <section className="space-y-8 print:hidden">
        <header className="space-y-4 border-b border-[var(--editorial-line)] pb-8">
          <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl">Reflect on your values</h1>
          <p className="page-intro max-w-[70ch]">
            Reflection is optional and saved on this device with this completed session. Your notes are not included in
            the standard JSON export. To back up saved notes, choose Export reflection backup in{' '}
            <Link to="/history">History</Link>.
          </p>
        </header>

        <CompletedValuesCard completed={completed} sessionReference={sessionReference} />

        <section
          className="space-y-4 border-t border-[var(--editorial-line)] pt-8"
          aria-labelledby="recurring-reflection-heading"
        >
          <h2
            id="recurring-reflection-heading"
            className="page-section-heading text-sys-color-text-primary text-3xl sm:text-4xl"
          >
            Recurring reflection
          </h2>
          <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
            Create a recurring prompt to reflect on your selected values over time. It includes those values and any
            saved reasons, goals or reflection notes you choose. Copy it into a service that supports scheduled tasks
            and follow its setup steps below.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <RecurringReflectionControls
              recurringPromptExpanded={recurringPromptExpanded}
              setRecurringPromptExpanded={setRecurringPromptExpanded}
              working={working}
              recurringContextOptions={recurringContextOptions}
              includedRecurringContextIds={includedRecurringContextIds}
              setIncludedRecurringContextIds={setIncludedRecurringContextIds}
              recurringPrompt={recurringPrompt}
              handleCopyRecurringPrompt={() => void handleCopyRecurringPrompt()}
              recurringCopyFeedback={recurringCopyFeedback}
            />
          </div>
        </section>
      </section>

      <section className="space-y-3 print:hidden">
        {actionError && (
          <p
            className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text mb-3 px-3 py-2"
            role="alert"
          >
            {actionError}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={secondaryActionButtonClasses} onClick={handlePrint}>
            Print
          </button>
          <button
            type="button"
            className={secondaryActionButtonClasses}
            onClick={() => void handleExportJson()}
            disabled={working}
          >
            Export JSON
          </button>
          <button type="button" className={secondaryActionButtonClasses} onClick={handleExportHtml}>
            Export HTML
          </button>
          <Link to="/history" className={`${secondaryActionButtonClasses} no-underline`}>
            Open History
          </Link>
          <Link
            to={{ pathname: '/replay', search: replaySearch }}
            className={`${secondaryActionButtonClasses} no-underline`}
          >
            Replay Session
          </Link>
          <Link
            to={{ pathname: '/reasoning', search: replaySearch }}
            className={`${primaryActionButtonClasses} no-underline`}
          >
            Back to reflection
          </Link>
        </div>
      </section>
    </div>
  );
}
