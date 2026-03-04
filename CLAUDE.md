# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal quit-vaping PWA (Progressive Web App) built with React, Vite, and Tailwind CSS. It uses a nicotine patch taper strategy with:
- Local-first data storage (localStorage) with optional cloud sync via Neon Postgres
- PWA capabilities with service worker for offline support
- Web Push API for medication reminders
- Simple password protection

## Development Commands

```bash
# Start dev server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# TypeScript check (part of build)
tsc -b
```

## Architecture

### Data Flow & State Management

The app uses a hybrid local-first approach with optional cloud sync:

1. **Primary State Hook**: `useLocalStorage()` in `src/hooks/useLocalStorage.ts`
   - On load: Tries to fetch from API (`/api/data`), falls back to localStorage
   - On change: Saves to localStorage immediately, debounced API sync (1s)
   - Centralizes all state updates via `updateData()` and `addCraving()`
   - Exposes `syncStatus` ('idle', 'loading', 'syncing', 'synced', 'error')

2. **Derived State Hooks**:
   - `usePhases()`: Computes current phase from dates using `dateUtils.ts`
   - `useCravings()`: Manages craving timer state and quick logging
   - `useReminders()`: Handles notification permissions and scheduling

### API Layer

Serverless API functions in `api/data/` (Vercel-compatible):
- `get.js`: Fetches app_data row from Neon Postgres
- `post.js`: Updates app_data row with JSON data

**Environment Variables**:
- `DATABASE_URL`: Neon Postgres connection string
- `API_KEY`: Optional API authentication header (`x-api-key`)

### Phase Logic

Phases are computed (not stored) from date configurations in `src/utils/dateUtils.ts`:
- Pre-quit: `startDate` to `quitDate`
- 21mg Patch: `quitDate` to `phase21End`
- 14mg Patch: `phase21End` to `phase14End`
- 7mg Patch: `phase14End` to `phase7End`
- Nicotine Free: `phase7End` onward (or `nicotineFreeDate`)

The `getCurrentPhase()` function returns the current phase based on today's date.

### Component Structure

```
src/components/
├── auth/          # Password protection
├── common/        # Navigation, PWA prompts, sync status
├── craving/       # Timer, breathing guide, result logging
├── dashboard/     # Main dashboard views
├── medication/    # Patch reminders and dose indicator
├── progress/      # Charts and milestones
└── settings/      # Date editor, password change, data reset
```

### PWA Configuration

- **Manifest**: `public/manifest.json`
- **Service Worker**: `public/sw.js` (caches GET requests only, skips API routes)
- **Registration**: `src/registerSW.ts`

The service worker handles:
- App shell caching for offline use
- Message-based notification scheduling
- Notification click handling

### Important Patterns

1. **Data Merging**: When fetching from API, data is merged with defaults to handle schema changes safely (see `useLocalStorage.ts:22-44`)

2. **Craving Logging**: Always use `addCraving()` from `useLocalStorage()` - it updates React state, which triggers re-renders and API sync

3. **Date Handling**: Use `parseLocalDate()` from `dateUtils.ts` for user-facing dates (treats ISO dates as local, not UTC)

4. **TypeScript Path Aliases**: `@/*` maps to `./src/*`

### Database Schema

Single-row table (`app_data`) with JSONB column:
- See `docs/schema.sql` for full schema
- Includes default data with dates, reminders, cravings arrays
- Auto-updates `updated_at` timestamp via trigger

### Deployment

- **Platform**: Vercel (see `vercel.json`)
- **Build Output**: `dist/` directory
- **Setup**: See `docs/SETUP.md` for Neon database setup
