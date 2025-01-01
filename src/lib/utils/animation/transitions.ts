import { Transition } from 'framer-motion';

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const easeTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export const cardTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 1,
};
