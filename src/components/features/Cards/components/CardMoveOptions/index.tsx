// src/components/Card/CardMoveOptions.tsx
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import { CardMoveOptionsProps } from '@/components/features/Cards/types';
import { allCategories } from '@/components/features/Categories/constants/categories'; // Use centralized categories
import { useMobile } from '@/lib/contexts/MobileContext';

/**
 * Component for displaying move options for a card.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.value - The card value object.
 * @param {string} props.currentCategory - The current category of the card.
 * @param {function} props.onMoveBetweenCategories - Callback function to handle moving the card between categories.
 * @param {function} props.onClose - Callback function to handle closing the move options menu.
 *
 * @returns {React.ReactPortal | null} A portal containing the move options menu, or null if the component is not mounted.
 *
 * @example
 * <CardMoveOptions
 *   value={cardValue}
 *   currentCategory="To Do"
 *   onMoveBetweenCategories={handleMove}
 *   onClose={handleClose}
 * />
 */
export function CardMoveOptions({ value, currentCategory, onMoveBetweenCategories, onClose }: CardMoveOptionsProps) {
  const [mounted, setMounted] = useState(false);
  const { isMobile } = useMobile();

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const updatePosition = useCallback(() => {
    const button = document.getElementById(`options-${value.id}`);
    if (button) {
      const rect = button.getBoundingClientRect();
      if (isMobile) {
        setPosition({
          top: rect.bottom + window.scrollY,
          left: Math.max(10, Math.min(window.innerWidth - 210, rect.right + window.scrollX - 200)),
        });
      } else {
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - 200,
        });
      }
    }
  }, [value.id, isMobile]);
  useEffect(() => {
    setMounted(true);
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`#options-${value.id}`) && !target.closest('.move-options-menu')) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [value.id, onClose]);
  const buttonBaseClass = `
  p-1.5 text-sm bg-white
  text-black // Changed to black for better visibility
  hover:bg-blue-300 // More subtle hover state that works with post-it style
  active:bg-blue-300 
  transition-colors touch-none select-none
  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1
`;
  const menuContent = (
    <motion.div
      className="move-options-menu w-52 touch-manipulation rounded-md border border-gray-200 bg-white py-1 shadow-lg"
      initial={{
        opacity: 0,
        y: -10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      role="dialog"
      aria-label={`Move options for ${value.title}`}
      aria-modal="true"
    >
      <div role="menu" aria-label="Available categories">
        {allCategories
          .filter((cat) => cat !== currentCategory)
          .map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                onMoveBetweenCategories(value, currentCategory, category);
                onClose();
              }}
              className={buttonBaseClass}
              role="menuitem"
              aria-label={`Move to ${category} category`}
            >
              Move to {category}
            </button>
          ))}
      </div>
      <button type="button" onClick={onClose} className="sr-only" aria-label="Close move options">
        Close
      </button>
    </motion.div>
  );
  if (!mounted) return null;
  return createPortal(menuContent, document.getElementById('portal-root') || document.body);
}
