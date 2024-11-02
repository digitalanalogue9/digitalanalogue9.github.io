import { Value } from "./Value";
import { CategoryName } from "./CategoryName";

export type Categories = {
    'Very Important': Value[];
    'Important': Value[];
    'Not Important': Value[];
    'Quite Important'?: Value[];
    'Of Some Importance'?: Value[];
};
