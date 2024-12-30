import { Position } from "@/lib/types";
export const getElementCenter = (element: HTMLElement): Position => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
};
export const getCardPosition = (cardId: string): Position | undefined => {
  const element = document.getElementById(`card-${cardId}`);
  return element ? getElementCenter(element) : undefined;
};
export const getCategoryPosition = (categoryName: string): Position | undefined => {
  const element = document.getElementById(`category-${categoryName}`);
  return element ? getElementCenter(element) : undefined;
};