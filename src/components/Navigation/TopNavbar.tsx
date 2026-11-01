/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - 16-Bit Pixel Navigation
 * Authentic Stepped Borders (.pixel-box), Pixel Typography (Press Start 2P & Silkscreen), Zero Blur.
 */

import React, { useState } from 'react';
import {
  CempasuchilRosette,
  SanctuaryTemple,
  ArchiveScroll,
  AuditLens,
  ExporterStele,
  BlueprintGrid,
  TuningForkWave,
  ShieldLocal,
  InquestDialogue
} from '../UI/SacredIcons';

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
  const [hoveredTab, setHoveredTab] = useState<AppTabId | null>(null);

  const tabs: { id: AppTabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'sanctuary', label: 'Sanctuary', icon: SanctuaryTemple },
    { id: 'archive', label: 'Archive', icon: ArchiveScroll },
    { id: 'audit', label: 'Audit', icon: AuditLens },
    { id: 'exporter', label: 'Export', icon: ExporterStele },
    { id: 'blueprint', label: 'Blueprint', icon: BlueprintGrid }
  ];

  return (
    <header className="fixed top-3 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex items-center justify-between">
      
      {/* Left: Pixel Brand Badge */}
      <div className="pointer-events-auto">
        <button
          onClick={() => onSelectTab('sanctuary')}
          data-cursor="interactive"
          className="pixel-box-amber h-9 px-3 flex items-center gap-2 cursor-pointer focus-visible:outline-none"
          aria-label="ÁNIMAS Sovereign Ofrenda Home"
        >
          <CempasuchilRosette className="w-4 h-4 text-amber-400" />
          <span className="font-pixel-display text-[10px] text-amber-300 uppercase tracking-widest">
            ÁNIMAS
          </span>
        </button>
      </div>

      {/* Center: Stepped 5-Tab Pixel Navigation Capsule */}
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto pixel-box flex items-center gap-1 p-1"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;

          return (
            <div key={tab.id} className="relative">
              <button
                onClick={() => onSelectTab(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                onFocus={() => setHoveredTab(tab.id)}
                onBlur={() => setHoveredTab(null)}
                data-cursor="interactive"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative h-8 px-2.5 flex items-center justify-center cursor-pointer font-pixel-display text-[9px] uppercase tracking-wider transition-none ${
                  isActive
                    ? 'bg-amber-500 border-2 border-amber-300 text-[#07080d] shadow-[1px_1px_0px_#000]'
                    : 'bg-transparent text-stone-300 hover:bg-[#1a1e36] hover:text-amber-300 border-2 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#07080d]' : 'text-stone-300'}`} />
                {isActive && (
                  <span className="ml-1.5 hidden md:inline font-bold">
                    {tab.label}
                  </span>
                )}
              </button>

              {/* Pixel Tooltip */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 pixel-box pointer-events-none z-50 whitespace-nowrap ${
                  isHovered && !isActive
                    ? 'block'
                    : 'hidden'
                }`}
              >
                <span className="font-pixel-body text-[9px] uppercase tracking-wider text-amber-300">
                  {tab.label}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Right: Stepped Cluster */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Procedural Audio Ambience Toggle */}
        <button
          onClick={onToggleAudio}
          data-cursor="interactive"
          className={`pixel-btn h-9 w-9 flex items-center justify-center cursor-pointer ${
            isAudioPlaying
              ? 'pixel-btn-amber text-amber-300'
              : 'text-stone-300'
          }`}
          aria-label={isAudioPlaying ? 'Mute procedural audio ambience' : 'Enable nocturnal soundscape'}
          title={isAudioPlaying ? 'Ambience: Active' : 'Ambience: Muted'}
        >
          <TuningForkWave className="w-4 h-4" />
        </button>

        {/* Local Sovereign Privacy Badge */}
        <div
          className="pixel-box h-9 px-2.5 text-emerald-400 text-[9px] font-pixel-body tracking-wider items-center gap-1.5 hidden sm:flex"
          title="Zero-Cloud Architecture: Local inference & vector store"
        >
          <ShieldLocal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase text-[8px] text-emerald-300 font-pixel-display">Local</span>
        </div>

        {/* Ask the Archive Inquest Trigger */}
        <button
          onClick={onOpenInquestDrawer}
          data-cursor="interactive"
          className="pixel-btn pixel-btn-amber h-9 px-3 flex items-center gap-1.5 cursor-pointer font-pixel-display text-[9px] uppercase tracking-wider"
          aria-label="Open Archive Inquest Companion"
        >
          <InquestDialogue className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden lg:inline">Inquest</span>
        </button>
      </div>

    </header>
  );
};
