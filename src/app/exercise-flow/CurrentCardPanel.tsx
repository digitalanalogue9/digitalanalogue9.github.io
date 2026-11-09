'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import { useDrag } from 'react-dnd';
import type { CategoryName, ValueCard } from '@/lib/contracts/types';
import { VALUE_CARD_TYPE, type ValueDragItem } from './dndTypes';

type Props = {
  card: ValueCard;
  activeCategories: CategoryName[];
  onDrop: (toCategory: CategoryName) => void;
  disabled: boolean;
};

export default function CurrentCardPanel({ card, activeCategories, onDrop, disabled }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: VALUE_CARD_TYPE,
      item: {
        type: VALUE_CARD_TYPE,
        id: card.id,
        title: card.title,
        description: card.description,
        source: 'deck',
      } satisfies ValueDragItem,
      canDrag: !disabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [card.description, card.id, card.title, disabled]
  );

  drag(cardRef);

  return (
    <section
      className="current-card-panel grid w-full min-w-0 grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-6"
      aria-labelledby="current-card-heading"
    >
      <motion.div
        ref={cardRef}
        layout
        tabIndex={disabled ? -1 : 0}
        aria-roledescription="Draggable card"
        className={`border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default relative w-full min-w-0 cursor-move border p-4 shadow-md transition-opacity duration-200 sm:p-5 ${
          isDragging ? 'opacity-60' : ''
        }`}
        aria-label={`Current card ${card.title}`}
      >
        <div
          className="bg-ref-color-brand-accent rounded-t-sys-radius-card-sm absolute inset-x-0 top-0 h-1"
          aria-hidden="true"
        />
        <div className="flex items-start gap-3">
          <Target className="text-ref-color-brand-primary mt-1 h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
          <div className="min-w-0">
            <p
              id="current-card-heading"
              className="sr-only"
            >
              Current card
            </p>
            <h3 className="text-sys-color-text-primary text-interface-title-1 mt-2 leading-tight font-semibold wrap-break-word">
              {card.title}
            </h3>
            <p className="text-sys-color-text-primary text-interface-base-large mt-3 font-sans leading-relaxed wrap-break-word">
              {card.description}
            </p>
          </div>
        </div>
      </motion.div>
      <div className="min-w-0 md:py-5">
        <div className="mobile-placement-grid grid grid-cols-2 gap-2 md:h-full md:grid-cols-1 md:content-between">
          {activeCategories.map((category) => (
            <button
              key={`drop-${category}`}
              type="button"
              className="border-sys-color-border-strong text-sys-color-text-primary hover:border-ref-color-brand-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm text-interface-base-small inline-flex min-h-11 items-center justify-between gap-2 border px-3 py-2 text-left font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:active:scale-100"
              onClick={() => onDrop(category)}
              disabled={disabled}
              aria-label={`Place current card in ${category}`}
            >
              {category}
              <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
