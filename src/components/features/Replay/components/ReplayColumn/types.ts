import { CategoryName, Value } from '@/lib/types';

/**
 * Props for the ReplayColumn component.
 */
export interface ReplayColumnProps {
  /** The title of the column, which is a category name. */
  title: CategoryName;
  /** The cards to be displayed in the column. */
  cards: Value[];
}
