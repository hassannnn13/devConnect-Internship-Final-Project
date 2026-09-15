
# GitHub Repository Explorer

A focused React + Vite application that fetches repository metadata and contributor activity from the public GitHub REST API to surface simple maintenance signals (top contributors and a basic risk score).

This README describes what the project does, how to run it locally, what it intentionally omits, and the checklist for final submission.

## Key features

- Lookup a repository by `owner/repo` (UI includes example presets).
- Fetch repository metadata and up to 100 contributors via the GitHub API.
- Compute a "top contributor share" and display a risk badge (`healthy`, `caution`, `risk`).
- Display rate-limit headers and accept an optional GitHub personal access token to increase request quota.
- Basic error handling for 404 (not found), 403 (rate limit), and other network/API errors.

## Run locally 

1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Open the Local URL Vite prints (usually `http://localhost:5173`).

Useful scripts: `dev`, `build`, `preview`, `lint` (see `package.json`).

## GitHub token (optional)

If you find API rate limits (403) while testing, create a personal access token at https://github.com/settings/tokens and paste it into the "GitHub token" field in the app. The token is saved to `localStorage` in the browser.

## Troubleshooting

- Blank page: open DevTools Console (F12) and paste errors here.
- Dev server not starting: run `npm install` then `npm run dev` and paste terminal output.
- Port conflicts: Vite prints the actual Local URL it uses — open that URL.
- Windows exit code `-1073741510`: this typically means the process was terminated externally; check for manual Ctrl+C, antivirus, or other tools killing child processes.

If you still see issues, paste the full terminal output and any console errors and I will debug.

## Data limitations 

- Contributors are a paginated sample (up to 100), not full history.
- Commit counts are a rough proxy — not a measure of quality or review effort.
- Client-only app; no server-side persistence.

## Submission checklist 

Ensure the following before submitting. Items marked **Action** need your input.

- **Repository history:** multiple focused commits exist and reflect development. (You provided `git log --oneline`.)
- **README:** Present and explains purpose, how to run, and limitations. (Done)
- **Failure handling:** The app catches and surfaces 404/403/network errors. (Done)
- **Demonstration:** **Action** — provide a deployed URL (Vercel/Netlify) or a 60–120s demo recording showing the app running and failure scenarios.

## Author
M. Hassan Idrees




