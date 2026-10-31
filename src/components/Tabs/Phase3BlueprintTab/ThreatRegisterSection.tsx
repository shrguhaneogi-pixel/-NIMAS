/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Threat Register & Hardening Section
 */

import React from 'react';
import { ShieldAlert, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';

interface ThreatItem {
  id: string;
  threat: string;
  vector: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  mitigation: string;
  verificationMethod: string;
}

const THREAT_REGISTER: ThreatItem[] = [
  {
    id: 'THR-01',
    threat: 'Prompt Injection via Archival Documents',
    vector: 'Malicious system instructions embedded inside uploaded TXT/MD letters or diary entries.',
    severity: 'HIGH',
    mitigation: 'Strictly isolate raw archive documents within distinct XML/fenced narrative tags (<archive_context>). System prompt mandates treating archival text as untrusted historical narrative data only.',
    verificationMethod: 'Automated injection test cases in Audit Studio asserting refusal to execute embedded instructions.'
  },
  {
    id: 'THR-02',
    threat: 'Path Traversal via File Ingestion',
    vector: 'File uploads containing relative path sequences (../../etc/passwd or symlink exploits).',
    severity: 'CRITICAL',
    mitigation: 'Sanitize file names, assign internal UUIDs, strip directory delimiters, and restrict storage strictly within a dedicated sandboxed archive directory.',
    verificationMethod: 'Pytest path traversal attack suite asserting 400 Bad Request on anomalous filenames.'
  },
  {
    id: 'THR-03',
    threat: 'Accidental Cloud Data Egress',
    vector: 'Accidental network calls or telemetry reporting to remote servers during ingestion or inference.',
    severity: 'CRITICAL',
    mitigation: 'FastAPI loopback-only binding; strip all external tracking, analytics, and telemetry libraries from packages; block outbound non-localhost sockets in production builds.',
    verificationMethod: 'Network-disconnected acceptance test with physical Wi-Fi/Ethernet offline; assert 100% functionality.'
  },
  {
    id: 'THR-04',
    threat: 'Local Network Eavesdropping',
    vector: 'Malicious processes or neighbors on local LAN inspecting unencrypted loopback traffic.',
    severity: 'HIGH',
    mitigation: 'FastAPI strictly binds to 127.0.0.1 (never 0.0.0.0). Local daemon enforces CORS restricted to origin http://localhost:3000 and generates ephemeral session tokens.',
    verificationMethod: 'Port scan asserting 0.0.0.0 is unexposed and LAN IP connection attempts are immediately rejected.'
  },
  {
    id: 'THR-05',
    threat: 'Denial of Service via Huge Archive Ingestion',
    vector: 'Uploading gigabyte-scale text files or recursive archives exhausting host memory.',
    severity: 'MEDIUM',
    mitigation: 'Enforce strict 10MB individual file limit and 100MB cumulative archive limit; chunk processing uses asynchronous generators to stream memory incrementally.',
    verificationMethod: 'Stress test ingesting 50MB synthetic payload verifying stable memory RSS < 512MB.'
  },
  {
    id: 'THR-06',
    threat: 'Small Model Hallucination & Confabulation',
    vector: 'Gemma 2B/9B inventing names, dates, or non-existent family members when evidence is thin.',
    severity: 'HIGH',
    mitigation: 'Mandate reasoning_scratchpad as first JSON key to enforce grounding CoT prior to answer emission; abstain when evidence is insufficient (<insufficient_evidence>).',
    verificationMethod: 'Gold benchmark test suite checking 100% pass rate on missing-evidence queries.'
  },
  {
    id: 'THR-07',
    threat: 'JSON Schema Truncation & Syntax Errors',
    vector: 'Context window boundaries or sampling jitter producing broken JSON from local LLM.',
    severity: 'MEDIUM',
    mitigation: 'Enforce GBNF grammar in llama.cpp runtime; Pydantic v2 validation middleware with single-retry fallback prompting for Ollama.',
    verificationMethod: '1,000 continuous query stress test asserting 0% unhandled JSON parse exceptions.'
  },
  {
    id: 'THR-08',
    threat: 'Three.js WebGL Resource Leak & GPU Hang',
    vector: 'Continuous memory creation and tab switching accumulating textures and geometries in GPU VRAM.',
    severity: 'MEDIUM',
    mitigation: 'Recursive dispose() protocol traversing all meshes, materials, procedural canvas textures, and render targets upon component unmount.',
    verificationMethod: 'Chrome DevTools heap snapshot & GPU memory trace showing flat memory curve across 50 tab switches.'
  },
  {
    id: 'THR-09',
    threat: 'Incomplete Cascading Archive Deletion',
    vector: 'Deleting a family memory leaving orphaned vector embeddings or chunk text in SQLite.',
    severity: 'HIGH',
    mitigation: 'Foreign key cascade constraints enabled in SQLite (PRAGMA foreign_keys = ON); atomic database transactions for delete operations.',
    verificationMethod: 'SQL audit query verifying 0 orphaned records in chunks, embeddings, and visual_profiles tables after delete.'
  },
  {
    id: 'THR-10',
    threat: 'Archive Backup Tampering or Corruption',
    vector: 'Restoring an exported zip or tar archive containing altered hashes or tampered schema.',
    severity: 'HIGH',
    mitigation: 'Cryptographic SHA-256 manifest generated during export; restore process validates document checksums prior to database ingestion.',
    verificationMethod: 'Restore unit test intentionally altering 1 byte and verifying rejection with tamper warning.'
  },
  {
    id: 'THR-11',
    threat: 'Malicious Markdown / HTML Injection (XSS)',
    vector: 'Archival letters containing <script> or event handler attributes executed in web interface.',
    severity: 'HIGH',
    mitigation: 'DOMPurify sanitization on all rendered markdown; plain-text rendering for archival quotes in the 3D inspection modal.',
    verificationMethod: 'XSS attack vectors submitted in synthetic archive; assert zero script execution in browser console.'
  }
];

export const ThreatRegisterSection: React.FC = () => {
  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-start justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>SECURITY & PRIVACY ARCHITECTURE</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-100">
            11-Point Threat Analysis & Hardening Register
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl font-sans">
            Formal security threat model protecting the sacred family archive against prompt injection, memory exhaustion, network leakage, and data tampering.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] font-mono text-emerald-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Air-Gap Ready</span>
        </div>
      </div>

      {/* Threat Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-left text-[11px] font-mono">
          <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
            <tr>
              <th className="p-3 font-medium">ID & Threat</th>
              <th className="p-3 font-medium">Attack Vector</th>
              <th className="p-3 font-medium">Severity</th>
              <th className="p-3 font-medium">Architecture Mitigation</th>
              <th className="p-3 font-medium">Verification Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 bg-stone-950/40 text-stone-300">
            {THREAT_REGISTER.map((item) => {
              const sevBadge = 
                item.severity === 'CRITICAL' ? 'bg-red-950/70 text-red-300 border-red-800/70' :
                item.severity === 'HIGH' ? 'bg-amber-950/70 text-amber-300 border-amber-800/70' :
                'bg-stone-900 text-stone-300 border-stone-800';

              return (
                <tr key={item.id} className="hover:bg-stone-900/50 transition">
                  <td className="p-3 font-serif font-bold text-stone-100 whitespace-nowrap">
                    <span className="text-amber-500 font-mono text-[10px] block font-normal">[{item.id}]</span>
                    {item.threat}
                  </td>
                  <td className="p-3 text-stone-400 font-sans text-xs max-w-xs">{item.vector}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sevBadge}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3 text-stone-300 font-sans text-xs max-w-sm">{item.mitigation}</td>
                  <td className="p-3 text-stone-400 font-sans text-xs max-w-xs">{item.verificationMethod}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
