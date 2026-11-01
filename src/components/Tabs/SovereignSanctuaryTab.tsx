/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Tab 1: Sovereign Sanctuary View
 * Immersive procedural 3D ofrenda with floating obsidian control dock and left cameo rail.
 */

import React, { useState } from 'react';
import { OfrendaCanvas } from '../ThreeOfrenda/OfrendaCanvas';
import { FloatingDock } from '../FloatingDock';
import { LeftCameoRail } from '../Navigation/LeftCameoRail';
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

  const handleCameoSelect = (id: string) => {
    audioAmbience.playMemoryChime();
    const isNicho = id.startsWith('nicho');
    const item: OfrendaItemClickData = {
      id,
      title: id.replace('nicho_', '').replace('offering_', '').replace('_', ' ').toUpperCase(),
      type: isNicho ? 'nicho' : 'pan_de_muerto',
      description: 'Memorial offering inspected from the left sacred cameo rail.',
      associated_memory_id: id === 'nicho_elena' ? 'mem_001' : 'mem_002',
      tier: 2
    };
    setSelectedOffering(item);
    if (isNicho) {
      onUpdateVisualState({ camera_profile: 'inspect_nicho' });
    } else {
      onUpdateVisualState({ camera_profile: 'inspect_recipe' });
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-stone-950">
      
      {/* Three.js 3D Ofrenda WebGL Scene with 3D cursor light coupling */}
      <OfrendaCanvas
        visualState={visualState}
        onItemClick={handleOfferingClick}
        onHoverItemChange={setHoveredItemTitle}
        selectedOfferingId={selectedOffering?.id ?? null}
        onResetView={handleResetView}
      />

      {/* Left-Edge Vertical Cameo Rail (Prevents bottom-edge UI collisions) */}
      <LeftCameoRail
        selectedOfferingId={selectedOffering?.id ?? null}
        onSelectRelic={handleCameoSelect}
      />

      {/* Floating Minimal Obsidian Control Dock (h-12, rounded-full) */}
      <FloatingDock
        visualState={visualState}
        onUpdateVisualState={onUpdateVisualState}
        hoveredItemTitle={hoveredItemTitle}
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
