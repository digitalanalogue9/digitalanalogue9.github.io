import type { CategoryName } from '@/lib/contracts/types';

export const VALUE_CARD_TYPE = 'value-card' as const;

export type ValueDragItem = {
  type: typeof VALUE_CARD_TYPE;
  id: string;
  title: string;
  description: string;
  source: 'deck' | 'bucket';
  sourceCategory?: CategoryName;
  sourceIndex?: number;
};
