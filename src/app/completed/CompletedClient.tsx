'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import { RecurringReflectionControls } from '@/app/completed/RecurringReflectionControls';
import { CompletedValuesCard } from '@/app/completed/CompletedValuesCard';
import type { CompletedSession } from '@/lib/contracts/types';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { downloadCompletedValuesHtml, downloadJsonFile, printCompletedValues } from '@/lib/utils/completedValuesExport';

const primaryActionButtonClasses = 'cv-button min-h-11 text-interface-base-small md:min-h-10';
const secondaryActionButtonClasses = `${primaryActionButtonClasses} cv-button--secondary`;

export default function CompletedClient({ sessionId }: { sessionId: string }) {
  const service = useExerciseService();
  const [completed, setCompleted] = useState<CompletedSession | null>(null);
  const [recurringPrompt, setRecurringPrompt] = useState('');
  const [sessionReference, setSessionReference] = useState(sessionId);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [recurringCopyFeedback, setRecurringCopyFeedback] = useState<string | null>(null);
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
      const { exerciseType } = record.session;
      const { finalValues, reflection } = record.completedSession;
      const context = service.getRecurringReflectionContextOptions(exerciseType, finalValues, reflection);
      setRecurringPrompt(
        service.composeRecurringReflectionPrompt({
          exerciseType,
          selectedValues: finalValues,
          reflection,
          includedContextIds: context.map((option) => option.id),
        })
      );
      setRecurringCopyFeedback(null);
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
  const handleCopyRecurringPrompt = async () => {
    setRecurringCopyFeedback(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(recurringPrompt);
      setRecurringCopyFeedback('Prompt copied.');
    } catch (copyError) {
      setRecurringCopyFeedback(
        copyError instanceof Error ? `Could not copy prompt: ${copyError.message}` : 'Could not copy prompt.'
      );
    }
  };

  return (
    <div className="app-page-panel mx-auto w-full max-w-4xl space-y-8">
      <section className="space-y-8 print:hidden">
        <header className="space-y-4 border-b border-[var(--editorial-line)] pb-8">
          <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl">Your core values</h1>
          <p className="page-intro max-w-[70ch]">
            Your values and any notes you’ve added are saved on this device. If you download a backup, it will include
            your notes, so keep it somewhere private.
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
            Set up recurring reflection
          </h2>
          <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
            Use this prompt to reflect on your values over time. It includes your saved notes; you can edit it before
            copying.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <RecurringReflectionControls
              recurringPrompt={recurringPrompt}
              onPromptChange={(value) => {
                setRecurringPrompt(value);
                setRecurringCopyFeedback(null);
              }}
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
        {recurringCopyFeedback && (
          <p className="text-interface-base-small text-sys-color-text-secondary" role="status">
            {recurringCopyFeedback}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            to={{ pathname: '/reasoning', search: replaySearch }}
            className={`${secondaryActionButtonClasses} no-underline sm:mr-auto`}
          >
            Back to reflection
          </Link>
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
          <Link
            to={{ pathname: '/replay', search: replaySearch }}
            className={`${secondaryActionButtonClasses} no-underline`}
          >
            Replay Session
          </Link>
          <button type="button" className={primaryActionButtonClasses} onClick={() => void handleCopyRecurringPrompt()}>
            Copy prompt
          </button>
        </div>
      </section>
    </div>
  );
}
