'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import type { CategoryName, ValueCard } from '@/lib/contracts/types';
import { VALUE_CARD_TYPE, type ValueDragItem } from './dndTypes';
import CardEntry from './CardEntry';

type Props = {
  category: CategoryName;
  cards: ValueCard[];
  activeCategories: CategoryName[];
  onDrop: (toCategory: CategoryName, valueId?: string) => void;
  onDropFromDeck: (toCategory: CategoryName, valueId: string, toIndex: number) => void;
  onMove: (valueId: string, from: CategoryName, to: CategoryName) => void;
  onReorder: (valueId: string, category: CategoryName, toIndex: number) => void;
  disabled: boolean;
  isAccessibilityMode: boolean;
  hasRemainingCards: boolean;
};

export default function BucketColumn({
  category,
  cards,
  activeCategories,
  onDrop,
  onDropFromDeck,
  onMove,
  onReorder,
  disabled,
  isAccessibilityMode,
  hasRemainingCards,
}: Props) {
  const bucketRef = useRef<HTMLElement>(null);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: VALUE_CARD_TYPE,
      canDrop: (item: ValueDragItem) =>
        !disabled &&
        (item.source === 'deck' || (item.sourceCategory !== undefined && item.sourceCategory !== category)),
      drop: (item: ValueDragItem, monitor) => {
        if (monitor.didDrop()) return;
        if (item.source === 'deck') {
          onDrop(category, item.id);
          return;
        }
        if (item.sourceCategory && item.sourceCategory !== category) {
          onMove(item.id, item.sourceCategory, category);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [category, disabled, onDrop, onMove]
  );

  drop(bucketRef);

  return (
    <motion.article
      ref={bucketRef}
      layout
      className={`border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default min-w-0 border p-3 shadow-sm transition-all duration-200 ${
        isOver ? 'border-ref-color-brand-primary bg-sys-color-surface-subtle ring-sys-color-focus-ring/25 ring-2' : ''
      }`}
      aria-label={`${category} category`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sys-color-text-primary text-interface-base-default min-w-0 font-semibold wrap-break-word">{category}</h4>
        <span className="bg-sys-color-surface-warm text-sys-color-text-primary rounded-ref-radius-999 text-interface-tiny-label px-2.5 py-0.5 font-semibold">
          {cards.length}
        </span>
      </div>

      <ul className="mt-3 min-h-56 space-y-2">
        <AnimatePresence initial={false}>
          {cards.map((card, index, values) => (
            <CardEntry
              key={card.id}
              card={card}
              category={category}
              activeCategories={activeCategories}
              onMove={onMove}
              onReorder={onReorder}
              onDropFromDeck={(valueId, nextCategory, toIndex) => onDropFromDeck(nextCategory, valueId, toIndex)}
              index={index}
              total={values.length}
              disabled={disabled}
              isAccessibilityMode={isAccessibilityMode}
            />
          ))}
        </AnimatePresence>
        {cards.length === 0 && (
          <li className="border-sys-color-border-default text-sys-color-text-primary rounded-sys-radius-button-sm text-interface-base-small flex min-h-28 items-center justify-center border border-dashed px-3 py-6 text-center">
            {hasRemainingCards ? 'No values yet' : 'No values in this bucket'}
          </li>
        )}
      </ul>
    </motion.article>
  );
}
