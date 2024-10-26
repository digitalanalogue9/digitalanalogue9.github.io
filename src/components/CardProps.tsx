// Card.tsx
'use client';
import { Value } from "@/types/Value";

export interface CardProps {
  value: Value;
  columnIndex: number;
  onDrop?: (value: Value, columnIndex: number) => void;
  onMoveUp?: (value: Value, fromColumnIndex: number) => void;
  onMoveDown?: (value: Value, fromColumnIndex: number) => void;
  debug?: boolean;
}
