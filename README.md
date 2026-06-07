# SenimdiQAdam — Frontend

An inclusive web platform for people with disabilities in Almaty, Kazakhstan. Provides a verified organization catalog, an AI consultant (Senim), InvaTaxi booking, news, guides, community tools, and an admin panel — fully bilingual in Kazakh and Russian.

> Diploma project, 2026.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | Vue 3 (Composition API, `<script setup>`) | ^3.5 |
| Build Tool | Vite | ^8.0 |
| State Management | Pinia | ^3.0 |
| Routing | Vue Router 4 (Hash history) | ^4.6 |
| Utilities | VueUse | ^14.2 |
| i18n | Custom lightweight (`src/i18n.js`) | — |
| HTTP | Fetch-based client with auto token refresh | — |
| Real-time | Browser WebSocket | — |
| Static Files | MinIO via `VITE_STATIC_URL` | — |

No third-party UI library is used — all components are written from scratch with CSS Custom Properties (design tokens).

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

---

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment variables (see section below)
cp .env.example .env

# Start development server (http://localhost:5173)
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend REST API base URL — all API calls are relative to this
VITE_API_URL=http://49.12.34.124:3000/api

# WebSocket server URL — used for InvaTaxi real-time chat
VITE_WS_URL=http://49.12.34.124:3000

# Static file server — avatars and news images via MinIO
VITE_STATIC_URL=http://49.12.34.124:3000
```

All variables are prefixed `VITE_` and are inlined at build time by Vite.

---

## Project Structure

```
src/
├── api/                       # HTTP layer — one file per domain
│   ├── apiClient.js           # Central fetch wrapper: auth headers, 401 refresh, URL helpers
│   ├── auth.js                # Login, register, logout, getMe, OAuth
│   ├── organizations.js       # Org catalog, geo-search, save/unsave, reviews
│   ├── news.js                # News list, detail, likes, comments
│   ├── guides.js              # Guides, categories, likes
│   ├── ai.js                  # AI assistant (Senim) chat, sessions, STT, TTS, emergency
│   ├── taxi.js                # InvaTaxi orders, chat, drivers, manager panel
│   ├── tickets.js             # Support tickets
│   ├── complaints.js          # Complaints
│   └── profile.js             # GET / PATCH current user profile, avatar, geo
│
├── stores/                    # Pinia stores
│   ├── auth.js                # User, tokens, savedOrgs, savedChats
│   ├── accessibility.js       # Font size, high-contrast, language, TTS
│   └── search.js              # Global search query state
│
├── views/                     # Route-level page components
│   ├── HomeView.vue           # Hero carousel, org preview, latest news, AI prompt
│   ├── OrganizationsView.vue  # Filterable org catalog with geo-search
│   ├── NewsView.vue           # News feed with pagination
│   ├── NewsDetailView.vue     # Article + likes + comments
│   ├── GuidesView.vue         # Guides list and detail
│   ├── AIAssistantView.vue    # Senim AI chat with session history
│   ├── InvaTaxiView.vue       # Order + my rides + driver list + manager panel
│   ├── ProfileView.vue        # Account: profile, favorites, requests, relative links
│   ├── LoginView.vue          # Email/password login + Google OAuth callback handler
│   ├── RegisterView.vue       # 3-step registration
│   ├── CommunityView.vue      # Community section
│   ├── HelpView.vue           # Platform help
│   ├── PlaceholderView.vue    # Stub for upcoming features
│   └── admin/
│       ├── AdminLayout.vue    # Sidebar layout for admin section
│       ├── AdminDashboard.vue # Overview metrics
│       ├── AdminOrgs.vue      # Create / edit / verify / delete organizations
│       ├── AdminNews.vue      # Create and manage news articles
│       ├── AdminUsers.vue     # List and manage user accounts
│       └── AdminTaxi.vue      # InvaTaxi drivers and orders management
│
├── components/                # Shared UI components
│   ├── AppHeader.vue          # Top bar: search, profile menu, accessibility toggle
│   ├── AppNavbar.vue          # Bottom navigation bar
│   ├── AppFooter.vue          # Footer with contact info
│   ├── AccessibilityPanel.vue # Font size, high-contrast, language, voice reader
│   ├── OrganizationCard.vue   # Organization card in catalog
│   └── OrgModal.vue           # Organization detail modal
│
├── mock/                      # Static JSON test data (used by mock API layer)
│   ├── organizations.json
│   ├── news.json
│   ├── guides.json
│   ├── taxi.json
│   └── community.json
│
├── router/index.js            # All routes, hash history, admin route guard
├── i18n.js                    # Translation strings (kaz / rus)
├── main.js                    # App entry point
├── App.vue                    # Root component
└── style.css                  # Global styles and design tokens
```

---

## Routing

The app uses **hash history** (`/#/path`) for static-hosting compatibility — no server-side SPA fallback configuration needed.

