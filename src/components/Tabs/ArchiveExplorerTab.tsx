/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Tab 2: Archive Explorer
 * High-density archival browser, paragraph chunk viewer, and simulated memory ingestion.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  User,
  Search,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Tag,
  AlertTriangle,
  Upload,
  FileText
} from 'lucide-react';
import { MemoryDocument, VisualDirectionState } from '../../types';
import { localRAG } from '../../services/ragEngine';
import { animasAI } from '../../services/MockAnimasAIAdapter';

interface ArchiveExplorerTabProps {
  onAskAboutMemory: (question: string) => void;
  onApplyVisualState: (patch: Partial<VisualDirectionState>) => void;
}

export const ArchiveExplorerTab: React.FC<ArchiveExplorerTabProps> = ({
  onAskAboutMemory,
  onApplyVisualState
}) => {
  const [documents, setDocuments] = useState<MemoryDocument[]>(localRAG.getDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.source_id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  // Ingestion Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFilename, setNewFilename] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPeople, setNewPeople] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);

  const selectedDoc = documents.find(d => d.source_id === selectedDocId) || documents[0];

  const categories = [
    { id: 'all', label: 'All Records' },
    { id: 'recipe', label: 'Recipes' },
    { id: 'oral_history', label: 'Oral Histories' },
    { id: 'diary', label: 'Diaries' },
    { id: 'letter', label: 'Letters' },
    { id: 'adversarial_injection', label: 'Adversarial Test' }
  ];

  const filteredDocs = documents.filter(doc => {
    const q = searchFilter.toLowerCase();
    const matchesSearch =
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q) ||
      doc.people_as_written.some(p => p.toLowerCase().includes(q)) ||
      doc.tags.some(t => t.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'all' || doc.source_type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSimulatedIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsIngesting(true);
    const peopleArr = newPeople.split(',').map(s => s.trim()).filter(Boolean);
    const tagsArr = newTags.split(',').map(s => s.trim().replace(/^#/, '')).filter(Boolean);

    const doc = await animasAI.ingestMemory({
      title: newTitle,
      filename: newFilename || `${newTitle.toLowerCase().replace(/\s+/g, '_')}.md`,
      content: newContent,
      source_date: newDate || null,
      people_as_written: peopleArr,
      tags: tagsArr.length > 0 ? tagsArr : ['family_archive']
    });

    const updated = localRAG.getDocuments();
    setDocuments(updated);
    setSelectedDocId(doc.source_id);
    setIsIngesting(false);
    setIsIngestModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewFilename('');
    setNewDate('');
    setNewPeople('');
    setNewTags('');
    setNewContent('');
  };

  const handleDelete = (sourceId: string) => {
    if (confirm('Delete this memory from your local sovereign archive?')) {
      localRAG.deleteDocument(sourceId);
      const updated = localRAG.getDocuments();
      setDocuments(updated);
      if (selectedDocId === sourceId && updated.length > 0) {
        setSelectedDocId(updated[0].source_id);
      }
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Restore original 15 synthetic Día de los Muertos test documents?')) {
      const reset = localRAG.resetToSyntheticDefault();
      setDocuments(reset);
      setSelectedDocId(reset[0]?.source_id || '');
    }
  };

  const handleApplySentiment = () => {
    if (!selectedDoc) return;
    const sentiment = animasAI.evaluateSentiment(selectedDoc);
    const patch = animasAI.mapToVisualParameters(sentiment);
    onApplyVisualState(patch);
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 text-stone-200">
      
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-1">
            Tab 2 • Sovereign Family Archive
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-100">
            Archive Explorer ({documents.length} Preserved Records)
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Browse oral histories, recipes, diaries, letters, and conflicting family accounts. All records are chunked locally preserving narrative and historical boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3.5 py-2 rounded-xl border border-stone-700 flex items-center gap-1.5 transition cursor-pointer"
            title="Reset to original 15 synthetic test fixtures"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Memory (.txt / .md)</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Document Browser / Right Chunk & Content Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List & Filter (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search by keywords, names, or tags..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-600 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-500 outline-none transition"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                  categoryFilter === c.id
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Document Cards List */}
          <div className="space-y-2 overflow-y-auto max-h-[620px] pr-1">
            {filteredDocs.map(doc => {
              const isSelected = doc.source_id === selectedDocId;
              return (
                <div
                  key={doc.source_id}
                  onClick={() => setSelectedDocId(doc.source_id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-600/80 text-amber-100 shadow'
                      : 'bg-stone-950 border-stone-800/80 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-serif font-bold line-clamp-1">{doc.title}</h4>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800 shrink-0">
                      {doc.source_id}
                    </span>
                  </div>

                  {/* Clean unboxed metadata with typographic dot separators */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-stone-400 font-sans">
                    {doc.source_date ? (
                      <span>{doc.source_date}</span>
                    ) : (
                      <span className="text-amber-400/80 italic">Date unknown</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{doc.source_type.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.chunks.length} chunks</span>
                  </div>

                  {doc.source_type === 'adversarial_injection' && (
                    <div className="mt-1.5 text-[9px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                      ⚠️ Adversarial Injection Security Test
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Record Detail & Paragraph Chunks (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 flex flex-col space-y-5">
          {selectedDoc ? (
            <>
              {/* Record Top Bar */}
              <div className="border-b border-stone-800 pb-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <span>{selectedDoc.source_id}</span>
                    <span>·</span>
                    <span className="text-stone-400">{selectedDoc.original_filename}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-100">{selectedDoc.title}</h3>
                  
                  {/* Clean Unboxed Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 pt-1">
                    {selectedDoc.source_date ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        {selectedDoc.source_date}
                      </span>
                    ) : (
                      <span className="text-amber-400/90 italic flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        Date unrecorded / historical uncertainty
                      </span>
                    )}
                    {selectedDoc.people_as_written.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-stone-500" />
                          {selectedDoc.people_as_written.join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAskAboutMemory(`Tell me about ${selectedDoc.title} and the people involved.`)}
                    className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                    title="Open Inquest Drawer with query about this memory"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Archive</span>
                  </button>

                  <button
                    onClick={() => handleDelete(selectedDoc.source_id)}
                    className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Full Document Narrative */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-stone-500 font-bold tracking-wider">
                    Preserved Text:
                  </span>
                  <button
                    onClick={handleApplySentiment}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Sync 3D Altar Tone</span>
                  </button>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed font-serif whitespace-pre-line max-h-56 overflow-y-auto">
                  {selectedDoc.content}
                </div>
              </div>

              {/* Paragraph-Aware Chunk Inspector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                    Paragraph-Aware Chunks ({selectedDoc.chunks.length})
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Structured for local SQLite-vec retrieval
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedDoc.chunks.map(chunk => (
                    <div
                      key={chunk.chunk_id}
                      className="bg-stone-950 border border-stone-800/80 rounded-xl p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span className="text-amber-300 font-bold">{chunk.chunk_id}</span>
                        <span>~{chunk.token_estimate} tokens</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-stone-500 text-xs p-8 text-center italic">
              No memory record selected.
            </div>
          )}
        </div>

      </div>

      {/* Simulated Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-serif font-bold text-amber-200 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Ingest Family Memory into Archive</span>
              </h3>
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Upload or paste personal family accounts, recipes, or letters. Memories are parsed into paragraph chunks and indexed locally in SQLite-vec.
            </p>

            <form onSubmit={handleSimulatedIngest} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Story Title / Heading *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Tía Carmen's Tamales Recipe from 1989"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg p-2.5 outline-none text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Original Filename (optional)</label>
                  <input
                    type="text"
                    value={newFilename}
                    onChange={e => setNewFilename(e.target.value)}
                    placeholder="carmen_tamales.md"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 outline-none text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Document Date (optional)</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    placeholder="1989-11-02 or 'circa 1980s'"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 outline-none text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">People Mentioned (comma-separated)</label>
                  <input
                    type="text"
                    value={newPeople}
                    onChange={e => setNewPeople(e.target.value)}
                    placeholder="Tía Carmen, Elena, Diego"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 outline-none text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="tamales, recipe, michoacan"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 outline-none text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Memory Content (.txt / Markdown) *</label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Paste family account here. Separate paragraphs with double newlines for automatic paragraph chunking..."
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg p-2.5 outline-none text-stone-200 leading-relaxed font-serif"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsIngestModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isIngesting}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {isIngesting ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{isIngesting ? 'Chunking & Indexing...' : 'Chunk & Ingest Locally'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
