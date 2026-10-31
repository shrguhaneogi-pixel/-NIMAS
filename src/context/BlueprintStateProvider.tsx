/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Centralized Blueprint State Context Provider
 * Manages the verification state of the 32 checklist items across all sub-components via React Context.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  DEFINITION_OF_DONE_ITEMS,
  ChecklistItem,
  loadVerifiedItemIds,
  saveVerifiedItemIds
} from '../components/Tabs/Phase3BlueprintTab/types';

export interface BlueprintStateContextType {
  verifiedIds: Set<string>;
  totalCount: number;
  verifiedCount: number;
  progressPercent: number;
  isItemVerified: (id: string) => boolean;
  toggleItem: (id: string) => void;
  selectAllCategory: (category: ChecklistItem['category']) => void;
  clearCategory: (category: ChecklistItem['category']) => void;
  verifyAll: () => void;
  resetAll: () => void;
  getItemsByCategory: (category: ChecklistItem['category']) => ChecklistItem[];
}

const BlueprintStateContext = createContext<BlueprintStateContextType | null>(null);

export const BlueprintStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(() => loadVerifiedItemIds());

  // Real-time synchronization to localStorage on state change (zero polling)
  useEffect(() => {
    saveVerifiedItemIds(verifiedIds);
  }, [verifiedIds]);

  const isItemVerified = (id: string): boolean => {
    return verifiedIds.has(id);
  };

  const toggleItem = (id: string) => {
    setVerifiedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllCategory = (category: ChecklistItem['category']) => {
    const categoryItemIds = DEFINITION_OF_DONE_ITEMS
      .filter(i => i.category === category)
      .map(i => i.id);

    setVerifiedIds(prev => {
      const next = new Set(prev);
      categoryItemIds.forEach(id => next.add(id));
      return next;
    });
  };

  const clearCategory = (category: ChecklistItem['category']) => {
    const categoryItemIds = new Set(
      DEFINITION_OF_DONE_ITEMS.filter(i => i.category === category).map(i => i.id)
    );

    setVerifiedIds(prev => {
      const next = new Set(prev);
      categoryItemIds.forEach(id => next.delete(id));
      return next;
    });
  };

  const verifyAll = () => {
    setVerifiedIds(new Set(DEFINITION_OF_DONE_ITEMS.map(i => i.id)));
  };

  const resetAll = () => {
    setVerifiedIds(new Set());
  };

  const getItemsByCategory = (category: ChecklistItem['category']): ChecklistItem[] => {
    return DEFINITION_OF_DONE_ITEMS.filter(i => i.category === category);
  };

  const totalCount = DEFINITION_OF_DONE_ITEMS.length;
  const verifiedCount = verifiedIds.size;
  const progressPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const contextValue = useMemo<BlueprintStateContextType>(() => ({
    verifiedIds,
    totalCount,
    verifiedCount,
    progressPercent,
    isItemVerified,
    toggleItem,
    selectAllCategory,
    clearCategory,
    verifyAll,
    resetAll,
    getItemsByCategory
  }), [verifiedIds, totalCount, verifiedCount, progressPercent]);

  return (
    <BlueprintStateContext.Provider value={contextValue}>
      {children}
    </BlueprintStateContext.Provider>
  );
};

export function useBlueprintState(): BlueprintStateContextType {
  const context = useContext(BlueprintStateContext);
  if (!context) {
    throw new Error('useBlueprintState must be used within BlueprintStateProvider');
  }
  return context;
}
