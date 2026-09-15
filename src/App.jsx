const EXAMPLES = ["facebook/react", "vuejs/core", "expressjs/express"];

export default function App() {
  
  const [query, setQuery] = useState("facebook/react");
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");
}

