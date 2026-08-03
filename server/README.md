# GGRC Payment Receipt Downloader Service

A lightweight Express service powered by Playwright to automate PDF download of payment receipts from the GGRC website.

## Prerequisites

- Node.js (v18+)
- Playwright browsers (if not running inside Docker)

## Local Development

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file (based on `.env.example`):
   ```env
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   GGRC_URL=https://portal.ggrc.co.in/PaymentPortal/MISPayment.aspx
   REQUEST_TIMEOUT_MS=60000
   BULLSEYE_PLAYWRIGHT_HEADLESS=true
   ```

4. Install Playwright browser binaries:
   ```bash
   npx playwright install chromium
   ```

5. Run in dev mode (hot reload):
   ```bash
   npm run dev
   ```

## Production Build & Run

```bash
npm run build
npm start
```

## Deployment on Render

This service can be deployed on Render as a **Web Service** using Docker.

1. **Service Type**: Web Service
2. **Environment**: Docker (Render will automatically detect the `Dockerfile` inside the root or specified folder)
3. **Docker Build Context**: If deploying in a monorepo structure, set:
   - Build Context: `server`
   - Dockerfile Path: `server/Dockerfile`
4. **Environment Variables**:
   - `PORT`: `3001`
   - `CORS_ORIGIN`: URL of your frontend static site (e.g. `https://your-frontend.onrender.com`)
   - `BULLSEYE_PLAYWRIGHT_HEADLESS`: `true`
