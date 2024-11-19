// Generated types file

import { Categories, CategoryName, Value } from "@/lib/types";

export interface MobileCardControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveToPrevCategory: boolean;
  canMoveToNextCategory: boolean;
  onMoveToPrevCategory: () => void;
  onMoveToNextCategory: () => void;
}


export interface MobileCategoryRowProps {
  category: CategoryName;
  cards: Value[];
  availableCategories: CategoryName[];
  isActive: boolean;
  isExpanded: boolean;
  onCategoryTap: (category: CategoryName) => void;
  onCategorySelect: (category: CategoryName) => void;
  showingCardSelection: boolean;
  onMoveWithinCategory?: (fromIndex: number, toIndex: number) => void;
  onMoveBetweenCategories?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
  lastDroppedCategory: CategoryName | null; // Add this line
}

export interface MobileSelectionOverlayProps {
  isVisible: boolean;
}

export interface MobileCardViewProps {
  cards: Value[];
  categorizedCards: Categories;
  onCardPlace: (card: Value, category: CategoryName) => void;
}


export interface MobileCategoryListProps {
  categories: Categories;
  activeDropZone: CategoryName | null;
  onDrop: (card: Value, category: CategoryName) => void;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
  selectedCard: Value | null;
  onCardSelect: (card: Value | null) => void;
}

export interface StatusMessageProps {
  status: {
    text: string;
    type: 'info' | 'warning' | 'success';
    isEndGame?: boolean;
  };
  isNearingCompletion: boolean;
  hasTooManyImportantCards: boolean;
  hasNotEnoughImportantCards: boolean;
  hasEnoughCards: boolean;
  targetCoreValues: number;
  canProceedToNextRound: boolean;
  remainingCards: any[];
  showDetails?: boolean;
  setShowDetails?: (show: boolean) => void;
}

export interface CategoryGridProps {
  categories: Categories;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}

export interface RoundActionsProps {
  remainingCards: Value[];
  canProceedToNextRound: boolean;
  onNextRound: () => void;
  onDrop: (card: Value, category: CategoryName) => void;
  isEndGame: boolean;
  setShowDetails?: (show: boolean) => void;
}

export interface RoundHeaderProps {
  targetCoreValues: number;
  roundNumber: number;
  remainingCardsCount: number;
}

export interface RoundUIProps {
  maxCards: number;
  showResults: boolean;
  sessionId?: string;
  roundNumber: number;
  targetCoreValues: number;
  remainingCards: Value[];
  categories: Categories;
  currentRoundCommands: any[]; // Consider creating a specific type for commands
  canProceedToNextRound: boolean;
  isEndGameReady: boolean;
  onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  onNextRound: () => Promise<void>;
}


export interface RoundActionsPropsWithActiveZone extends RoundActionsProps {
  onActiveDropZoneChange?: (category: CategoryName | null) => void;
  selectedMobileCard?: Value | null;
  onMobileCardSelect?: (card: Value | null) => void;
  setShowDetails?: (show: boolean) => void;
}

export interface StatusState {
  remainingCards: Value[];
  targetCoreValues: number;
  categories: Categories;
  hasMinimumNotImportant: boolean;
  hasEnoughCards: boolean;
  isNearingCompletion: boolean;
  veryImportantCount: number;
  totalActiveCards: number;
}

export interface CategoryGridProps {
  categories: Categories;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}

export type StatusType = 'info' | 'warning' | 'success';

export interface Status {
  text: string;
  type: StatusType;
  isEndGame?: boolean;
}
