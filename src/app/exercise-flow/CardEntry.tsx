'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, Info, MoveVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import type { CategoryName, ValueCard } from '@/lib/contracts/types';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { VALUE_CARD_TYPE, type ValueDragItem } from './dndTypes';

export function computeInsertPosition(clientY: number, rect: Pick<DOMRect, 'top' | 'bottom'>): 'above' | 'below' {
  const midY = (rect.bottom - rect.top) / 2;
  return clientY - rect.top < midY ? 'above' : 'below';
}

type Props = {
  card: ValueCard;
  category: CategoryName;
  activeCategories: CategoryName[];
  onMove: (valueId: string, from: CategoryName, to: CategoryName) => void;
  onReorder: (valueId: string, category: CategoryName, toIndex: number) => void;
  onDropFromDeck?: (valueId: string, category: CategoryName, toIndex: number) => void;
  index: number;
  total: number;
  disabled: boolean;
  isAccessibilityMode: boolean;
  showEditingControls?: boolean;
};

type CardDropArgs = Pick<Props, 'category' | 'onDropFromDeck' | 'onMove' | 'onReorder'> & {
  item: ValueDragItem;
  didDrop: boolean;
  insertPosition: 'above' | 'below';
  index: number;
};

export function handleCardDrop({
  item,
  didDrop,
  insertPosition,
  index,
  category,
  onDropFromDeck,
  onMove,
  onReorder,
}: CardDropArgs): void {
  if (didDrop) return;
  if (item.source === 'deck') {
    onDropFromDeck?.(item.id, category, insertPosition === 'above' ? index : index + 1);
    return;
  }
  if (item.sourceCategory === category && item.sourceIndex !== undefined && item.sourceIndex !== index) {
    const sourceIndex = item.sourceIndex;
    const targetIndex =
      insertPosition === 'above' ? (sourceIndex < index ? index - 1 : index) : sourceIndex < index ? index : index + 1;
    onReorder(item.id, category, targetIndex);
    return;
  }
  if (item.sourceCategory && item.sourceCategory !== category) onMove(item.id, item.sourceCategory, category);
}

export default function CardEntry({
  card,
  category,
  activeCategories,
  onMove,
  onReorder,
  onDropFromDeck,
  index,
  total,
  disabled,
  isAccessibilityMode,
  showEditingControls = false,
}: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [insertPosition, setInsertPosition] = useState<'above' | 'below' | null>(null);
  const insertPositionRef = useRef<'above' | 'below'>('above');
  const restoreCardFocusRef = useRef(false);
  const cardRef = useRef<HTMLLIElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: VALUE_CARD_TYPE,
      item: {
        type: VALUE_CARD_TYPE,
        id: card.id,
        title: card.title,
        description: card.description,
        source: 'bucket',
        sourceCategory: category,
        sourceIndex: index,
      } satisfies ValueDragItem,
      canDrag: !disabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [card.id, card.title, category, disabled, index]
  );
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: VALUE_CARD_TYPE,
      canDrop: (item: ValueDragItem) =>
        !disabled && item.id !== card.id && (item.source === 'deck' ? !!onDropFromDeck : true),
      hover: (_item: ValueDragItem, monitor) => {
        const rect = cardRef.current?.getBoundingClientRect();
        const offset = monitor.getClientOffset();
        if (!rect || !offset) return;
        const position = computeInsertPosition(offset.y, rect);
        insertPositionRef.current = position;
        setInsertPosition(position);
      },
      drop: (item: ValueDragItem, monitor) => {
        handleCardDrop({
          item,
          didDrop: monitor.didDrop(),
          insertPosition: insertPositionRef.current,
          index,
          category,
          onDropFromDeck,
          onMove,
          onReorder,
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [card.id, category, disabled, index, onMove, onReorder]
  );

  useEffect(() => {
    if (!isOver) setInsertPosition(null);
  }, [isOver]);

  useEffect(() => {
    if (!restoreCardFocusRef.current) return;
    restoreCardFocusRef.current = false;
    cardRef.current?.focus();
  }, [index]);

  const handleReorder = (toIndex: number) => {
    if (!showEditingControls) {
      onReorder(card.id, category, toIndex);
      return;
    }
    restoreCardFocusRef.current = true;
    onReorder(card.id, category, toIndex);
    cardRef.current?.focus();
  };

  drag(drop(cardRef));

  const descriptionId = `bucket-description-${card.id}`;

  return (
    <motion.li
      ref={cardRef}
      layout
      tabIndex={disabled ? -1 : 0}
      aria-roledescription="Draggable card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className={`border-sys-color-border-default bg-sys-color-surface-warm rounded-sys-radius-button-sm text-interface-base-small relative border p-3 shadow-sm transition-colors duration-200 ease-in-out motion-reduce:transition-none ${
        isDragging ? 'opacity-50' : ''
      } ${isOver && !insertPosition ? 'border-ref-color-brand-primary bg-sys-color-surface-subtle ring-sys-color-focus-ring/25 ring-2' : ''}`}
      aria-label={`${card.title} in ${category}`}
    >
      {isOver && insertPosition && (
        <motion.div
          data-testid="insert-indicator"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.12 }}
          className={`bg-ref-color-brand-accent rounded-ref-radius-999 absolute right-0 left-0 z-10 h-0.5 ${
            insertPosition === 'above' ? '-top-px' : '-bottom-px'
          }`}
          aria-hidden="true"
        />
      )}
      <div className="flex items-start gap-2">
        <MoveVertical
          className="text-sys-color-text-secondary mt-0.5 h-4 w-4 shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sys-color-text-primary text-interface-base-default leading-snug font-semibold wrap-break-word">
            {card.title}
          </p>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.p
                id={descriptionId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                className="text-sys-color-text-secondary text-interface-base-small mt-2 overflow-hidden font-sans leading-relaxed"
              >
                {card.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          className="text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm -mr-1 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
          onClick={() => setIsExpanded((current) => !current)}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} description for ${card.title}`}
          aria-expanded={isExpanded}
          aria-controls={descriptionId}
        >
          <Info className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {(isAccessibilityMode || showEditingControls) && (
        <div className="border-sys-color-border-default mt-3 flex flex-wrap gap-2 border-t pt-3">
          {index > 0 && (
            <button
              type="button"
              className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm text-interface-tiny-label inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border px-2 py-1 font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 motion-reduce:transition-none"
              onClick={() => handleReorder(index - 1)}
              disabled={disabled}
              aria-label={`Move ${card.title} up in ${category}`}
            >
              <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Up
            </button>
          )}
          {index < total - 1 && (
            <button
              type="button"
              className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm text-interface-tiny-label inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border px-2 py-1 font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 motion-reduce:transition-none"
              onClick={() => handleReorder(index + 1)}
              disabled={disabled}
              aria-label={`Move ${card.title} down in ${category}`}
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Down
            </button>
          )}
          {activeCategories
            .filter((next) => next !== category)
            .map((next) => (
              <button
                key={`${card.id}-${category}-${next}`}
                type="button"
                className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm text-interface-tiny-label inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border px-2 py-1 font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 motion-reduce:transition-none"
                onClick={() => onMove(card.id, category, next)}
                disabled={disabled}
                aria-label={`Move ${card.title} to ${next}`}
              >
                Move to {next}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </button>
            ))}
        </div>
      )}
    </motion.li>
  );
}
