/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda — Sovereign API Client
 * Connects the 3D frontend to the FastAPI backend (local or cloud container)
 * with graceful fallback to in-browser sovereign RAG simulation.
 */

/**
 * Resolves the configured backend API URL from Next.js (NEXT_PUBLIC_API_URL)
 * or Vite (VITE_API_URL) environment variables.
 */
export const getApiBaseUrl = (): string => {
  // 1. Vite client environment variable (configured via envPrefix in vite.config.ts)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const metaEnv = (import.meta as any).env;
    if (metaEnv.NEXT_PUBLIC_API_URL) {
      return String(metaEnv.NEXT_PUBLIC_API_URL).replace(/\/$/, '');
    }
    if (metaEnv.VITE_API_URL) {
      return String(metaEnv.VITE_API_URL).replace(/\/$/, '');
    }
  }

  // 2. Next.js / Node process environment variable / Vite define static replacement
  try {
    if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
      return String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '');
    }
  } catch {
    // Non-node runtime safety
  }

  // 3. Fallback to default local backend daemon host (Option A BYO-Local)
  return 'http://127.0.0.1:8000';
};

/**
 * Checks if the backend API is reachable within a strict timeout.
 */
export const checkBackendHealth = async (timeoutMs: number = 2000): Promise<boolean> => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
};
