/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Prompt 04: Sovereign Sentiment Engine
 */

import React, { useState } from 'react';
import { Sparkles, Eye, Sliders, CheckCircle2, Flame, Layers } from 'lucide-react';
import { gemmaService, SYSTEM_PROMPTS } from '../../services/gemmaSimulator';
import { SovereignSentimentResponse, VisualDirectionState, MemoryTone } from '../../types';

interface Prompt04SentimentEngineProps {
  onApplyVisualState: (state: Partial<VisualDirectionState>) => void;
}

export const Prompt04SentimentEngine: React.FC<Prompt04SentimentEngineProps> = ({
  onApplyVisualState
}) => {
  const [testText, setTestText] = useState(
    "Abuela Elena always cooked the mole in the deep clay cazuela, smiling as the chilies and Mexican dark chocolate filled the kitchen with warmth."
  );
  const [sentimentResult, setSentimentResult] = useState<SovereignSentimentResponse | null>(null);

  const sampleSnippets: { label: string; tone: MemoryTone; text: string }[] = [
    {
      label: 'Joyful (Recipe & Feast)',
      tone: 'joyful',
      text: 'Mariachis played El Son de la Negra at the celebration, and Abuela cheered loudly as Sofia held her medical diploma.'
    },
    {
      label: 'Somber (Telegram & Loss)',
      tone: 'somber',
      text: 'The telegram stamp was unreadable from Pátzcuaro. Uncle Ignacio had passed away and the sirens sounded for days.'
    },
    {
      label: 'Reflective (Palo Escrito Guitar)',
      tone: 'reflective',
      text: 'Tío Héctor would tune the Paracho cedar guitar on the humid porch, letting the notes linger in the evening air.'
    },
    {
      label: 'Mixed (Torrents & Singing)',
      tone: 'mixed',
      text: 'A downpour flooded the cemetery, but we built cardboard tepees over the candles and sang hymns sharing hot atole.'
    },
    {
      label: 'Neutral (Carpentry Ledger)',
      tone: 'neutral',
      text: 'Inventory ledger: two German planes, three saws, and sixty Michoacán pine boards. Mateo hired at 8 pesos per day.'
    }
  ];

  const handleClassify = (textToClassify: string) => {
    const res = gemmaService.analyzeSentiment(textToClassify);
    setSentimentResult(res);
  };

  const handleApplyTo3D = () => {
    if (!sentimentResult) return;
    onApplyVisualState({
      memory_tone: sentimentResult.memory_tone,
      tone_confidence: sentimentResult.tone_confidence,
      visual_intensity: sentimentResult.visual_intensity,
      lighting_profile: sentimentResult.lighting_profile,
      particle_profile: sentimentResult.particle_profile,
      camera_profile: sentimentResult.camera_motion === 'slow_drift' ? 'slow_drift' : 'static'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Prompt 04 • Sovereign Sentiment & 3D Visual Direction
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-100">
            Affective Memory Classification & Scene Director
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Translates emotional nuances of retrieved memories into bounded Three.js presentation parameters.
          </p>
        </div>

        {sentimentResult && (
          <button
            onClick={handleApplyTo3D}
            className="text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply to 3D Ofrenda Canvas</span>
          </button>
        )}
      </div>

      {/* Emotion to Visual Mapping Specification Table */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
          Visual Parameter Translation Matrix
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 font-mono text-[10px] uppercase">
                <th className="py-2 px-3">Memory Tone</th>
                <th className="py-2 px-3">Lighting Profile</th>
                <th className="py-2 px-3">Particle Profile</th>
                <th className="py-2 px-3">Camera Motion</th>
                <th className="py-2 px-3">Atmospheric Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-400">joyful</td>
                <td className="py-2.5 px-3 text-stone-300">warm_candle</td>
                <td className="py-2.5 px-3 text-amber-300">petal_drift (swirling)</td>
                <td className="py-2.5 px-3 text-stone-300">slow_drift</td>
                <td className="py-2.5 px-3 text-stone-400 font-sans">Vibrant amber glow, active marigold petals</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-blue-400">somber</td>
                <td className="py-2.5 px-3 text-stone-300">subdued_amber</td>
                <td className="py-2.5 px-3 text-stone-400">dust_motes</td>
                <td className="py-2.5 px-3 text-stone-300">static</td>
                <td className="py-2.5 px-3 text-stone-400 font-sans">Low-key amber, respectful stillness</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-purple-400">reflective</td>
                <td className="py-2.5 px-3 text-stone-300">soft_candle</td>
                <td className="py-2.5 px-3 text-stone-300">gentle_drift</td>
                <td className="py-2.5 px-3 text-stone-300">slow_drift</td>
                <td className="py-2.5 px-3 text-stone-400 font-sans">Intimate candlelight, drifting contemplation</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-stone-400">neutral</td>
                <td className="py-2.5 px-3 text-stone-300">neutral</td>
                <td className="py-2.5 px-3 text-stone-500">none</td>
                <td className="py-2.5 px-3 text-stone-300">static</td>
                <td className="py-2.5 px-3 text-stone-400 font-sans">Balanced studio lighting, steady camera</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-400">mixed</td>
                <td className="py-2.5 px-3 text-stone-300">balanced_warm</td>
                <td className="py-2.5 px-3 text-emerald-300">gentle_drift</td>
                <td className="py-2.5 px-3 text-stone-300">slow_drift</td>
                <td className="py-2.5 px-3 text-stone-400 font-sans">Layered warm contrast, resilient warmth</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Classification Test Bench */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          Test Emotional Classification on Memory Extracts
        </h3>

        {/* Quick Snippets */}
        <div className="flex flex-wrap gap-2">
          {sampleSnippets.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTestText(s.text);
                handleClassify(s.text);
              }}
              className="text-xs bg-stone-950 hover:bg-amber-950/80 border border-stone-800 hover:border-amber-700 text-stone-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div>
          <textarea
            rows={3}
            value={testText}
            onChange={e => setTestText(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 focus:border-amber-600 rounded-xl p-3 text-xs text-stone-200 outline-none leading-relaxed font-serif"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleClassify(testText)}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Classify Sentiment & Compute 3D Parameters</span>
          </button>
        </div>

        {/* Output Card */}
        {sentimentResult && (
          <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-amber-900/60 space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-stone-500 uppercase text-[10px] font-bold">
                Classification Result:
              </span>
              <span className="font-mono text-amber-300 uppercase font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                {sentimentResult.memory_tone} ({Math.round(sentimentResult.tone_confidence * 100)}% Confidence)
              </span>
            </div>

            <p className="text-stone-300 italic font-serif">
              "{sentimentResult.reasoning_scratchpad}"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 font-mono text-[11px]">
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-center">
                <span className="text-stone-500 block text-[9px] uppercase">Lighting</span>
                <span className="text-amber-300 font-bold">{sentimentResult.lighting_profile}</span>
              </div>
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-center">
                <span className="text-stone-500 block text-[9px] uppercase">Particles</span>
                <span className="text-amber-300 font-bold">{sentimentResult.particle_profile}</span>
              </div>
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-center">
                <span className="text-stone-500 block text-[9px] uppercase">Camera Motion</span>
                <span className="text-amber-300 font-bold">{sentimentResult.camera_motion}</span>
              </div>
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-center">
                <span className="text-stone-500 block text-[9px] uppercase">Intensity</span>
                <span className="text-amber-300 font-bold">{Math.round(sentimentResult.visual_intensity * 100)}%</span>
              </div>
            </div>

            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
              <pre>{JSON.stringify(sentimentResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
