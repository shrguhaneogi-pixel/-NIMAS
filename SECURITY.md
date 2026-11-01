# Security Policy — ÁNIMAS: The Sovereign 3D Ofrenda

## Threat Model & Security Posture

**ÁNIMAS** is engineered as a sovereign, local-first memorial sanctuary. Because personal family memories, photographs, and records are deeply sacred and sensitive, the system is designed with strict data isolation:

1. **Zero Unsolicited Telemetry**:
   - The application does not collect analytics, telemetry, or user usage metrics.
   - All memory search and RAG indexing occur in-memory / in local browser storage by default.

2. **Data Boundary & AI Privacy**:
   - In local mode (`Local Mock Adapter`), zero bytes leave the browser.
   - When optional remote inference is enabled (e.g., Google Gemini 2.5 Flash), user data is sent only to the configured endpoint over TLS 1.3, solely for the explicit query being processed.
   - No prompts or retrieved memory chunks are saved to remote third-party databases.

3. **Prompt Injection & Persona Hijack Resistance**:
   - The grounding companion enforces strict system-level constraints (`Prompt00Constitution.tsx` and `Prompt03GroundedAnswerer.tsx`).
   - The system categorically refuses to emulate the deceased or speak as a ghost/spirit, resisting adversarial roleplay prompts (`gold_027` through `gold_030`).
   - Grounded citations require direct verbatim support from ingested archival documents; unevidenced requests are explicitly rejected with `insufficient_evidence`.

4. **Cryptographic Integrity**:
   - Ingested documents produce deterministic SHA-256 content hashes (`chunk_id = hash(doc_id + chunk_index + text)`).
   - Any client-side state export (`Export Tab`) produces human-auditable JSON without encrypted black-box blobs.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential data leak in ÁNIMAS:

1. **Do not create a public GitHub issue.**
2. Send an email to the security maintainers or open a private GitHub Security Advisory.
3. Provide detailed steps to reproduce the issue, including example payload or memory archive sample.
4. We aim to acknowledge reports within 48 hours and provide a patch/remediation within 14 business days.
