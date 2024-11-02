import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { CardMoveOptionsProps } from './types';
import { CategoryName } from '@/types';

const categories: CategoryName[] = [
  'Very Important',
  'Quite Important',
  'Important',
  'Of Some Importance',
  'Not Important'
];

export function CardMoveOptions({
  value,
  currentCategory,
  onMoveToCategory,
  onClose
}: CardMoveOptionsProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
    // Calculate position based on the button that opened the menu
    const button = document.getElementById(`options-${value.id}`);
    if (button) {
      const rect = button.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 200, // Menu width is 200px
      });
    }
  }, [value.id]);

  const menuContent = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1"
    >
      {categories
        .filter(cat => cat !== currentCategory)
        .map(category => (
          <button
            key={category}
            onClick={() => {
              onMoveToCategory(value, currentCategory, category);
              onClose();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 
                     hover:bg-gray-50 transition-colors"
          >
            Move to {category}
          </button>
        ))}
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(
    menuContent,
    document.getElementById('portal-root') || document.body
  );
}
