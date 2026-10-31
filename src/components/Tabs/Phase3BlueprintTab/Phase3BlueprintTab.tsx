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
  const { totalCount, verifiedCount, progressPercent, verifyAll, resetAll } = useBlueprintState();
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
            <div className="flex items-center gap-3 bg-stone-900/90 border border-stone-800 p-3.5 rounded-2xl shrink-0 shadow-lg">
              <div className="text-right">
                <div className="text-xs text-stone-400 font-mono uppercase tracking-wider">DoD Status</div>
                <div className="text-lg font-serif font-bold text-amber-300">
                  {verifiedCount} / {totalCount} <span className="text-xs text-stone-400 font-normal">Passed</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/80 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Central Progress Bar & Quick Actions */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verification Checklist Progress ({progressPercent}% Completed)</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={verifyAll}
                  className="text-xs text-amber-400 hover:text-amber-300 transition underline underline-offset-2"
                >
                  Verify All 32 Criteria
                </button>
                <span className="text-stone-600">·</span>
                <button
                  onClick={resetAll}
                  className="text-xs text-stone-400 hover:text-stone-200 transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar text-xs font-mono">
            <button
              onClick={() => setActiveSubSection('checklist')}
              className={`px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-2 ${
                activeSubSection === 'checklist'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>32-Point DoD Checklist (5 Modules)</span>
            </button>

            <button
              onClick={() => setActiveSubSection('monorepo')}
              className={`px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-2 ${
                activeSubSection === 'monorepo'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Monorepo Topology</span>
            </button>

            <button
              onClick={() => setActiveSubSection('dual_runtime')}
              className={`px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-2 ${
                activeSubSection === 'dual_runtime'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Dual Runtime Strategy</span>
            </button>

            <button
              onClick={() => setActiveSubSection('agent_delegation')}
              className={`px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-2 ${
                activeSubSection === 'agent_delegation'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Agent Swarm</span>
            </button>

            <button
              onClick={() => setActiveSubSection('threat_register')}
              className={`px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-2 ${
                activeSubSection === 'threat_register'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
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
