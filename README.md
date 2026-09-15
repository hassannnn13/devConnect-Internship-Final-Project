# GitHub Repository Explorer

A small React app that looks up a public GitHub repository (by `owner/repo`) and surfaces simple maintenance signals: repository metadata, top contributors, and a basic risk score based on commit concentration.

## What it does

- Lookup a repository by `owner/repo` (example presets included).
- Fetch repository metadata and up to 100 contributors from the GitHub REST API.
- Calculate a simple "top contributor share" risk score and render top contributors.
- Show GitHub API rate-limit headers and accept an optional personal access token to raise limits.

## Quick start

1. Clone the repository and enter the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the Local URL printed by Vite (commonly `http://localhost:5173`). Vite will auto-select another free port if the default is in use.

Useful scripts (in `package.json`):

- `npm run dev` — start Vite dev server (hot reload)
- `npm run build` — build production bundle to `dist`
- `npm run preview` — preview production build locally
- `npm run lint` — run `oxlint` (scaffolded linter)

## GitHub token (optional)

Create a personal access token at https://github.com/settings/tokens (no scopes required for public repo metadata). Paste it into the "GitHub token" field in the app. The token is stored only in `localStorage` for this browser.

## Troubleshooting

- Blank page after the dev server starts: open DevTools Console (F12) and paste any runtime errors here.
- App mounting: `src/main.jsx` mounts the app into `#root` in `index.html` — ensure that file exists and that `src/main.jsx` is unchanged.
- Missing React hooks error: ensure `src/App.jsx` imports `useState` and `useEffect` (this repo includes that fix).
- Dev server exits with `-1073741510` on Windows: this often indicates the process was terminated (Ctrl+C) or killed by another program — re-run `npm run dev` and watch for antivirus or system activity.
- Port in use: Vite will pick a free port automatically; open the `Local` URL printed.

If problems persist, paste the full terminal output from `npm run dev` and any browser console errors and I will help debug.

## Data limitations

- Contributors are fetched from the GitHub contributors endpoint (paginated). The app requests up to 100 contributors — this is a sample, not full history.
- Commit counts reflect the contributors endpoint and do not measure code quality, review effort, or file-level ownership.

## Scope

- No server-side authentication or persisted settings beyond the optional token in `localStorage`.


