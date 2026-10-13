# Deploying PRIA

| Part | Where | Folder |
|---|---|---|
| Portal (Next.js) | Vercel | repository root |
| API (Node + Hono) | Railway | `backend/` |
| Content storage | Cloudflare R2 | one JSON document |

No database is needed. All editable content (sub-section recommendations, the two province/region
tables and the four summary pages) is one small JSON document that the API stores in a private
R2 bucket. Everything else stays in `src/data/pria.ts`.

```
Browser ──► Vercel (Next.js, static + ISR) ──server-side fetch──► Railway API ──► Cloudflare R2
                     ▲                                               │
                     └──── POST /api/revalidate (after each write) ──┘
```

- Pages are static. They re-check the API every `CONTENT_REVALIDATE_SECONDS` and refresh
  immediately when the API calls `/api/revalidate` after a write.
- If the API is unreachable during a Vercel build, the portal builds with the local content.
  If it is unreachable later, visitors keep seeing the last good version.

---

## 1. Push the project to GitHub

Vercel and Railway both deploy from a Git repository.

```bash
cd PRIA
git init
git add .
git commit -m "PRIA portal and API"
git branch -M main
git remote add origin https://github.com/<you>/pria.git
git push -u origin main
```

`.env`, `.env.local`, `backend/.env` and `backend/data` are gitignored. Never commit secrets.

## 2. Generate two secrets

```bash
openssl rand -hex 32   # ADMIN_API_KEY      (Railway only)
openssl rand -hex 32   # REVALIDATE_SECRET  (same value on Railway and Vercel)
```

PowerShell alternative:

```powershell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
```

## 3. Cloudflare R2

1. Cloudflare dashboard → **R2 Object Storage** → enable R2 if prompted.
2. **Create bucket** → name `pria-content` → location Automatic → Create. Leave public access **off**.
3. Copy your **Account ID** (R2 overview page, right side).
4. R2 → **Manage API tokens** → **Create API token**:
   - Permissions: **Object Read & Write**
   - Specify bucket: `pria-content`
   - Create, then copy the **Access Key ID** and **Secret Access Key** (shown once).

You do not need to upload anything; the API creates `content/pria-content.json` on the first write.

## 4. Railway (API)

1. railway.com → **New Project** → **Deploy from GitHub repo** → pick the repository.
2. Open the service → **Settings**:
   - **Source → Root Directory**: `/backend`
   - **Config-as-code → Railway Config File**: `/backend/railway.json`
     (sets build `npm run build`, start `npm start`, health check `/health`)
3. **Variables** → add:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `ADMIN_API_KEY` | secret from step 2 |
   | `STORAGE_DRIVER` | `r2` |
   | `R2_ACCOUNT_ID` | from step 3 |
   | `R2_ACCESS_KEY_ID` | from step 3 |
   | `R2_SECRET_ACCESS_KEY` | from step 3 |
   | `R2_BUCKET` | `pria-content` |
   | `R2_OBJECT_KEY` | `content/pria-content.json` |
   | `CORS_ORIGINS` | `https://<your-project>.vercel.app` (fill in after step 5; comma-separate several) |
   | `REVALIDATE_SECRET` | secret from step 2 |
   | `FRONTEND_REVALIDATE_URL` | leave empty until step 6 |

   Do **not** set `PORT`; Railway provides it.
4. **Settings → Networking → Generate Domain**. You get e.g. `https://pria-api-production.up.railway.app`.
5. Check it: open `https://<railway-domain>/health` → `{"ok":true,"storage":"r2"}`.
   `"ok":false` means the R2 credentials or bucket name are wrong (see the deploy logs).

## 5. Vercel (portal)

1. vercel.com → **Add New → Project** → import the repository.
2. Framework preset **Next.js** (auto-detected). Root Directory: `./` (repository root).
   Build/Output settings: leave defaults.
3. **Environment Variables** (Production, and Preview if you use previews):

   | Variable | Value |
   |---|---|
   | `PRIA_API_URL` | `https://<railway-domain>` (no trailing slash) |
   | `REVALIDATE_SECRET` | same value as on Railway |
   | `CONTENT_REVALIDATE_SECONDS` | `300` (optional) |

4. **Deploy**. Your site is at `https://<your-project>.vercel.app`.
5. Add the logo: put `ndma-logo.png` in `public/`, commit and push (Vercel redeploys automatically).

## 6. Connect instant refresh

Back in Railway → Variables:

- `FRONTEND_REVALIDATE_URL` = `https://<your-project>.vercel.app/api/revalidate`
- `CORS_ORIGINS` = `https://<your-project>.vercel.app` (plus any custom domain)

Railway redeploys. Every successful write now returns `"revalidation":{"status":"ok"}` and the
portal shows the change within a few seconds.

If you add a custom domain on Vercel, update both `FRONTEND_REVALIDATE_URL` and `CORS_ORIGINS`.

---

## Managing content

Read access is public. Writes need `Authorization: Bearer <ADMIN_API_KEY>`.
`GET /api/structure` lists every valid segment, category, sub-section, table, region and column id.

