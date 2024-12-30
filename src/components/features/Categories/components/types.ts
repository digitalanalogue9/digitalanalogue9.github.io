import { CategoryName, Value } from "../../../../lib/types";

/** Result of mobile interactions */
export interface MobileInteractionsResult {
    /** Expanded category */
    expandedCategory: CategoryName | null;
    /** Active drop zone */
    activeDropZone: CategoryName | null;
    /** Callback to handle expand */
    handleExpand: (category: CategoryName) => void;
    /** Callback to handle close */
    handleClose: () => void;
    /** Callback to handle drop with zone */
    handleDropWithZone: (card: Value, category: CategoryName) => { category: CategoryName };
  }