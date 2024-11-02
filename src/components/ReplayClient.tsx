'use client'

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRoundsBySession } from '@/db/indexedDB';
import { Round } from '@/types/Round';
import { CategoryName } from '@/types/CategoryName';
import { Value } from '@/types/Value';
import { getEnvBoolean } from '@/utils';
import CategoryColumn from '@/components/CategoryColumn';
import { AnimatedCard } from '@/components/Card';
import { useReplayState } from '@/hooks/useReplayState';
import { useCardAnimation } from '@/hooks/useCardAnimation';

export default function ReplayClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const debug = getEnvBoolean('debug', false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  
  const {
    categories,
    animatingCard,
    executeCommand,
    resetCategories,
    setAnimatingCard
  } = useReplayState();

  const { position, isAnimating, startAnimation } = useCardAnimation(
    animatingCard?.sourcePos || { x: 0, y: 0 },
    animatingCard?.targetPos || { x: 0, y: 0 },
    500 / playbackSpeed
  );

  useEffect(() => {
    if (!sessionId) return;

    const loadRounds = async () => {
      if (debug) console.log('🔄 Loading rounds for session:', sessionId);
      try {
        const roundData = await getRoundsBySession(sessionId);
        setRounds(roundData.sort((a, b) => a.roundNumber - b.roundNumber));
        if (debug) console.log('✅ Rounds loaded:', roundData);
      } catch (error) {
        console.error('❌ Error loading rounds:', error);
      }
    };

    loadRounds();
  }, [sessionId, debug]);

  const playNextCommand = useCallback(() => {
    const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
    if (!currentRoundData) return;

    if (currentCommandIndex >= currentRoundData.commands.length) {
      if (currentRound < rounds.length) {
        setCurrentRound(currentRound + 1);
        setCurrentCommandIndex(0);
        resetCategories();
      } else {
        setIsPlaying(false);
      }
      return;
    }

    const command = currentRoundData.commands[currentCommandIndex];
    executeCommand(command);
    if ('sourcePosition' in command && 'targetPosition' in command) {
      startAnimation();
    }
    setCurrentCommandIndex(prev => prev + 1);
  }, [
    currentRound,
    currentCommandIndex,
    rounds,
    executeCommand,
    resetCategories,
    startAnimation
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && rounds.length > 0 && !isAnimating) {
      const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
      if (currentRoundData && currentCommandIndex < currentRoundData.commands.length) {
        timer = setInterval(playNextCommand, 1000 / playbackSpeed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearInterval(timer);
  }, [
    isPlaying,
    currentRound,
    currentCommandIndex,
    rounds,
    playbackSpeed,
    isAnimating,
    playNextCommand
  ]);

  const handleReset = () => {
    setCurrentRound(1);
    setCurrentCommandIndex(0);
    setIsPlaying(false);
    resetCategories();
    setAnimatingCard(null);
  };

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">No Session ID Provided</h1>
        <p>Please provide a session ID in the URL parameters.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
          Replay Session: {sessionId}
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Reset
          </button>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="px-2 sm:px-4 py-1.5 sm:py-2 border rounded text-sm sm:text-base"
          >
            <option value={0.5}>0.5x Speed</option>
            <option value={1}>1x Speed</option>
            <option value={2}>2x Speed</option>
            <option value={4}>4x Speed</option>
          </select>
          <div className="text-gray-600 text-sm sm:text-base">
            Round {currentRound} - Command {currentCommandIndex + 1}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-4">
        {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards]) => (
          <CategoryColumn
            key={title}
            title={title}
            cards={cards}
            onDrop={() => Promise.resolve()}
            onMoveWithinCategory={() => Promise.resolve()}
            onMoveBetweenCategories={() => Promise.resolve()}
          />
        ))}
      </div>

      {animatingCard && (
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <AnimatedCard
            value={animatingCard.value}
            columnIndex={undefined}
            onDrop={() => {}}
            currentCategory={undefined}
          />
        </div>
      )}
    </div>
  );
}
