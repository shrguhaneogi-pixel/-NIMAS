/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Privacy & Security Category Sub-component
 * Encapsulates internal category progress tracking while synchronizing with BlueprintStateProvider.
 */

import React, { useMemo } from 'react';
import { ShieldAlert, Check } from 'lucide-react';
import { useBlueprintState } from '../../../../context/BlueprintStateProvider';

export const PrivacySecurityCategoryCard: React.FC = () => {
  const { getItemsByCategory, isItemVerified, toggleItem, selectAllCategory, clearCategory } =
    useBlueprintState();

  const items = useMemo(() => getItemsByCategory('security'), [getItemsByCategory]);

  // Internal category progress tracking logic
  const { verifiedCount, totalCount, progressPercent, isComplete } = useMemo(() => {
    const total = items.length;
    const verified = items.filter(it => isItemVerified(it.id)).length;
    const percent = total > 0 ? Math.round((verified / total) * 100) : 0;
    return {
      totalCount: total,
      verifiedCount: verified,
      progressPercent: percent,
      isComplete: total > 0 && verified === total
    };
  }, [items, isItemVerified]);

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Category Header with Internal Progress Indicator */}
      <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isComplete
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/70'
                : 'bg-stone-950 text-amber-400 border border-stone-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-100 text-sm">
              3. Privacy, Air-Gap & Security Hardening
            </h3>
            <span className="text-[10px] text-stone-400 font-mono">
              Zero Egress · Loopback Only · Injection Resistance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Select/Clear Category Action */}
          <button
            onClick={() => (isComplete ? clearCategory('security') : selectAllCategory('security'))}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
          >
            {isComplete ? 'Clear' : 'Select All'}
          </button>

          {/* Internal Progress Badge */}
          <span
            className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold tabular-nums transition-colors ${
              isComplete
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-stone-950 text-stone-400 border border-stone-800'
            }`}
          >
            {verifiedCount} / {totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Internal Mini Progress Bar */}
      <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden border border-stone-800/60">
        <div
          className={`h-full transition-all duration-300 ${
            isComplete ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {items.map(item => {
          const isChecked = isItemVerified(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                isChecked
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-stone-200'
                  : 'bg-stone-950 border-stone-800/70 text-stone-300 hover:border-stone-700'
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                  isChecked
                    ? 'bg-emerald-600 text-stone-950'
                    : 'border border-stone-700 bg-stone-900 group-hover:border-stone-500'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-serif font-bold leading-tight ${
                      isChecked ? 'text-emerald-300' : 'text-stone-100'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono text-stone-500">[{item.id}]</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed font-sans">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
