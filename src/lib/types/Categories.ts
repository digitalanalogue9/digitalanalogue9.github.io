import { Value } from "./Value";
import { CategoryName } from "./CategoryName";

// In src/types/Categories.ts
export interface Categories {
  'Very Important': Value[];
  'Not Important': Value[];
  'Quite Important'?: Value[];
  'Important'?: Value[];
  'Of Some Importance'?: Value[];
  [key: string]: Value[] | undefined;  // Add index signature
}
// These types can be used for type checking in specific rounds
export type Round1And2Categories = Required<Categories>;

export type Round3Categories = Required<Omit<Categories, 'Of Some Importance'>>;

export type Round4Categories = Pick<Categories, 'Very Important' | 'Not Important'>;
