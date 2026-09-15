const EXAMPLES = ["facebook/react", "vuejs/core", "expressjs/express"];

export default function App() {
  
  const [query, setQuery] = useState("facebook/react");
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
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

}

