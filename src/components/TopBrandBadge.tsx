/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Minimal Top Brand Badge
 * Unobtrusive top-left header with static indicator per Three.js skill guidelines.
 */

import React from 'react';
import { ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { CempasuchilRosette } from './UI/SacredIcons';

interface TopBrandBadgeProps {
  onOpenWorkbench: () => void;
  onOpenCompanion: () => void;
}

export const TopBrandBadge: React.FC<TopBrandBadgeProps> = ({
  onOpenWorkbench,
  onOpenCompanion
}) => {
  return (
    <div className="fixed top-4 left-4 z-20 pointer-events-auto">
      <div className="bg-stone-950/90 border border-stone-800/80 rounded-2xl p-3.5 shadow-2xl max-w-sm">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <CempasuchilRosette className="w-5 h-5 text-amber-400" />
            <div>
              <h1 className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                ÁNIMAS
              </h1>
              <p className="text-[10px] text-stone-400 font-serif italic">
                The Sovereign 3D Ofrenda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/70 text-[10px] text-emerald-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Local & Private</span>
          </div>
        </div>

        <p className="text-[11px] text-stone-300 leading-tight mt-1.5">
          Interactive Día de los Muertos memorial driven by sovereign family archives.
        </p>

        <div className="mt-2.5 pt-2 border-t border-stone-800/70 flex items-center justify-between gap-2 text-[11px]">
          <button
            onClick={onOpenCompanion}
            className="text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Ask Memory Companion</span>
          </button>

          <button
            onClick={onOpenWorkbench}
            className="text-stone-400 hover:text-stone-200 transition cursor-pointer flex items-center gap-1"
          >
            <Layers className="w-3 h-3 text-stone-400" />
            <span>Prompt Suite</span>
          </button>
        </div>
      </div>
    </div>
  );
};