| Path | View | Notes |
|---|---|---|
| `/` | HomeView | |
| `/services/organizations` | OrganizationsView | |
| `/services/ai` | AIAssistantView | |
| `/services/accessibility-map` | Placeholder | Upcoming |
| `/services/jobs` | Placeholder | Upcoming |
| `/services/documents` | Placeholder | Upcoming |
| `/projects/community` | CommunityView | |
| `/projects/forums` | Placeholder | Upcoming |
| `/inva-taxi` | InvaTaxiView | Rider, driver, and manager views in one |
| `/news` | NewsView | |
| `/news/:id` | NewsDetailView | |
| `/guides` | GuidesView | |
| `/help` | HelpView | |
| `/login` | LoginView | Email/password + Google OAuth |
| `/register` | RegisterView | 3-step flow |
| `/auth/callback` | LoginView | Handles OAuth token exchange |
| `/profile` | ProfileView | Requires auth |
| `/admin/*` | Admin panel | Role-guarded — see Roles |

### OAuth Shim

Google OAuth redirects to `/auth/callback?token=...` (no hash). The static file `public/auth/callback.html` intercepts this and redirects to `/#/auth/callback?token=...` so Vue Router can process it.

---

## Authentication

Tokens are stored in `localStorage`:

| Key | Content |
|---|---|
| `sqAccessToken` | Short-lived JWT (15 min) |
| `sqRefreshToken` | Long-lived refresh token (7 days) |
| `sqUser` | Serialised user object |

`apiClient.js` automatically:
1. Attaches `Authorization: Bearer <accessToken>` to every request.
2. On `401` — calls `POST /auth/refresh` to get new tokens, queuing concurrent requests.
3. Retries the original request once with the refreshed token.
4. On refresh failure — clears all tokens and redirects to `/login`.

---

## User Roles

| Role | Access |
|---|---|
| `USER` | Full platform access (rider for InvaTaxi) |
| `RELATIVE` | Same as USER — for guardians / relatives of a person with a disability |
| `ORG_MANAGER` | Can manage their own organization listing |
| `TAXI_MANAGER` | InvaTaxi dispatcher panel + admin section |
| `MODERATOR` | Admin: organizations, news, users, comments, complaints |
| `ADMIN` | Full admin panel |

The `requireAdmin` route guard in `router/index.js` blocks `/admin/*` for any role not in `['ADMIN', 'MODERATOR', 'TAXI_MANAGER']`.

---

## Internationalisation

Two languages: **Kazakh** (`kaz`) and **Russian** (`rus`, default).

Active language is persisted in `localStorage` under `sqLang`. The `useI18n(lang)` helper returns a lookup function:

```js
import { useI18n } from '../i18n.js'

const tr = useI18n('kaz')
tr('services') // → 'Қызметтер'
```

`apiClient.js` forwards the active language as an `Accept-Language` header (`kk` / `ru`) so the backend returns already-localised field values.

---

## Accessibility

All accessibility features are built without third-party libraries, using only CSS and browser Web APIs.

| Feature | Implementation |
|---|---|
| High contrast | `high-contrast` class on `<html>` + 200+ overrides in `main.css` |
| Font size | `data-font-size="small/medium/large"` on `<html>`, all text in `rem` / CSS variables |
| Language toggle | `sqLang` in `localStorage`, reactive via `accessibility` Pinia store |
| Voice reader (TTS) | Browser `SpeechSynthesisUtterance` Web API |
| Settings persistence | `localStorage` keys: `sqHighContrast`, `sqFontSize`, `sqLang` |

