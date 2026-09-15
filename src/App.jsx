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
}

