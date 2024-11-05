'use client'

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRoundsBySession } from '@/db/indexedDB';
import { Round, Value, CategoryName, DropCommandPayload, MoveCommandPayload, Command, Categories } from '@/types';
import { getEnvBoolean } from '@/utils';
import { AnimatedCard } from '@/components/Card';
import { useReplayState } from '@/hooks/useReplayState';
import { useCardAnimation } from '@/hooks/useCardAnimation';
import { ReplayColumn } from './ReplayColumn';
import { motion, useSpring } from 'framer-motion';

interface CommandInfo {
  roundNumber: number;
  description: string;
}

function MobileReplayCategory({ title, cards }: { title: CategoryName; cards: Value[] }) {
  return (
    <div data-category={title} className="p-2 rounded-lg border bg-white border-gray-200">
      <div className="flex items-center justify-between">
        <span className="font-medium text-xs sm:text-sm truncate">{title}</span>
        <span className="bg-gray-200 px-1.5 py-0.5 rounded-full text-xs">
          {cards.length}
        </span>
      </div>
      {cards.length > 0 && (
        <div className="mt-1 space-y-1">
          {cards.map(card => (
            <div key={card.id} className="text-xs text-gray-600 truncate">
              {card.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileReplayCategories({ categories }: { categories: Categories }) {
  return (
    <div className="w-full space-y-1">
      <div className="w-full">
        <MobileReplayCategory title="Very Important" cards={categories['Very Important'] || []} />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <MobileReplayCategory title="Quite Important" cards={categories['Quite Important'] || []} />
        <MobileReplayCategory title="Important" cards={categories['Important'] || []} />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <MobileReplayCategory title="Of Some Importance" cards={categories['Of Some Importance'] || []} />
        <MobileReplayCategory title="Not Important" cards={categories['Not Important'] || []} />
      </div>
    </div>
  );
}

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

  const x = useSpring(0, { stiffness: 100, damping: 20 });
  const y = useSpring(0, { stiffness: 100, damping: 20 });

  // Mobile detection after mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (animatingCard) {
      x.set(position.x);
      y.set(position.y);
    }
  }, [animatingCard, x, y]);

  const { position, isAnimating, startAnimation } = useCardAnimation(
    animatingCard?.sourcePos || { x: 0, y: 0 },
    animatingCard?.targetPos || { x: 0, y: 0 },
    1000 / playbackSpeed
  );

  const emptyCategories = {
    'Very Important': [],
    'Important': [],
    'Quite Important': [],
    'Of Some Importance': [],
    'Not Important': []
  };

  const getCurrentRoundCategories = useCallback(() => {
    const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
    return currentRoundData?.availableCategories || emptyCategories;
  }, [currentRound, rounds]);

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

  const getCommandDescription = (command: Command): string => {
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
  };

  const playNextCommand = useCallback(async () => {
    if (isRoundTransition) return;
  
    const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
    if (!currentRoundData) return;
  
    if (currentCommandIndex >= currentRoundData.commands.length) {
      if (currentRound < rounds.length) {
        setIsRoundTransition(true);
        setIsPlaying(false);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCurrentRound(currentRound + 1);
        setCurrentCommandIndex(0);
        resetCategories();
        setIsRoundTransition(false);
        setIsPlaying(true);
  
        // Set the first card of the next round
        const nextRound = rounds.find(r => r.roundNumber === currentRound + 1);
        if (nextRound && nextRound.commands.length > 0) {
          const firstCommand = nextRound.commands[0];
          const cardId = (firstCommand.payload as DropCommandPayload | MoveCommandPayload).cardId;
          const nextCard = allCards.find(card => card.id === cardId);
          if (nextCard) {
            setCurrentCard(nextCard);
          }
        }
      } else {
        setIsPlaying(false);
      }
      return;
    }
  
    const command = currentRoundData.commands[currentCommandIndex];
    const payload = command.payload as DropCommandPayload | MoveCommandPayload;
    
    // Update current card based on the command
    const cardToShow = allCards.find(card => card.id === payload.cardId);
    if (cardToShow) {
      setCurrentCard(cardToShow);
    }
  
    setCommandInfo({
      roundNumber: currentRound,
      description: getCommandDescription(command)
    });
  
    executeCommand(command);
    if (animatingCard) {
      startAnimation();
    }
    setCurrentCommandIndex(prev => prev + 1);
  }, [
    currentRound,
    currentCommandIndex,
    rounds,
    executeCommand,
    resetCategories,
    startAnimation,
    animatingCard,
    isRoundTransition,
    allCards // Add allCards to dependencies
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && rounds.length > 0 && !isAnimating && !isRoundTransition) {
      timer = setInterval(playNextCommand, 2000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [
    isPlaying,
    rounds,
    playbackSpeed,
    isAnimating,
    playNextCommand,
    isRoundTransition
  ]);

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

  return (
    <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-8">
      <div className={`space-y-2 sm:space-y-4 ${isMobile ? 'h-screen flex flex-col' : ''}`}>
        <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
            
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded bg-white text-sm sm:text-base"
            >
              <option value={0.5}>0.5x Speed</option>
              <option value={1}>1x Speed</option>
              <option value={2}>2x Speed</option>
              <option value={4}>4x Speed</option>
            </select>

            {!isPlaying && !commandInfo ? (
              <div className="flex items-center text-sm sm:text-base text-gray-600">
                Click Play to start the replay
              </div>
            ) : commandInfo && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="font-semibold">Round {commandInfo.roundNumber}:</span>
                <span>{commandInfo.description}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative h-32 sm:h-48">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {currentCard && (
              <AnimatedCard
                value={currentCard}
                columnIndex={undefined}
                onDrop={() => Promise.resolve()}
                currentCategory={undefined}
              />
            )}
          </div>
        </div>

        {isMobile ? (
          <div className="flex-1 min-h-0">
            <MobileReplayCategories categories={categories} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Object.entries(emptyCategories).map(([title]) => (
              <ReplayColumn
                key={title}
                title={title as CategoryName}
                cards={categories[title as CategoryName] || []}
              />
            ))}
          </div>
        )}

        {animatingCard && (
          <motion.div
            style={{
              position: 'fixed',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
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
    </div>
  );
}
