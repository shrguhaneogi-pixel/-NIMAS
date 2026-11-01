# ÁNIMAS — Security & Privacy Audit

**Auditor:** Application Security Engineer & Principal Architect  
**Date:** 2026-11-01  
**Scope:** Entire repository (`src/`, configuration, data fixtures, build manifests)  
**Security Model:** Local-First, Sovereign Digital Memorial  

---

## 1. Executive Summary

Ánimas is designed to manage and celebrate sensitive family archives, personal letters, and oral histories. Preserving privacy and sovereign control is therefore not an afterthought, but a core constitutional requirement.

This audit evaluates the codebase against local-first security principles, credential exposure, input validation, injection resistance, and data confidentiality.

---

## 2. Secrets & Credential Protection

| Check Item | Status | Verification Evidence |
| :--- | :---: | :--- |
| **Committed Secrets / API Keys** | **PASS** | Grep inspection across all files found zero committed API keys, tokens, or credentials. |
| **Environment Variable Hygiene** | **PASS** | `.env.example` contains only sanitized placeholder values (`MY_GEMINI_API_KEY`, `MY_APP_URL`). |
| **Gitignore Coverage** | **PASS** | `.gitignore` explicitly excludes `.env*` while preserving `!.env.example`. |
| **Client-Side Bundle Exposure** | **PASS** | No server credentials or private keys are referenced in client bundles. |

---

## 3. Data Protection & Local-First Sovereignty

### 3.1 Zero Remote Telemetry & Tracking
- **Verification:** Inspection of `package.json`, `index.html`, and `src/` confirmed zero tracking scripts, analytics SDKs (Google Analytics, Mixpanel, Sentry), or external telemetry endpoints.
- **Offline Capability:** All core functions—BM25 archival search, Web Audio synthetic soundscapes, procedural 16-bit texture dithering, 3D Canvas rendering, and sentiment classification—operate completely offline with zero outbound network calls.

### 3.2 Ingestion Boundaries & Untrusted Data Handling
- **Archival Content as Untrusted Data:** Family archives may contain malicious prompt injections, formatting exploits, or simulated adversarial graffiti.
- **Defense-in-Depth:**
  - `gemmaSimulator.ts` implements strict application-level boundaries refusing persona hijacking or system override directives (`status: 'out_of_scope'`).
  - Text input in `ragEngine.ts` is sanitized using unicode letter matching and regular expression escaping (`escapeRegExp`).
  - Document deletion cleanly removes memory records from localStorage and state memory.

---

## 4. Threat Matrix & Residual Risks

| Threat Category | Potential Risk | Mitigation in Codebase | Severity | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Local Service Exposure** | If future FastAPI service binds to `0.0.0.0`, local network peers could access archives | Enforce `127.0.0.1` binding and local origin checks in backend scaffolding | P2 | Documented in Blueprint |
| **Prompt Injection** | Untrusted document instructions attempt to override assistant constitution | Application-layer heuristic pattern filtering and structured JSON schema enforcement | P1 | Mitigated & Verified |
| **Persona Hijacking** | Users or documents prompting the model to speak as deceased ancestors | Explicit constitutional abstention rule refusing first-person deceased impersonation | P1 | Mitigated & Verified |
| **LocalStorage Quota** | Storing very large custom archives in browser storage may exceed 5MB quota | `LocalRAGEngine` catches quota exceptions gracefully; Phase 3 plans SQLite-vec on disk | P3 | Mitigated |

---

## 5. Security Recommendations for Future Backend Deployment
1. When spinning up the Python FastAPI service, bind exclusively to `127.0.0.1` (never `0.0.0.0`).
2. Implement CORS restrictions allowing requests only from the local frontend origin (`http://localhost:3000`).
3. For local vector databases (e.g. `sqlite-vec`), ensure file permissions on the `.db` file are restricted to the local user account (`0600`).
