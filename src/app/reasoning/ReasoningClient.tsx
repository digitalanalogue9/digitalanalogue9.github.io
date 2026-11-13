'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { nonExercisePageContainerClassName } from '@/app/layoutClasses';
import { ReflectionJournal } from '@/app/reasoning/ReflectionJournal';
import type {
  RelationshipReflectionNotes,
  SessionReflection,
  ValueReflectionNotes,
  ValueCard,
} from '@/lib/contracts/types';
import { evaluateRoundTransition } from '@/lib/domain/roundEngine';
import { useExerciseService } from '@/lib/services/ExerciseServiceContext';

type ExerciseService = ReturnType<typeof useExerciseService>;
type SessionRecord = Awaited<ReturnType<ExerciseService['loadSession']>>;
type Session = SessionRecord['session'];
type RoundSnapshot = SessionRecord['currentRound'];

const emptyReflection: SessionReflection = { version: 1, values: {} };

export default function ReasoningClient({ sessionId }: { sessionId: string }) {
  const service = useExerciseService();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [round, setRound] = useState<RoundSnapshot | null>(null);
  const [finalValues, setFinalValues] = useState<ValueCard[]>([]);
  const [reflection, setReflection] = useState<SessionReflection>(emptyReflection);
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
    setReflection(emptyReflection);
    setEditingCompleted(false);

    try {
      const record = await service.loadSession(sessionId);
      if (requestSequence !== loadSequenceRef.current) return;

      setSession(record.session);
      setRound(record.currentRound);
      if (record.session.status === 'completed' && record.completedSession) {
        setEditingCompleted(true);
        setFinalValues(record.completedSession.finalValues);
        setReflection(record.completedSession.reflection ?? emptyReflection);
        return;
      }

      const transition = evaluateRoundTransition(record.currentRound);
      if (!transition.canComplete) {
        setError('Session is not ready for reflection.');
        return;
      }

      setFinalValues(record.currentRound.categories['Very Important']);
    } catch (loadError) {
      if (requestSequence !== loadSequenceRef.current) return;
      setError(loadError instanceof Error ? loadError.message : 'Failed to load session.');
    } finally {
      if (requestSequence === loadSequenceRef.current) setLoading(false);
    }
  }, [service, sessionId]);

  useEffect(() => {
    void loadSession();
    return () => {
      loadSequenceRef.current += 1;
    };
  }, [loadSession]);

  const handleComplete = useCallback(async () => {
    if (!session || !round || mutationLockedRef.current) return;
    mutationLockedRef.current = true;
    setWorking(true);
    setError(null);
    try {
      if (editingCompleted) {
        await service.saveReflection(session.id, reflection);
      } else {
        await service.completeSession({ session, round, reasonsById: {}, reflection });
      }
      navigate(
        {
          pathname: '/completed',
          search: `?${new URLSearchParams({ sessionId: session.id }).toString()}`,
        },
        { replace: true }
      );
    } catch (completeError) {
      setError(completeError instanceof Error ? completeError.message : 'Unable to save reflection. Try again.');
    } finally {
      mutationLockedRef.current = false;
      setWorking(false);
    }
  }, [editingCompleted, navigate, reflection, round, service, session]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleComplete();
  };
  const updateValueReflection = useCallback((valueId: string, field: keyof ValueReflectionNotes, value: string) => {
    setReflection((current) => ({
      ...current,
      values: { ...current.values, [valueId]: { ...current.values[valueId], [field]: value } },
    }));
  }, []);
  const updateSuggestionResponse = useCallback(
    (valueId: string, suggestionId: string, response: 'recognised' | 'rejected' | 'unsure') => {
      setReflection((current) => {
        const notes = current.values[valueId] ?? {};
        return {
          ...current,
          values: {
            ...current.values,
            [valueId]: { ...notes, suggestions: { ...notes.suggestions, [suggestionId]: response } },
          },
        };
      });
    },
    []
  );
  const updateRelationshipReflection = useCallback(
    (relationshipId: string, field: keyof RelationshipReflectionNotes, value: string) => {
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
  const relationships = service.getReflectionRelationships(session?.exerciseType ?? 'personal', finalValues);
  const summary = service.getReflectionSummary(session?.exerciseType ?? 'personal', finalValues, reflection);

  return (
    <form className={`${nonExercisePageContainerClassName} mx-auto max-w-4xl space-y-8`} onSubmit={handleSubmit}>
      <header className="space-y-4 border-b border-[var(--editorial-line)] pb-8">
        <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl">Reflect on your values</h1>
        <p className="page-intro max-w-[70ch]">
          These optional prompts help you explore the values you selected. Your answers are saved with this session on
          this device.
        </p>
        {error && (
          <p
            className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
            role="alert"
          >
            {error}
          </p>
        )}
      </header>

      {finalValues.length > 0 && (
        <ReflectionJournal
          selectedValues={finalValues}
          exerciseType={session?.exerciseType ?? 'personal'}
          reflection={reflection}
          relationships={relationships}
          summary={summary}
          working={working}
          onGoalChange={(goal) => setReflection((current) => ({ ...current, goal }))}
          onValueChange={updateValueReflection}
          onSuggestionChange={updateSuggestionResponse}
          onRelationshipChange={updateRelationshipReflection}
        />
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--editorial-line)] pt-6">
        <button type="submit" className="cv-button min-h-11" disabled={working || finalValues.length === 0}>
          {working ? 'Saving…' : editingCompleted ? 'Save reflection' : 'Save reflection and complete'}
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
