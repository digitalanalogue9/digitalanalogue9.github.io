'use client';
import { Value } from "@/types/Value";
import { CategoryName } from "@/types/CategoryName";

export interface CategoryColumnProps {
  title: CategoryName;
  cards: Value[];
  onDrop: (value: Value, category: CategoryName) => void;
  onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => void;
}
