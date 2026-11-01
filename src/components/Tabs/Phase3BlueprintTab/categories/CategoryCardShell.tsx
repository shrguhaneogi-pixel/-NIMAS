/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Memoized Pixel Category Card Shell
 * Pure memoized shell providing render isolation and authentic stepped pixel borders.
 * Uses Press Start 2P for headers and Silkscreen for body text. Zero backdrop-blur.
 */

import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { CempasuchilRosette } from '../../../UI/SacredIcons';

export interface CardItemView {
  id: string;
  title: string;
  description: string;
  isChecked: boolean;
}

export interface CategoryCardShellProps {
  categoryId: string;
  categoryNumber: number;
  categoryTitle: string;
  categorySubtitle: string;
  icon: React.ReactNode;
  items: CardItemView[];
  verifiedCount: number;
  totalCount: number;
  progressPercent: number;
  isComplete: boolean;
  onVerifyItem: (id: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export const CategoryCardShell = memo<CategoryCardShellProps>(({
  categoryNumber,
  categoryTitle,
  categorySubtitle,
  icon,
  items,
  verifiedCount,
  totalCount,
  progressPercent,
  isComplete,
  onVerifyItem,
  onSelectAll,
  onClear
}) => {
  return (
    <div
      className={`p-4 space-y-3 ${
        isComplete
          ? 'pixel-box-amber'
          : 'pixel-box'
      }`}
    >
      {/* Category Header with Internal Progress Indicator */}
      <div className="flex items-center justify-between border-b-2 border-[#232a42] pb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 flex items-center justify-center border-2 ${
              isComplete
                ? 'border-amber-400 bg-amber-950/80 text-amber-300'
                : 'border-[#353f63] bg-[#121526] text-stone-400'
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-pixel-display text-[10px] text-amber-200 leading-normal uppercase">
              {categoryNumber}. {categoryTitle}
            </h3>
            <span className="font-pixel-body text-[9px] text-stone-400">
              {categorySubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Select/Clear Category Action */}
          <button
            onClick={() => (isComplete ? onClear() : onSelectAll())}
            className="pixel-btn text-[8px] font-pixel-display px-2 py-1 cursor-pointer uppercase"
          >
            {isComplete ? 'Clear' : 'Select All'}
          </button>

          {/* Luminous Completion Status Badge with Sacred Glyphs */}
          {isComplete && (
            <span className="border-2 border-amber-400 bg-amber-600 text-black font-pixel-display text-[8px] uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 shadow-sm font-bold">
              <CempasuchilRosette size={12} className="text-black shrink-0" />
              <span>Complete</span>
            </span>
          )}

          {/* Internal Progress Badge */}
          <span
            className={`font-pixel-display text-[8px] px-2 py-0.5 border-2 ${
              isComplete
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-[#121526] text-stone-300 border-[#353f63]'
            }`}
          >
            {verifiedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Internal Mini Stepped Progress Bar */}
      <div className="w-full bg-[#07080d] h-2 border-2 border-[#232a42] p-0.5">
        <div
          className={`h-full transition-all duration-150 ${
            isComplete
              ? 'bg-amber-400'
              : 'bg-amber-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-1.5">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onVerifyItem(item.id)}
            className={`p-2.5 border-2 cursor-pointer flex items-start gap-2.5 select-none ${
              item.isChecked
                ? 'bg-[#18110e] border-amber-600 text-stone-200'
                : 'bg-[#0e111d] border-[#1d2338] text-stone-300 hover:border-[#353f63]'
            }`}
          >
            <div
              className={`mt-0.5 w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                item.isChecked
                  ? 'border-amber-400 bg-amber-500 text-black font-bold'
                  : 'border-[#353f63] bg-[#07080d]'
              }`}
            >
              {item.isChecked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`font-pixel-display text-[9px] leading-tight ${
                    item.isChecked ? 'text-amber-300' : 'text-stone-200'
                  }`}
                >
                  {item.title}
                </span>
                <span className="font-pixel-body text-[8px] text-stone-500">[{item.id}]</span>
              </div>
              <p className="font-pixel-body text-[9px] text-stone-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

CategoryCardShell.displayName = 'CategoryCardShell';
