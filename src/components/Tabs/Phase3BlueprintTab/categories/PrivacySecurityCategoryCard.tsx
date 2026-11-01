/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Privacy & Security Category Sub-component
 * Encapsulates internal category progress tracking and renders through memoized CategoryCardShell.
 */

import React, { useMemo, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useBlueprintState } from '../../../../context/BlueprintStateProvider';
import { CategoryCardShell, CardItemView } from './CategoryCardShell';

export const PrivacySecurityCategoryCard: React.FC = () => {
  const { getItemsByCategory, isItemVerified, verifyItem, selectAllCategory, clearCategory } =
    useBlueprintState();

  const rawItems = useMemo(() => getItemsByCategory('security'), [getItemsByCategory]);

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
    selectAllCategory('security');
  }, [selectAllCategory]);

  const handleClear = useCallback(() => {
    clearCategory('security');
  }, [clearCategory]);

  return (
    <CategoryCardShell
      categoryId="security"
      categoryNumber={3}
      categoryTitle="Privacy, Air-Gap & Security Hardening"
      categorySubtitle="Zero Egress · Loopback Only · Injection Resistance"
      icon={<ShieldAlert className="w-4 h-4" />}
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
