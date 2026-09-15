# Repo Signals — GitHub Repository Explorer

A small app to inspect GitHub repositories and surface maintenance signals (top contributors, commit share, risk level).

## Problem
It's hard to know who actually maintains a repository from the GitHub UI. This app helps quickly answer: who are the top contributors, and how concentrated are commits?

## What it does
- Look up a public GitHub repository by `owner/repo`.
- Shows repo metadata, top contributors (sample), and a simple risk score based on commit share.
- Handles common failure modes (404, rate limit, GitHub/server errors, network errors).
 - Search GitHub repositories by keyword and view useful fields: name, description, stars, forks, language, open issues, and link to GitHub.
 - Sort search results by "Most stars", "Most forks", or "Recently updated".

## How to run locally
1. Clone the repository and enter the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app at `http://localhost:5173`.

## Using the search

- Use the "Search repositories" box to search public GitHub repositories. Results show the repository name, description, stars, forks, language, open issues, and a link to GitHub.
- While results load you'll see `Loading repositories...`.
- If the request fails you'll see `Couldn't load repositories. Please try again.`
- If a search succeeds but returns nothing you'll see `No repositories found for "xyz". Try another search.`

Optional: provide a GitHub personal access token in the app (bottom of the form) to raise rate limits.

### Generating a GitHub personal access token (PAT)

1. Visit https://github.com/settings/tokens
2. Click "Generate new token" (classic) or create a fine-grained token. For public-read access you do not need to select any scopes — repository metadata is public.
3. Copy the token and paste it into the "GitHub token" field in the app. The token is stored only in `sessionStorage` for the current tab.
4. If you see a 403 with rate-limit messages, adding a token will increase your allowed requests.

## Automated checks
- The project has a `package.json` with `dev`, `build`, and `preview` scripts for Vite.
- Add CI (optional) to run `npm ci && npm run build` on push.

## Failure and rate-limit handling
- 404 response → user-friendly message: repository doesn't exist or is private.
- 403 rate-limit → shows when rate-limit resets and suggests using a token.
- 5xx responses → instructs the user to try again later.
- Network failures → instructs the user to check connection.

## Data limitations (README must state these)
- Contributors are fetched via the GitHub REST API contributors endpoint which returns a sample (paginated). The app requests up to 100 contributors — this is a sample, not a full commit history.
- Commit counts reflect contributions reported by the contributors endpoint; they do not measure code quality, review effort, or file-level ownership.
- Results may be skewed by bots, renamed users, or mirrored repositories.

## Scope (what's deliberately out of scope)
- No authentication beyond an optional token input in the UI (no server-side auth flow).
- No persisted user settings; token is stored only in `sessionStorage` for the tab.
- No history, analytics, or multi-repo comparisons.

## Demo / Submission
- To demonstrate the app, either deploy to Vercel/Netlify or record a short screen capture showing lookups, handling a 404, and the rate-limit message.

## Next suggested improvements
- Add tests for core utility functions and a small end-to-end test for the UI.
- Add CI to build and run tests on PRs.
- Deploy for a public demo URL.

---

If you want, I can:
- add CI config for GitHub Actions,
- deploy the site to Netlify/Vercel,
- add a short recording (I can generate instructions to record), or
- update the UI/UX as part of polish work.

## Commit history and submission checklist

- Ensure your repository contains a sequence of meaningful commits that show how the work progressed (feature commits, fix commits, README updates). A single all-in-one commit is acceptable but a multi-commit history is preferred.
- Include this README and a short demonstration (deployed URL or a short screen recording).
- The reviewer will check that the README allows someone unfamiliar to run the project locally and that failure paths are documented.

## Deployment (quick)

To deploy to Vercel:

1. Sign in to Vercel and import the repository.
2. Use the default Build Command: `npm run build` and `Output Directory: dist`.
3. Add a GitHub token as an environment variable if you plan to demo rate-limited scenarios.

To deploy to Netlify:

1. Connect the repository to Netlify and set the build command to `npm run build` and publish directory to `dist`.
2. Add environment variables if needed.

## Demo recording instructions

If you prefer to submit a short recording instead of deploying, record a 60–120s video showing:

- Launching the app locally (`npm run dev` and opening `http://localhost:5175`).
- Looking up an example repo (use the example buttons).
- Triggering a 404 (search for a non-existent `owner/repo`) and showing the error message.
- Demonstrating rate-limit guidance (explain that you can add a token to the token field).

