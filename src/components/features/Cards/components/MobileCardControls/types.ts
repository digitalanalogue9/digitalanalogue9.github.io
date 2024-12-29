/** Props for mobile card movement controls */
export interface MobileCardControlsProps {
    /** Flag indicating if upward movement is possible */
    canMoveUp: boolean;
    /** Flag indicating if downward movement is possible */
    canMoveDown: boolean;
    /** Callback to move card up */
    onMoveUp: () => void;
    /** Callback to move card down */
    onMoveDown: () => void;
    /** Flag indicating if movement to previous category is possible */
    canMoveToPrevCategory: boolean;
    /** Flag indicating if movement to next category is possible */
    canMoveToNextCategory: boolean;
    /** Callback to move to previous category */
    onMoveToPrevCategory: () => void;
    /** Callback to move to next category */
    onMoveToNextCategory: () => void;
  }
  