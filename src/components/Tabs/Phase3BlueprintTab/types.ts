/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Phase 3 Blueprint Data Models
 */

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'local_ai' | 'security' | 'frontend_3d' | 'release';
}

export const DEFINITION_OF_DONE_ITEMS: ChecklistItem[] = [
  // 1. Architecture and Engineering (6 items)
  {
    id: 'arch_01',
    category: 'architecture',
    title: 'Monorepo Structure is Documented and Reproducible',
    description: 'Clean separation between apps/web (Next.js), apps/api (FastAPI), packages/contracts, and packages/prompts with pnpm-workspace and uv.'
  },
  {
    id: 'arch_02',
    category: 'architecture',
    title: 'Frontend and Backend Start Independently',
    description: 'Apps can be launched, debugged, and tested separately via their respective CLI scripts without tight dev-server coupling.'
  },
  {
    id: 'arch_03',
    category: 'architecture',
    title: 'Dependencies and Model Versions are Pinned',
    description: 'Lockfiles (pnpm-lock.yaml and uv.lock) are committed and model tags (e.g. gemma2:9b-instruct-q4_K_M) are explicitly pinned.'
  },
  {
    id: 'arch_04',
    category: 'architecture',
    title: 'Shared Contracts are Versioned and Canonical',
    description: 'JSON schemas in packages/contracts govern both Pydantic models in FastAPI and Zod/TypeScript schemas in Next.js.'
  },
  {
    id: 'arch_05',
    category: 'architecture',
    title: 'No Deprecated or Invented Library APIs',
    description: 'Uses documented package exports (e.g., motion/react instead of legacy Framer Motion, strict Three.js r160+ PBR standards).'
  },
  {
    id: 'arch_06',
    category: 'architecture',
    title: 'Git History Contains Independently Verified Commits',
    description: 'Strict protocol: one improvement, one verified commit, zero commits with broken tests or unverified changes.'
  },

  // 2. Local AI & RAG (7 items)
  {
    id: 'ai_01',
    category: 'local_ai',
    title: 'Gemma Generates Responses Locally Without Cloud',
    description: 'Inference executes entirely on consumer hardware via local Ollama or llama.cpp instance at 127.0.0.1.'
  },
  {
    id: 'ai_02',
    category: 'local_ai',
    title: 'Embeddings are Generated Locally',
    description: 'Vector generation uses local sentence-transformers / EmbeddingGemma; zero external embedding APIs.'
  },
  {
    id: 'ai_03',
    category: 'local_ai',
    title: 'TXT and Markdown Ingestion Works Locally',
    description: 'Uploaded family stories are validated, UTF-8 normalized, and split using paragraph-aware chunk boundaries.'
  },
  {
    id: 'ai_04',
    category: 'local_ai',
    title: 'Hybrid Retrieval Returns Traceable Evidence',
    description: 'Combines sqlite-vec vector similarity with FTS5 lexical matching, returning exact chunk and source offsets.'
  },
  {
    id: 'ai_05',
    category: 'local_ai',
    title: 'Answers are Strictly Grounded in Retrieved Context',
    description: 'System instructions and CoT scratchpads prevent supplementing facts with pre-trained LLM hallucination.'
  },
  {
    id: 'ai_06',
    category: 'local_ai',
    title: 'Insufficient Evidence and Conflicting Accounts Handled',
    description: 'Abstains when documentary evidence is missing; preserves conflicting accounts (e.g. courtyard fountain) without choosing a winner.'
  },
  {
    id: 'ai_07',
    category: 'local_ai',
    title: 'Model Outputs Pass Backend Schema Validation',
    description: 'FastAPI verifies that returned JSON strictly conforms to Pydantic models before transmitting to frontend.'
  },

  // 3. Privacy and Security (6 items)
  {
    id: 'sec_01',
    category: 'security',
    title: 'Zero Cloud AI Dependency in Core Workflows',
    description: 'Query answering, sentiment classification, and ingestion operate with 100% network disconnection.'
  },
  {
    id: 'sec_02',
    category: 'security',
    title: 'Zero Family Archive Content Sent Externally',
    description: 'No telemetry, cloud analytics, Firebase, remote databases, or third-party web trackers.'
  },
  {
    id: 'sec_03',
    category: 'security',
    title: 'Uploads are Validated and Safely Stored',
    description: 'Enforces UTF-8 decoding, internal non-traversable filenames, and strict file-size limits on .txt and .md files.'
  },
  {
    id: 'sec_04',
    category: 'security',
    title: 'Adversarial Prompt Injections are Resisted',
    description: 'Archived text is tagged as untrusted narrative data in <archive_context>; override instructions are safely ignored.'
  },
  {
    id: 'sec_05',
    category: 'security',
    title: 'Local API is Bound Strictly to Loopback',
    description: 'FastAPI binds strictly to 127.0.0.1 (not 0.0.0.0) with restricted CORS and origin validation.'
  },
  {
    id: 'sec_06',
    category: 'security',
    title: 'Cascading Archive Deletion and Backup Restores Work',
    description: 'Deleting an archive removes sources, chunks, vectors, and presentation states with zero orphaned data.'
  },

  // 4. Frontend and 3D Ofrenda (7 items)
  {
    id: 'front_01',
    category: 'frontend_3d',
    title: 'Archive Explorer and Inquest Drawer Function Seamlessly',
    description: 'Browsing documents, reading paragraph chunks, and submitting queries work with instantaneous feedback.'
  },
  {
    id: 'front_02',
    category: 'frontend_3d',
    title: '3D Memory Objects are Selectable and Inspectable',
    description: 'Clicking nichos, candles, or offerings triggers camera transitions and opens linked archival records.'
  },
  {
    id: 'front_03',
    category: 'frontend_3d',
    title: 'Sentiment JSON Directly Controls 3D Presentation',
    description: 'Translates memory_tone into bounded lighting profiles, flickering candlelight, and marigold petal drift.'
  },
  {
    id: 'front_04',
    category: 'frontend_3d',
    title: 'All 3D Scene Assets and Textures Load Locally',
    description: '100% procedural HTML5 canvas textures and Web Audio API oscillators; zero external 404 URL dependencies.'
  },
  {
    id: 'front_05',
    category: 'frontend_3d',
    title: 'Alternative Touch and Keyboard Navigation Works',
    description: 'Memories and controls are 100% accessible via keyboard and standard DOM controls without requiring 3D.'
  },
  {
    id: 'front_06',
    category: 'frontend_3d',
    title: 'Reduced-Motion and WebGL Fallback are Respected',
    description: 'Provides still camera mode and styled non-WebGL fallbacks when hardware acceleration is disabled.'
  },
  {
    id: 'front_07',
    category: 'frontend_3d',
    title: 'Mobile and Desktop Layouts are Tested and Responsive',
    description: 'Inquest Drawer renders as a slide-up bottom sheet on mobile and a slide-out right drawer on desktop.'
  },

  // 5. Release Verification (6 items)
  {
    id: 'rel_01',
    category: 'release',
    title: 'Unit and Integration Tests Pass',
    description: 'Pytest suite passes in apps/api and Vitest passes in apps/web with full coverage of critical paths.'
  },
  {
    id: 'rel_02',
    category: 'release',
    title: 'AI Evaluation Targets are Met on Gold Suite',
    description: '100% citation integrity, 0 hallucinations on missing-evidence tests, and 0 prompt injection breaches.'
  },
  {
    id: 'rel_03',
    category: 'release',
    title: 'Accessibility Compliance (WCAG AA) Completed',
    description: 'Tested for semantic HTML, focus-visible states, touch targets >= 44px, and contrast ratios >= 4.5:1.'
  },
  {
    id: 'rel_04',
    category: 'release',
    title: 'Hardware Profiling and Latency are Documented',
    description: 'RAM, VRAM, first-token latency, and tokens/sec are documented for Gemma 4 variants on target machines.'
  },
  {
    id: 'rel_05',
    category: 'release',
    title: 'Network-Disconnected Acceptance Test Passes',
    description: 'Complete end-to-end verification executed with Wi-Fi and Ethernet physically disconnected.'
  },
  {
    id: 'rel_06',
    category: 'release',
    title: 'README and Setup Documentation are Complete',
    description: 'Step-by-step setup guide for uv, pnpm, Ollama/llama.cpp model weights, and local environment launch.'
  }
];

const STORAGE_KEY = 'animas_dod_verification_v1';

export function loadVerifiedItemIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (err) {
    console.warn('LocalStorage unavailable, using fallback in-memory state:', err);
  }
  return new Set();
}

export function saveVerifiedItemIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}
