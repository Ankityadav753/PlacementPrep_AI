# PlacementPrep AI — Production Deployment & Operations Guide

This guide provides step-by-step instructions for deploying the **PlacementPrep AI** platform to production using a secure, modern cloud architecture.

---

## 1. Production Architecture Overview

```
┌─────────────────────────────────┐
│     Client (React + Vite)       │
│  Hosted on Vercel / Netlify     │
│  Build Output: client/dist      │
└────────────────┬────────────────┘
                 │ HTTPS (REST API)
                 ▼
┌─────────────────────────────────┐
│     Server (Express / Node)     │
│       Hosted on Render          │
│       Port: process.env.PORT    │
└────────┬───────────────┬────────┘
         │               │
         ▼               ▼
┌─────────────────┐  ┌───────────────────────────────────┐
│  MongoDB Atlas  │  │  External Sandboxes & AI Providers│
│  Cloud Database │  │  • Judge0 (Code Execution Sandbox)│
│  (TLS Required) │  │  • OpenAI / LLM Endpoint          │
└─────────────────┘  └───────────────────────────────────┘
```

---

## 2. Environment Variables Specification

### Backend Server Environment Variables (`server`)
Configure these variables in your hosting provider's dashboard (e.g., Render Environment Settings):

| Variable Name | Required | Description | Example / Default |
|---|---|---|---|
| `NODE_ENV` | **Yes** | Runtime mode. Must be set to `production`. | `production` |
| `PORT` | Auto | Assigned automatically by hosting platform. | `5000` or `$PORT` |
| `MONGODB_URI` | **Yes** | Authenticated MongoDB Atlas connection string with TLS. | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/placementprep_ai?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | Cryptographically secure random secret (min 32 bytes). | *(Generate using command below)* |
| `JWT_EXPIRES_IN` | No | JWT lifespan. | `7d` |
| `CLIENT_URL` | **Yes** | Production frontend URL(s) for CORS validation (comma-separated if multiple). | `https://placementprep-ai.vercel.app` |
| `JUDGE0_BASE_URL` | No | Judge0 CE API base endpoint. | `https://judge0-ce.p.rapidapi.com` |
| `JUDGE0_API_KEY` | Optional | RapidAPI key for Judge0 cloud execution. | *(Your RapidAPI key)* |
| `AI_API_KEY` | Optional | OpenAI / LLM API key for AI evaluations. | *(Your AI provider key)* |
| `AI_BASE_URL` | No | LLM API base URL. | `https://api.openai.com/v1` |
| `AI_MODEL` | No | Model name for mock interview and review. | `gpt-4o-mini` |

> **To generate a secure JWT secret locally, run:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Frontend Client Environment Variables (`client`)
Configure this variable in Vercel or Netlify Project Settings:

| Variable Name | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | Full production URL to backend API. | `https://placementprep-ai-server.onrender.com/api` |

---

## 3. Database Setup: MongoDB Atlas

1. **Create Cluster**:
   - Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free (M0) or production shared cluster in your preferred cloud region.
2. **Create Database User**:
   - Navigate to **Database Access** → **Add New Database User**.
   - Select **Password** authentication.
   - Grant role: `readWrite` on `placementprep_ai` database.
3. **Configure Network Access**:
   - Navigate to **Network Access** → **Add IP Address**.
   - Add `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Render's dynamic IP ranges, or configure dedicated VPC peering.
4. **Copy Connection String**:
   - Go to **Database Deployments** → Click **Connect** → **Drivers** (Node.js).
   - Copy the URI and replace `<password>` with your database user's password.
   - Example: `mongodb+srv://app_user:YourSecurePassword@cluster0.mongodb.net/placementprep_ai?retryWrites=true&w=majority`.

---

## 4. Backend Deployment: Render

You can deploy using the provided [`render.yaml`](file:///c:/Users/ankit/Desktop/PlacementPrep_AI/render.yaml) blueprint or manually:

### Option A: Manual Setup on Render
1. Log in to [Render](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your Git repository.
4. Set the following build settings:
   - **Name**: `placementprep-ai-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<your-atlas-connection-string>`
   - `JWT_SECRET` = `<generated-32-byte-hex-string>`
   - `CLIENT_URL` = `<your-frontend-vercel-url>`
   - `JUDGE0_API_KEY` = `<your-rapidapi-key>` *(optional)*
   - `AI_API_KEY` = `<your-openai-key>` *(optional)*
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g., `https://placementprep-ai-server.onrender.com`).

---

## 5. Frontend Deployment: Vercel / Netlify

### Deploying to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project** and select your repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://placementprep-ai-server.onrender.com/api` *(Your Render backend URL with `/api` suffix)*
5. Click **Deploy**.
6. The repository includes [`client/vercel.json`](file:///c:/Users/ankit/Desktop/PlacementPrep_AI/client/vercel.json) ensuring seamless client-side SPA routing on refresh.

### Deploying to Netlify
1. Log in to [Netlify](https://netlify.com) → **Add new site** → **Import an existing project**.
2. Select your repository.
3. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
4. Under **Environment Variables**:
   - `VITE_API_URL` = `https://placementprep-ai-server.onrender.com/api`
5. Click **Deploy Site**.
6. The repository includes [`client/public/_redirects`](file:///c:/Users/ankit/Desktop/PlacementPrep_AI/client/public/_redirects) for client-side routing.

---

## 6. Post-Deployment Verification Checklist

Once both services are deployed, perform these verification steps:

- [ ] **Health Probe**:
  Open `https://<your-backend-domain>/api/health` in your browser. Verify it returns HTTP 200 with `database: "connected"`.
- [ ] **HTTPS Verification**:
  Verify both frontend and backend enforce HTTPS without mixed-content warnings.
- [ ] **Registration & Session**:
  Register a new test candidate on the production frontend. Verify JWT persistence in localStorage and automatic redirection to `/dashboard`.
- [ ] **Direct Route Navigation**:
  Refresh the browser on `/dashboard`, `/coding-round`, `/history`. Verify no 404 error occurs (verifies SPA rewrite rules).
- [ ] **Cross-User Protection**:
  Verify unauthenticated requests to `/api/analytics/overview` or `/api/coding/start` receive HTTP 401.
- [ ] **Resume Analyzer Flow**:
  Upload a test PDF resume. Verify ATS scorecard, skills chips, and suggestions generate cleanly.
- [ ] **Coding Assessment Flow**:
  Start a timed coding session. Verify questions load, timer runs, and sample execution functions properly.
- [ ] **AI Mock Interview Flow**:
  Select a role track, submit an answer, and verify scorecard generation.
- [ ] **History & Analytics**:
  Inspect the history dashboard and verify metrics reflect real database records.

---

## 7. Security & Maintenance Best Practices

1. **Secrets Hygiene**:
   Never commit `.env` files. Verify `git status` ignores `.env` files.
2. **CORS Defense**:
   Update `CLIENT_URL` on the backend whenever your frontend custom domain changes.
3. **Database Backups**:
   Enable daily automated snapshots in MongoDB Atlas.
4. **Log Privacy**:
   Server logs never record user passwords, raw tokens, or parsed resume text.
