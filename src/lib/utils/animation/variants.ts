import { Variants } from 'framer-motion';

export const cardVariants: Variants = {
  initial: {
    scale: 1.0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 1.0,
    opacity: 0,
  },
  hover: {
    scale: 1.0,
    transition: {
      duration: 0.2,
    },
  },
};

export const categoryVariants: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -20,
    opacity: 0,
  },
};
