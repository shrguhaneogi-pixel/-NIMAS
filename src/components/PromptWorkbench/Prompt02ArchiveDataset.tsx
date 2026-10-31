/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Prompt 02: Archive & Ingestion Studio
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  User,
  Tag,
  FileText,
  RotateCcw,
  Sparkles,
  Check,
  Search
} from 'lucide-react';
import { MemoryDocument } from '../../types';
import { localRAG } from '../../services/ragEngine';

export const Prompt02ArchiveDataset: React.FC = () => {
  const [documents, setDocuments] = useState<MemoryDocument[]>(localRAG.getDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.source_id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  // New Ingest Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFilename, setNewFilename] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPeople, setNewPeople] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newContent, setNewContent] = useState('');

  const selectedDoc = documents.find(d => d.source_id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter(d => {
    const q = searchFilter.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.people_as_written.some(p => p.toLowerCase().includes(q)) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const peopleArr = newPeople.split(',').map(s => s.trim()).filter(Boolean);
    const tagsArr = newTags.split(',').map(s => s.trim().replace(/^#/, '')).filter(Boolean);

    const doc = localRAG.ingestDocument({
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
    if (confirm('Delete this memory from local storage?')) {
      localRAG.deleteDocument(sourceId);
      const updated = localRAG.getDocuments();
      setDocuments(updated);
      if (selectedDocId === sourceId && updated.length > 0) {
        setSelectedDocId(updated[0].source_id);
      }
    }
  };

  const handleReset = () => {
    if (confirm('Reset entire archive to original 15 synthetic Día de los Muertos test fixtures?')) {
      const resetDocs = localRAG.resetToSyntheticDefault();
      setDocuments(resetDocs);
      setSelectedDocId(resetDocs[0]?.source_id || '');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Prompt 02 • Sovereign Memory Ingestion & Archive
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-100">
            Sovereign Family Archive ({documents.length} Documents)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Paragraph-aware chunking preserving narrative borders, recipes, and contradictions. Stored 100% locally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-stone-700"
            title="Reset to original synthetic 15-memory test suite"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest New Story (.txt / .md)</span>
          </button>
        </div>
      </div>

      {/* Main Split View: Left List / Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Document Browser */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter by title, person, tag, or content..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-600 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-500 outline-none"
            />
          </div>

          {/* Document Items List */}
          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
            {filteredDocs.map(doc => {
              const isSelected = doc.source_id === selectedDocId;
              return (
                <div
                  key={doc.source_id}
                  onClick={() => setSelectedDocId(doc.source_id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
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

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-stone-400">
                    {doc.source_date && <span>📅 {doc.source_date}</span>}
                    <span className="capitalize">📜 {doc.source_type.replace('_', ' ')}</span>
                    <span>🧩 {doc.chunks.length} Chunks</span>
                  </div>

                  {doc.source_type === 'adversarial_injection' && (
                    <div className="mt-1.5 text-[9px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                      ⚠️ Adversarial Injection Test Vector
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chunk & Document Inspector */}
        <div className="lg:col-span-7 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 flex flex-col space-y-4">
          {selectedDoc ? (
            <>
              {/* Doc Header */}
              <div className="border-b border-stone-800 pb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                    <span>{selectedDoc.source_id}</span>
                    <span>•</span>
                    <span className="text-stone-400">{selectedDoc.original_filename}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-100">{selectedDoc.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-2">
                    {selectedDoc.source_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        {selectedDoc.source_date}
                      </span>
                    )}
                    {selectedDoc.people_as_written.length > 0 && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        {selectedDoc.people_as_written.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedDoc.source_id)}
                  className="p-2 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
                  title="Delete from archive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Full Text */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-stone-500 font-semibold tracking-wider">
                  Raw Document Content:
                </span>
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed font-serif whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedDoc.content}
                </div>
              </div>

              {/* Paragraph-Aware Chunks */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                    Paragraph-Aware Chunks ({selectedDoc.chunks.length}):
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Preserves cultural & narrative boundaries</span>
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
              No document selected.
            </div>
          )}
        </div>

      </div>

      {/* Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-stone-200">
            <h3 className="text-base font-serif font-bold text-amber-200">Ingest Family Memory into Archive</h3>
            
            <form onSubmit={handleIngest} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Title / Story Heading *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Abuelo's Workshop Ledger from 1965"
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
                    placeholder="mem_entry.txt"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 outline-none text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Document Date (optional)</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    placeholder="YYYY-MM-DD or 'circa 1970'"
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
                    placeholder="Elena, Mateo, Tío Héctor"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 outline-none text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="recipe, celebration, michoacan"
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
                  placeholder="Paste family account, recipe, or transcribed recording here. Separate paragraphs with double newlines for automatic paragraph chunking..."
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
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Chunk & Ingest Locally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
