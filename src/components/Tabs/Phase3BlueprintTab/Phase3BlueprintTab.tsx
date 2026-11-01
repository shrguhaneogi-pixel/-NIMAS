/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Phase 3 Production Implementation Blueprint Tab
 * Powered by BlueprintStateProvider and modular category sub-components with independent progress tracking.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  FolderTree,
  Cpu,
  Users,
  ShieldAlert,
  FileCheck2
} from 'lucide-react';
import {
  BlueprintStateProvider,
  useBlueprintState
} from '../../../context/BlueprintStateProvider';
import { ArchitectureCategoryCard } from './categories/ArchitectureCategoryCard';
import { AiRagCategoryCard } from './categories/AiRagCategoryCard';
import { PrivacySecurityCategoryCard } from './categories/PrivacySecurityCategoryCard';
import { Frontend3dCategoryCard } from './categories/Frontend3dCategoryCard';
import { VerificationCategoryCard } from './categories/VerificationCategoryCard';
import { MonorepoArchitectureSection } from './MonorepoArchitectureSection';
import { DualRuntimeSection } from './DualRuntimeSection';
import { AgentDelegationSection } from './AgentDelegationSection';
import { ThreatRegisterSection } from './ThreatRegisterSection';

type SubSection = 'checklist' | 'monorepo' | 'dual_runtime' | 'agent_delegation' | 'threat_register';

const BlueprintInner: React.FC = () => {
  const { totalCount, totalVerified, progressPercent, verifyAll, resetAll } = useBlueprintState();
  const [activeSubSection, setActiveSubSection] = useState<SubSection>('checklist');

  return (
    <div className="min-h-full bg-stone-950 text-stone-200 pb-20">
      {/* Top Banner / Hero Header */}
      <div className="border-b border-stone-800 bg-gradient-to-b from-stone-900/80 via-stone-900/40 to-stone-950 px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
                <FileCheck2 className="w-4 h-4" />
                <span>PHASE 3 PRODUCTION BLUEPRINT · GOOGLE ANTIGRAVITY SPEC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-wide">
                Sovereign Architecture & 32-Point Definition of Done
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm font-sans max-w-3xl leading-relaxed">
                Transitioning Ánimas from an AI Studio prototype to a locally executable, privacy-preserving memorial application. One machine. One archive. Zero cloud dependencies.
              </p>
            </div>

            {/* Quick Metrics Badge - Synced in real-time */}
            <div className="flex items-center gap-3 pixel-box p-3 shrink-0">
              <div className="text-right">
                <div className="text-[9px] text-stone-400 font-pixel-body uppercase tracking-wider">DoD Status</div>
                <div className="text-sm font-pixel-display font-bold text-amber-300">
                  {totalVerified} / {totalCount} <span className="text-[8px] text-stone-400 font-normal">Passed</span>
                </div>
              </div>
              <div className="w-9 h-9 border-2 border-amber-500 bg-amber-950 flex items-center justify-center text-amber-300 font-pixel-display font-bold text-xs">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Central Progress Bar & Quick Actions */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-pixel-body text-stone-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Verification Checklist Progress ({progressPercent}% Completed)</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={verifyAll}
                  className="text-[9px] font-pixel-display text-amber-400 hover:text-amber-300 transition underline underline-offset-2 uppercase"
                >
                  Verify All 32
                </button>
                <span className="text-stone-600">·</span>
                <button
                  onClick={resetAll}
                  className="text-[9px] font-pixel-display text-stone-400 hover:text-stone-200 transition flex items-center gap-1 uppercase"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="w-full bg-[#07080d] h-3 border-2 border-[#232a42] p-0.5">
              <div
                className="bg-amber-400 h-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar text-[9px] font-pixel-display">
            <button
              onClick={() => setActiveSubSection('checklist')}
              className={`px-3 py-1.5 border-2 transition whitespace-nowrap flex items-center gap-2 uppercase cursor-pointer ${
                activeSubSection === 'checklist'
                  ? 'bg-amber-600 border-amber-400 text-black font-bold shadow-[2px_2px_0px_#000]'
                  : 'pixel-btn'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>32-Point DoD (5 Modules)</span>
            </button>

            <button
              onClick={() => setActiveSubSection('monorepo')}
              className={`px-3 py-1.5 border-2 transition whitespace-nowrap flex items-center gap-2 uppercase cursor-pointer ${
                activeSubSection === 'monorepo'
                  ? 'bg-amber-600 border-amber-400 text-black font-bold shadow-[2px_2px_0px_#000]'
                  : 'pixel-btn'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Monorepo Topology</span>
            </button>

            <button
              onClick={() => setActiveSubSection('dual_runtime')}
              className={`px-3 py-1.5 border-2 transition whitespace-nowrap flex items-center gap-2 uppercase cursor-pointer ${
                activeSubSection === 'dual_runtime'
                  ? 'bg-amber-600 border-amber-400 text-black font-bold shadow-[2px_2px_0px_#000]'
                  : 'pixel-btn'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Dual Runtime</span>
            </button>

            <button
              onClick={() => setActiveSubSection('agent_delegation')}
              className={`px-3 py-1.5 border-2 transition whitespace-nowrap flex items-center gap-2 uppercase cursor-pointer ${
                activeSubSection === 'agent_delegation'
                  ? 'bg-amber-600 border-amber-400 text-black font-bold shadow-[2px_2px_0px_#000]'
                  : 'pixel-btn'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Agent Swarm</span>
            </button>

            <button
              onClick={() => setActiveSubSection('threat_register')}
              className={`px-3 py-1.5 border-2 transition whitespace-nowrap flex items-center gap-2 uppercase cursor-pointer ${
                activeSubSection === 'threat_register'
                  ? 'bg-amber-600 border-amber-400 text-black font-bold shadow-[2px_2px_0px_#000]'
                  : 'pixel-btn'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Threat Register (11 Pts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {activeSubSection === 'checklist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-100">
                Phase 3 Release Definition of Done (32 Verification Criteria)
              </h2>
              <span className="text-xs font-mono text-stone-400">
                5 Modular Sub-components with Internal Progress Tracking
              </span>
            </div>

            {/* 5 Distinct Category Sub-components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArchitectureCategoryCard />
              <AiRagCategoryCard />
              <PrivacySecurityCategoryCard />
              <Frontend3dCategoryCard />
              <div className="md:col-span-2">
                <VerificationCategoryCard />
              </div>
            </div>
          </div>
        )}

        {activeSubSection === 'monorepo' && <MonorepoArchitectureSection />}
        {activeSubSection === 'dual_runtime' && <DualRuntimeSection />}
        {activeSubSection === 'agent_delegation' && <AgentDelegationSection />}
        {activeSubSection === 'threat_register' && <ThreatRegisterSection />}
      </div>
    </div>
  );
};

export const Phase3BlueprintTab: React.FC = () => {
  return (
    <BlueprintStateProvider>
      <BlueprintInner />
    </BlueprintStateProvider>
  );
};

export {
  ArchitectureCategoryCard,
  AiRagCategoryCard,
  PrivacySecurityCategoryCard,
  Frontend3dCategoryCard,
  VerificationCategoryCard
};
