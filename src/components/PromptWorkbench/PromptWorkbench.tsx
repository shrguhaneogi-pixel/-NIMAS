/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Engineering & Prompt Workbench
 * Master orchestrator for Prompts 00 through 07 with live evaluation and 3D sync.
 */

import React, { useState } from 'react';
import {
  Layers,
  Shield,
  Network,
  BookOpen,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Terminal,
  Download,
  ArrowLeft,
  X
} from 'lucide-react';
import { Prompt00Constitution } from './Prompt00Constitution';
import { Prompt01Architecture } from './Prompt01Architecture';
import { Prompt02ArchiveDataset } from './Prompt02ArchiveDataset';
import { Prompt03GroundedAnswerer } from './Prompt03GroundedAnswerer';
import { Prompt04SentimentEngine } from './Prompt04SentimentEngine';
import { Prompt05EvaluationAudit } from './Prompt05EvaluationAudit';
import { Prompt06LocalOptimization } from './Prompt06LocalOptimization';
import { Prompt07Phase3Export } from './Prompt07Phase3Export';
import { VisualDirectionState } from '../../types';

interface PromptWorkbenchProps {
  onClose: () => void;
  onApplyVisualState: (state: Partial<VisualDirectionState>) => void;
}

export const PromptWorkbench: React.FC<PromptWorkbenchProps> = ({
  onClose,
  onApplyVisualState
}) => {
  const [activeTab, setActiveTab] = useState<string>('prompt_00');

  const tabs = [
    { id: 'prompt_00', num: '00', title: 'Constitution', icon: Shield },
    { id: 'prompt_01', num: '01', title: 'Architecture', icon: Network },
    { id: 'prompt_02', num: '02', title: 'Archive & Ingestion', icon: BookOpen },
    { id: 'prompt_03', num: '03', title: 'Grounded Answerer', icon: MessageSquare },
    { id: 'prompt_04', num: '04', title: 'Sentiment & 3D', icon: Sparkles },
    { id: 'prompt_05', num: '05', title: 'Evaluation & Audit', icon: ShieldAlert },
    { id: 'prompt_06', num: '06', title: 'Local Optimization', icon: Terminal },
    { id: 'prompt_07', num: '07', title: 'Phase 3 Export', icon: Download }
  ];

  return (
    <div className="fixed inset-0 z-40 bg-stone-950 flex flex-col overflow-hidden text-stone-200">
      
      {/* Top Header */}
      <div className="px-6 py-3.5 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to 3D Ofrenda</span>
          </button>
          
          <div className="h-5 w-px bg-stone-800" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                ÁNIMAS • AI Studio Engineering Lab
              </span>
              <span className="bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px] font-mono px-2 py-0.5 rounded">
                Gemma 2B/9B Suite
              </span>
            </div>
            <div className="text-[11px] text-stone-400">
              Prototyping, evaluating, and exporting local-first RAG and sovereign sentiment
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tab Bar */}
      <div className="px-6 py-2.5 bg-stone-900/40 border-b border-stone-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <span className="text-[10px] opacity-75">[{t.num}]</span>
              <Icon className="w-3.5 h-3.5" />
              <span className="font-sans font-medium">{t.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'prompt_00' && <Prompt00Constitution />}
        {activeTab === 'prompt_01' && <Prompt01Architecture />}
        {activeTab === 'prompt_02' && <Prompt02ArchiveDataset />}
        {activeTab === 'prompt_03' && <Prompt03GroundedAnswerer />}
        {activeTab === 'prompt_04' && <Prompt04SentimentEngine onApplyVisualState={onApplyVisualState} />}
        {activeTab === 'prompt_05' && <Prompt05EvaluationAudit />}
        {activeTab === 'prompt_06' && <Prompt06LocalOptimization />}
        {activeTab === 'prompt_07' && <Prompt07Phase3Export />}
      </div>

    </div>
  );
};
