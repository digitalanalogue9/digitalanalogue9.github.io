import { useState, useCallback } from 'react';
import { CategoryName, Value } from "@/lib/types";
import { logStateUpdate } from "@/lib/utils";
import { MobileInteractionsResult } from '../types';

/**
 * Custom hook to manage mobile interactions for categories and drop zones.
 *
 * @returns {Object} An object containing:
 * - `expandedCategory` {CategoryName | null}: The currently expanded category.
 * - `activeDropZone` {CategoryName | null}: The currently active drop zone.
 * - `handleExpand` {(category: CategoryName) => void}: Function to handle expanding a category.
 * - `handleClose` {() => void}: Function to handle closing the expanded category.
 * - `handleDropWithZone` {(card: Value, category: CategoryName) => { category: CategoryName }}: Function to handle dropping a card into a category with a drop zone.
 */
export function useMobileInteractions(): MobileInteractionsResult {
  const [expandedCategory, setExpandedCategory] = useState<CategoryName | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<CategoryName | null>(null);
  const handleExpand = useCallback((category: CategoryName) => {
    logStateUpdate('handleMobileExpand', {
      category
    }, 'MobileInteractions');
    setExpandedCategory(category);
  }, []);
  const handleClose = useCallback(() => {
    logStateUpdate('handleMobileClose', {}, 'MobileInteractions');
    setExpandedCategory(null);
  }, []);
  const handleDropWithZone = useCallback((card: Value, category: CategoryName) => {
    logStateUpdate('handleMobileDropWithZone', {
      card,
      category
    }, 'MobileInteractions');
    setActiveDropZone(category);
    setExpandedCategory(category);
    // Clear the active zone after a short delay
    setTimeout(() => {
      setActiveDropZone(null);
    }, 500);
    return {
      category
    };
  }, []);
  return {
    expandedCategory,
    activeDropZone,
    handleExpand,
    handleClose,
    handleDropWithZone
  };
}