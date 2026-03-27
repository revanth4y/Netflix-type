# Netflix Clone (Frontend)

A production-ready Netflix-style frontend built with React, Vite, and Tailwind CSS. Uses the OMDb API for movie data and simulates authentication via LocalStorage.


## Tech Stack

- **React 18** + **Vite**
- **React Router DOM** (with lazy-loaded routes)
- **TanStack React Query** for server state
- **Axios** for API calls
- **Context API** for auth + theme
- **Tailwind CSS** for styling (dark/light theme)
- **Headless UI** for accessible dropdowns
- **Framer Motion** for sidebar animations
- **react-hot-toast** for notifications
- **LocalStorage** for auth and theme persistence (no backend)

## Setup

1. **Clone and install**

   ```bash
   cd netflix
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set your OMDb API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   VITE_OMDB_API_KEY=your_api_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

   - Get an OMDb key at [OMDb API](https://www.omdbapi.com/apikey.aspx).
   - For trailer previews, create a key in [Google Cloud Console](https://console.cloud.google.com/) and enable the **YouTube Data API v3**. Use that key as `VITE_YOUTUBE_API_KEY`. Do not commit real keys; use `.env` (gitignored) and keep `.env.example` as a template.

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173).

4. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server           |
| `npm run build`| Production build           |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint                 |
| `npm run lint:fix` | Fix ESLint issues      |
| `npm run format` | Format with Prettier    |

## Features

- **Auth (frontend-only)**  
  Sign up and sign in; credentials stored in LocalStorage. Protected route `/browse`; unauthenticated users are redirected to `/login`.

- **Routing**  
  `/login`, `/signup`, `/browse` (protected), and 404. Lazy-loaded route chunks for code splitting.

- **Movies (OMDb)**  
  Browse rows by category (e.g. Batman, Avengers, Action, Comedy, Drama). Search with debounced input. Click a movie to open a **trailer modal** (YouTube API v3); "View details" opens the detail modal (poster, year, genre, plot, IMDb, runtime).
- **Trailer preview (YouTube API v3)**  
  Clicking a movie card fetches the official trailer via `searchTrailer(movieTitle)` and opens a portal-based modal with a 16:9 embed, loading and error states, and close on overlay/ESC. API key via `VITE_YOUTUBE_API_KEY`.

- **UI**  
  Dark theme, sticky navbar with search and logout, hero banner, horizontal scroll rows, hover effects, and responsive layout.

- **Quality**  
  ESLint + Prettier, env-based API key, loading and error states, validation utilities, reusable Input component, and toast notifications.

## Enhancements

- **Hamburger menu (mobile)**  
  Three-line menu icon; slide-in sidebar from left (Framer Motion); Home, Browse, My List, theme toggle, Logout; click outside or Escape to close; accessible (aria-label, role, tabIndex).

- **Profile dropdown (desktop)**  
  Headless UI Menu with user avatar (initial letter), theme toggle (dark/light), and Logout.

- **Live clock**  
  `Clock.jsx` + `useClock()` hook; HH:MM:SS AM/PM in navbar top-right on Browse; updates every second with cleanup.

- **Signup mobile field**  
  Mobile number (10 digits, numbers only); validation in `utils/validation.js`; reusable `Input` component; red border and message on error; submit disabled when invalid.

- **Dark/light theme**  
  Theme toggle in profile dropdown and mobile menu; persisted in LocalStorage; Tailwind `light:` variant and `ThemeContext`.
- **Debounced search** in navbar (unchanged; search remains debounced for API calls).

## Folder Structure

```
src/
  api/            # Axios instance, movie API, query keys, youtube (trailer search)
  components/     # Navbar, MovieRow, MovieCard, Modal, TrailerModal, ProtectedRoute, Clock
  components/ui/  # Input (reusable)
  context/        # AuthContext, ThemeContext
  hooks/          # useDebouncedValue, useClock, useTrailer
  pages/          # Login, Signup, Browse, NotFound
  routes/         # AppRoutes (lazy routes)
  utils/          # constants, validation
  App.jsx
  main.jsx
  index.css
```

## Notes

- No backend: auth is simulated with LocalStorage only.
- OMDb free tier has a request limit; use responsibly.
- **Do not hardcode API keys.** Use `import.meta.env.VITE_YOUTUBE_API_KEY` and set `VITE_YOUTUBE_API_KEY` in `.env` (see `.env.example`).
