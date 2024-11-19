'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRoundsBySession } from "@/lib/db/indexedDB";
import { Round, Value, CategoryName, DropCommandPayload, MoveCommandPayload, Command, Categories } from "@/lib/types";
import { getEnvBoolean } from "@/lib/utils/config";
import { AnimatedCard } from "@/components/features/Cards/components/AnimatedCard";
import { useReplayState } from '../../hooks/useReplayState';
import { useCardAnimation } from '../../hooks/useCardAnimation';
import { ReplayColumn } from '../ReplayColumn';
import { motion, useSpring } from 'framer-motion';
import { MobileReplayCategories } from '../MobileReplayCategories';
import { CommandInfo } from '@/components/features/Replay/types';

export default function ReplayClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const debug = getEnvBoolean('debug', false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [commandInfo, setCommandInfo] = useState<CommandInfo | null>(null);
  const [currentCard, setCurrentCard] = useState<Value | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isRoundTransition, setIsRoundTransition] = useState(false);
  const [allCards, setAllCards] = useState<Value[]>([]);
  const {
    categories,
    animatingCard,
    executeCommand,
    resetCategories,
    setAnimatingCard,
    setAllCards: setReplayStateCards
  } = useReplayState();

  const {
    position,
    isAnimating,
    startAnimation
  } = useCardAnimation(animatingCard?.sourcePos || {
    x: 0,
    y: 0
  }, animatingCard?.targetPos || {
    x: 0,
    y: 0
  }, 1000 / playbackSpeed);

  // Mobile detection after mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const emptyCategories = useMemo(() => ({
    'Very Important': [],
    'Important': [],
    'Quite Important': [],
    'Of Some Importance': [],
    'Not Important': []
  }), []);
  const getCurrentRoundCategories = useCallback(() => {
    const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
    return currentRoundData?.availableCategories || emptyCategories;
  }, [currentRound, rounds, emptyCategories]);
  useEffect(() => {
    if (!sessionId) return;
    const loadRounds = async () => {
      try {
        const roundData = await getRoundsBySession(sessionId);
        const sortedRounds = roundData.sort((a, b) => a.roundNumber - b.roundNumber);
        setRounds(sortedRounds);
        if (sortedRounds.length > 0) {
          // Get all unique cards from all rounds
          const cards = new Set<Value>();
          sortedRounds.forEach(round => {
            Object.values(round.availableCategories).forEach(categoryCards => {
              categoryCards?.forEach(card => {
                cards.add(card);
              });
            });
          });
          const cardsArray = Array.from(cards);
          setAllCards(cardsArray);
          setReplayStateCards(cardsArray);

          // Set the first card
          const firstCommand = sortedRounds[0].commands[0];
          if (firstCommand) {
            const cardId = (firstCommand.payload as DropCommandPayload | MoveCommandPayload).cardId;
            const firstCard = cardsArray.find(card => card.id === cardId);
            if (firstCard) {
              setCurrentCard(firstCard);
            }
          }
        }
        resetCategories();
      } catch (error) {
        console.error('Failed to load rounds:', error);
      }
    };
    loadRounds();
  }, [sessionId, resetCategories, setReplayStateCards]);
  const getCommandDescription = useCallback((command: Command): string => {
    const payload = command.payload as DropCommandPayload | MoveCommandPayload;
    const card = allCards.find(c => c.id === payload.cardId);
    const cardTitle = card ? card.title : payload.cardId;
    if (command.type === 'DROP') {
      const dropPayload = payload as DropCommandPayload;
      return `Drop '${cardTitle}' to '${dropPayload.category}'`;
    } else if (command.type === 'MOVE') {
      const movePayload = payload as MoveCommandPayload;
      if (movePayload.fromCategory === movePayload.toCategory) {
        return `Move '${cardTitle}' within '${movePayload.fromCategory}'`;
      }
      return `Move '${cardTitle}' from '${movePayload.fromCategory}' to '${movePayload.toCategory}'`;
    }
    return `Command ${currentCommandIndex + 1}`;
  }, [allCards, currentCommandIndex]);

  const playNextCommand = useCallback(async () => {
    if (isRoundTransition) return;
    const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
    if (!currentRoundData) return;
    if (currentCommandIndex >= currentRoundData.commands.length) {
      if (currentRound < rounds.length) {
        // Transition to the next round
        setIsRoundTransition(true);
        setIsPlaying(false);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Pause before transitioning
        setCurrentRound(currentRound + 1);
        setCurrentCommandIndex(0);
        resetCategories();
        setIsRoundTransition(false);
        setIsPlaying(true);
        const nextRound = rounds.find(r => r.roundNumber === currentRound + 1);
        if (nextRound && nextRound.commands.length > 0) {
          const firstCommand = nextRound.commands[0];
          const cardId = (firstCommand.payload as DropCommandPayload | MoveCommandPayload).cardId;
          const nextCard = allCards.find(card => card.id === cardId);
          if (nextCard) {
            setCurrentCard(nextCard);
          }
          setCommandInfo({
            roundNumber: currentRound + 1,
            description: getCommandDescription(firstCommand)
          });
        }
        return;
      } else {
        setIsPlaying(false);
        return; // End of all rounds
      }
    }
    const command = currentRoundData.commands[currentCommandIndex];
    const payload = command.payload as DropCommandPayload | MoveCommandPayload;
    const cardId = payload.cardId;
    const cardToAnimate = allCards.find(card => card.id === cardId);
    if (!cardToAnimate) return;

    // Set the next command info if available
    const nextCommand = currentRoundData.commands[currentCommandIndex + 1];
    if (nextCommand) {
      setCommandInfo({
        roundNumber: currentRound,
        description: getCommandDescription(nextCommand)
      });
      const nextCardId = (nextCommand.payload as DropCommandPayload | MoveCommandPayload).cardId;
      const nextCard = allCards.find(card => card.id === nextCardId);
      if (nextCard) {
        setCurrentCard(nextCard);
      }
    } else if (currentCommandIndex + 1 === currentRoundData.commands.length && currentRound < rounds.length) {
      // Prepare for the transition indicating next round
      setCommandInfo({
        roundNumber: currentRound + 1,
        description: "Next round starting soon..."
      });
    }
    let sourceElement: Element | null;
    if (command.type === 'DROP') {
      sourceElement = document.querySelector('[data-card-wrapper]');
    } else {
      const movePayload = payload as MoveCommandPayload;
      sourceElement = document.querySelector(`[data-category="${movePayload.fromCategory}"] [data-card-id="${cardId}"]`);
    }

    const targetCategory = command.type === 'DROP'
      ? (payload as DropCommandPayload).category
      : (payload as MoveCommandPayload).toCategory;

    const targetElement = document.querySelector(`[data-category="${targetCategory}"]`);

    if (sourceElement && targetElement) {
      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      // Calculate center points for source and target
      const sourceCenter = {
        x: sourceRect.left + (sourceRect.width / 2),
        y: sourceRect.top + (sourceRect.height / 2)
      };

      const targetCenter = {
        x: targetRect.left + (targetRect.width / 2),
        y: targetRect.top + 20  // 20px from top of category
      };

      // Start animation
      setAnimatingCard({
        value: cardToAnimate,
        sourcePos: sourceCenter,
        targetPos: targetCenter
      });

      // Wait for animation to complete before executing command
      await new Promise<void>(resolve => {
        const animationDuration = 500;  // Fixed duration for consistent speed
        setTimeout(() => {
          executeCommand(command);
          setAnimatingCard(null);
          resolve();
        }, animationDuration);
      });
    } else {
      executeCommand(command);
    }

    setCurrentCommandIndex(prev => prev + 1);
  }, [currentRound, currentCommandIndex, rounds, executeCommand, resetCategories, isRoundTransition, allCards, playbackSpeed, getCommandDescription, setAnimatingCard]);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && rounds.length > 0 && !isAnimating && !isRoundTransition) {
      timer = setInterval(playNextCommand, 1000 / playbackSpeed); // 1000ms base interval
    }
    return () => clearInterval(timer);
  }, [isPlaying, rounds, playbackSpeed, isAnimating, playNextCommand, isRoundTransition]);
  const handleReset = () => {
    setCurrentRound(1);
    setCurrentCommandIndex(0);
    setIsPlaying(false);
    resetCategories();
    setAnimatingCard(null);
    setCommandInfo(null);
    setCurrentCard(null);
    setIsRoundTransition(false);
  };

  // Don't render until we know if it's mobile or not
  if (isMobile === null) {
    return null;
  }
  return <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-8" aria-label="Session replay viewer">
    <div className={`space-y-2 sm:space-y-4 ${isMobile ? 'h-screen flex flex-col' : ''}`}>
      <section className="bg-white rounded-lg shadow-lg p-2 sm:p-4" aria-label="Replay controls">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex gap-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base" aria-label={isPlaying ? 'Pause replay' : 'Start replay'}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm sm:text-base" aria-label="Reset replay to beginning">
              Reset
            </button>
          </div>

          <div className="flex items-center">
            <label htmlFor="playback-speed" className="sr-only">
              Playback speed
            </label>
            <select id="playback-speed" value={playbackSpeed} onChange={e => setPlaybackSpeed(Number(e.target.value))} className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded bg-white text-sm sm:text-base" aria-label="Select playback speed">
              <option value={0.5}>0.5x Speed</option>
              <option value={1}>1x Speed</option>
              <option value={2}>2x Speed</option>
              <option value={4}>4x Speed</option>
            </select>
          </div>

          <div className="flex items-center text-sm sm:text-base" aria-live="polite" role="status">
            {!isPlaying && !commandInfo ? <span className="text-gray-600">
              Click Play to start the replay
            </span> : commandInfo && <span>
              <span className="font-semibold">Round {commandInfo.roundNumber}:</span>
              {' '}{commandInfo.description}
            </span>}
          </div>
        </div>
      </section>

      <section className="relative h-32 sm:h-48" aria-label="Current card display">
        <div className="absolute left-1/2 transform -translate-x-1/2 current-card-display" data-card-wrapper aria-live="polite">
          {currentCard && !animatingCard && isPlaying && <AnimatedCard value={currentCard} columnIndex={undefined} onDrop={() => Promise.resolve()} currentCategory={undefined} />}
        </div>
      </section>

      <section aria-label="Card categories">
        {isMobile ? <div className="flex-1 min-h-0">
          <MobileReplayCategories categories={getCurrentRoundCategories()} aria-label="Mobile categories view" />
        </div> : <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" role="grid" aria-label="Category grid">
          {Object.entries(getCurrentRoundCategories()).map(([title]) => <ReplayColumn key={title} title={title as CategoryName} cards={categories[title as CategoryName] || []} />)}
        </div>}
      </section>

      {animatingCard && (
        <motion.div
          initial={false}
          style={{
            position: 'fixed',
            left: animatingCard.sourcePos.x,
            top: animatingCard.sourcePos.y,
            zIndex: 1000,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',  // Center the card on its position
          }}
          animate={{
            left: animatingCard.targetPos.x,
            top: animatingCard.targetPos.y,
          }}
          transition={{
            type: "tween",  // Use tween instead of spring for straight-line movement
            duration: 0.5,
            ease: "easeInOut"
          }}
          aria-hidden="true"
        >
          <AnimatedCard
            value={animatingCard.value}
            columnIndex={undefined}
            onDrop={() => Promise.resolve()}
            currentCategory={undefined}
          />
        </motion.div>
      )}
    </div>
  </div>;
}