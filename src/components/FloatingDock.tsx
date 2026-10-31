/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Collapsible Bottom Control Dock
 * Pinned to bottom-center with zero side occlusion, solid surfaces (no backdrop-filter over WebGL),
 * and clean cinema mode toggle per Three.js skill guidelines.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Camera,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
  Settings2
} from 'lucide-react';
import { VisualDirectionState, CameraProfile, LightingProfile, ParticleProfile } from '../types';

interface FloatingDockProps {
  visualState: VisualDirectionState;
  onUpdateVisualState: (patch: Partial<VisualDirectionState>) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenCompanion: () => void;
  onOpenWorkbench: () => void;
  hoveredItemTitle: string | null;
  activeViewMode: '3d_ofrenda' | 'prompt_workbench';
  onSwitchViewMode: (mode: '3d_ofrenda' | 'prompt_workbench') => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  visualState,
  onUpdateVisualState,
  isAudioPlaying,
  onToggleAudio,
  onOpenCompanion,
  onOpenWorkbench,
  hoveredItemTitle,
  activeViewMode,
  onSwitchViewMode
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'lighting' | 'particles'>('camera');

  const cameraPresets: { id: CameraProfile; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🏛️' },
    { id: 'inspect_nicho', label: 'Elena’s Nicho', icon: '🖼️' },
    { id: 'inspect_candle', label: 'Votive Cirios', icon: '🕯️' },
    { id: 'inspect_recipe', label: 'Ofrenda Bread', icon: '🍞' }
  ];

  const lightingPresets: { id: LightingProfile; label: string }[] = [
    { id: 'warm_candle', label: 'Warm Candle' },
    { id: 'soft_candle', label: 'Soft Candle' },
    { id: 'subdued_amber', label: 'Subdued Amber' },
    { id: 'balanced_warm', label: 'Balanced Warm' }
  ];

  const particlePresets: { id: ParticleProfile; label: string }[] = [
    { id: 'petal_drift', label: 'Marigold Petals' },
    { id: 'gentle_drift', label: 'Gentle Motes' },
    { id: 'none', label: 'Stillness' }
  ];

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 ease-out"
      style={{
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 32px)' : '0px'})`,
        maxWidth: 'min(960px, 95vw)',
        width: '100%'
      }}
    >
      {/* Top Bar with Hover Label & Collapse Button */}
      <div className="flex items-center justify-between px-3 mb-1.5 pointer-events-auto">
        <div className="flex items-center gap-2">
          {hoveredItemTitle ? (
            <div className="bg-stone-900 border border-amber-800/60 text-amber-200 text-xs px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 animate-fadeIn">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{hoveredItemTitle}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">(Click to Inspect)</span>
            </div>
          ) : (
            <div className="text-[11px] text-stone-400/90 font-mono tracking-wider hidden sm:block bg-stone-950/80 px-2.5 py-0.5 rounded border border-stone-800/50">
              Drag to orbit • Scroll to zoom • Click offerings to inspect
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-stone-900 border border-stone-700/80 hover:border-amber-600/70 text-stone-300 hover:text-amber-300 text-xs px-3 py-1 rounded-t flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Show Controls' : 'Hide Controls'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Cinema Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Solid Control Dock (No backdrop-filter per Three.js guidelines) */}
      <div className="bg-stone-950/95 border border-stone-800 rounded-xl shadow-2xl p-3 text-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Quick Actions & Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSwitchViewMode(activeViewMode === '3d_ofrenda' ? 'prompt_workbench' : '3d_ofrenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'prompt_workbench'
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'bg-stone-900 border border-amber-900/60 text-amber-300 hover:bg-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Prompt Suite & Evaluation Lab</span>
            </button>

            <button
              onClick={onOpenCompanion}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Archive Companion</span>
            </button>

            <button
              onClick={onToggleAudio}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border transition cursor-pointer ${
                isAudioPlaying
                  ? 'bg-amber-950/60 border-amber-700/80 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title={isAudioPlaying ? 'Mute nocturnal soundscape' : 'Enable procedural audio soundscape'}
            >
              {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAudioPlaying ? 'Ambience On' : 'Ambience Off'}</span>
            </button>
          </div>

          {/* Center: Tabs for Camera / Lighting / Particles */}
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'camera' ? 'bg-stone-800 text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Views</span>
            </button>
            <button
              onClick={() => setActiveTab('lighting')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'lighting' ? 'bg-stone-800 text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Lighting</span>
            </button>
            <button
              onClick={() => setActiveTab('particles')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'particles' ? 'bg-stone-800 text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Petals</span>
            </button>
          </div>

          {/* Right: Active Tab Controls */}
          <div className="flex items-center gap-1.5">
            {activeTab === 'camera' && (
              <div className="flex items-center gap-1">
                {cameraPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onUpdateVisualState({ camera_profile: preset.id })}
                    className={`px-2.5 py-1 rounded text-xs border transition cursor-pointer ${
                      visualState.camera_profile === preset.id
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-medium'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span className="mr-1">{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'lighting' && (
              <div className="flex items-center gap-1">
                {lightingPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onUpdateVisualState({ lighting_profile: preset.id })}
                    className={`px-2.5 py-1 rounded text-xs border transition cursor-pointer ${
                      visualState.lighting_profile === preset.id
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-medium'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'particles' && (
              <div className="flex items-center gap-1">
                {particlePresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onUpdateVisualState({ particle_profile: preset.id })}
                    className={`px-2.5 py-1 rounded text-xs border transition cursor-pointer ${
                      visualState.particle_profile === preset.id
                        ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-medium'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sovereign Sentiment Telemetry Bar */}
        <div className="mt-2.5 pt-2 border-t border-stone-800/70 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Sentiment Tone:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                visualState.memory_tone === 'joyful'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : visualState.memory_tone === 'somber'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : visualState.memory_tone === 'reflective'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : visualState.memory_tone === 'mixed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-stone-700/40 text-stone-300'
              }`}>
                {visualState.memory_tone}
              </span>
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Confidence:</span>
              <span className="font-mono text-stone-300">{Math.round((visualState.tone_confidence || 0.9) * 100)}%</span>
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">Intensity:</span>
              <span className="font-mono text-amber-400">{Math.round((visualState.visual_intensity || 0.5) * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-400">
            <span className="text-[10px] text-stone-500 uppercase">Architecture:</span>
            <span className="text-amber-500 font-mono text-[10px] font-medium">Local Gemma 2B/9B • SQLite-vec • Zero-Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
};
