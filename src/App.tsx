/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Main Application Entry
 * 4-Tab Architecture: Sovereign Sanctuary | Archive Explorer | Audit Studio | Scaffold Exporter
 */

import React, { useState } from 'react';
import { TopNavbar, AppTabId } from './components/Navigation/TopNavbar';
import { SovereignSanctuaryTab } from './components/Tabs/SovereignSanctuaryTab';
import { ArchiveExplorerTab } from './components/Tabs/ArchiveExplorerTab';
import { AuditStudioTab } from './components/Tabs/AuditStudioTab';
import { ScaffoldExporterTab } from './components/Tabs/ScaffoldExporterTab';
import { Phase3BlueprintTab } from './components/Tabs/Phase3BlueprintTab/Phase3BlueprintTab';
import { InquestDrawer } from './components/InquestDrawer/InquestDrawer';
import { VisualDirectionState } from './types';
import { audioAmbience } from './services/audioAmbience';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>('sanctuary');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isInquestDrawerOpen, setIsInquestDrawerOpen] = useState<boolean>(false);
  const [inquestInitialQuery, setInquestInitialQuery] = useState<string>('');

  const [visualState, setVisualState] = useState<VisualDirectionState>({
    memory_tone: 'reflective',
    tone_confidence: 0.91,
    visual_intensity: 0.55,
    lighting_profile: 'warm_candle',
    particle_profile: 'petal_drift',
    camera_profile: 'overview',
    motion_profile: 'gentle'
  });

  const handleUpdateVisualState = (patch: Partial<VisualDirectionState>) => {
    setVisualState(prev => ({ ...prev, ...patch }));
  };

  const handleToggleAudio = () => {
    const active = audioAmbience.toggle();
    setIsAudioPlaying(active);
  };

  const handleAskAboutQuery = (question: string) => {
    setInquestInitialQuery(question);
    setIsInquestDrawerOpen(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-x-hidden bg-stone-950 font-sans text-stone-100 select-none">
      
      {/* 3-Zone Top Navigation Bar */}
      <TopNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenInquestDrawer={() => {
          setInquestInitialQuery('');
          setIsInquestDrawerOpen(true);
        }}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Tab Views */}
      <main className="w-full h-full">
        {/* Tab 1: The Sovereign Sanctuary (3D Canvas + Bottom Control Dock) */}
        <div className={`w-full h-full ${activeTab === 'sanctuary' ? 'block' : 'hidden'}`}>
          <SovereignSanctuaryTab
            visualState={visualState}
            onUpdateVisualState={handleUpdateVisualState}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onOpenInquestDrawer={() => {
              setInquestInitialQuery('');
              setIsInquestDrawerOpen(true);
            }}
            onNavigateToTab={setActiveTab}
            onAskAboutItem={handleAskAboutQuery}
          />
        </div>

        {/* Tab 2: Archive Explorer */}
        {activeTab === 'archive' && (
          <div className="w-full h-full overflow-y-auto">
            <ArchiveExplorerTab
              onAskAboutMemory={handleAskAboutQuery}
              onApplyVisualState={handleUpdateVisualState}
            />
          </div>
        )}

        {/* Tab 3: Hallucination & Adversarial Audit Studio */}
        {activeTab === 'audit' && (
          <div className="w-full h-full overflow-y-auto">
            <AuditStudioTab />
          </div>
        )}

        {/* Tab 4: Scaffold Exporter */}
        {activeTab === 'exporter' && (
          <div className="w-full h-full overflow-y-auto">
            <ScaffoldExporterTab />
          </div>
        )}

        {/* Tab 5: Phase 3 Blueprint */}
        {activeTab === 'blueprint' && (
          <div className="w-full h-full overflow-y-auto">
            <Phase3BlueprintTab />
          </div>
        )}
      </main>

      {/* Responsive Inquest Drawer (Slide-up BottomSheet on Mobile, Slide-out Drawer on Desktop) */}
      <InquestDrawer
        isOpen={isInquestDrawerOpen}
        onClose={() => setIsInquestDrawerOpen(false)}
        onUpdateVisualState={handleUpdateVisualState}
        initialQuestion={inquestInitialQuery}
      />

    </div>
  );
}
