import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import '../Styles/ReportTable.css';
import { truncateText } from '../utils.js';

// Helper to highlight hashtags in post text
function highlightHashtags(text) {
  if (!text) return '';
  return text.split(/(#[\w]+)/g).map((part, idx) =>
    part.startsWith && part.startsWith('#') ?
      <span key={idx} style={{ color: '#1976d2', fontWeight: 600 }}>{part}</span> :
      part
  );
}
import { Search } from 'lucide-react';
import '../Styles/Scrape.css';


// Copied from ReportTable.jsx
const SAMPLE_RESULTS = [
  {
    id: 1,
    platform: 'Facebook',
    post: 'This is absolutely disgusting behavior from these people. They should all be banned and removed from our community immediately. This kind of hate speech cannot be tolerated.',
    user: { name: 'satish kumar', username: '@satish_kumar' },
    toxicitySeverity: 'High',
    toxicityScore: 8.7,
    toxicityTags: ['hate', 'harassment'],
    postLink: 'https://facebook.com/posts/123456789',
    location: { lat: 12.9715987, lng: 77.5945627 },
    policeStation: 'Hingna Police Station',
    reportedAt: '2025-01-05T10:30:00Z'
  },
  {
    id: 2,
    platform: 'Twitter',
    post: 'Another spam message trying to sell fake products. These scammers are getting more creative with their approaches and targeting vulnerable users.',
    user: { name: 'harish', username: '@harish_2024' },
    toxicitySeverity: 'Medium',
    toxicityScore: 6.2,
    toxicityTags: ['spam', 'scam'],
    postLink: 'https://twitter.com/user/status/987654321',
    location: { lat: 40.7128, lng: -74.0060 },
    policeStation: 'NYPD 1st Precinct',
    reportedAt: '2025-01-05T14:15:00Z'
  },
  {
    id: 3,
    platform: 'Instagram',
    post: 'Mild inappropriate content that violates community guidelines but is not severely harmful.',
    user: { name: 'Ramesh gade', username: '@ramesh_gade' },
    toxicitySeverity: 'Low',
    toxicityScore: 3.4,
    toxicityTags: ['inappropriate'],
    postLink: 'https://instagram.com/p/ABC123DEF',
    location: { lat: 34.0522, lng: -118.2437 },
    policeStation: 'Nagpur Central Division',
    reportedAt: '2025-01-05T16:45:00Z'
  },
  {
    id: 4,
    platform: 'TikTok',
    post: 'Extremely concerning content promoting dangerous activities. This could seriously harm young viewers who might attempt to replicate these dangerous stunts.',
    user: { name: 'Nazim Ansari', username: '@nazim_ansari_2024' },
    toxicitySeverity: 'High',
    toxicityScore: 9.1,
    toxicityTags: ['dangerous', 'harmful'],
    postLink: 'https://tiktok.com/@user/video/123456789',
    location: { lat: 51.5074, lng: -0.1278 },
    policeStation: 'Metropolitan Police - Westminster',
    reportedAt: '2025-01-05T11:20:00Z'
  },
  {
    id: 5,
    platform: 'YouTube',
    post: 'Video contains moderate levels of abusive language and personal attacks against specific individuals in the community.',
    user: { name: 'Omen ', username: '@omen_yt' },
    toxicitySeverity: 'Medium',
    toxicityScore: 5.8,
    toxicityTags: ['abuse', 'personal attack'],
    postLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    location: { lat: 37.7749, lng: -122.4194 },
    policeStation: 'SFPD Central Station',
    reportedAt: '2025-01-05T13:10:00Z'
  },
  {
    id: 6,
    platform: 'LinkedIn',
    post: 'Professional misconduct and harassment targeting colleagues with discriminatory comments based on personal characteristics.',
    user: { name: 'Kartik Bisen', username: '@kartik_bisen' },
    toxicitySeverity: 'High',
    toxicityScore: 7.9,
    toxicityTags: ['harassment', 'discrimination'],
    postLink: 'https://linkedin.com/posts/rwilson_post123',
    location: { lat: 41.8781, lng: -87.6298 },
    policeStation: 'Chicago Police Department - District 1',
    reportedAt: '2025-01-05T09:45:00Z'
  },
  {
    id: 7,
    platform: 'Reddit',
    post: 'Coordinated spam campaign flooding multiple subreddits with misleading information and fake news articles.',
    user: { name: 'Anonymous User', username: 'u/throwaway_2024_spam' },
    toxicitySeverity: 'Medium',
    toxicityScore: 6.7,
    toxicityTags: ['spam', 'misinformation'],
    postLink: 'https://reddit.com/r/example/comments/abc123',
    location: { lat: 43.6532, lng: -79.3832 },
    policeStation: 'Toronto Police Service - 52 Division',
    reportedAt: '2025-01-05T12:30:00Z'
  }
];

const Scrape = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('hashtag'); // 'hashtag' or 'username'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [platform, setPlatform] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  // --- Heatmap logic ---
  const heatmapRef = useRef(null);
  useEffect(() => {
    if (!heatmapRef.current) return;
    // Remove any previous map instance
    if (window.heatmapLeafletMap) {
      window.heatmapLeafletMap.remove();
      window.heatmapLeafletMap = null;
    }
    // Center on India for demo
    const map = L.map(heatmapRef.current).setView([22.9734, 78.6569], 5);
    window.heatmapLeafletMap = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    // Dummy heat points: [lat, lng, intensity]
    const points = [
      [19.076, 72.8777, 0.8], // Mumbai
      [28.7041, 77.1025, 0.7], // Delhi
      [13.0827, 80.2707, 0.6], // Chennai
      [22.5726, 88.3639, 0.9], // Kolkata
      [12.9716, 77.5946, 0.5], // Bangalore
      [23.0225, 72.5714, 0.4], // Ahmedabad
      [26.9124, 75.7873, 0.3], // Jaipur
      [17.385, 78.4867, 0.6], // Hyderabad
    ];
    L.heatLayer(points, { radius: 35, blur: 25, maxZoom: 10 }).addTo(map);
  }, []);

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
      // Use the full sampleReports as the base data
      let simulated = [...SAMPLE_RESULTS];

      // Filter by location if provided
      if (location.trim()) {
        simulated = simulated.filter(r => {
          // Accept both string and object location
          if (typeof r.location === 'string') {
            return r.location.toLowerCase().includes(location.trim().toLowerCase());
          } else if (typeof r.location === 'object' && r.policeStation) {
            return r.policeStation.toLowerCase().includes(location.trim().toLowerCase());
          }
          return false;
        });
      }
      // Filter by start date if provided
      if (startDate) {
        simulated = simulated.filter(r => {
          const date = r.reportedAt || r.date;
          return date && date >= startDate;
        });
      }
      // Filter by end date if provided
      if (endDate) {
        simulated = simulated.filter(r => {
          const date = r.reportedAt || r.date;
          return date && date <= endDate;
        });
      }
      // Filter by platform if provided
      if (platform) {
        simulated = simulated.filter(r =>
          (r.platform && r.platform.toLowerCase() === platform.toLowerCase())
        );
      }

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
          <div className="form-row" style={{ marginTop: 12, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 'bold', marginBottom: 2, color: '#1976d2' }}>Location Filter</label>
              <input
                className="form-input"
                placeholder="Location (e.g. Nagpur)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ minWidth: 160 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 'bold', marginBottom: 2, color: '#1976d2' }}>Starting Date</label>
              <input
                className="form-input"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ minWidth: 140 }}
                title="Start Date"
                placeholder="Start Date"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 'bold', marginBottom: 2, color: '#1976d2' }}>Ending Date</label>
              <input
                className="form-input"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ minWidth: 140 }}
                title="End Date"
                placeholder="End Date"
              />
            </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold', marginBottom: 2, color: '#1976d2' }}>Platform</label>
                <select
                  className="form-select"
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  style={{ minWidth: 160, height: 36 }}
                >
                  <option value="">All Platforms</option>
                  <option value="example.com">example.com</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="reddit">Reddit</option>
                </select>
              </div>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

  <div className="report-table-container" style={{ marginTop: 32, maxWidth: '150vw', width: '100%' }}>
          <div className="report-table__wrapper" style={{ overflowX: 'visible' }}>
            <table className="report-table" role="table" style={{ tableLayout: 'auto', width: '100%' }}>
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Post</th>
                  <th scope="col">User Details</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Toxicity</th>
                  <th scope="col">Hashtags</th>
                  <th scope="col">Date</th>
                  <th scope="col">Post Link</th>
                  <th scope="col">Location</th>
                  <th scope="col">Police Station</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 && !loading ? (
                  <tr><td colSpan={10} className="empty">No results yet. Try a search above.</td></tr>
                ) : (
                  results.map((report) => ([
                    <tr
                      key={report.id}
                      className={`report-table__row${expandedRow === report.id ? ' expanded' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedRow(expandedRow === report.id ? null : report.id)}
                    >
                      <td className="report-table__cell report-table__cell--platform">
                        <span className={`platform-badge platform-badge--${report.platform?.toLowerCase()}`}>{report.platform}</span>
                      </td>
                      <td className="report-table__cell report-table__cell--post">
                        <span>
                          {highlightHashtags(truncateText(report.post, 80))}
                          {report.post.length > 80 && <span style={{ color: '#1976d2', marginLeft: 6, fontWeight: 500 }}> ...more</span>}
                        </span>
                      </td>
                      <td className="report-table__cell report-table__cell--user">
                        <div className="user-details">
                          <div className="user-details__name">{report.user?.name}</div>
                          <div className="user-details__username">{report.user?.username}</div>
                        </div>
                      </td>
                      <td className="report-table__cell">
                        <span className={`report-table__severity report-table__severity--${report.toxicitySeverity?.toLowerCase()}`}>{report.toxicitySeverity}</span>
                      </td>
                      <td className="report-table__cell report-table__cell--toxicity">
                        <div className="toxicity-info">
                          <div className="toxicity-info__score">{report.toxicityScore}/10</div>
                          <div className="toxicity-info__tags">
                            {Array.isArray(report.toxicityTags) && report.toxicityTags.map((tag, idx) => (
                              <span key={idx} className="toxicity-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="report-table__cell">
                        {Array.isArray(report.toxicityTags) ? report.toxicityTags.join(', ') : ''}
                      </td>
                      <td className="report-table__cell">
                        {report.reportedAt || report.date || ''}
                      </td>
                      <td className="report-table__cell">
                        <a href={report.postLink} target="_blank" rel="noopener noreferrer" className="post-link">View Post</a>
                      </td>
                      <td className="report-table__cell">
                        {report.location?.lat && report.location?.lng ? `${report.location.lat}, ${report.location.lng}` : ''}
                      </td>
                      <td className="report-table__cell report-table__cell--police">
                        {report.policeStation}
                      </td>
                    </tr>,
                    expandedRow === report.id && (
                      <tr key={`expand-${report.id}`} className="report-table__row expanded-info-row">
                        <td colSpan={10} style={{ background: '#f3f4f6', padding: '1.5rem 2rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>Full Post:</div>
                          <div style={{ marginBottom: 12, whiteSpace: 'pre-line' }}>{highlightHashtags(report.post)}</div>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>User Details:</div>
                          <div>Name: {report.user?.name}</div>
                          <div>Username: {report.user?.username}</div>
                          {report.user?.email && <div>Email: {report.user.email}</div>}
                          {report.user?.phone && <div>Phone: {report.user.phone}</div>}
                          <div style={{ fontWeight: 600, margin: '12px 0 8px' }}>Toxicity Tags:</div>
                          <div>{Array.isArray(report.toxicityTags) ? report.toxicityTags.join(', ') : ''}</div>
                          <div style={{ fontWeight: 600, margin: '12px 0 8px' }}>Police Station:</div>
                          <div>{report.policeStation}</div>
                          <div style={{ fontWeight: 600, margin: '12px 0 8px' }}>Reported At:</div>
                          <div>{report.reportedAt}</div>
                        </td>
                      </tr>
                    )
                  ]) )
                )}
              </tbody>
            </table>
          </div>
        </div>

      
      </div>

      {/* Heat Map Section */}
      <div style={{ margin: '48px auto 0', maxWidth: 1200, width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', padding: 32 }}>
        <h2 style={{ color: '#1976d2', marginBottom: 24 }}>Heat Map of Reports <span style={{ fontSize: 18, color: '#888' }}>(Demo)</span></h2>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 32, width: '100%' }}>
          <div style={{ width: '50%', minWidth: 320, height: 350, borderRadius: 8, position: 'relative', marginBottom: 0, overflow: 'hidden' }}>
            <div ref={heatmapRef} id="heatmap-map" style={{ width: '100%', height: '100%' }}></div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 350 }}>
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <span title="Facebook" style={{ fontSize: 32 }}><i className="fa-brands fa-facebook" style={{ color: '#1877f2' }}></i></span>
              <span title="Twitter" style={{ fontSize: 32 }}><i className="fa-brands fa-twitter" style={{ color: '#1da1f2' }}></i></span>
              <span title="Instagram" style={{ fontSize: 32 }}><i className="fa-brands fa-instagram" style={{ color: '#e6683c' }}></i></span>
              <span title="LinkedIn" style={{ fontSize: 32 }}><i className="fa-brands fa-linkedin" style={{ color: '#0077b5' }}></i></span>
              <span title="Reddit" style={{ fontSize: 32 }}><i className="fa-brands fa-reddit" style={{ color: '#ff4500' }}></i></span>
              <span title="YouTube" style={{ fontSize: 32 }}><i className="fa-brands fa-youtube" style={{ color: '#ff0000' }}></i></span>
              <span title="TikTok" style={{ fontSize: 32 }}><i className="fa-brands fa-tiktok" style={{ color: '#000' }}></i></span>
            </div>
          </div>
        </div>
      </div>

 
    </div>
  );
};

// No prop types required for this component currently.

export default Scrape;
