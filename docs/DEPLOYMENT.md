# ÁNIMAS: Deployment & Production Architecture Guide

## 1. Overview & Architecture

Ánimas is architected as a **sovereign, local-first 3D digital memorial**. To deploy to the cloud while maintaining local-first privacy guarantees, Ánimas employs a **Hybrid Monorepo Deployment Architecture**:

```
 ┌──────────────────────────────────────────────────────────────┐
 │                      Vercel Edge Network                     │
 │          https://animas-sovereign-ofrenda.vercel.app         │
 │                                                              │
 │   • Vite 8 + React 19 Client-Side SPA                       │
 │   • Three.js + R3F 3D Ofrenda Altar                         │
 │   • 16-Bit Pixel-Art UI with Zero Backdrop-Blur Churn        │
 │   • In-Browser Fallback BM25 RAG Engine (Zero Cloud Egress)  │
 └───────────────────────────────┬──────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼ (Default / Sovereign)         ▼ (Optional Remote Hosting)
   ┌───────────────────────────┐   ┌───────────────────────────┐
   │    Option A: BYO-Local    │   │ Option B: Cloud Container │
   │   http://127.0.0.1:8000   │   │  (Render / Railway / OCI) │
   │                           │   │                           │
   │ • FastAPI Daemon          │   │ • Docker Container        │
   │ • Local Gemma 2B / 9B     │   │ • Persistent Volume Mount │
   │ • sqlite-vec Local Store  │   │ • Dynamic ${PORT:-8000}   │
   │ • Chromium PNA Compliant  │   │ • CORS for *.vercel.app   │
   └───────────────────────────┘   └───────────────────────────┘
```

---

## 2. Frontend Deployment (Vercel)

The frontend is configured via `vercel.json` with SPA routing and asset caching headers.

### A. Deploy via Git (Recommended)

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat(deploy): configure Vercel SPA and containerized FastAPI backend"
   git push origin main
   ```
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects the Vite framework with:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. *(Optional)* In Project Settings > Environment Variables, add:
   - `NEXT_PUBLIC_API_URL`: `https://animas-api.onrender.com` (leave unset to default to `http://127.0.0.1:8000` for local daemon or in-browser sovereign RAG).

### B. Deploy via Vercel CLI

If you have the Vercel CLI authenticated locally:
```bash
# Preview Deployment
npx vercel

# Production Deployment
npx vercel --prod
```

---

## 3. Backend Deployment Options

The Python backend is located in [`backend/`](file:///c:/Users/Dell/OneDrive/Desktop/Project/-NIMAS/backend).

### Option A: BYO-Local (Bring Your Own Local Daemon)

This mode preserves 100% of the sovereign zero-cloud privacy architecture. The deployed Vercel HTTPS frontend communicates directly with the user's local hardware over loopback.

> [!NOTE]
> Modern Chromium browsers enforce **Private Network Access (PNA)**, which blocks public HTTPS websites from accessing `127.0.0.1` unless the server explicitly responds with `Access-Control-Allow-Private-Network: true`. Ánimas includes built-in PNA middleware in [`backend/main.py`](file:///c:/Users/Dell/OneDrive/Desktop/Project/-NIMAS/backend/main.py) to ensure this works out of the box.

**Run the local backend daemon:**
```bash
cd backend
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

### Option B: Cloud Container Deployment on Render

A pre-configured [`render.yaml`](file:///c:/Users/Dell/OneDrive/Desktop/Project/-NIMAS/render.yaml) blueprint is included in the project root.

1. Navigate to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your Ánimas GitHub repository.
4. Render will parse `render.yaml` and spin up the Dockerized FastAPI service with:
   - Runtime: Docker (`backend/Dockerfile`)
   - Healthcheck: `/health`
   - CORS origin: Allowed for `https://*.vercel.app`
   - Dynamic port binding: Uses `${PORT:-8000}`

---

### Option C: Docker / Docker Compose

To run the containerized backend locally or on a virtual private server (VPS):

```bash
# Build and run the backend container
docker compose up -d

# Check logs
docker compose logs -f api

# Verify health status
curl http://localhost:8000/health
```

The Docker setup uses a persistent volume (`animas-data:/app/data`) to retain memory embeddings across container rebuilds.

---

## 4. Verification & Testing

Ánimas includes a native zero-dependency Node test harness and Python integration tests:

```bash
# Run all 6 frontend & deployment test suites (69 tests)
npm test

# Run backend integration tests
python tests/test_backend_integration.py
```
