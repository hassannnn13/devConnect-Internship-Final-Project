# GitHub Repository Explorer

A small React app that answers one question GitHub's own UI doesn't
show you directly: how much of a repository's activity comes from a
single person. Enter any public `owner/repository`, and it fetches the
repo's contributors and shows what share of sampled commits the top
contributor made, as a plain `healthy` / `caution` / `risk` signal.

- Repo: https://github.com/hassannnn13/devConnect-Internship-Final-Project
- Live demo: https://git-repository-explorer.vercel.app/

## What you need to run it

- Node.js and npm installed
- Internet access 

That's it. 
No API keys required to just try it out.

## Getting it running

```bash
git clone https://github.com/hassannnn13/devConnect-Internship-Final-Project.git
cd devConnect-Internship-Final-Project
npm install
npm run dev
```

Vite will print a local link in your terminal, usually `http://localhost:5173`. 
Open it, and it'll automatically show you `facebook/react` as an example 
so you see it working right away.

Other useful commands:

```bash
npm run build     # for production
```

## How to use it

1. Type in a repo as `owner/repository` (like `facebook/react`), or just click one of the example buttons.
2. Hit Analyze.
3. You'll get the repo's description, its top 3 contributors, and a badge:
   - `healthy` — top contributor made 35% or less of the commits
   - `caution` — between 35% and 60%
   - `risk` — over 60%

There's also an optional spot to paste a GitHub token. You don't need 
one — the app works fine without it — it just lets you make more 
requests per hour before GitHub slows you down. Paste it in *before* 
you run a search, not during one. And heads up: it's saved in your 
browser's local storage, so don't use a token you care about keeping 
private — anyone with access to your browser's dev tools could see it.

## What happens when things go wrong

I made sure this doesn't just break or hang when GitHub misbehaves:

- **Repo doesn't exist or is private** → tells you straight up, no guessing.
- **Hit GitHub's rate limit** → says so, and shows you the numbers (how many requests you have left, when it resets).
- **Rate limit hits specifically while grabbing contributors** → gets its own message instead of a confusing generic error.
- **GitHub is just being slow** → after 8 seconds it gives up and tells you to try again, instead of spinning forever.
- **No internet connection** → tells you it couldn't reach GitHub.
- **Repo has no contributor data yet** (happens with brand new repos) → says so, instead of showing a fake "0% healthy" badge that would be misleading.

## Being honest about what this actually tells you

- It only looks at the top 100 contributors. Big projects have more than that, so this is a sample, not the whole picture.
- This is purely about commit *counts*. It has no idea if someone's commits are good, bad, tiny, or huge — it can't tell you anything about code quality or how thorough someone's reviews are.
- The `healthy` / `caution` / `risk` labels are just something I made up for this project — they're not some official GitHub standard.
- Run the same search twice and you might get slightly different numbers, especially if rate limiting cuts a request short.

## What this doesn't do

Just to be upfront — this app won't:

- Tell you anything about code quality or security
- Look at pull requests, reviews, or issues
- Show you full historical data (just a current snapshot)
- Save anything anywhere — every search is live, right in your browser

## How it's put together
.
├── src/
│ ├── App.jsx # all the logic — state, API calls, the math, the UI
│ ├── index.css # styling
│ └── main.jsx # where React gets started
├── index.html
├── package.json
├── vite.config.js
└── README.md

## Three decisions

## 1. I used React + Vite instead of just plain HTML/CSS/JS

**What I did:** Built the whole thing in React.

**What I could've done instead:** Skipped the framework entirely — just plain HTML, CSS, and JavaScript.

**Why I went with React:** There's a lot of state to juggle here — what you typed, whether it's loading, the repo data, contributor data, rate limit numbers, your token. Trying to keep all of that in sync by hand with plain JavaScript gets messy really fast. React just handles that part for me.

**What it cost me:** A plain HTML file just... works. Open it in a browser, done. This project now needs Node, npm, a whole build process, and a giant `node_modules` folder before anyone can even see it run. Honestly, for something this small, that's more setup than it really needed — I did it because I wanted the React practice, not because the app demanded it.

## 2. I call GitHub's API directly from the browser — and this one bit me later

**What I did:** The app talks straight to `api.github.com`. No backend in between.

**What I could've done instead:** Built a small backend server that talks to GitHub and hands the data to the frontend.

**Why I skipped the backend:** Everything I needed was public data anyway. Building and hosting a whole server just to pass through public GET requests felt like overkill. Going direct meant I could ship this as a plain static site.

**What it actually cost me:** This is the one that came back to bite me. Without a backend, there's nowhere safe to store a GitHub token — so it had to go straight into the browser's local storage, out in the open for anyone poking around in dev tools. I added the token field anyway because it's genuinely useful for testing, but it meant extra code, extra UI, and a warning in this README telling people not to use a token they actually care about. If I'd built a backend, none of that would've been necessary — the token could've just stayed safely on the server. I'd probably still skip the backend for a project this size, but it wasn't a free decision.

## 3. I picked one metric instead of building a whole dashboard

**What I did:** Show just one thing — how concentrated the commits are around the top contributor.

**What I could've done instead:** Build out a bigger dashboard — stars, forks, issues, commit frequency, languages, the whole works.

**Why I kept it narrow:** A pile of stats is basically just GitHub's own page, reformatted. One clear number that actually tells you something useful — "is this repo relying on one person" — felt more valuable than a wall of numbers nobody asked for.

**What it cost me:** The app can only answer this one question. If someone wants to know whether a project handles issues well, or reviews code carefully, or is actively maintained day-to-day — this tool has nothing for them. And since there's only one number on the page, if that number happens to be misleading for some repo (see the limitations above), there's nothing else there to balance it out.

## Made by

M. Hassan Idrees