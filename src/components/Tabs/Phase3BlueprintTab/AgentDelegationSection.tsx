/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Multi-Agent Delegation Section
 */

import React from 'react';
import { Users, Bot, Terminal, GitCommit, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AgentRole {
  title: string;
  codename: string;
  responsibilities: string[];
  deliverables: string[];
  color: string;
}

const AGENTS: AgentRole[] = [
  {
    title: 'Principal Architect & Coordinator',
    codename: 'Lead Agent',
    responsibilities: [
      'Enforces monorepo design integrity and repository-safety protocol',
      'Orchestrates task assignments across specialist agents',
      'Reviews PRs against the 32-point Definition of Done before merges'
    ],
    deliverables: ['pnpm-workspace.yaml', 'Makefile', 'Architecture docs', 'Release tags'],
    color: 'amber'
  },
  {
    title: 'Local AI & RAG Specialist',
    codename: 'Agent 1 (Intelligence)',
    responsibilities: [
      'Gemma prompting, CoT scratchpad design, and Jinja2 templates',
      'Hybrid sqlite-vec + FTS5 search index optimization',
      'Dual runtime adapter for Ollama and llama.cpp'
    ],
    deliverables: ['rag_pipeline.py', 'animas.gbnf', 'model_adapter.py', 'prompt_eval.py'],
    color: 'emerald'
  },
  {
    title: 'Backend & Data Systems Engineer',
    codename: 'Agent 2 (Daemon)',
    responsibilities: [
      'FastAPI daemon development, Pydantic v2 contract enforcement',
      'SQLite schema migrations and cascading archive purge logic',
      'Loopback 127.0.0.1 binding and zero-cloud network hardening'
    ],
    deliverables: ['main.py', 'database.py', 'ingestion_service.py', 'security_middleware.py'],
    color: 'cyan'
  },
  {
    title: '3D & Creative Technologist',
    codename: 'Agent 3 (Sanctuary)',
    responsibilities: [
      'Three.js procedural ofrenda geometry, PBR lighting, and shaders',
      'Web Audio API soundscapes (breeze, candle crackle, chime)',
      'Sentiment-to-visual parameter mapping and GPU memory lifecycle'
    ],
    deliverables: ['OfrendaScene.ts', 'procedural_textures.ts', 'AudioEngine.ts', 'shaders/'],
    color: 'purple'
  },
  {
    title: 'Frontend & UX Engineer',
    codename: 'Agent 4 (Interface)',
    responsibilities: [
      'Next.js 15 App Router implementation and responsive layouts',
      'Dual-mode Inquest Drawer (mobile bottom sheet / desktop side drawer)',
      'WCAG AA accessible controls, keyboard navigation, and focus states'
    ],
    deliverables: ['InquestDrawer.tsx', 'ArchiveBrowser.tsx', 'FloatingDock.tsx', 'TopNavbar.tsx'],
    color: 'blue'
  },
  {
    title: 'QA, Security & Evaluation Engineer',
    codename: 'Agent 5 (Red Team)',
    responsibilities: [
      '30-case gold benchmark evaluation and adversarial prompt injection testing',
      'Pytest and Vitest test harness setup and continuous verification',
      'Network-disconnected acceptance testing and offline verification'
    ],
    deliverables: ['test_gold_suite.py', 'red_team_injection.py', 'dod_verification.sh'],
    color: 'rose'
  }
];

export const AgentDelegationSection: React.FC = () => {
  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-start justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <Users className="w-4 h-4" />
            <span>GOOGLE ANTIGRAVITY MULTI-AGENT SWARM</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-100">
            Multi-Agent Delegation & Execution Architecture
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl font-sans">
            A coordinator-led swarm architecture for autonomous, reproducible development. Each specialist agent operates within strict domain boundaries under the <span className="text-amber-400 font-mono">One Improvement, One Verified Commit</span> protocol.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-400">
          <Bot className="w-3.5 h-3.5 text-amber-500" />
          <span>Coordinator: Active</span>
        </div>
      </div>

      {/* Safety Protocol Banner */}
      <div className="bg-stone-950 p-4 rounded-xl border border-amber-900/40 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-serif font-bold text-amber-200">
            Repository-Safety Protocol: One Improvement, One Verified Commit
          </h4>
          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
            No agent may batch multiple unrelated features into a single PR. Every commit must pass all local unit tests, lints, and benchmark checks prior to merging. Broken states are never committed to the sovereign branch.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent, idx) => (
          <div key={idx} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <span className="text-xs font-serif font-bold text-stone-100">{agent.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-300 border border-stone-800">
                {agent.codename}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Responsibilities</span>
              <ul className="text-[11px] text-stone-400 space-y-1 font-sans">
                {agent.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">·</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-stone-800/60">
              <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Key Deliverables</span>
              <div className="flex flex-wrap gap-1">
                {agent.deliverables.map((del, dIdx) => (
                  <span key={dIdx} className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-900/80 text-stone-300 rounded border border-stone-800">
                    {del}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
