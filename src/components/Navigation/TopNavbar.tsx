/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Top Navigation Bar
 * Follows the 3-zone Top Bar Contract: Brand Wordmark | 5 Tab Pills | Actions
 * Features horizontal scroll guard for mobile responsiveness.
 */

import React from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  MessageSquare,
  ShieldCheck,
  Compass,
  BookOpen,
  FileCheck,
  Download,
  Cpu
} from 'lucide-react';

export type AppTabId = 'sanctuary' | 'archive' | 'audit' | 'exporter' | 'blueprint';

interface TopNavbarProps {
  activeTab: AppTabId;
  onSelectTab: (tab: AppTabId) => void;
  onOpenInquestDrawer: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenInquestDrawer,
  isAudioPlaying,
  onToggleAudio
}) => {
  const tabs: { id: AppTabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'sanctuary', label: 'The Sovereign Sanctuary', icon: Compass },
    { id: 'archive', label: 'Archive Explorer', icon: BookOpen },
    { id: 'audit', label: 'Audit Studio', icon: FileCheck },
    { id: 'exporter', label: 'Scaffold Exporter', icon: Download },
    { id: 'blueprint', label: 'Phase 3 Blueprint', icon: Cpu }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-16 bg-stone-950/90 border-b border-stone-800/80 px-3 sm:px-6 flex items-center justify-between gap-3 md:gap-6 select-none text-stone-200">
      
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onSelectTab('sanctuary');
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-xl">🌺</span>
          <div>
            <span className="font-serif font-bold text-amber-200 tracking-wider text-base group-hover:text-amber-100 transition whitespace-nowrap block">
              ÁNIMAS
            </span>
            <span className="text-[10px] text-stone-400 font-serif italic block -mt-1 hidden sm:block">
              The Sovereign 3D Ofrenda
            </span>
          </div>
        </a>
      </div>

      {/* Zone 2: 5 Primary Tab Pills (Single-line with overflow-x scroll guard) */}
      <nav className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800/80 overflow-x-auto no-scrollbar max-w-full">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Actions & Privacy Status */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Procedural Audio Ambience Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition cursor-pointer ${
            isAudioPlaying
              ? 'bg-amber-950/60 border-amber-700/80 text-amber-300'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
          title={isAudioPlaying ? 'Mute procedural night ambience' : 'Enable procedural audio soundscape'}
        >
          {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-mono hidden xl:inline">
            {isAudioPlaying ? 'Ambience On' : 'Ambience Off'}
          </span>
        </button>

        {/* Local-First Sovereign Status Indicator (Clean static label, no pulsing dot) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-[10px] text-emerald-300 font-mono">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Local & Private</span>
        </div>

        {/* Ask the Archive Button */}
        <button
          onClick={onOpenInquestDrawer}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition cursor-pointer shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask the Archive</span>
        </button>
      </div>

    </header>
  );
};
