import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const SAMPLE_RESULTS = [
  { id: 'sample-1', title: '#cybersecurity - Example post 1', excerpt: 'Dummy post excerpt about cybersecurity best practices.', source: 'example.com', url: '#' },
  { id: 'sample-2', title: '@nasa - Example post 2', excerpt: 'Dummy post excerpt from a user about space exploration.', source: 'example.org', url: '#' },
  { id: 'sample-3', title: '#infosec - Example post 3', excerpt: 'Dummy post with a short security tip.', source: 'blog.example', url: '#' }
];

const Scrape = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('hashtag'); // 'hashtag' or 'username'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Note: Browsers cannot scrape arbitrary sites due to CORS and legal constraints.
  // This component simulates a search and provides instructions for backend integration.
  const performSearch = async (e) => {
    e.preventDefault();
    setError(null);
    if (!query.trim()) {
      setError('Please enter a hashtag or username to search.');
      return;
    }

    setLoading(true);
  setResults([]);

    try {
      // Simulate a network/search delay
      await new Promise(res => setTimeout(res, 900));

      // Simulated results - replace this block with a call to your backend scraping/search API.
      const simulated = Array.from({ length: 6 }).map((_, i) => ({
        id: `${type}-${i + 1}`,
        title: `${type === 'hashtag' ? '#' : '@'}${query} - example post ${i + 1}`,
        excerpt: `This is a simulated post excerpt for ${type === 'hashtag' ? '#' : '@'}${query}. Replace with real data from a server.`,
        source: 'example.com',
        url: '#'
      }));

      setResults(simulated);
    } catch {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // show sample results on first render so user can see output immediately
    setResults(SAMPLE_RESULTS);
  }, []);

  return (
    <div className="scrape-page">
      <div className="scrape-container">
        <h1>Scrape/Search Posts</h1>
        {/* <p>Search posts on the internet by hashtag or username. Note: this UI simulates searching. For real scraping, connect to a backend API that performs authorized scraping or uses official platform APIs.</p> */}

        <form className="scrape-form" onSubmit={performSearch}>
          <div className="form-row">
            <select value={type} onChange={e => setType(e.target.value)} className="form-select">
              <option value="hashtag">Hashtag</option>
              <option value="username">Username</option>
            </select>
            <input className="form-input" placeholder={type === 'hashtag' ? 'e.g. cybersecurity' : 'e.g. nasa'} value={query} onChange={e => setQuery(e.target.value)} />
            <button className="btn btn-primary" type="submit" disabled={loading}><Search size={16} /> {loading ? 'Searching...' : 'Search'}</button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="results">
          {results.length === 0 && !loading && <div className="empty">No results yet. Try a search above.</div>}
          {results.map(r => (
            <div key={r.id} className="result-card">
              <a href={r.url} target="_blank" rel="noreferrer" className="result-title">{r.title}</a>
              <p className="result-excerpt">{r.excerpt}</p>
              <div className="result-meta">Source: {r.source}</div>
            </div>
          ))}
        </div>

      
      </div>

      <style>{`
        .scrape-page{ min-height: calc(100vh - 70px); padding: 24px 0; background:#f8fafc }
        .scrape-container{ max-width:1100px; margin:0 auto; background:white; padding:28px; border-radius:12px; box-shadow:0 1px 6px rgba(2,6,23,0.08) }

        /* Form layout */
        .scrape-form .form-row{ display:flex; gap:12px; align-items:center; margin-bottom:16px }
        .form-select{ padding:10px 14px; border:1px solid #e5e7eb; border-radius:8px; background:white }
        .form-input{ flex:1; padding:10px 14px; border:1px solid #e5e7eb; border-radius:8px }
        .btn.btn-primary{ display:inline-flex; align-items:center; gap:8px }

        /* Results layout - use grid for bigger screens */
        .results{ margin-top:16px; display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px }
        .result-card{ padding:14px; border:1px solid #eef2ff; border-radius:8px; background:#ffffff }
        .result-title{ font-weight:700; color:#0ea5e9; text-decoration:none; display:block; margin-bottom:6px }
        .result-excerpt{ color:#475569; margin-bottom:8px }
        .result-meta{ color:#94a3b8; font-size:13px }

        .integration-note{ margin-top:20px; color:#475569 }
        .error{ color:#dc2626; margin-top:8px }
        .empty{ color:#94a3b8 }

        /* Responsive adjustments */
        @media (max-width: 900px) {
          .scrape-container{ padding:20px }
          .results{ grid-template-columns: repeat(1, minmax(0,1fr)); }
        }

        @media (max-width: 640px) {
          .scrape-container{ padding:16px; border-radius:10px }
          .scrape-form .form-row{ flex-direction:column; align-items:stretch }
          .form-select, .form-input, .btn.btn-primary{ width:100% }
          .form-select, .form-input{ box-sizing:border-box }
          .btn.btn-primary{ justify-content:center; padding:10px 12px }
          .result-card{ padding:12px }
          .result-title{ font-size:15px }
          .result-excerpt{ font-size:14px }
        }

        /* Small phone tweaks */
        @media (max-width: 380px) {
          .scrape-container{ padding:12px }
          .scrape-form .form-row{ gap:8px }
          .result-title{ font-size:14px }
          .result-meta{ font-size:12px }
        }
      `}</style>
    </div>
  );
};

// No prop types required for this component currently.

export default Scrape;
