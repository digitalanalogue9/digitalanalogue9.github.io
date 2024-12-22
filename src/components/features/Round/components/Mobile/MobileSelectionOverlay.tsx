import { motion, AnimatePresence } from 'framer-motion';
import { MobileSelectionOverlayProps} from '@/components/features/Round/types';


/**
 * MobileSelectionOverlay component displays an overlay with a message when visible.
 * It uses Framer Motion for animations.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isVisible - Determines if the overlay is visible.
 *
 * @returns {JSX.Element} The rendered component.
 */
export function MobileSelectionOverlay({ isVisible }: MobileSelectionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-100"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium z-50 text-center pointer-events-none px-4 w-full"
          >
            Tap a category to place card
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
