# Xabarchi — SMS platform frontend (MVP)

Xabarchi ("herald" in Uzbek) turns your own Android phones into an SMS gateway for your business.
This repository is the **frontend MVP**: a marketing website plus a complete dashboard experience,
running entirely on **mock data** — no backend required.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (tsc + vite)
```

Sign in with **any email** and a **6+ character password** (mock auth, persisted in localStorage).

## What's inside

| Area | Routes |
|---|---|
| Marketing | `/` home, `/pricing`, `/faq`, `/docs` (public API docs) |
| Auth (mock) | `/login`, `/register`, `/forgot-password` |
| Dashboard | `/app` overview, `/app/sms` history, `/app/sms/new` compose, `/app/devices`, `/app/contacts`, `/app/templates`, `/app/analytics`, `/app/api` keys+webhook, `/app/billing`, `/app/settings`, `/app/profile`, `/app/notifications`, `/app/help` |

- **i18n**: 🇺🇿 Uzbek (default) · 🇷🇺 Russian · 🇬🇧 English — polished switcher, per-feature dictionaries.
- **Theming**: light / dark / system with an animated circular-reveal transition (View Transitions API,
  falls back gracefully; respects `prefers-reduced-motion`).
- **States**: every data surface has designed loading (shimmer skeletons), empty, success and error states.
- **Charts**: Recharts with a CVD-validated palette per theme, tooltips, and a table view for accessibility.

## Architecture

Feature-based clean architecture. The UI never talks to data directly — it goes through feature
repositories that sit on a simulated transport, so a real backend can be plugged in without touching
any component.

```
src/
  app/                    # composition root
    layouts/              # Marketing / Auth / Dashboard shells
    providers.tsx         # Theme → I18n → Toast
    router.tsx            # lazy routes + auth guard
  pages/                  # route components (marketing, auth, dashboard)
  features/               # vertical slices
    auth/model/           # mock session store
    sms/api/              # fetchMessages, sendSms (status progression on timers)
    devices/api/          # fetch/pair/remove/setDefault
    contacts/api/         # CRUD
    templates/api/        # CRUD + {variable} extraction
    dashboard/api/        # overview aggregates
    notifications/model/  # shared read/unread store
  shared/
    ui/                   # design system (Button, Field, Modal, Toast, Tabs, …)
    charts/               # validated chart palettes + tooltip card
    i18n/                 # language context + common vocabulary
    theme/                # ThemeProvider with animated transition
    api/mockClient.ts     # simulate(): latency + optional failures — swap point for real HTTP
    mock/                 # domain types + seeded realistic dataset
    lib/                  # cn, formatters (uz/ru/en dates, phones, SMS segments), hooks
```

**Swapping in a real backend:** replace the bodies of `features/*/api/repository.ts` with HTTP calls
(the `simulate()` wrapper marks every seam) and keep the return types from `shared/mock/types.ts`
as the API contracts. Nothing else changes.

## Design system

- **Palette**: *kok* turquoise `#0E9488` (Samarkand tile blue) on cool paper white; deep blue-green ink;
  apricot-gold reserved for warnings. Dark mode is a deep blue-green ink, not gray.
- **Type**: Unbounded (display), Golos Text (body — full Cyrillic), JetBrains Mono (numbers, phones, code).
- **Signature motif**: the *dispatch path* — a dashed line with a traveling pulse and delivery ticks
  (queued → sent → delivered), used in the hero, loaders, empty states and the 404.
- **Motion**: spring-based micro-interactions (Motion), 60fps transform/opacity only, all gated behind
  `prefers-reduced-motion`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · React Router 7 · Recharts · lucide-react
