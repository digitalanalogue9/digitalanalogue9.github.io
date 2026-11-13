'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import type { CompletedSession } from '@/lib/contracts/types';
import {
  copyCompletedValuesText,
  downloadJsonFile,
  formatCompletedValuesText,
  printCompletedValues,
} from '@/lib/utils/completedValuesExport';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { exportSessionData } from '@/lib/db/canonicalSessionRepository';
import ImportSection from './ImportSection';
import HistorySessionSelector from './HistorySessionSelector';
import { historyButtonClassName } from '@/app/history/constants/buttonStyles';
import { isBehaviourReflectionEnabled } from '@/lib/utils/config/featureFlags';
import { useNavigate } from 'react-router-dom';
import type { BehaviourAttempt } from '@/lib/services/behaviourAttemptService';
import { getBehaviourAttemptServiceSingleton } from '@/lib/services/serviceSingleton';

type ExerciseService = ReturnType<typeof useExerciseService>;
type Session = Awaited<ReturnType<ExerciseService['listSessions']>>[number];
type CompletedValuesLoadState =
  | {
      status: 'loading';
    }
  | {
      status: 'loaded';
      completedSession: CompletedSession;
    }
  | {
      status: 'error';
      message: string;
    };

export default function HistoryClient() {
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();
  const service = useExerciseService();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [scenarioAttempts, setScenarioAttempts] = useState<BehaviourAttempt[]>([]);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  const [includeScenarioPrivateText, setIncludeScenarioPrivateText] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isImportError, setIsImportError] = useState(false);
  const [importText, setImportText] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [completedValuesLoads, setCompletedValuesLoads] = useState<Record<string, CompletedValuesLoadState>>({});
  const [copyingCompletedValuesSessionId, setCopyingCompletedValuesSessionId] = useState<string | null>(null);
  const [printingCompletedValuesSessionId, setPrintingCompletedValuesSessionId] = useState<string | null>(null);
  const [copiedCompletedValuesSessionId, setCopiedCompletedValuesSessionId] = useState<string | null>(null);
  const loadSequenceRef = useRef(0);
  const completedValuesPromisesRef = useRef<Record<string, Promise<CompletedSession>>>({});
  const copiedFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const loadSessions = useCallback(async () => {
    const requestSequence = ++loadSequenceRef.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const items = await service.listSessions();
      if (requestSequence !== loadSequenceRef.current) return;
      setSessions(items);
    } catch (loadError) {
      if (requestSequence !== loadSequenceRef.current) return;
      setLoadError(loadError instanceof Error ? loadError.message : 'Unable to load history.');
    } finally {
      if (requestSequence === loadSequenceRef.current) {
        setIsLoading(false);
      }
    }
  }, [service]);

  useEffect(() => {
    void loadSessions();
    if (behaviourReflectionEnabled) {
      void getBehaviourAttemptServiceSingleton()
        .listAttempts()
        .then(setScenarioAttempts)
        .catch(() => setScenarioError('Behaviour reflections could not be loaded.'));
    }
    return () => {
      isMountedRef.current = false;
      loadSequenceRef.current += 1;
      if (copiedFeedbackTimeoutRef.current) {
        clearTimeout(copiedFeedbackTimeoutRef.current);
      }
    };
  }, [behaviourReflectionEnabled, loadSessions]);

  const ensureCompletedSession = useCallback(
    async (sessionId: string) => {
      const cachedCompletedValues = completedValuesLoads[sessionId];
      if (cachedCompletedValues?.status === 'loaded') {
        return cachedCompletedValues.completedSession;
      }

      const pendingCompletedValues = completedValuesPromisesRef.current[sessionId];
      if (pendingCompletedValues) {
        return pendingCompletedValues;
      }

      setCompletedValuesLoads((prev) => ({
        ...prev,
        [sessionId]: {
          status: 'loading',
        },
      }));

      const completedValuesPromise = service
        .loadSession(sessionId)
        .then((record) => {
          const completedSession = record.completedSession;
          if (!completedSession) {
            throw new Error('Completed values are unavailable for this session.');
          }

          if (isMountedRef.current) {
            setCompletedValuesLoads((prev) => ({
              ...prev,
              [sessionId]: {
                status: 'loaded',
                completedSession,
              },
            }));
          }

          return completedSession;
        })
        .catch((completedValuesError) => {
          const message =
            completedValuesError instanceof Error ? completedValuesError.message : 'Unable to load completed values.';

          if (isMountedRef.current) {
            setCompletedValuesLoads((prev) => ({
              ...prev,
              [sessionId]: {
                status: 'error',
                message,
              },
            }));
          }

          throw new Error(message);
        })
        .finally(() => {
          delete completedValuesPromisesRef.current[sessionId];
        });

      completedValuesPromisesRef.current[sessionId] = completedValuesPromise;
      return completedValuesPromise;
    },
    [completedValuesLoads, service]
  );

  const getSessionNameById = useCallback(
    (sessionId: string) => {
      const session = sessions.find((item) => item.id === sessionId);
      return session ? session.id : sessionId;
    },
    [sessions]
  );

  const handleDelete = useCallback(
    async (sessionId: string) => {
      setIsWorking(true);
      setActionError(null);
      setIsImportError(false);
      try {
        await service.deleteSession(sessionId);
        setCompletedValuesLoads((prev) => {
          if (!prev[sessionId]) {
            return prev;
          }

          const next = { ...prev };
          delete next[sessionId];
          return next;
        });
        setCopyingCompletedValuesSessionId((current) => (current === sessionId ? null : current));
        setPrintingCompletedValuesSessionId((current) => (current === sessionId ? null : current));
        setCopiedCompletedValuesSessionId((current) => (current === sessionId ? null : current));
        await loadSessions();
      } catch (deleteError) {
        setActionError(deleteError instanceof Error ? deleteError.message : 'Delete failed.');
      } finally {
        setIsWorking(false);
      }
    },
    [loadSessions, service]
  );

  const handleCopyCompletedValues = useCallback(
    async (sessionId: string) => {
      setActionError(null);
      setIsImportError(false);
      setCopyingCompletedValuesSessionId(sessionId);
      setCopiedCompletedValuesSessionId((current) => (current === sessionId ? null : current));

      try {
        const completedSession = await ensureCompletedSession(sessionId);
        await copyCompletedValuesText(formatCompletedValuesText(getSessionNameById(sessionId), completedSession));
        setCopiedCompletedValuesSessionId(sessionId);
        if (copiedFeedbackTimeoutRef.current) {
          clearTimeout(copiedFeedbackTimeoutRef.current);
        }
        copiedFeedbackTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setCopiedCompletedValuesSessionId((current) => (current === sessionId ? null : current));
          }
        }, 2500);
      } catch (copyError) {
        setActionError(copyError instanceof Error ? copyError.message : 'Copy failed.');
      } finally {
        setCopyingCompletedValuesSessionId((current) => (current === sessionId ? null : current));
      }
    },
    [ensureCompletedSession, getSessionNameById]
  );

  const handlePrintCompletedValues = useCallback(
    async (sessionId: string) => {
      setActionError(null);
      setIsImportError(false);
      setPrintingCompletedValuesSessionId(sessionId);

      try {
        const completedSession = await ensureCompletedSession(sessionId);
        printCompletedValues(getSessionNameById(sessionId), completedSession);
      } catch (printError) {
        setActionError(printError instanceof Error ? printError.message : 'Print failed.');
      } finally {
        setPrintingCompletedValuesSessionId((current) => (current === sessionId ? null : current));
      }
    },
    [ensureCompletedSession, getSessionNameById]
  );

  const handleExport = useCallback(
    async (sessionId: string) => {
      setIsWorking(true);
      setActionError(null);
      setIsImportError(false);
      try {
        const payload = await service.exportSession(sessionId);
        downloadJsonFile(`core-values-${getSessionNameById(sessionId)}`, payload);
      } catch (exportError) {
        setActionError(exportError instanceof Error ? exportError.message : 'Export failed.');
      } finally {
        setIsWorking(false);
      }
    },
    [getSessionNameById, service]
  );

  const handleScenarioExport = useCallback(
    async (attempt: BehaviourAttempt, fullBackup: boolean) => {
      setIsWorking(true);
      setActionError(null);
      setIsImportError(false);
      try {
        const payload = await getBehaviourAttemptServiceSingleton().exportAttempt(attempt.id, {
          includePrivateText: includeScenarioPrivateText,
          includeActiveProgress: fullBackup,
        });
        downloadJsonFile(`core-values-scenario-${attempt.id}`, payload);
      } catch (exportError) {
        setActionError(exportError instanceof Error ? exportError.message : 'Behaviour reflection export failed.');
      } finally {
        setIsWorking(false);
      }
    },
    [includeScenarioPrivateText]
  );

  const handleImportPayload = useCallback(
    async (payload: unknown) => {
      setIsWorking(true);
      setActionError(null);
      setIsImportError(false);
      try {
        if (
          typeof payload === 'object' &&
          payload !== null &&
          'format' in payload &&
          payload.format === 'core-values-scenario-results'
        ) {
          const scenarioService = getBehaviourAttemptServiceSingleton();
          const rawId = (payload as { attempt?: { id?: unknown } }).attempt?.id;
          const existing =
            typeof rawId === 'string' ? await scenarioService.loadAttempt(rawId).catch(() => null) : null;
          if (
            existing &&
            !window.confirm(
              'This backup replaces the behaviour reflection with the same ID. It can replace newer local work. Continue?'
            )
          ) {
            setIsWorking(false);
            return;
          }
          await scenarioService.restoreAttempt(payload);
          setImportText('');
          setScenarioAttempts(await scenarioService.listAttempts());
          return;
        }
        await service.importSession(payload);
        setImportText('');
        await loadSessions();
      } catch (importError) {
        setActionError(importError instanceof Error ? importError.message : 'Import failed.');
        setIsImportError(true);
      } finally {
        setIsWorking(false);
      }
    },
    [loadSessions, service]
  );

  const handleImportText = useCallback(async () => {
    try {
      const parsed = JSON.parse(importText);
      await handleImportPayload(parsed);
    } catch {
      setActionError('Import JSON is malformed.');
      setIsImportError(true);
    }
  }, [handleImportPayload, importText]);

  const handleImportFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (isWorking) return;
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        await handleImportPayload(parsed);
      } catch {
        setActionError('Selected file is not valid JSON.');
        setIsImportError(true);
      } finally {
        event.target.value = '';
      }
    },
    [handleImportPayload, isWorking]
  );

  const handleCopyCompletedValuesFromList = (id: string) => {
    void handleCopyCompletedValues(id);
  };
  const handlePrintCompletedValuesFromList = (id: string) => {
    void handlePrintCompletedValues(id);
  };
  return (
    <div className="app-page-panel mx-auto w-full max-w-4xl space-y-4">
      <header className="space-y-4 border-b border-[var(--editorial-line)] pb-8">
        <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl">Session History</h1>
        <p className="page-intro">
          Review saved exercises, continue where you left off, and manage your backups. Values JSON backups include
          saved reflection notes and may contain personal information.
        </p>
      </header>
      {actionError && (
        <p
          id="history-action-error"
          className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
          role="alert"
        >
          {actionError}
        </p>
      )}

      <ImportSection
        importText={importText}
        onImportTextChange={setImportText}
        onImportFromText={() => void handleImportText()}
        onImportFile={handleImportFile}
        isWorking={isWorking}
        hasError={isImportError}
      />

      <section className="space-y-4 border-t border-[var(--editorial-line)] pt-8">
        <h2 className="page-section-heading text-sys-color-text-primary text-3xl sm:text-4xl">
          Sessions saved in this browser
        </h2>
        {isLoading ? (
          <p className="text-interface-base-small text-sys-color-text-secondary mt-2">Loading sessions...</p>
        ) : loadError ? (
          <div className="mt-2 space-y-2">
            <p
              className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
              role="alert"
            >
              {loadError}
            </p>
            <button
              type="button"
              className={`${historyButtonClassName} border-sys-color-border-strong bg-sys-color-surface-subtle text-sys-color-text-primary hover:bg-sys-color-surface-subtle-hover border`}
              onClick={() => void loadSessions()}
            >
              Retry
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-interface-base-small text-sys-color-text-secondary mt-2">
            No sessions saved in this browser yet.
          </p>
        ) : (
          <div className="mt-3">
            <HistorySessionSelector
              sessions={sessions}
              isWorking={isWorking}
              copyCompletedValuesLoading={(id) => copyingCompletedValuesSessionId === id}
              printCompletedValuesLoading={(id) => printingCompletedValuesSessionId === id}
              copyCompletedValuesSucceeded={(id) => copiedCompletedValuesSessionId === id}
              onDelete={handleDelete}
              onExport={handleExport}
              onExportLegacy={(id) => {
                setIsWorking(true);
                setActionError(null);
                void exportSessionData(id, { format: 'legacy' })
                  .then((payload) => downloadJsonFile(`core-values-${id}-legacy`, payload))
                  .catch(() => setActionError('Legacy backup export failed.'))
                  .finally(() => setIsWorking(false));
              }}
              onCopyCompletedValues={handleCopyCompletedValuesFromList}
              onPrintCompletedValues={handlePrintCompletedValuesFromList}
            />
          </div>
        )}
      </section>
      {behaviourReflectionEnabled && (
        <section
          className="space-y-4 border-t border-[var(--editorial-line)] pt-8"
          aria-labelledby="scenario-history-heading"
        >
          <h2
            id="scenario-history-heading"
            className="page-section-heading text-sys-color-text-primary text-3xl sm:text-4xl"
          >
            Behaviour reflections
          </h2>
          <div className="mt-3 space-y-2">
            <label className="text-interface-base-small text-sys-color-text-primary flex items-start gap-2">
              <input
                type="checkbox"
                checked={includeScenarioPrivateText}
                onChange={(event) => setIncludeScenarioPrivateText(event.target.checked)}
              />
              <span>Include private context and reflection notes in behaviour reflection exports</span>
            </label>
            <p className="text-interface-base-small text-sys-color-text-secondary">
              Downloads omit private text by default. A full backup can include active progress; unrevealed
              interpretations are never included.
            </p>
          </div>
          {scenarioError && (
            <p role="alert" className="mt-2">
              {scenarioError}
            </p>
          )}
          {scenarioAttempts.length === 0 ? (
            <p className="text-interface-base-small text-sys-color-text-secondary mt-2">
              No behaviour reflections saved in this browser yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {scenarioAttempts.map((attempt) => (
                <li
                  key={attempt.id}
                  className="rounded-sys-radius-card-sm border-sys-color-border-default flex flex-wrap items-center justify-between gap-3 border p-4"
                >
                  <div>
                    <h3 className="text-sys-color-text-primary font-semibold">
                      {attempt.stage === 'active'
                        ? 'Unfinished behaviour reflection'
                        : 'Completed behaviour reflection'}
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
                      className={`${historyButtonClassName} bg-sys-color-surface-subtle hover:bg-sys-color-surface-subtle-hover`}
                      onClick={() => navigate(`/behaviour?attemptId=${encodeURIComponent(attempt.id)}`)}
                    >
                      {attempt.stage === 'active' ? 'Resume' : 'Review'}
                    </button>
                    {attempt.stage === 'finished' && (
                      <button
                        type="button"
                        className={`${historyButtonClassName} bg-sys-color-surface-subtle hover:bg-sys-color-surface-subtle-hover`}
                        disabled={isWorking}
                        onClick={() => void handleScenarioExport(attempt, false)}
                      >
                        Download results
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${historyButtonClassName} bg-sys-color-surface-subtle hover:bg-sys-color-surface-subtle-hover`}
                      disabled={isWorking}
                      onClick={() => void handleScenarioExport(attempt, true)}
                    >
                      Download full backup
                    </button>
                    <button
                      type="button"
                      className={`${historyButtonClassName} bg-sys-color-surface-subtle hover:bg-sys-color-surface-subtle-hover`}
                      onClick={async () => {
                        try {
                          await getBehaviourAttemptServiceSingleton().deleteAttempt(attempt.id);
                          setScenarioAttempts(await getBehaviourAttemptServiceSingleton().listAttempts());
                        } catch {
                          setScenarioError('This behaviour reflection could not be deleted. Please retry.');
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