---

## API Layer

All API modules live in `src/api/` and build on top of `apiClient.js`.

### Connecting to the real backend

Each API file currently contains a mock implementation with simulated delays. To connect to the real backend, replace mock function bodies with `apiClient.js` calls:

```js
// Before (mock):
export const getOrganizations = async (filters = {}) => {
  await delay(500)
  return { items: mockData, total: mockData.length }
}

// After (real API):
export const getOrganizations = async (filters = {}) => {
  return get('/core/organizations', buildQuery(filters))
}
```

### Gateway routing

All requests go through the API Gateway at `VITE_API_URL`:

```
/api/core/*  →  core-svc   (organizations, news, profile, guides)
/api/taxi/*  →  taxi-svc   (InvaTaxi)
/api/ai/*    →  ai-svc     (AI assistant)
```

### Key exports from `apiClient.js`

| Export | Purpose |
|---|---|
| `GATEWAY_URL` | REST API base URL |
| `STATIC_URL` | Static file server base URL |
| `WS_URL` | WebSocket server URL |
| `avatarUrl(path)` | Resolves an avatar path to a full URL |
| `newsImageUrl(path)` | Resolves a news image path to a full URL |
| `getAccessToken()` | Reads `sqAccessToken` from localStorage |
| `apiFetch(path, opts)` | Authenticated fetch with auto token refresh |

```js
// Usage in views or other API files:
import { avatarUrl, newsImageUrl } from '../api/apiClient.js'

// <img :src="avatarUrl(user.avatarUrl)" />
// <img :src="newsImageUrl(article.imageUrl)" />
```

---

## Pinia Stores

### `auth` store (`src/stores/auth.js`)

| Property / Action | Description |
|---|---|
| `user` | Current user object (normalised flat structure) |
| `isAuthenticated` | `true` if both token and user are present |
| `isAdmin` / `isModerator` / `isTaxiManager` | Role boolean helpers |
| `fullName` | `firstName + lastName` computed string |
| `roleLabel` | Human-readable role name (Russian) |
| `login(email, password)` | Authenticates, fetches full profile, persists |
| `register(payload)` | Registers user, persists |
| `logout()` | Clears all local state and tokens |
| `loginWithTokens(at, rt)` | OAuth post-callback handler |
| `updateLocalUser(fields)` | Merges profile updates into local state |
| `toggleSaveOrg(orgId)` | Optimistic save / unsave with API sync |
| `saveChat(chat)` | Persists an AI chat session to localStorage |

### `accessibility` store (`src/stores/accessibility.js`)

Manages font size, high-contrast mode, language, and TTS state.

### `search` store (`src/stores/search.js`)

Manages global search query shared between `AppHeader` and page views.

---

## Pagination

All list endpoints use offset-based pagination:

- **Request**: `?limit=20&offset=0`
- **Response**: `{ items: [...], total: N }`

---

## Test Accounts (mock)

| Email | Password | Role |
|---|---|---|
| admin@senimdi.kz | admin123 | ADMIN |
| user@senimdi.kz | User1234 | USER |
| mod@senimdi.kz | Mod12345 | MODERATOR |
| manager@senimdi.kz | Manager1 | TAXI_MANAGER |
| relative@senimdi.kz | Relat123 | RELATIVE |

---

## Feature Status

### Implemented

- All UI pages and shared components
- Mock API with all endpoints and simulated delays
- Authentication — login, register, logout, OAuth shim, 401-refresh flow
- Profile — view, edit, avatar upload, geolocation
- Guardian / relative system (RelativeLink)
- Organizations — catalog, filters, search, geo-search, reviews, favorites
- News — feed, detail page, likes, comments with moderation
- Guides — list, detail, likes, categories
- InvaTaxi — order form, my rides, real-time chat, driver list, manager panel
- AI assistant — chat, session history, mock RAG responses
- Support tickets and complaints
- Accessibility panel — contrast, font size, language, TTS
- Admin panel — organizations, news, users, taxi management

---

## Scripts

```bash
npm run dev      # Vite dev server with HMR (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Serve dist/ locally for production verification
```

---

## License

Private — All rights reserved © 2025 SenimdiQAdam.
