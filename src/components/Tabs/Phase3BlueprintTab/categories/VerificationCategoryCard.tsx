/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Verification Category Sub-component
 * Encapsulates internal category progress tracking and renders through memoized CategoryCardShell.
 */

import React, { useMemo, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useBlueprintState } from '../../../../context/BlueprintStateProvider';
import { CategoryCardShell, CardItemView } from './CategoryCardShell';

export const VerificationCategoryCard: React.FC = () => {
  const { getItemsByCategory, isItemVerified, verifyItem, selectAllCategory, clearCategory } =
    useBlueprintState();

  const rawItems = useMemo(() => getItemsByCategory('release'), [getItemsByCategory]);

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
    selectAllCategory('release');
  }, [selectAllCategory]);

  const handleClear = useCallback(() => {
    clearCategory('release');
  }, [clearCategory]);

  return (
    <CategoryCardShell
      categoryId="release"
      categoryNumber={5}
      categoryTitle="Release & Production Verification"
      categorySubtitle="Unit & Gold Benchmarks · WCAG AA · Air-Gap Acceptance"
      icon={<CheckCircle2 className="w-4 h-4" />}
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
