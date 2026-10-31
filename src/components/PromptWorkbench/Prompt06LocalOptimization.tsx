/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Prompt 06: Local Gemma Optimization
 */

import React, { useState } from 'react';
import { Terminal, Cpu, Copy, Check, HardDrive, Layers } from 'lucide-react';

export const Prompt06LocalOptimization: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copySnippet = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const gbnfGrammar = `root ::= "{" ws "\\"reasoning_scratchpad\\":" ws string "," ws "\\"status\\":" ws status_val "," ws "\\"answer\\":" ws string "," ws "\\"evidence_used\\":" ws array "}"
status_val ::= "\\"answered\\"" | "\\"insufficient_evidence\\"" | "\\"conflicting_evidence\\"" | "\\"out_of_scope\\""
array ::= "[" ws (string ("," ws string)*)? ws "]"
string ::= "\\"" ([^"\\\\\\x00-\\x1F] | "\\\\" (["\\\\\\/bfnrt] | "u" [0-9a-fA-F]{4}))* "\\""
ws ::= [ \\t\\n\\r]*`;

  const ollamaModelfile = `FROM gemma2:9b-instruct-q4_K_M

TEMPLATE """{{ if .System }}<start_of_turn>system
{{ .System }}<end_of_turn>
{{ end }}{{ if .Prompt }}<start_of_turn>user
{{ .Prompt }}<end_of_turn>
{{ end }}<start_of_turn>model
{{ .Response }}<end_of_turn>"""

PARAMETER temperature 0.15
PARAMETER top_p 0.90
PARAMETER top_k 40
PARAMETER repeat_penalty 1.15
PARAMETER num_ctx 4096
PARAMETER stop "<end_of_turn>"
PARAMETER stop "<eos>"

SYSTEM """You are the Ánimas Grounded Memory Companion. Answer user queries exclusively based on <archive_context>. Output strict JSON starting with reasoning_scratchpad."""`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
          Prompt 06 • Local Runtime Optimization (Gemma 2B / 9B)
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-100">
          Hardware Pacing, GBNF Grammars & Context Budgeting
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Deploying to llama.cpp, Ollama, or Antigravity local agents with zero cloud dependencies.
        </p>
      </div>

      {/* Context Budget Calculator */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          4096-Token Context Window Budget (Gemma 2B / 9B)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center">
            <span className="text-stone-500 block text-[9px] uppercase">System Prompt</span>
            <span className="text-stone-200 text-sm font-bold">~420 tokens</span>
            <span className="text-[9px] text-stone-500 block mt-0.5">Fixed memory</span>
          </div>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center">
            <span className="text-stone-500 block text-[9px] uppercase">Retrieved Context</span>
            <span className="text-amber-400 text-sm font-bold">~480 tokens</span>
            <span className="text-[9px] text-stone-500 block mt-0.5">Top-4 chunks</span>
          </div>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center">
            <span className="text-stone-500 block text-[9px] uppercase">User Question</span>
            <span className="text-stone-200 text-sm font-bold">~45 tokens</span>
            <span className="text-[9px] text-stone-500 block mt-0.5">Natural language</span>
          </div>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center">
            <span className="text-stone-500 block text-[9px] uppercase">Reasoning CoT</span>
            <span className="text-purple-400 text-sm font-bold">~180 tokens</span>
            <span className="text-[9px] text-stone-500 block mt-0.5">Scratchpad thinking</span>
          </div>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-center">
            <span className="text-stone-500 block text-[9px] uppercase">JSON Answer</span>
            <span className="text-emerald-400 text-sm font-bold">~220 tokens</span>
            <span className="text-[9px] text-stone-500 block mt-0.5">Grounded response</span>
          </div>
        </div>

        <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/80 text-xs text-stone-300 leading-relaxed">
          <span className="text-emerald-400 font-bold font-mono">Headroom: ~2,700 tokens free. </span>
          Allows multiple dialogue turns in local memory without truncating previous answers or overflowing the KV cache on CPU/VRAM.
        </div>
      </div>

      {/* GBNF Grammar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-200">
              llama.cpp GBNF Grammar (animas_response.gbnf)
            </h3>
            <p className="text-[11px] text-stone-400">
              Guarantees 100% syntactically valid JSON at the sampling level with zero backticks or malformed braces.
            </p>
          </div>
          <button
            onClick={() => copySnippet(gbnfGrammar, 'gbnf')}
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedType === 'gbnf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'gbnf' ? 'Copied GBNF' : 'Copy GBNF'}</span>
          </button>
        </div>

        <pre className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-amber-300/90 overflow-x-auto leading-relaxed">
          {gbnfGrammar}
        </pre>
      </div>

      {/* Ollama Modelfile */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-200">
              Ollama Modelfile (Modelfile.animas)
            </h3>
            <p className="text-[11px] text-stone-400">
              Low temperature (0.15) for strict factual recall + native Gemma &lt;start_of_turn&gt; formatting.
            </p>
          </div>
          <button
            onClick={() => copySnippet(ollamaModelfile, 'ollama')}
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedType === 'ollama' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'ollama' ? 'Copied Modelfile' : 'Copy Modelfile'}</span>
          </button>
        </div>

        <pre className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
          {ollamaModelfile}
        </pre>
      </div>
    </div>
  );
};
