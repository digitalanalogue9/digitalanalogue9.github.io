import { Category } from "./Category";


export type Value = {
    id: string;
    title: string;
    description: string;
    category?: Category;
};
