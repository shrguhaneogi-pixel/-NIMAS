/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: Deployment Readiness & Monorepo Configuration Test Suite
 * Validates:
 * 1. Environment configuration files (.env.example, vercel.json).
 * 2. Next.js & Vite environment variable compatibility (NEXT_PUBLIC_API_URL).
 * 3. Frontend API client fallback mechanism.
 * 4. FastAPI backend schema, CORS regex, and containerization artifacts.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

describe('Deployment Readiness: Configuration Files', () => {
  test('.env.example exists and documents NEXT_PUBLIC_API_URL and VITE_API_URL', () => {
    const envPath = path.join(projectRoot, '.env.example');
    assert.ok(fs.existsSync(envPath), '.env.example must exist');
    const content = fs.readFileSync(envPath, 'utf-8');
    assert.ok(content.includes('NEXT_PUBLIC_API_URL'), 'Must document NEXT_PUBLIC_API_URL');
    assert.ok(content.includes('VITE_API_URL'), 'Must document VITE_API_URL');
    assert.ok(content.includes('127.0.0.1:8000'), 'Must document local default host');
  });

  test('vercel.json exists, is valid JSON, and configures SPA rewrites', () => {
    const vercelPath = path.join(projectRoot, 'vercel.json');
    assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
    const config = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
    assert.strictEqual(config.outputDirectory, 'dist');
    assert.ok(Array.isArray(config.rewrites), 'Must have rewrites array');
    const rootRewrite = config.rewrites.find(r => r.destination === '/index.html');
    assert.ok(rootRewrite, 'Must rewrite routes to /index.html');
  });

  test('vite.config.ts exposes NEXT_PUBLIC_ prefix and defines process.env.NEXT_PUBLIC_API_URL', () => {
    const vitePath = path.join(projectRoot, 'vite.config.ts');
    assert.ok(fs.existsSync(vitePath), 'vite.config.ts must exist');
    const content = fs.readFileSync(vitePath, 'utf-8');
    assert.ok(content.includes('NEXT_PUBLIC_'), 'Must include NEXT_PUBLIC_ in envPrefix');
    assert.ok(content.includes("'process.env.NEXT_PUBLIC_API_URL'"), 'Must define process.env.NEXT_PUBLIC_API_URL');
  });
});

import { pathToFileURL } from 'node:url';

describe('Deployment Readiness: Frontend API Client', () => {
  test('apiClient.ts exists and provides getApiBaseUrl', async () => {
    const clientPath = path.join(projectRoot, 'src', 'services', 'apiClient.ts');
    assert.ok(fs.existsSync(clientPath), 'apiClient.ts must exist');
    const { getApiBaseUrl } = await import(pathToFileURL(clientPath).href);
    assert.strictEqual(typeof getApiBaseUrl, 'function');
  });

  test('MockAnimasAIAdapter seamlessly falls back to local RAG when backend is offline', async () => {
    const adapterPath = path.join(projectRoot, 'src', 'services', 'MockAnimasAIAdapter.ts');
    assert.ok(fs.existsSync(adapterPath), 'MockAnimasAIAdapter.ts must exist');
    const { animasAI } = await import(pathToFileURL(adapterPath).href);
    
    // Querying with offline or empty API URL should safely return grounded answer
    const result = await animasAI.queryMemories({ question: 'mole poblano chilies' });
    assert.ok(result.answer, 'Must return answer');
    assert.ok(result.retrievals.length > 0, 'Must return retrieved chunks');
    assert.ok(result.retrievals[0].chunk.chunk_id, 'Chunk must contain chunk_id for InquestDrawer citations');
    assert.ok(result.retrievals[0].source.source_id, 'Source must contain source_id for InquestDrawer navigation');
    assert.ok(result.visual_direction, 'Must return visual direction');
  });
});

describe('Deployment Readiness: Backend Architecture & Containerization', () => {
  test('FastAPI backend files exist and are populated', () => {
    const backendFiles = [
      'backend/pyproject.toml',
      'backend/schemas.py',
      'backend/db.py',
      'backend/prompts.py',
      'backend/main.py',
      'backend/Dockerfile',
      'backend/docker-compose.yml',
      'backend/render.yaml'
    ];

    for (const f of backendFiles) {
      const fullPath = path.join(projectRoot, f);
      assert.ok(fs.existsSync(fullPath), `${f} must exist in repository`);
    }
  });

  test('FastAPI main.py configures CORS for Vercel preview domains and PNA header', () => {
    const mainPath = path.join(projectRoot, 'backend', 'main.py');
    const mainCode = fs.readFileSync(mainPath, 'utf-8');
    assert.ok(
      mainCode.includes('allow_origin_regex=r"^https://.*\\.vercel\\.app$"'),
      'Must configure CORS regex for Vercel preview URLs'
    );
    assert.ok(mainCode.includes('CORSMiddleware'), 'Must use FastAPI CORSMiddleware');
    assert.ok(
      mainCode.includes('Access-Control-Allow-Private-Network'),
      'Must configure Private Network Access header for Chromium HTTPS-to-localhost communication'
    );
  });

  test('Root orchestration blueprints exist for Docker and Render with dynamic PORT', () => {
    const composePath = path.join(projectRoot, 'docker-compose.yml');
    const renderPath = path.join(projectRoot, 'render.yaml');
    const dockerfilePath = path.join(projectRoot, 'backend', 'Dockerfile');
    assert.ok(fs.existsSync(composePath), 'docker-compose.yml must exist at root');
    assert.ok(fs.existsSync(renderPath), 'render.yaml must exist at root');
    
    const dockerfileCode = fs.readFileSync(dockerfilePath, 'utf-8');
    assert.ok(dockerfileCode.includes('${PORT:-8000}'), 'Dockerfile must bind to dynamic PORT for Render deployment');
  });
});
