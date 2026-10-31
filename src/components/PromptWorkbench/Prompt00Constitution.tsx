/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Prompt 00: Project Constitution
 */

import React from 'react';
import { ShieldCheck, Lock, Heart, Database, Terminal, Cpu } from 'lucide-react';

export const Prompt00Constitution: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-stone-900 p-6 rounded-2xl border border-amber-800/60 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
          <span>Prompt 00</span>
          <span>•</span>
          <span>Project Constitution & Master Instructions</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-amber-100 mb-2">
          ÁNIMAS: The Sovereign 3D Ofrenda
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
          A completely local-first, privacy-preserving interactive memorial application inspired by Día de los Muertos and the concept of <em>Ghost in the Machine</em>.
          Memories belong to families, not corporations.
        </p>
      </div>

      {/* Non-Negotiable Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-100">1. Data Sovereignty</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Never require a cloud LLM, external embedding API, or cloud vector database. No family archive ever leaves the user’s local machine. Zero telemetry, zero Firebase, zero cloud auth.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-100">2. Grounded Truth</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Answers are derived exclusively from retrieved archive chunks. Never supplement missing details with pre-trained LLM hallucination. Acknowledge uncertainty and preserve family contradictions.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-100">3. Memorial Dignity</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Ánimas is an archive companion, not the deceased’s consciousness. Never impersonate deceased relatives or fabricate first-person afterlife dialogue. Speak with compassionate, grounded respect.
          </p>
        </div>

      </div>

      {/* Small Local Model Engineering Imperatives */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
        <h3 className="font-serif font-bold text-amber-200 text-base flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          Small Local Model (Gemma 2B / 9B) Engineering Realities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-stone-950 p-4 rounded-lg border border-stone-800/80 space-y-2">
            <div className="font-mono font-bold text-amber-300">Chain-of-Thought (CoT) First</div>
            <p className="text-stone-300 leading-relaxed">
              Small local models hallucinate if forced to output zero-shot JSON. Every JSON schema begins with a mandatory <code className="bg-stone-800 px-1 py-0.5 rounded text-amber-200">"reasoning_scratchpad"</code> string where the model systematically verifies evidence sufficiency, checks for contradictions, and flags prompt injections.
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-lg border border-stone-800/80 space-y-2">
            <div className="font-mono font-bold text-amber-300">Flat Deterministic Schemas</div>
            <p className="text-stone-300 leading-relaxed">
              Deeply nested schemas trigger grammar invalidation and truncated outputs on 2B/9B models. Ánimas maintains flat, bounded schemas with explicit string/number ranges validated via Pydantic v2.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Separation Triad */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-3">
        <h3 className="font-serif font-bold text-amber-200 text-base">Architectural Separation Triad</h3>
        <p className="text-xs text-stone-300 leading-relaxed">
          The AI system is strictly separated into three independently testable responsibilities:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="border border-stone-800 bg-stone-950 p-3 rounded-lg">
            <span className="text-stone-400 font-mono text-[10px] uppercase block">Module 1</span>
            <span className="font-bold text-stone-100 block mt-1">Memory Retrieval Engine</span>
            <p className="text-stone-400 text-[11px] mt-1">Non-LLM vector search via SQLite-vec with paragraph-aware chunking.</p>
          </div>

          <div className="border border-stone-800 bg-stone-950 p-3 rounded-lg">
            <span className="text-stone-400 font-mono text-[10px] uppercase block">Module 2</span>
            <span className="font-bold text-stone-100 block mt-1">Grounded Memory Answerer</span>
            <p className="text-stone-400 text-[11px] mt-1">Local Gemma inference with CoT reasoning and strict evidence citation.</p>
          </div>

          <div className="border border-stone-800 bg-stone-950 p-3 rounded-lg">
            <span className="text-stone-400 font-mono text-[10px] uppercase block">Module 3</span>
            <span className="font-bold text-stone-100 block mt-1">Sovereign Sentiment Engine</span>
            <p className="text-stone-400 text-[11px] mt-1">Extracts memory tone to drive the Three.js 3D ofrenda lighting and petals.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
