import { useState, useCallback } from 'react';
import { CategoryName, Value } from "@/lib/types";
import { logStateUpdate } from "@/lib/utils";

export function useMobileInteractions() {
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