| Method | Path | Body |
|---|---|---|
| `GET` | `/health` | — |
| `GET` | `/api/structure` | — |
| `GET` | `/api/content` | — |
| `PUT` | `/api/recommendations/:segment/:category/:subSection` | `{ "items": [{ "id", "title", "description?", "tags?" }] }` (empty array clears it) |
| `PUT` | `/api/tables/:tableId` | `{ "rows": { "<Region>": { "<columnId>": "value" or null } } }` (merges cells) |
| `PUT` | `/api/summary/:id` | `{ "paragraphs": ["..."] }` (empty array clears it) |
| `PUT` | `/api/content` | the full document (replaces everything; `{"version":1}` resets all) |

Examples (bash / macOS / Git Bash):

```bash
API=https://<railway-domain>
KEY=<ADMIN_API_KEY>

# Add recommendations to Segment 1 → Residential → Material Options
curl -X PUT "$API/api/recommendations/mountain/residential/material-options" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"items":[{"id":"m-1","title":"Recommendation title","description":"Details","tags":["materials"]}]}'

# Fill table cells
curl -X PUT "$API/api/tables/province-breakdown" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"rows":{"Punjab":{"residential-urban":"…","residential-rural":"…"}}}'

# Publish a summary page
curl -X PUT "$API/api/summary/ndma-role" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"paragraphs":["First paragraph.","Second paragraph."]}'

# Back up all content
curl "$API/api/content" -o pria-content-backup.json
```

PowerShell (Windows):

```powershell
$API = "https://<railway-domain>"; $KEY = "<ADMIN_API_KEY>"
$body = @{ paragraphs = @("First paragraph.", "Second paragraph.") } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$API/api/summary/ndma-role" `
  -Headers @{ Authorization = "Bearer $KEY" } -ContentType "application/json" -Body $body
```

When a sub-section has items, its "Content Pending" state is replaced automatically. The same
applies to tables (once any cell has a value) and summary pages (once they have paragraphs).

Content is limited to 200 items per sub-section and 1 MB per request. Writes are applied one at a
time within the API instance; keep the Railway service at **1 replica** so concurrent edits can't
overwrite each other.

---

## Local development

```bash
# API
cd backend
cp .env.example .env          # STORAGE_DRIVER=file stores content in backend/data/
# set ADMIN_API_KEY (24+ chars); optionally REVALIDATE_SECRET + FRONTEND_REVALIDATE_URL=http://localhost:3000/api/revalidate
npm install
npm run dev                   # http://localhost:4000

# Portal (second terminal, repository root)
cp .env.example .env.local    # PRIA_API_URL=http://localhost:4000, same REVALIDATE_SECRET
npm install
npm run dev                   # http://localhost:3000
```

Leave `PRIA_API_URL` empty to run the portal on local content only.
In `npm run dev`, a stopped API makes content pages error; production builds fall back instead.

---

## Environment reference

### Vercel (portal)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PRIA_API_URL` | no | — | Railway API base URL. Empty = local content only. |
| `REVALIDATE_SECRET` | for instant refresh | — | Authorises `POST /api/revalidate`. Must match Railway. |
| `CONTENT_REVALIDATE_SECONDS` | no | `300` | Background re-check interval for content pages. |

### Railway (API)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | Set to `production`. |
| `PORT` | auto | `4000` | Injected by Railway. |
| `ADMIN_API_KEY` | for writes | — | Bearer token (24+ chars). Without it, writes return 503. |
| `CORS_ORIGINS` | no | `http://localhost:3000` | Comma-separated browser origins. |
| `STORAGE_DRIVER` | yes | `file` | `r2` on Railway. `file` is for local use (Railway's disk resets on deploy). |
| `R2_ACCOUNT_ID` | with r2 | — | Cloudflare account id. |
| `R2_ACCESS_KEY_ID` | with r2 | — | R2 API token access key. |
| `R2_SECRET_ACCESS_KEY` | with r2 | — | R2 API token secret. |
| `R2_BUCKET` | with r2 | — | e.g. `pria-content`. |
| `R2_OBJECT_KEY` | no | `content/pria-content.json` | Object path of the content document. |
| `CACHE_TTL_SECONDS` | no | `30` | In-memory cache for public reads. |
| `FRONTEND_REVALIDATE_URL` | for instant refresh | — | `https://<vercel-domain>/api/revalidate`. |
| `REVALIDATE_SECRET` | with the URL above | — | Must match Vercel. |
| `DATA_FILE` | no | `./data/pria-content.json` | Only used with `STORAGE_DRIVER=file`. |

The API refuses to start if required variables are missing and prints which ones.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Railway deploy fails on "Invalid environment configuration" | The log lists the missing variables; add them. |
| `/health` returns `"ok":false` | Wrong R2 account id, keys or bucket name, or the token isn't scoped to that bucket. |
| Write returns 401 | `Authorization: Bearer <ADMIN_API_KEY>` missing or wrong. |
| Write returns 404 / 400 | Unknown id; check `GET /api/structure`. |
| Write returns `"revalidation":{"status":"failed"}` | Content is saved. Check `FRONTEND_REVALIDATE_URL` and that `REVALIDATE_SECRET` matches on both sides. Pages still refresh within `CONTENT_REVALIDATE_SECONDS`. |
| Railway can't find the build | Root Directory must be `/backend` and the config file path `/backend/railway.json`. |
| Vercel build logs "Content API unavailable" | Harmless: it built with local content. Check `PRIA_API_URL`, then redeploy or wait for revalidation. |
