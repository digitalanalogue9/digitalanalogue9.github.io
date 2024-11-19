import { Value, Categories, CategoryName } from "@/lib/types";

export interface ReplayColumnProps {
  title: CategoryName;
  cards: Value[];
}

export interface MobileReplayCategoriesProps {
  categories: Categories;
}

export interface AnimatingCard {
  value: Value;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
}

export interface CommandInfo {
  roundNumber: number;
  description: string;
}