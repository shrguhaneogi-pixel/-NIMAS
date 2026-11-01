/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - AI / RAG Category Sub-component
 * Encapsulates internal category progress tracking and renders through memoized CategoryCardShell.
 */

import React, { useMemo, useCallback } from 'react';
import { Cpu } from 'lucide-react';
import { useBlueprintState } from '../../../../context/BlueprintStateProvider';
import { CategoryCardShell, CardItemView } from './CategoryCardShell';

export const AiRagCategoryCard: React.FC = () => {
  const { getItemsByCategory, isItemVerified, verifyItem, selectAllCategory, clearCategory } =
    useBlueprintState();

  const rawItems = useMemo(() => getItemsByCategory('local_ai'), [getItemsByCategory]);

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
    selectAllCategory('local_ai');
  }, [selectAllCategory]);

  const handleClear = useCallback(() => {
    clearCategory('local_ai');
  }, [clearCategory]);

  return (
    <CategoryCardShell
      categoryId="local_ai"
      categoryNumber={2}
      categoryTitle="Local AI & Grounded RAG Pipeline"
      categorySubtitle="Gemma CoT · sqlite-vec · Citation Proofs"
      icon={<Cpu className="w-4 h-4" />}
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
