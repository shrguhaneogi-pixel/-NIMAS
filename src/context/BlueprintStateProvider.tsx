/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Centralized Blueprint State Context Provider
 * Manages the verification state of the 32 checklist items across all sub-components via React Context.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  DEFINITION_OF_DONE_ITEMS,
  ChecklistItem,
  CANONICAL_DOD_IDS,
  loadVerifiedItemIds,
  saveVerifiedItemIds
} from '../components/Tabs/Phase3BlueprintTab/types';

export interface BlueprintStateContextType {
  verifiedIds: Set<string>;
  totalCount: number;
  totalVerified: number;
  verifiedCount: number;
  progressPercent: number;
  isItemVerified: (id: string) => boolean;
  verifyItem: (id: string) => void;
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

  const isItemVerified = useCallback((id: string): boolean => {
    return verifiedIds.has(id);
  }, [verifiedIds]);

  const verifyItem = useCallback((id: string) => {
    if (!CANONICAL_DOD_IDS.has(id)) return;
    setVerifiedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Alias for backward compatibility
  const toggleItem = verifyItem;

  const selectAllCategory = useCallback((category: ChecklistItem['category']) => {
    const categoryItemIds = DEFINITION_OF_DONE_ITEMS
      .filter(i => i.category === category)
      .map(i => i.id);

    setVerifiedIds(prev => {
      const next = new Set(prev);
      categoryItemIds.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const clearCategory = useCallback((category: ChecklistItem['category']) => {
    const categoryItemIds = new Set(
      DEFINITION_OF_DONE_ITEMS.filter(i => i.category === category).map(i => i.id)
    );

    setVerifiedIds(prev => {
      const next = new Set(prev);
      categoryItemIds.forEach(id => next.delete(id));
      return next;
    });
  }, []);

  const verifyAll = useCallback(() => {
    setVerifiedIds(new Set(CANONICAL_DOD_IDS));
  }, []);

  const resetAll = useCallback(() => {
    setVerifiedIds(new Set());
  }, []);

  const getItemsByCategory = useCallback((category: ChecklistItem['category']): ChecklistItem[] => {
    return DEFINITION_OF_DONE_ITEMS.filter(i => i.category === category);
  }, []);

  const totalCount = DEFINITION_OF_DONE_ITEMS.length;
  // Derived totalVerified calculation, bound strictly to canonical DoD IDs
  const totalVerified = useMemo(() => {
    let count = 0;
    verifiedIds.forEach(id => {
      if (CANONICAL_DOD_IDS.has(id)) count++;
    });
    return count;
  }, [verifiedIds]);

  const verifiedCount = totalVerified;
  const progressPercent = totalCount > 0 ? Math.round((totalVerified / totalCount) * 100) : 0;

  const contextValue = useMemo<BlueprintStateContextType>(() => ({
    verifiedIds,
    totalCount,
    totalVerified,
    verifiedCount,
    progressPercent,
    isItemVerified,
    verifyItem,
    toggleItem,
    selectAllCategory,
    clearCategory,
    verifyAll,
    resetAll,
    getItemsByCategory
  }), [
    verifiedIds,
    totalCount,
    totalVerified,
    verifiedCount,
    progressPercent,
    isItemVerified,
    verifyItem,
    toggleItem,
    selectAllCategory,
    clearCategory,
    verifyAll,
    resetAll,
    getItemsByCategory
  ]);

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
