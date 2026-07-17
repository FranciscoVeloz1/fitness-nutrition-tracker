# FitTrack — Fitness & Nutrition Tracker

A premium, offline-first fitness and nutrition tracker. Log your daily meals,
diet adherence, workouts, and weight progress — all stored locally on your
device, no account or backend required.

![License](https://img.shields.io/badge/license-MIT-blue) ![Made with React](https://img.shields.io/badge/react-19-61dafb) ![Vite](https://img.shields.io/badge/vite-8-646cff)

## Features

- **Dashboard** — today's snapshot: weight change, diet adherence, workout status, streaks, weekly trend chart, and quick actions.
- **Daily Meals** — log up to five planned meals a day as followed, modified, or skipped, with notes and estimated calories. Adherence is computed automatically.
- **Workout** — log completion, type, category (cardio/strength/stretching/mixed/rest), duration, and intensity, with 30-day consistency stats.
- **Weight Tracking** — log weight, body fat %, muscle mass %, and waist. Charts for trend, highest/lowest, and progress toward a goal weight.
- **History** — a calendar view of every logged day; click any day to see its meals, workout, weight, and notes.
- **Analytics** — adherence trend, monthly comparison, and a GitHub-style contribution heatmap.
- **Settings** — customize meal names/times, goal weight, units (kg/lb), theme, and export/import/reset your data as JSON.
- **PWA** — installable, works offline, and caches the app shell via a service worker.
- **100% local** — all data lives in IndexedDB (with an automatic LocalStorage fallback) behind a storage abstraction, so a backend/cloud sync can be added later without touching UI code.

## Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Routing | React Router v7 |
| Forms & validation | React Hook Form + Zod |
| Data/cache layer | TanStack Query (wrapping the local storage layer) |
| UI state | Zustand |
| Animation | Framer Motion |
| Charts | Recharts |
| Dates | date-fns |
| Icons | Lucide |
| Persistence | IndexedDB (via `idb`), LocalStorage fallback |
| PWA | vite-plugin-pwa (Workbox) |

## Architecture

```
src/
├── components/     # Generic, reusable UI (common/, layout/, ui/ shadcn primitives)
├── features/       # Feature-scoped components (meals, workout, weight, dashboard, history, analytics, settings)
├── hooks/          # Reusable hooks (TanStack Query hooks, media queries, etc.)
├── lib/            # Query client, query key factory, shadcn `cn()` helper
├── pages/          # Route-level page components (lazy-loaded)
├── providers/      # App-wide providers (theme, query client, router, toaster)
├── routes/         # Route path constants, nav item config, router definition
├── services/       # Pure domain logic (adherence, streaks, statistics, backup, date/unit helpers)
├── state/          # Zustand stores for ephemeral UI state
├── storage/        # Storage abstraction: adapters (IndexedDB/LocalStorage), repositories, keys
├── styles/         # Global CSS (Tailwind layers, theme tokens, glassmorphism utilities)
└── types/          # Shared TypeScript domain models
```

**Storage abstraction.** All persistence goes through a `StorageAdapter`
interface (`get`/`set`/`delete`/`keys`/`clear`). `IndexedDbAdapter` is used
when available, falling back to `LocalStorageAdapter` otherwise. Repositories
(`SettingsRepository`, `DailyRecordsRepository`) sit on top of the adapter and
are the only place that knows the storage keys/shape. Because every feature
talks to repositories through domain services and TanStack Query hooks — never
directly to `indexedDB`/`localStorage` — swapping in a real backend later only
means changing the repository implementations.

**Data model.** Each calendar day is a single `DailyRecord` (`meals`,
`workout`, `weight`, `notes`), keyed by ISO date. `AppSettings` holds meal
templates, goal weight, units, and theme. See `src/types/` for the full
models.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone git@github.com:FranciscoVeloz1/fitness-nutrition-tracker.git
cd fitness-nutrition-tracker
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` (or the next free port) with hot
module reloading.

Other useful scripts:

```bash
npm run lint          # ESLint
npm run lint:fix      # ESLint with autofix
npm run format        # Prettier write
npm run format:check  # Prettier check
npm run typecheck     # tsc --noEmit
npm run build         # Production build (dist/)
npm run preview       # Preview the production build locally
```

### Data & Privacy

Fitness data is synced to **personal-api** under your account (`/api/v1/users/:userId/fitness/*`) after login. personal-api users have a global `role` (`READ_ONLY` | `ADMIN`); this app uses the same session for **self** fitness only and does not manage roles. Export/import from Settings still works for local JSON backups.

## Deployment (GitHub Pages via GitHub Actions)

This repo is already wired for zero-touch deployment:

- `vite.config.ts` sets `base: '/fitness-nutrition-tracker/'` to match the
  GitHub Pages project-site URL (`https://<user>.github.io/fitness-nutrition-tracker/`).
- `.github/workflows/deploy.yml` runs on every push to `main`: install →
  lint → typecheck → build → upload the `dist/` folder as a Pages artifact →
  deploy.
- Production API URL is injected at build time via the `VITE_API_BASE_URL`
  repository secret (not from `.env`). Locally, copy `.env.example` to `.env`
  and point at `http://localhost:3000`.

If you fork or rename this repo, update `base` in `vite.config.ts` (and the
`start_url`/`scope` in the PWA manifest inside the same file) to match the new
repo name.

### API URL for GitHub Pages

```bash
# One-time: set the production personal-api origin (no trailing slash)
gh secret set VITE_API_BASE_URL --body "https://YOUR-API.up.railway.app"
```

On `personal-api`, include the Pages origin in `CORS_ORIGINS`, e.g.
`https://franciscoveloz1.github.io`.

### One-time repository setup (already done for this repo, kept here for reference)

```bash
# Authenticate the GitHub CLI (skip if already logged in)
gh auth status || gh auth login

# From inside the project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create the GitHub repository and push in one step
gh repo create fitness-nutrition-tracker --public --source=. --remote=origin --push

# Enable GitHub Pages, served from GitHub Actions
gh api -X PUT "repos/:owner/fitness-nutrition-tracker/pages" \
  -f build_type=workflow \
  --silent || gh browser # if the API call needs Pages enabled via UI first time

# (Optional) confirm the Pages site
gh repo view --web
```

After the first successful run of the "Deploy to GitHub Pages" workflow, the
site is live at:

```
https://franciscoveloz1.github.io/fitness-nutrition-tracker/
```

## Using this project as a Git Submodule

This project is designed to live in its own repository and be consumed by a
parent workspace (like this one) as a **Git submodule**, rather than being
committed directly into the parent repo.

### Adding it to a workspace

From the root of the parent (workspace) repository:

```bash
git submodule add git@github.com:FranciscoVeloz1/fitness-nutrition-tracker.git repos/fitness-nutrition-tracker
git commit -m "Add fitness-nutrition-tracker as a submodule"
```

### Cloning a workspace that already includes it

```bash
git clone --recurse-submodules <parent-repo-url>
# or, if already cloned without submodules:
git submodule update --init --recursive
```

### Pulling upstream changes into the submodule

```bash
cd repos/fitness-nutrition-tracker
git pull origin main
cd ../..
git add repos/fitness-nutrition-tracker
git commit -m "Update fitness-nutrition-tracker submodule"
```

### Working on the submodule and pushing changes back

Because the submodule is a full independent Git repository, you can `cd`
into it and use normal `git add`/`commit`/`push` — the parent repo only
tracks *which commit* of the submodule it points to.

```bash
cd repos/fitness-nutrition-tracker
# make changes, then:
git add .
git commit -m "Some change"
git push origin main
cd ../..
git add repos/fitness-nutrition-tracker   # record the new submodule commit
git commit -m "Bump fitness-nutrition-tracker submodule"
```

## Roadmap / Extension Points

The architecture intentionally keeps room for growth without a rewrite:

- **Authentication** — add an `AuthProvider` in `src/providers/` and gate
  routes; storage adapters are already isolated from UI.
- **Cloud sync** — implement a `RemoteStorageAdapter` (e.g. REST or
  Supabase-backed) implementing the existing `StorageAdapter` interface, and
  swap it in `storage-provider.ts`. Repositories and hooks don't need to
  change.
- **Backend API** — TanStack Query hooks already treat local storage like a
  server; replacing repository calls with `fetch` calls is a drop-in swap.
- **PDF export / notifications** — hook points already exist in
  `src/services/backup.ts` and Settings for extending export formats and
  adding browser notifications for meal/workout reminders.

## License

MIT
