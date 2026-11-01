/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Frontend & 3D Category Sub-component
 * Encapsulates internal category progress tracking and renders through memoized CategoryCardShell.
 */

import React, { useMemo, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { useBlueprintState } from '../../../../context/BlueprintStateProvider';
import { CategoryCardShell, CardItemView } from './CategoryCardShell';

export const Frontend3dCategoryCard: React.FC = () => {
  const { getItemsByCategory, isItemVerified, verifyItem, selectAllCategory, clearCategory } =
    useBlueprintState();

  const rawItems = useMemo(() => getItemsByCategory('frontend_3d'), [getItemsByCategory]);

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
    selectAllCategory('frontend_3d');
  }, [selectAllCategory]);

  const handleClear = useCallback(() => {
    clearCategory('frontend_3d');
  }, [clearCategory]);

  return (
    <CategoryCardShell
      categoryId="frontend_3d"
      categoryNumber={4}
      categoryTitle="Frontend & 3D Sovereign Ofrenda"
      categorySubtitle="Procedural Assets · Touch Forgiveness · WebGL Cleanup"
      icon={<Sparkles className="w-4 h-4" />}
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
