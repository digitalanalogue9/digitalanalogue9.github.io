'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import type { ValueCard } from '@/lib/contracts/types';
import { evaluateRoundTransition } from '@/lib/domain/roundEngine';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';

type ExerciseService = ReturnType<typeof useExerciseService>;
type SessionRecord = Awaited<ReturnType<ExerciseService['loadSession']>>;
type Session = SessionRecord['session'];
type RoundSnapshot = SessionRecord['currentRound'];

export default function ReasoningClient({ sessionId }: { sessionId: string }) {
  const service = useExerciseService();

  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [round, setRound] = useState<RoundSnapshot | null>(null);
  const [finalValues, setFinalValues] = useState<ValueCard[]>([]);
  const [reasonsById, setReasonsById] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [editingCompleted, setEditingCompleted] = useState(false);
  const loadSequenceRef = useRef(0);
  const mutationLockedRef = useRef(false);

  const loadSession = useCallback(async () => {
    const requestSequence = ++loadSequenceRef.current;
    if (!sessionId) {
      setError('Missing session id.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSession(null);
    setRound(null);
    setFinalValues([]);
    setReasonsById({});
    setEditingCompleted(false);

    try {
      const record = await service.loadSession(sessionId);
      if (requestSequence !== loadSequenceRef.current) return;

      setSession(record.session);
      setRound(record.currentRound);
      if (record.session.status === 'completed' && record.completedSession) {
        setEditingCompleted(true);
        setFinalValues(record.completedSession.finalValues);
        setReasonsById(
          Object.fromEntries(record.completedSession.finalValues.map((value) => [value.id, value.reason ?? '']))
        );
        return;
      }

      const transition = evaluateRoundTransition(record.currentRound);
      if (!transition.canComplete) {
        setError('Session is not ready for reasoning.');
        return;
      }

      const values = record.currentRound.categories['Very Important'];
      const initialReasons = Object.fromEntries(values.map((value) => [value.id, '']));
      setFinalValues(values);
      setReasonsById(initialReasons);
    } catch (loadError) {
      if (requestSequence !== loadSequenceRef.current) return;
      setError(loadError instanceof Error ? loadError.message : 'Failed to load session.');
    } finally {
      if (requestSequence === loadSequenceRef.current) {
        setLoading(false);
      }
    }
  }, [navigate, service, sessionId]);

  useEffect(() => {
    void loadSession();
    return () => {
      loadSequenceRef.current += 1;
    };
  }, [loadSession]);

  const handleComplete = useCallback(async () => {
    if (!session || !round) return;
    if (mutationLockedRef.current) return;
    mutationLockedRef.current = true;
    setWorking(true);
    setError(null);

    try {
      if (editingCompleted) {
        await service.updateCompletedReasons(session.id, reasonsById);
      } else {
        await service.completeSession({ session, round, reasonsById });
      }
      navigate(
        {
          pathname: '/completed',
          search: `?${new URLSearchParams({ sessionId: session.id }).toString()}`,
        },
        { replace: true }
      );
    } catch (completeError) {
      setError(completeError instanceof Error ? completeError.message : 'Unable to save results.');
    } finally {
      mutationLockedRef.current = false;
      setWorking(false);
    }
  }, [editingCompleted, navigate, reasonsById, round, service, session]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleComplete();
  };

  if (loading) {
    return (
      <div className={`${nonExercisePageContainerClassName} space-y-4`} role="status" aria-live="polite">
        <div className="border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default border p-6 shadow-sm">
          <div className="bg-sys-color-surface-subtle rounded-sys-radius-button-sm h-4 w-32 animate-pulse motion-reduce:animate-none" />
          <div className="bg-sys-color-surface-subtle rounded-sys-radius-button-sm mt-3 h-7 w-64 animate-pulse motion-reduce:animate-none" />
          <div className="bg-sys-color-surface-subtle rounded-sys-radius-button-sm mt-5 h-28 animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div
        className={`${nonExercisePageContainerClassName} rounded-sys-radius-card-sm border-sys-color-border-default bg-sys-color-surface-default border p-6 shadow-sm`}
      >
        <p
          className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
          role="alert"
        >
          {error}
        </p>
        <Link
          to="/"
          className="text-ref-color-brand-primary hover:text-ref-color-brand-primary-hover mt-4 inline-block underline"
        >
          Return home
        </Link>
      </div>
    );
  }

  const exerciseSearch = `?${new URLSearchParams({ sessionId }).toString()}`;

  return (
    <form className={`${nonExercisePageContainerClassName} space-y-8`} onSubmit={handleSubmit}>
      <section className="space-y-4" aria-labelledby="reasoning-heading">
        <h1 id="reasoning-heading" className="page-heading text-4xl sm:text-5xl lg:text-6xl">
          Reflect on your choices
        </h1>
        <p className="page-intro max-w-2xl">
          You can add a short note about why each final value matters to you. These notes are optional and saved with
          the completed session in this browser.
        </p>
        {error && (
          <p
            className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text mt-4 px-3 py-2"
            role="alert"
          >
            {error}
          </p>
        )}
      </section>

      {finalValues.length > 0 && (
        <div className="border-t border-[var(--editorial-line)] pt-8">
          <ul className="space-y-4">
            {finalValues.map((value) => {
              const reasonId = `reason-${value.id}`;
              return (
                <li key={value.id} className="border-sys-color-border-default border-b pb-4 last:border-b-0 last:pb-0">
                  <label className="block" htmlFor={reasonId}>
                    <span className="page-section-heading text-sys-color-text-primary block text-3xl sm:text-4xl">
                      {value.title}
                    </span>
                  </label>
                  <p
                    id={`${reasonId}-description`}
                    className="text-sys-color-text-secondary mt-2 text-lg leading-relaxed"
                  >
                    {value.description}
                  </p>
                  <textarea
                    id={reasonId}
                    aria-describedby={`${reasonId}-description`}
                    className="cv-field__control mt-3 min-h-28 w-full resize-y"
                    value={reasonsById[value.id] ?? ''}
                    onChange={(event) =>
                      setReasonsById((prev) => ({
                        ...prev,
                        [value.id]: event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Optional reason"
                    disabled={working}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--editorial-line)] pt-6">
        <button
          type="submit"
          className="cv-button min-h-11"
          disabled={working || Boolean(error && finalValues.length === 0)}
        >
          {working ? 'Saving...' : editingCompleted ? 'Save changes' : 'Save Completed Session'}
        </button>
        <Link
          to={{ pathname: editingCompleted ? '/completed' : '/exercise', search: exerciseSearch }}
          className="rounded-sys-radius-button-sm border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle border px-4 py-2 no-underline transition-colors motion-reduce:transition-none"
        >
          {editingCompleted ? 'Back to results' : 'Back to Board'}
        </Link>
      </div>
    </form>
  );
}
