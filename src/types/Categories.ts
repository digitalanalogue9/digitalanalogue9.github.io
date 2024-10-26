import { Value } from "./Value";
import { CategoryName } from "./CategoryName";


export type Categories = {
    [key in CategoryName]: Value[];
};
