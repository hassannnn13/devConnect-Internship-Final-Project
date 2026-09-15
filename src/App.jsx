const EXAMPLES = ["facebook/react", "vuejs/core", "expressjs/express"];

export default function App() {
  
  const [query, setQuery] = useState("facebook/react");
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [status, setStatus] = useState("idle"); 
  const [errorMsg, setErrorMsg] = useState("");

  const [repo, setRepo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(null);
  const [rateLimitLimit, setRateLimitLimit] = useState(null);
  const [rateLimitReset, setRateLimitReset] = useState(null);

  useEffect(() => {
    fetchRepoSignals(query);
  }, []);

  const saveToken = (val) => {
    setToken(val);
    localStorage.setItem("gh_token", val);
  };

  const updateRateLimits = (headers) => {
    const limit = headers.get("x-ratelimit-limit");
    const remaining = headers.get("x-ratelimit-remaining");
    const reset = headers.get("x-ratelimit-reset");
    
    if (limit) setRateLimitLimit(limit);
    if (remaining) setRateLimitRemaining(remaining);
    if (reset) setRateLimitReset(reset);
  };

    const fetchRepoSignals = async (targetRepo) => {
    if (!targetRepo.includes("/")) {
      setStatus("error");
      setErrorMsg("Please enter a valid target in 'owner/repository' format.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setRepo(null);
    setContributors([]);

    const headers = token ? { Authorization: `token ${token}` } : {};

    try {
      const repoRes = await fetch(`https://api.github.com/repos/${targetRepo}`, { headers });
      updateRateLimits(repoRes.headers);

      if (!repoRes.ok) {
        if (repoRes.status === 404) throw new Error("Repository not found or private.");
        if (repoRes.status === 403) throw new Error("GitHub API rate limit exceeded. Add a personal access token.");
        throw new Error(`GitHub API error (${repoRes.status}).`);
      }

      const repoData = await repoRes.json();

      const contribRes = await fetch(`https://api.github.com/repos/${targetRepo}/contributors?per_page=100`, { headers });
      updateRateLimits(contribRes.headers);

      if (!contribRes.ok) {
        throw new Error("Unable to retrieve contributor metrics for this repository.");
      }

      const contribData = await contribRes.json();

      setRepo(repoData);
      setContributors(Array.isArray(contribData) ? contribData : []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred while fetching data.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRepoSignals(query);
  };

  const totalCommits = contributors.reduce((sum, c) => sum + c.contributions, 0);
  const topShare = totalCommits > 0 && contributors.length > 0 
    ? contributors[0].contributions / totalCommits 
    : 0;
  
  const topThree = contributors.slice(0, 3);

  let riskLevel = "healthy";
  if (topShare > 0.6) riskLevel = "risk";
  else if (topShare > 0.35) riskLevel = "caution";

  return (
    <>
      <header className="page-header">
        <h1>Repo Signals</h1>
        <p>Analyze maintainer concentration and bus-factor risks on public GitHub repositories.</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="repo-input">Repository (owner/repo)</label>
            <input
              id="repo-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. facebook/react"
              required
            />
          </div>

          <button type="submit" style={{ marginTop: "1.5rem" }}>Analyze</button>

          <div className="examples" style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
            <span className="note" style={{ marginRight: 8 }}>Examples:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  fetchRepoSignals(ex);
                }}
                style={{ marginRight: 6 }}
              >
                {ex}
              </button>
            ))}
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
            <label htmlFor="token-input">GitHub token (optional — raises rate limit)</label>
            <input
              id="token-input"
              type="password"
              value={token}
              onChange={(e) => saveToken(e.target.value)}
              placeholder="ghp_..."
            />
          </div>
        </form>

        <p role="status" aria-live="polite" className={status === "error" ? "status-error" : "status"}>
          {status === "loading" && "Loading repository metrics…"}
          {status === "error" && errorMsg}
        </p>

        {rateLimitRemaining !== null && (
          <p className="status" style={{ fontSize: "0.9rem", marginTop: 6 }}>
            Rate limit: {rateLimitRemaining}/{rateLimitLimit} — resets {rateLimitReset ? new Date(rateLimitReset * 1000).toLocaleTimeString() : "soon"}.
          </p>
        )}

        {status === "success" && repo && (
          <article className="panel">
            <span className={`badge badge--${riskLevel}`}>{Math.round(topShare * 100)}% Top Share</span>
            <h2>{repo.full_name}</h2>
            <p>{repo.description || "No description provided."}</p>

            <h3>Top contributors</h3>
            <ul>
              {topThree.map((c) => (
                <li key={c.login}>
                  <a href={c.html_url} target="_blank" rel="noreferrer">{c.login}</a> — {c.contributions} commits
                </li>
              ))}
            </ul>
            <p className="note">
              Top contributor made {Math.round(topShare * 100)}% of commits sampled from{" "}
              {contributors.length === 100 ? "100+" : contributors.length} contributors.
              This is commit count only — not code quality or review effort.
            </p>
          </article>
        )}
      </main>

      <footer>
        <p>Data from the public GitHub API. Results are a sample, not full history.</p>
      </footer>
    </>
  );
}

