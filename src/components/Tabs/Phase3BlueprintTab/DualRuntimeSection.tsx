/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Dual Runtime Inference Section
 */

import React from 'react';
import { Cpu, Server, Gauge, Code2, Zap } from 'lucide-react';

interface ModelProfile {
  variant: string;
  parameters: string;
  quantization: string;
  ramVram: string;
  tokSec: string;
  firstToken: string;
  idealUse: string;
}

const HARDWARE_PROFILES: ModelProfile[] = [
  {
    variant: 'Gemma 2 2B Instruct',
    parameters: '2.6B',
    quantization: 'Q4_K_M',
    ramVram: '2.9 GB',
    tokSec: '42-58 t/s',
    firstToken: '< 240ms',
    idealUse: 'Low-power laptops, integrated graphics, baseline memory sentiment extraction'
  },
  {
    variant: 'Gemma 2 9B Instruct',
    parameters: '9.2B',
    quantization: 'Q4_K_M',
    ramVram: '6.7 GB',
    tokSec: '28-36 t/s',
    firstToken: '< 380ms',
    idealUse: 'Target standard: multi-document synthesis, conflict preservation, high reasoning fidelity'
  },
  {
    variant: 'Gemma 2 27B Instruct',
    parameters: '27.2B',
    quantization: 'Q4_K_M',
    ramVram: '17.5 GB',
    tokSec: '14-22 t/s',
    firstToken: '< 750ms',
    idealUse: 'Workstations with 24GB+ VRAM (NVIDIA RTX 4090 or Apple Silicon M2/M3 Max)'
  },
  {
    variant: 'EmbeddingGemma',
    parameters: '300M',
    quantization: 'FP16',
    ramVram: '0.6 GB',
    tokSec: 'Instantaneous',
    firstToken: '< 35ms',
    idealUse: 'Local dense vector embeddings with sqlite-vec cosine similarity'
  }
];

export const DualRuntimeSection: React.FC = () => {
  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-start justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <Cpu className="w-4 h-4" />
            <span>SOVEREIGN INFERENCE ENGINE</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-100">
            Dual Runtime Strategy: Ollama & llama.cpp
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl font-sans">
            Guarantees developer ergonomics and strict production schema enforcement without requiring any external cloud APIs. The local daemon hot-swaps between engines via an abstract adapter interface.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Telemetry</span>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Runtime A: Ollama Daemon</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
              Developer Friendly
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed font-sans">
            Runs via background service at <code className="text-stone-300 font-mono text-[10px]">http://127.0.0.1:11434</code>. Pulls quantized model tags directly from the official registry. Provides built-in model swapping and automatic GPU layer offloading on macOS Metal, ROCm, and CUDA.
          </p>
          <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-[10px] font-mono text-stone-300">
            <code>ollama run gemma2:9b-instruct-q4_K_M</code>
          </div>
        </div>

        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-serif font-bold text-sm">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Runtime B: llama.cpp + GBNF Grammar</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
              Production Hardened
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed font-sans">
            Executes via <code className="text-stone-300 font-mono text-[10px]">llama-server</code> with strict GBNF grammar constraints. Forces the logits sampler to output 100% syntactically valid JSON conforming to the Ánimas schema, eliminating regex retries and JSON parse errors.
          </p>
          <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-[10px] font-mono text-stone-300">
            <code>./llama-server -m gemma-2-9b-it.Q4_K_M.gguf --grammar-file animas.gbnf</code>
          </div>
        </div>
      </div>

      {/* Hardware Profiling Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-stone-200 text-xs font-serif font-bold">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>Hardware Profiling & Memory Footprint Matrix</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
              <tr>
                <th className="p-3 font-medium">Model Variant</th>
                <th className="p-3 font-medium">Quantization</th>
                <th className="p-3 font-medium">RAM / VRAM</th>
                <th className="p-3 font-medium">Speed</th>
                <th className="p-3 font-medium">First-Token Latency</th>
                <th className="p-3 font-medium">Target Deployment Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 bg-stone-950/40 text-stone-300">
              {HARDWARE_PROFILES.map((prof, idx) => (
                <tr key={idx} className="hover:bg-stone-900/50 transition">
                  <td className="p-3 font-serif font-bold text-stone-100 whitespace-nowrap">
                    {prof.variant}
                  </td>
                  <td className="p-3 text-amber-400 whitespace-nowrap">{prof.quantization}</td>
                  <td className="p-3 text-stone-200 whitespace-nowrap">{prof.ramVram}</td>
                  <td className="p-3 text-emerald-400 whitespace-nowrap">{prof.tokSec}</td>
                  <td className="p-3 text-stone-300 whitespace-nowrap">{prof.firstToken}</td>
                  <td className="p-3 text-stone-400 font-sans text-xs">{prof.idealUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
