/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Memory Inspector Modal
 * Displays offering context, linked archive story, and sentiment analysis when an altar item is clicked.
 */

import React from 'react';
import { X, Sparkles, BookOpen, MessageSquare, Tag, Calendar, User } from 'lucide-react';
import { OfrendaItemClickData, MemoryDocument, VisualDirectionState } from '../types';
import { CempasuchilRosette } from './UI/SacredIcons';
import { localRAG } from '../services/ragEngine';
import { gemmaService } from '../services/gemmaSimulator';

interface MemoryInspectorModalProps {
  item: OfrendaItemClickData | null;
  onClose: () => void;
  onAskAboutItem: (question: string) => void;
  onApplyVisualTone: (toneState: Partial<VisualDirectionState>) => void;
}

export const MemoryInspectorModal: React.FC<MemoryInspectorModalProps> = ({
  item,
  onClose,
  onAskAboutItem,
  onApplyVisualTone
}) => {
  if (!item) return null;

  const doc: MemoryDocument | undefined = item.associated_memory_id
    ? localRAG.getDocumentById(item.associated_memory_id)
    : undefined;

  const sentiment = doc ? gemmaService.analyzeSentiment(doc) : null;

  const handleApplySentimentToOfrenda = () => {
    if (!sentiment) return;
    onApplyVisualTone({
      memory_tone: sentiment.memory_tone,
      tone_confidence: sentiment.tone_confidence,
      visual_intensity: sentiment.visual_intensity,
      lighting_profile: sentiment.lighting_profile,
      particle_profile: sentiment.particle_profile,
      camera_profile: sentiment.camera_motion === 'slow_drift' ? 'slow_drift' : 'static'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fadeIn">
      <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <CempasuchilRosette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-200 tracking-wide">{item.title}</h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="bg-amber-950/60 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded font-mono text-[10px]">
                  Altar Tier {item.tier}
                </span>
                <span>•</span>
                <span>Sovereign Offering</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Item Description */}
          <div className="bg-stone-950/50 p-3.5 rounded-xl border border-stone-800/80 text-sm leading-relaxed text-stone-300">
            {item.description}
          </div>

          {/* Linked Memory Record */}
          {doc ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Archived Family Record ({doc.source_id})</span>
                </div>
                {sentiment && (
                  <button
                    onClick={handleApplySentimentToOfrenda}
                    className="text-xs bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-300 px-2.5 py-1 rounded flex items-center gap-1.5 transition cursor-pointer"
                    title="Translate this memory's emotional tone into 3D altar lighting & petals"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apply Tone to 3D Ofrenda</span>
                  </button>
                )}
              </div>

              <div className="bg-stone-950 border border-amber-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-base text-stone-100 font-semibold">{doc.title}</h3>
                  {doc.source_date && (
                    <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      {doc.source_date}
                    </span>
                  )}
                </div>

                <p className="text-sm text-stone-300 whitespace-pre-line leading-relaxed font-serif italic border-l-2 border-amber-600/50 pl-3">
                  "{doc.content}"
                </p>

                {/* People & Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/60 text-xs">
                  {doc.people_as_written.length > 0 && (
                    <div className="flex items-center gap-1 text-stone-400">
                      <User className="w-3 h-3 text-stone-500" />
                      <span>{doc.people_as_written.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {doc.tags.map(t => (
                      <span key={t} className="bg-stone-800 text-stone-400 px-2 py-0.5 rounded text-[10px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sentiment Engine Classification Preview */}
              {sentiment && (
                <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Sovereign Sentiment Classification:
                    </span>
                    <span className="font-mono text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/50">
                      {sentiment.memory_tone} ({Math.round(sentiment.tone_confidence * 100)}%)
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs italic">
                    "{sentiment.reasoning_scratchpad}"
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px] text-stone-400">
                    <div className="bg-stone-900 p-1.5 rounded text-center">
                      <span className="text-stone-500 block">Lighting:</span>
                      <span className="text-amber-200">{sentiment.lighting_profile}</span>
                    </div>
                    <div className="bg-stone-900 p-1.5 rounded text-center">
                      <span className="text-stone-500 block">Particles:</span>
                      <span className="text-amber-200">{sentiment.particle_profile}</span>
                    </div>
                    <div className="bg-stone-900 p-1.5 rounded text-center">
                      <span className="text-stone-500 block">Motion:</span>
                      <span className="text-amber-200">{sentiment.camera_motion}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-stone-400 italic bg-stone-950/40 p-4 rounded-xl text-center">
              No directly linked memory file for this offering. You can ingest new letters or diary excerpts into the archive to link them.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200 transition px-3 py-1.5"
          >
            Close
          </button>

          <button
            onClick={() => {
              const query = doc
                ? `Tell me about ${doc.title} and the people mentioned.`
                : `What significance does ${item.title} hold in the family ofrenda?`;
              onClose();
              onAskAboutItem(query);
            }}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Companion About This</span>
          </button>
        </div>

      </div>
    </div>
  );
};
