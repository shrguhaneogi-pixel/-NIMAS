/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Tab 1: Sovereign Sanctuary View
 * Immersive procedural 3D ofrenda with floating collapsible bottom control dock.
 */

import React, { useState } from 'react';
import { OfrendaCanvas } from '../ThreeOfrenda/OfrendaCanvas';
import { FloatingDock } from '../FloatingDock';
import { MemoryInspectorModal } from '../MemoryInspectorModal';
import { VisualDirectionState, OfrendaItemClickData } from '../../types';
import { audioAmbience } from '../../services/audioAmbience';

interface SovereignSanctuaryTabProps {
  visualState: VisualDirectionState;
  onUpdateVisualState: (patch: Partial<VisualDirectionState>) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenInquestDrawer: () => void;
  onNavigateToTab: (tabId: 'sanctuary' | 'archive' | 'audit' | 'exporter') => void;
  onAskAboutItem: (question: string) => void;
}

export const SovereignSanctuaryTab: React.FC<SovereignSanctuaryTabProps> = ({
  visualState,
  onUpdateVisualState,
  isAudioPlaying,
  onToggleAudio,
  onOpenInquestDrawer,
  onNavigateToTab,
  onAskAboutItem
}) => {
  const [hoveredItemTitle, setHoveredItemTitle] = useState<string | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<OfrendaItemClickData | null>(null);

  const handleOfferingClick = (item: OfrendaItemClickData) => {
    audioAmbience.playMemoryChime();
    setSelectedOffering(item);

    // Zoom camera towards target object
    if (item.type === 'nicho') {
      onUpdateVisualState({ camera_profile: 'inspect_nicho' });
    } else if (item.type === 'candle') {
      onUpdateVisualState({ camera_profile: 'inspect_candle' });
    } else if (item.type === 'pan_de_muerto' || item.type === 'copal') {
      onUpdateVisualState({ camera_profile: 'inspect_recipe' });
    }
  };

  const handleResetView = () => {
    setSelectedOffering(null);
    onUpdateVisualState({ camera_profile: 'overview' });
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-stone-950">
      
      {/* Three.js 3D Ofrenda WebGL Scene */}
      <OfrendaCanvas
        visualState={visualState}
        onItemClick={handleOfferingClick}
        onHoverItemChange={setHoveredItemTitle}
        selectedOfferingId={selectedOffering?.id ?? null}
        onResetView={handleResetView}
      />

      {/* Floating Collapsible Bottom Control Dock */}
      <FloatingDock
        visualState={visualState}
        onUpdateVisualState={onUpdateVisualState}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={onToggleAudio}
        onOpenCompanion={onOpenInquestDrawer}
        onOpenWorkbench={() => onNavigateToTab('audit')}
        hoveredItemTitle={hoveredItemTitle}
        activeViewMode="3d_ofrenda"
        onSwitchViewMode={mode => onNavigateToTab(mode === 'prompt_workbench' ? 'audit' : 'sanctuary')}
      />

      {/* Memory Inspector Modal when clicking offerings */}
      <MemoryInspectorModal
        item={selectedOffering}
        onClose={() => {
          setSelectedOffering(null);
          onUpdateVisualState({ camera_profile: 'overview' });
        }}
        onAskAboutItem={onAskAboutItem}
        onApplyVisualTone={onUpdateVisualState}
      />

    </div>
  );
};
