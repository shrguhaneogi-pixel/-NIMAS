/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - 16-Bit Pixel Control Dock
 * Stepped Pixel Containers (.pixel-box), Press Start 2P & Silkscreen Typography, Zero Blur.
 */

import React, { useState } from 'react';
import {
  MinimalEye,
  SacredFlame,
  BotanicalPetal
} from './UI/SacredIcons';
import { VisualDirectionState, CameraProfile, LightingProfile, ParticleProfile } from '../types';

interface FloatingDockProps {
  visualState: VisualDirectionState;
  onUpdateVisualState: (patch: Partial<VisualDirectionState>) => void;
  hoveredItemTitle?: string | null;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  visualState,
  onUpdateVisualState,
  hoveredItemTitle
}) => {
  const [openMenu, setOpenMenu] = useState<'camera' | 'lighting' | 'particles' | null>(null);

  const cameraPresets: { id: CameraProfile; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'inspect_nicho', label: 'Nicho' },
    { id: 'inspect_candle', label: 'Candles' },
    { id: 'inspect_recipe', label: 'Pan Muerto' }
  ];

  const lightingPresets: { id: LightingProfile; label: string }[] = [
    { id: 'warm_candle', label: 'Candlelight' },
    { id: 'soft_candle', label: 'Evening Amber' },
    { id: 'subdued_amber', label: 'Subdued Vigil' },
    { id: 'balanced_warm', label: 'Studio Warm' }
  ];

  const particlePresets: { id: ParticleProfile; label: string }[] = [
    { id: 'petal_drift', label: 'Petals' },
    { id: 'gentle_drift', label: 'Motes' },
    { id: 'none', label: 'Stillness' }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none flex flex-col items-center">
      
      {/* Offering Hover Badge */}
      {hoveredItemTitle && (
        <div className="pointer-events-auto mb-2 px-3 py-1 pixel-box-amber text-amber-200 text-xs font-pixel-body flex items-center gap-2">
          <MinimalEye className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-pixel-display text-[9px] uppercase">{hoveredItemTitle}</span>
          <span className="text-[8px] text-stone-400">
            [Click to Inspect]
          </span>
        </div>
      )}

      {/* Main Stepped Pixel Dock */}
      <div className="pointer-events-auto pixel-box h-10 px-2 flex items-center gap-1.5">
        
        {/* 1. Camera Views */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'camera' ? null : 'camera')}
            data-cursor="interactive"
            aria-label="Camera Sanctuary Perspectives"
            className={`pixel-btn h-7 px-2.5 flex items-center gap-1.5 cursor-pointer font-pixel-display text-[8px] uppercase tracking-wider ${
              openMenu === 'camera' ? 'pixel-btn-amber text-amber-200' : ''
            }`}
          >
            <MinimalEye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Views</span>
          </button>

          {openMenu === 'camera' && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-1.5 pixel-box flex flex-col space-y-1 z-50">
              {cameraPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onUpdateVisualState({ camera_profile: preset.id });
                    setOpenMenu(null);
                  }}
                  data-cursor="interactive"
                  className={`w-full px-2 py-1 text-left font-pixel-body text-[9px] cursor-pointer flex items-center justify-between ${
                    visualState.camera_profile === preset.id
                      ? 'bg-amber-600 text-black font-bold'
                      : 'text-stone-300 hover:bg-[#1a1e36] hover:text-amber-300'
                  }`}
                >
                  <span>{preset.label}</span>
                  {visualState.camera_profile === preset.id && (
                    <span className="text-[10px]">■</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-0.5 h-4 bg-[#232a42]" />

        {/* 2. Lighting Profile */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'lighting' ? null : 'lighting')}
            data-cursor="interactive"
            aria-label="Sanctuary Candle Lighting"
            className={`pixel-btn h-7 px-2.5 flex items-center gap-1.5 cursor-pointer font-pixel-display text-[8px] uppercase tracking-wider ${
              openMenu === 'lighting' ? 'pixel-btn-amber text-amber-200' : ''
            }`}
          >
            <SacredFlame className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Light</span>
          </button>

          {openMenu === 'lighting' && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-1.5 pixel-box flex flex-col space-y-1 z-50">
              {lightingPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onUpdateVisualState({ lighting_profile: preset.id });
                    setOpenMenu(null);
                  }}
                  data-cursor="interactive"
                  className={`w-full px-2 py-1 text-left font-pixel-body text-[9px] cursor-pointer flex items-center justify-between ${
                    visualState.lighting_profile === preset.id
                      ? 'bg-amber-600 text-black font-bold'
                      : 'text-stone-300 hover:bg-[#1a1e36] hover:text-amber-300'
                  }`}
                >
                  <span>{preset.label}</span>
                  {visualState.lighting_profile === preset.id && (
                    <span className="text-[10px]">■</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-0.5 h-4 bg-[#232a42]" />

        {/* 3. Petal Drift */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === 'particles' ? null : 'particles')}
            data-cursor="interactive"
            aria-label="Botanical Petal Drift"
            className={`pixel-btn h-7 px-2.5 flex items-center gap-1.5 cursor-pointer font-pixel-display text-[8px] uppercase tracking-wider ${
              openMenu === 'particles' ? 'pixel-btn-amber text-amber-200' : ''
            }`}
          >
            <BotanicalPetal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Petals</span>
          </button>

          {openMenu === 'particles' && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-1.5 pixel-box flex flex-col space-y-1 z-50">
              {particlePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onUpdateVisualState({ particle_profile: preset.id });
                    setOpenMenu(null);
                  }}
                  data-cursor="interactive"
                  className={`w-full px-2 py-1 text-left font-pixel-body text-[9px] cursor-pointer flex items-center justify-between ${
                    visualState.particle_profile === preset.id
                      ? 'bg-amber-600 text-black font-bold'
                      : 'text-stone-300 hover:bg-[#1a1e36] hover:text-amber-300'
                  }`}
                >
                  <span>{preset.label}</span>
                  {visualState.particle_profile === preset.id && (
                    <span className="text-[10px]">■</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
