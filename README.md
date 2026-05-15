# BOQ Intelligence Dashboard

A static React + Vite dashboard for BOQ review, multi-project quotation intelligence, and owner-safe presentation pages.

## Local Development

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173`.

## Production Checks

```bash
npm.cmd run lint
npm.cmd run build
```

Vite writes the production output to `dist/`.

## Vercel Deployment

Recommended Vercel settings:

- Framework Preset: `Vite`
- Build Command: `npm.cmd run build` locally, or `npm run build` in Vercel
- Output Directory: `dist`
- Install Command: `npm install`

This repo includes `vercel.json` with an SPA rewrite to `index.html`, so direct refreshes on routes like `/owner/karun-phuket-old-town-rev01` work correctly after deployment.

## Owner Presentation Routes

Owner-safe pages are available at:

```text
/owner/:projectId
```

Example:

```text
/owner/karun-phuket-old-town-rev01
```

## Future Firebase Environment

Firebase is not implemented yet. `.env.example` reserves Vite client-side Firebase variables for future work:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Do not put Firebase Admin SDK credentials or service account keys in Vite environment variables.

## Static Data Import

New BOQ projects are currently added as static data in `src/data/projects.js`.

See:

- `docs/IMPORT_WORKFLOW.md`
- `src/data/importTemplate.json`
 
