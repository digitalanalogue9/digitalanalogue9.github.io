// src/components/Card/CardMoveOptions.tsx
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import { CardMoveOptionsProps } from './types';
import { CategoryName } from '@/types';
import { allCategories } from '@/constants/categories'; // Use centralized categories

export function CardMoveOptions({
  value,
  currentCategory,
  onMoveBetweenCategories,
  onClose
}: CardMoveOptionsProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const button = document.getElementById(`options-${value.id}`);
    if (button) {
      const rect = button.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        setPosition({
          top: rect.bottom + window.scrollY,
          left: Math.max(10, Math.min(window.innerWidth - 210, rect.right + window.scrollX - 200))
        });
      } else {
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - 200
        });
      }
    }
  }, [value.id]);

  useEffect(() => {
    setMounted(true);
    updatePosition();

    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`#options-${value.id}`) && 
          !target.closest('.move-options-menu')) {
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

  const menuContent = (
    <motion.div
      className="move-options-menu w-48 bg-white rounded-md shadow-lg border 
                border-gray-200 py-1 touch-manipulation"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
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
      <div 
        role="menu" 
        aria-label="Available categories"
      >
        {allCategories
          .filter(cat => cat !== currentCategory)
          .map(category => (
            <button
              key={category}
              type="button"
              onClick={() => {
                onMoveBetweenCategories(value, currentCategory, category);
                onClose();
              }}
              className="block w-full text-left px-4 py-3 text-sm text-gray-700 
                       hover:bg-gray-50 active:bg-gray-100 transition-colors
                       touch-manipulation select-none focus:outline-none focus:bg-gray-50
                       focus:ring-2 focus:ring-inset focus:ring-blue-500"
              role="menuitem"
              aria-label={`Move to ${category} category`}
            >
              Move to {category}
            </button>
          ))}
      </div>
      <button
        onClick={onClose}
        className="sr-only"
        aria-label="Close move options"
      >
        Close
      </button>
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(
    menuContent,
    document.getElementById('portal-root') || document.body
  );
}
