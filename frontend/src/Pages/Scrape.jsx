import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import '../Styles/ReportTable.css';
import { truncateText } from '../utils.js';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to highlight hashtags in post text
function highlightHashtags(text) {
  if (!text) return '';
  return text.split(/(#[\w]+)/g).map((part, idx) =>
    part.startsWith && part.startsWith('#') ?
      <span key={idx} className="hashtag-highlight">{part}</span> :
      part
  );
}
import { Search } from 'lucide-react';
import '../Styles/Scrape.css';


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
  const [filteredResults, setFilteredResults] = useState([]);
  const [chartData, setChartData] = useState({ pieData: [], barData: [] });

  // Update chart data when filtered results change
  useEffect(() => {
    const dataToUse = filteredResults.length > 0 ? filteredResults : results;
    const severityCount = {};
    dataToUse.forEach(result => {
      const severity = result.toxicitySeverity || 'Unknown';
      severityCount[severity] = (severityCount[severity] || 0) + 1;
    });

    const pieData = Object.entries(severityCount).map(([name, value]) => ({
      name,
      value,
      color: name === 'High' ? '#ef4444' : name === 'Medium' ? '#f59e0b' : name === 'Low' ? '#10b981' : '#6b7280'
    }));

    const platformCount = {};
    dataToUse.forEach(result => {
      const platform = result.platform || 'Unknown';
      platformCount[platform] = (platformCount[platform] || 0) + 1;
    });

    const barData = Object.entries(platformCount).map(([name, count]) => ({
      platform: name,
      count,
      toxicityAvg: Math.round((dataToUse
        .filter(r => r.platform === name)
        .reduce((sum, r) => sum + (r.toxicityScore || 0), 0) / 
        dataToUse.filter(r => r.platform === name).length || 0) * 10) / 10
    }));

    setChartData({ pieData, barData });
  }, [filteredResults, results]);

  const { pieData, barData } = chartData;

  // Effect to filter results whenever filters change
  useEffect(() => {
    let filtered = results;

    // Filter by platform
    if (platform && platform !== '') {
      filtered = filtered.filter(result => 
        result.platform.toLowerCase() === platform.toLowerCase()
      );
    }

    // Filter by location
    if (location && location !== '') {
      filtered = filtered.filter(result => 
        result.policeStation.toLowerCase().includes(location.toLowerCase()) ||
        (result.location && 
         (result.location.lat.toString().includes(location) || 
          result.location.lng.toString().includes(location)))
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(result => {
        const reportDate = new Date(result.reportedAt);
        const filterStartDate = new Date(startDate);
        return reportDate >= filterStartDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter(result => {
        const reportDate = new Date(result.reportedAt);
        const filterEndDate = new Date(endDate);
        return reportDate <= filterEndDate;
      });
    }

    setFilteredResults(filtered);
  }, [results, platform, location, startDate, endDate]);

  // --- Heatmap logic ---
  const heatmapRef = useRef(null);
  useEffect(() => {
    if (!heatmapRef.current) return;
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
     await new Promise(res => setTimeout(res, 900));

     let simulated = [...SAMPLE_RESULTS];

      if (location.trim()) {
        simulated = simulated.filter(r => {
          if (typeof r.location === 'string') {
            return r.location.toLowerCase().includes(location.trim().toLowerCase());
          } else if (typeof r.location === 'object' && r.policeStation) {
            return r.policeStation.toLowerCase().includes(location.trim().toLowerCase());
          }
          return false;
        });
      }
      if (startDate) {
        simulated = simulated.filter(r => {
          const date = r.reportedAt || r.date;
          return date && date >= startDate;
        });
      }
      if (endDate) {
        simulated = simulated.filter(r => {
          const date = r.reportedAt || r.date;
          return date && date <= endDate;
        });
      }
      if (platform) {
        simulated = simulated.filter(r =>
          (r.platform && r.platform.toLowerCase() === platform.toLowerCase())
        );
      }
      if (query.trim()) {
        if (type === 'hashtag') {
          simulated = simulated.filter(r =>
            r.post && r.post.toLowerCase().includes(query.trim().toLowerCase())
          );
        } else if (type === 'username') {
          simulated = simulated.filter(r =>
            r.user &&
            (
              (r.user.username && r.user.username.toLowerCase().includes(query.trim().toLowerCase())) ||
              (r.user.name && r.user.name.toLowerCase().includes(query.trim().toLowerCase()))
            )
          );
        }
      }

      setResults(simulated);
    } catch {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <div className="form-row filter-row">
            <div className="filter-group">
              <label className="filter-label">Location Filter</label>
              <input
                className="filter-input-location"
                placeholder="Location (e.g. Nagpur)"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Starting Date</label>
              <input
                className="filter-input-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                title="Start Date"
                placeholder="Start Date"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Ending Date</label>
              <input
                className="filter-input-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                title="End Date"
                placeholder="End Date"
              />
            </div>
              <div className="filter-group">
                <label className="filter-label">Platform</label>
                <select
                  className="filter-input-platform"
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
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
              {/* <div className="filter-group filter-actions">
                <label className="filter-label">Actions</label>
                <button 
                  type="button"
                  className="btn btn-secondary clear-filters-btn"
                  onClick={() => {
                    setLocation('');
                    setStartDate('');
                    setEndDate('');
                    setPlatform('');
                  }}
                  disabled={!location && !startDate && !endDate && !platform}
                >
    nn             Clear Filters
                </button>
              </div> */}
          </div>
          
          {/* Filter Status */}
          {(location || startDate || endDate || platform) && (
            <div className="filter-status">
              <span className="filter-status-text">
                Active Filters: 
                {location && <span className="filter-tag">Location: {location}</span>}
                {startDate && <span className="filter-tag">From: {startDate}</span>}
                {endDate && <span className="filter-tag">To: {endDate}</span>}
                {platform && <span className="filter-tag">Platform: {platform}</span>}
              </span>
              <span className="results-count">
                Showing {filteredResults.length} of {results.length} results
              </span>
            </div>
          )}
        </form>

        {error && <div className="error">{error}</div>}

        {/* Charts Section */}
        {results.length > 0 && (
          <div className="analytics-dashboard">
            <h2 className="dashboard-title">
              Analytics Dashboard
              {(location || startDate || endDate || platform) && (
                <span className="dashboard-filter-indicator"> (Filtered Data)</span>
              )}
            </h2>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Toxicity Severity Distribution</h3>
                </div>
                <div className="chart-content">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        innerRadius="35%"
                        paddingAngle={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Platform Analytics</h3>
                </div>
                <div className="chart-content">
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Report Count" />
                      <Bar yAxisId="right" dataKey="toxicityAvg" fill="#10b981" name="Avg Toxicity Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

  <div className="report-table-container">
          <div className="report-table__wrapper">
            <table className="report-table" role="table">
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
                {filteredResults.length === 0 && !loading ? (
                  <tr><td colSpan={10} className="empty">
                    {results.length === 0 ? 'No results yet. Try a search above.' : 'No results match the current filters.'}
                  </td></tr>
                ) : (
                  filteredResults.map((report) => ([
                    <tr
                      key={report.id}
                      className={`report-table__row${expandedRow === report.id ? ' expanded' : ''} clickable-row`}
                      onClick={() => setExpandedRow(expandedRow === report.id ? null : report.id)}
                    >
                      <td className="report-table__cell report-table__cell--platform">
                        <span className={`platform-badge platform-badge--${report.platform?.toLowerCase()}`}>{report.platform}</span>
                      </td>
                      <td className="report-table__cell report-table__cell--post">
                        <span>
                          {highlightHashtags(truncateText(report.post, 80))}
                          {report.post.length > 80 && <span className="more-link"> ...more</span>}
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
                        <td colSpan={10} className="expanded-info-cell">
                          <div className="expanded-info-title">Full Post:</div>
                          <div className="expanded-info-content">{highlightHashtags(report.post)}</div>
                          <div className="expanded-info-title">User Details:</div>
                          <div>Name: {report.user?.name}</div>
                          <div>Username: {report.user?.username}</div>
                          {report.user?.email && <div>Email: {report.user.email}</div>}
                          {report.user?.phone && <div>Phone: {report.user.phone}</div>}
                          <div className="expanded-info-title spaced">Toxicity Tags:</div>
                          <div>{Array.isArray(report.toxicityTags) ? report.toxicityTags.join(', ') : ''}</div>
                          <div className="expanded-info-title spaced">Police Station:</div>
                          <div>{report.policeStation}</div>
                          <div className="expanded-info-title spaced">Reported At:</div>
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

      {/* Heat Map Section
      <div className="heatmap-section">
        <h2 className="heatmap-title">Heat Map of Reports <span className="heatmap-demo-label">(Demo)</span></h2>
        <div className="heatmap-flex-row">
          <div className="heatmap-map-container">
            <div ref={heatmapRef} id="heatmap-map" className="heatmap-map-inner"></div>
          </div>
          <div className="heatmap-icons-container">
            <div className="heatmap-icons-row">
              <span title="Facebook" className="heatmap-icon"><i className="fa-brands fa-facebook heatmap-facebook"></i></span>
              <span title="Twitter" className="heatmap-icon"><i className="fa-brands fa-twitter heatmap-twitter"></i></span>
              <span title="Instagram" className="heatmap-icon"><i className="fa-brands fa-instagram heatmap-instagram"></i></span>
              <span title="LinkedIn" className="heatmap-icon"><i className="fa-brands fa-linkedin heatmap-linkedin"></i></span>
              <span title="Reddit" className="heatmap-icon"><i className="fa-brands fa-reddit heatmap-reddit"></i></span>
              <span title="YouTube" className="heatmap-icon"><i className="fa-brands fa-youtube heatmap-youtube"></i></span>
              <span title="TikTok" className="heatmap-icon"><i className="fa-brands fa-tiktok heatmap-tiktok"></i></span>
            </div>
          </div>
        </div>
      </div>

  */}
    </div>
  );
};

// No prop types required for this component currently.

export default Scrape;
