/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Monorepo Architecture Blueprint Section
 */

import React from 'react';
import { FolderTree, Layers, GitBranch, Terminal, ShieldCheck } from 'lucide-react';

export const MonorepoArchitectureSection: React.FC = () => {
  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-start justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <FolderTree className="w-4 h-4" />
            <span>MODULAR MONOREPO TOPOLOGY</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-100">
            Phase 3 Monorepo & Directory Structure
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl font-sans">
            A single, sovereign repository architecture governed by <span className="text-stone-300 font-mono">pnpm-workspace</span> and <span className="text-stone-300 font-mono">uv</span>. Decouples the Next.js visual layer from the local Python memory intelligence daemon.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-400">
          <GitBranch className="w-3.5 h-3.5 text-amber-500" />
          <span>target: main</span>
        </div>
      </div>

      {/* Directory Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 leading-relaxed overflow-x-auto">
          <div className="text-stone-500 pb-2 border-b border-stone-800/80 mb-2 flex items-center justify-between">
            <span>REPOSITORY LAYOUT</span>
            <span className="text-[10px] text-amber-500/80">pnpm + uv workspace</span>
          </div>
          <pre className="text-[11px] font-mono space-y-0.5 text-stone-300">
{`animas/
├── apps/
│   ├── web/                     # Next.js 15 App Router (Frontend)
│   │   ├── src/
│   │   │   ├── app/             # Sanctuary, Archive, Audit views
│   │   │   ├── components/3d/   # Three.js Sovereign Ofrenda
│   │   │   ├── hooks/           # useLocalInquest, useOfrendaAudio
│   │   │   └── services/        # Local IPC / HTTP client adapter
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/                     # FastAPI Sovereign Intelligence Daemon
│       ├── animas_core/
│       │   ├── rag/             # sqlite-vec + FTS5 hybrid retrieval
│       │   ├── ingestion/       # TXT & Markdown chunking parser
│       │   ├── adapters/        # Ollama & llama.cpp runtime drivers
│       │   └── schemas/         # Pydantic v2 data contracts
│       ├── pyproject.toml       # Managed via uv (deterministic locks)
│       └── main.py              # Strict 127.0.0.1:8765 loopback entry
│
├── packages/
│   ├── contracts/               # Shared canonical JSON Schemas
│   │   ├── memory_response.json # Schema with reasoning_scratchpad
│   │   └── visual_direction.json# Strict Three.js parameter bounds
│   │
│   └── prompts/                 # Versioned Gemma System Prompts
│       ├── gemma_grounding.jinja
│       └── sentiment_extraction.jinja
│
├── pnpm-workspace.yaml
├── Makefile                     # Unified local boot & test scripts
└── README.md                    # Zero-cloud installation guide`}
          </pre>
        </div>

        {/* Architectural Rationales */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center gap-2 text-stone-200 text-xs font-serif font-bold">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Decoupled Process Boundaries</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
              The Next.js UI and FastAPI daemon run as distinct OS processes communicating via local HTTP/SSE over loopback. This allows the backend to be stopped, restarted, or swapped with a pure C++ or Rust binary without disrupting client-side 3D WebGL contexts.
            </p>
          </div>

          <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center gap-2 text-stone-200 text-xs font-serif font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contract-First Code Generation</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
              <code className="text-amber-300 font-mono text-[10px]">packages/contracts</code> acts as the single source of truth. Pydantic models in Python and TypeScript interfaces in Next.js are compiled from identical JSON schemas to eliminate serialization drift.
            </p>
          </div>

          <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center gap-2 text-stone-200 text-xs font-serif font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Deterministic Package Management</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
              Node dependencies are pinned via <code className="text-stone-300 font-mono text-[10px]">pnpm-lock.yaml</code> and Python dependencies via <code className="text-stone-300 font-mono text-[10px]">uv.lock</code>. Zero floating dependencies or unpinned model weight hashes ensures build reproducibility across different developer machines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
