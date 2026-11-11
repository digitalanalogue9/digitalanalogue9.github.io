'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Link } from 'react-router-dom';

import { useExerciseService } from '@/lib/services/ExerciseServiceContext';
import { CategoryGrid } from './CategoryGrid';
import { CurrentCardPreview } from './CurrentCardPreview';
import { buildReplayFrames } from './replayTimeline';

type ExerciseService = ReturnType<typeof useExerciseService>;
type SessionRecord = Awaited<ReturnType<ExerciseService['loadSession']>>;
type Session = SessionRecord['session'];
type RoundSnapshot = SessionRecord['rounds'][number];
type PlaybackSpeed = keyof typeof PLAYBACK_SPEEDS;

const replayHistoryLinkClasses =
  'inline-flex min-h-11 items-center text-ref-color-brand-primary underline hover:text-ref-color-brand-primary-hover md:min-h-9';

const PLAYBACK_SPEEDS = {
  '0.5x': 2000,
  '1x': 1200,
  '1.5x': 800,
  '2x': 600,
} as const;

function clearPlaybackTimer(timerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>) {
  if (timerRef.current !== null) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

function getCommandStepLabel(commandIndex: number, totalCommands: number, usesSnapshotFallback: boolean) {
  if (totalCommands === 0 && !usesSnapshotFallback) {
    return 'No recorded commands';
  }

  if (usesSnapshotFallback) {
    return totalCommands === 0 ? 'Saved snapshot' : `Saved snapshot after ${totalCommands} commands`;
  }

  return `Command ${commandIndex} of ${totalCommands}`;
}

export default function ReplayClient({ sessionId }: { sessionId: string }) {
  const service = useExerciseService();
  const [session, setSession] = useState<Session | null>(null);
  const [rounds, setRounds] = useState<RoundSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>('1x');
  const [frameIndex, setFrameIndex] = useState(0);
  const loadSequenceRef = useRef(0);
  const playbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replayFrames = buildReplayFrames(rounds);
  const currentFrame = replayFrames[frameIndex] ?? replayFrames[0];
  const currentSnapshot = currentFrame?.snapshot;
  const currentCard = currentSnapshot?.deck[0];

  useEffect(() => {
    const load = async () => {
      const requestSequence = ++loadSequenceRef.current;
      clearPlaybackTimer(playbackTimerRef);
      setIsPlaying(false);
      setFrameIndex(0);
      if (!sessionId) {
        if (requestSequence !== loadSequenceRef.current) return;
        setError('Missing session id.');
        setSession(null);
        setRounds([]);
        setIsLoading(false);
        return;
      }
      setError(null);
      setSession(null);
      setRounds([]);
      setIsLoading(true);
      try {
        const record = await service.loadSession(sessionId);
        if (requestSequence !== loadSequenceRef.current) return;
        setSession(record.session);
        setRounds(record.rounds);
      } catch (loadError) {
        if (requestSequence !== loadSequenceRef.current) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load replay.');
        setSession(null);
        setRounds([]);
      } finally {
        if (requestSequence === loadSequenceRef.current) {
          setIsLoading(false);
        }
      }
    };
    void load();
    return () => {
      clearPlaybackTimer(playbackTimerRef);
      loadSequenceRef.current += 1;
    };
  }, [service, sessionId]);

  useEffect(() => {
    clearPlaybackTimer(playbackTimerRef);

    if (!isPlaying) {
      return;
    }

    if (replayFrames.length <= 1 || frameIndex >= replayFrames.length - 1) {
      setIsPlaying(false);
      return;
    }

    playbackTimerRef.current = setTimeout(() => {
      setFrameIndex((current) => {
        if (current >= replayFrames.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, PLAYBACK_SPEEDS[playbackSpeed]);

    return () => {
      clearPlaybackTimer(playbackTimerRef);
    };
  }, [frameIndex, isPlaying, playbackSpeed, replayFrames.length]);

  const replayHeader = (
    <header className="space-y-4">
      <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl">Replay</h1>
      <p className="page-intro max-w-[70ch]">
        Follow each recorded round to see how your choices shaped the final set.
      </p>
    </header>
  );

  if ((currentFrame === undefined || currentSnapshot === undefined) && rounds.length > 0) {
    if (!isLoading && !error && session) {
      return (
        <div className="app-page-panel mx-auto w-full max-w-4xl space-y-8">
          {replayHeader}
          <section className="space-y-3 border-t border-[var(--editorial-line)] pt-6" role="status">
            <p className="text-interface-base-small text-sys-color-text-secondary">
              Session: {session.id} | Status: {session.status} | Rounds recorded: {rounds.length}
            </p>
            <p className="text-interface-base-small text-sys-color-text-secondary mt-2">
              This session&apos;s replay timeline could not be reconstructed. You can still review it in History.
            </p>
            <Link to="/history" className={`mt-3 ${replayHistoryLinkClasses}`}>
              Back to History
            </Link>
          </section>
        </div>
      );
    }
  }

  if (isLoading) {
    return (
      <div className="app-page-panel mx-auto w-full max-w-4xl space-y-8">
        {replayHeader}
        <section className="border-t border-[var(--editorial-line)] pt-6" role="status" aria-live="polite">
          Loading replay...
        </section>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="app-page-panel mx-auto w-full max-w-4xl space-y-8">
        {replayHeader}
        <section className="space-y-3 border-t border-[var(--editorial-line)] pt-6">
          <p
            className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-ref-color-rag-red-text px-3 py-2"
            role="alert"
          >
            {error ?? 'Session not found.'}
          </p>
          <Link to="/history" className={replayHistoryLinkClasses}>
            Back to History
          </Link>
        </section>
      </div>
    );
  }

  const isAtReplayEnd = replayFrames.length === 0 || frameIndex >= replayFrames.length - 1;
  const sessionReference = session.id;
  const handlePlayPause = () => {
    if (replayFrames.length <= 1) {
      return;
    }

    if (isPlaying) {
      clearPlaybackTimer(playbackTimerRef);
      setIsPlaying(false);
      return;
    }

    if (isAtReplayEnd) {
      setFrameIndex(0);
    }

    setIsPlaying(true);
  };

  const handleReset = () => {
    clearPlaybackTimer(playbackTimerRef);
    setIsPlaying(false);
    setFrameIndex(0);
  };

  return (
    <div className="app-page-panel mx-auto w-full max-w-4xl space-y-8">
      {replayHeader}
      <p className="text-interface-base-small text-sys-color-text-secondary">
        Session: {sessionReference} · Status: {session.status} · Rounds recorded: {rounds.length}
      </p>
      {rounds.length === 0 ? (
        <section className="space-y-3 border-t border-[var(--editorial-line)] pt-6" role="status">
          <h2 className="page-section-heading text-sys-color-text-primary text-3xl sm:text-4xl">
            No rounds available to replay
          </h2>
          <p className="text-interface-base-small text-sys-color-text-secondary mt-1">
            This session is saved, but it has no round snapshots to show.
          </p>
          <Link to="/history" className={`mt-3 ${replayHistoryLinkClasses}`}>
            Back to History
          </Link>
        </section>
      ) : (
        <>
          <section className="space-y-4 border-t border-[var(--editorial-line)] pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="page-section-heading text-sys-color-text-primary text-2xl sm:text-3xl">
                  Replay controls
                </h2>
                <p className="text-interface-base-small text-sys-color-text-secondary mt-2">
                  Round {currentFrame.roundIndex + 1} of {currentFrame.totalRounds} |{' '}
                  {getCommandStepLabel(
                    currentFrame.commandIndex,
                    currentFrame.totalCommands,
                    currentFrame.usesSnapshotFallback
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="apc-button min-h-11 md:min-h-10"
                  onClick={handlePlayPause}
                  disabled={replayFrames.length <= 1}
                >
                  {isPlaying ? 'Pause' : isAtReplayEnd ? 'Play Again' : 'Play'}
                </button>
                <button
                  type="button"
                  className="rounded-sys-radius-button-sm border-sys-color-border-strong text-interface-base-small text-sys-color-text-primary hover:bg-sys-color-surface-subtle min-h-11 border px-4 py-2 md:min-h-9"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <label
                  className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-center gap-2 md:min-h-9"
                  htmlFor="replay-speed"
                >
                  Playback speed
                  <select
                    id="replay-speed"
                    className="apc-select__control min-h-11 md:min-h-9"
                    value={playbackSpeed}
                    onChange={(event) => setPlaybackSpeed(event.target.value as PlaybackSpeed)}
                  >
                    {Object.keys(PLAYBACK_SPEEDS).map((speed) => (
                      <option key={speed} value={speed}>
                        {speed}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div
              className="rounded-sys-radius-button-sm bg-sys-color-surface-warm text-interface-base-small text-sys-color-text-primary mt-4 px-3 py-2"
              role="status"
              aria-live="polite"
            >
              {currentFrame.commandStatus}
              {currentFrame.usesSnapshotFallback && (
                <span className="text-ref-color-brand-primary ml-2 font-medium">Showing a saved round snapshot</span>
              )}
            </div>
          </section>

          <CurrentCardPreview card={currentCard} />

          <section className="space-y-4 border-t border-[var(--editorial-line)] pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="page-section-heading text-sys-color-text-primary text-2xl sm:text-3xl">
                Round {currentFrame.roundNumber} snapshot
              </h2>
              <span className="rounded-ref-radius-999 border-sys-color-border-default text-interface-tiny-label text-sys-color-text-primary border px-3 py-1 font-semibold">
                Deck remaining: {currentSnapshot.deck.length}
              </span>
            </div>
            <CategoryGrid activeCategories={currentSnapshot.activeCategories} snapshot={currentSnapshot} />
          </section>
        </>
      )}
    </div>
  );
}
