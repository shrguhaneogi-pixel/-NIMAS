/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - ChecklistCategoryCard Sub-component
 */

import React from 'react';
import { Check, CheckCircle2, Circle } from 'lucide-react';
import { ChecklistItem } from './types';

interface ChecklistCategoryCardProps {
  title: string;
  categoryKey: ChecklistItem['category'];
  icon: React.FC<{ className?: string }>;
  items: ChecklistItem[];
  verifiedIds: Set<string>;
  onToggleItem: (id: string) => void;
}

export const ChecklistCategoryCard: React.FC<ChecklistCategoryCardProps> = ({
  title,
  icon: Icon,
  items,
  verifiedIds,
  onToggleItem
}) => {
  const verifiedCount = items.filter(it => verifiedIds.has(it.id)).length;
  const isComplete = verifiedCount === items.length;

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-lg">
      
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isComplete ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/70' : 'bg-stone-950 text-amber-400 border border-stone-800'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-100 text-sm">{title}</h3>
            <span className="text-[10px] text-stone-400 font-mono">
              {items.length} Verification Criteria
            </span>
          </div>
        </div>

        {/* Completion Pill */}
        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold tabular-nums ${
          isComplete
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            : 'bg-stone-950 text-stone-400 border border-stone-800'
        }`}>
          {verifiedCount} / {items.length} Verified
        </span>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {items.map(item => {
          const isChecked = verifiedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                isChecked
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-stone-200'
                  : 'bg-stone-950 border-stone-800/70 text-stone-300 hover:border-stone-700'
              }`}
            >
              {/* Checkbox Icon */}
              <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                isChecked
                  ? 'bg-emerald-600 text-stone-950'
                  : 'border border-stone-700 bg-stone-900 group-hover:border-stone-500'
              }`}>
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Text Description */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-serif font-bold leading-tight ${
                    isChecked ? 'text-emerald-300' : 'text-stone-100'
                  }`}>
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono text-stone-500">
                    [{item.id}]
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
