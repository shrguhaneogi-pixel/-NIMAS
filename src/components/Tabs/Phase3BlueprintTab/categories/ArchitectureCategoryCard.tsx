/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Architecture Category Sub-component
 * Encapsulates internal category progress tracking and renders through memoized CategoryCardShell.
 */

import React, { useMemo, useCallback } from 'react';
import { Layers } from 'lucide-react';
import { useBlueprintState } from '../../../../context/BlueprintStateProvider';
import { CategoryCardShell, CardItemView } from './CategoryCardShell';

export const ArchitectureCategoryCard: React.FC = () => {
  const { getItemsByCategory, isItemVerified, verifyItem, selectAllCategory, clearCategory } =
    useBlueprintState();

  const rawItems = useMemo(() => getItemsByCategory('architecture'), [getItemsByCategory]);

  const items: CardItemView[] = useMemo(() => {
    return rawItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      isChecked: isItemVerified(item.id)
    }));
  }, [rawItems, isItemVerified]);

  const { totalCount, verifiedCount, progressPercent, isComplete } = useMemo(() => {
    const total = items.length;
    const verified = items.filter(i => i.isChecked).length;
    const percent = total > 0 ? Math.round((verified / total) * 100) : 0;
    return {
      totalCount: total,
      verifiedCount: verified,
      progressPercent: percent,
      isComplete: total > 0 && verified === total
    };
  }, [items]);

  const handleSelectAll = useCallback(() => {
    selectAllCategory('architecture');
  }, [selectAllCategory]);

  const handleClear = useCallback(() => {
    clearCategory('architecture');
  }, [clearCategory]);

  return (
    <CategoryCardShell
      categoryId="architecture"
      categoryNumber={1}
      categoryTitle="Architecture & Monorepo Engineering"
      categorySubtitle="Process Boundaries · Pinned Lockfiles · Canonical Schemas"
      icon={<Layers className="w-4 h-4" />}
      items={items}
      verifiedCount={verifiedCount}
      totalCount={totalCount}
      progressPercent={progressPercent}
      isComplete={isComplete}
      onVerifyItem={verifyItem}
      onSelectAll={handleSelectAll}
      onClear={handleClear}
    />
  );
};
