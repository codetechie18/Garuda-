import { useState, useEffect } from 'react';
import '../Styles/SearchPosts.css';
import { truncateText } from '../utils.js';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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


const platformOptions = [
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Reddit', label: 'Reddit' }
];

const severityOptions = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [platform, setPlatform] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [location, setLocation] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [chartData, setChartData] = useState({ pieData: [], barData: [] });
  const [editingPoliceStation, setEditingPoliceStation] = useState(null);
  const [policeStationValue, setPoliceStationValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Available police stations for dropdown
  const policeStations = [
    'Hingna Police Station',
    'NYPD 1st Precinct',
    'Nagpur Central Division',
    'Metropolitan Police - Westminster',
    'SFPD Central Station',
    'Chicago Police Department - District 1',
    'Toronto Police Service - 52 Division',
    'Mumbai Police - Bandra Division',
    'Delhi Police - CP District',
    'Bangalore City Police'
  ];

  const handleEditPoliceStation = (reportId, currentStation) => {
    setEditingPoliceStation(reportId);
    setPoliceStationValue(currentStation || '');
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleInputChange = (value) => {
    setPoliceStationValue(value);
    
    if (value.length > 0) {
      const filtered = policeStations.filter(station =>
        station.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPoliceStationValue(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleSavePoliceStation = (reportId) => {
    // Update the results array with new police station
    setResults(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, policeStation: policeStationValue }
        : report
    ));
    setEditingPoliceStation(null);
    setPoliceStationValue('');
  };

  const handleCancelEdit = () => {
    setEditingPoliceStation(null);
    setPoliceStationValue('');
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  // Update chart data when filtered results change
  useEffect(() => {
    const dataToUse = filteredResults.length > 0 ? filteredResults : results;
    const severityCount = {};
    dataToUse.forEach(result => {
      const severity = result.toxicitySeverity || 'Unknown';
      severityCount[severity] = (severityCount[severity] || 0) + 1;
    });

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

    setChartData({ barData });
  }, [filteredResults, results]);

  const { barData } = chartData;

  // Effect to filter results whenever filters change
  useEffect(() => {
    let filtered = results;

    // Filter by platform
    if (platform && platform.value) {
      filtered = filtered.filter(result => 
        result.platform.toLowerCase() === platform.value.toLowerCase()
      );
    }

    // Filter by severity
    if (severity && severity.value) {
      filtered = filtered.filter(result => 
        result.toxicitySeverity.toLowerCase() === severity.value.toLowerCase()
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
  }, [results, platform, location, severity, startDate, endDate]);

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
        <div className="security-reports__header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="security-reports__title">
              <Search size={24} />
              Search Posts
            </h1>
            <p className="security-reports__subtitle">
              Search across social media platforms for specific content, hashtags, or users
            </p></div>
          </div>
        </div>
        {/* <p>Search posts on the internet by hashtag or username. Note: this UI simulates searching. For real scraping, connect to a backend API that performs authorized scraping or uses official platform APIs.</p> */}

        <form className="scrape-form" onSubmit={performSearch}>
          <div className="search-filter-container">
            {/* Search Section */}
            <div className="search-section-compact">
              <div className="search-inputs-row">
                <div className="search-input-group">
                  <label className="compact-label">Hashtag</label>
                  <input 
                    className="form-input-compact hashtag-input" 
                    placeholder="#cybersecurity" 
                    value={type === 'hashtag' ? query : ''} 
                    onChange={e => {
                      setQuery(e.target.value);
                      setType('hashtag');
                    }} 
                  />
                </div>
                
                <div className="search-input-group username-group">
                  <label className="compact-label">Username</label>
                  <input 
                    className="form-input-compact username-input" 
                    placeholder="@username" 
                    value={type === 'username' ? query : ''} 
                    onChange={e => {
                      setQuery(e.target.value);
                      setType('username');
                    }} 
                  />
                </div>
                
                <div className="search-input-group location-group">
                  <label className="compact-label">Location</label>
                  <input
                    className="form-input-compact location-input"
                    placeholder="City, police station, or coords"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
                
                <button 
                  className="btn btn-primary compact-search-btn" 
                  type="button" 
                  disabled={loading || !query}
                  onClick={performSearch}
                >
                  <Search size={14} /> Search
                </button>
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="filter-section-compact">
              <div className="filter-inputs-row">
                <div className="filter-input-group">
                  <label className="compact-label">Platform</label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={platformOptions}
                    value={platform}
                    onChange={setPlatform}
                    isClearable
                    placeholder="All Platforms"
                  />
                </div>
                
                <div className="filter-input-group">
                  <label className="compact-label">Severity</label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={severityOptions}
                    value={severity}
                    onChange={setSeverity}
                    isClearable
                    placeholder="All Severities"
                  />
                </div>
                
                <div className="filter-input-group">
                  <label className="compact-label">Start Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="filter-input-compact"
                    placeholderText="Select start date"
                  />
                </div>
                
                <div className="filter-input-group">
                  <label className="compact-label">End Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="filter-input-compact"
                    placeholderText="Select end date"
                  />
                </div>
                
                <button 
                  type="button"
                  className="btn btn-outline clear-filters-btn-compact"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setPlatform(null);
                    setSeverity(null);
                  }}
                  disabled={!startDate && !endDate && !platform && !severity}
                  title="Clear all filters"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Status */}
          {(startDate || endDate || platform || severity) && (
            <div className="filter-status">
              <span className="filter-status-text">
                Active Filters: 
                {startDate && <span className="filter-tag">From: {startDate.toLocaleDateString()}</span>}
                {endDate && <span className="filter-tag">To: {endDate.toLocaleDateString()}</span>}
                {platform && <span className="filter-tag">Platform: {platform.label}</span>}
                {severity && <span className="filter-tag">Severity: {severity.label}</span>}
              </span>
              <span className="results-count">
                Showing {filteredResults.length} of {results.length} results
              </span>
            </div>
          )}
        </form>

        {error && <div className="error">{error}</div>}

       

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
                  <th scope="col">Police Station</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 && !loading ? (
                  <tr><td colSpan={9} className="empty">
                    {results.length === 0 ? 'No results yet. Try a search above.' : `No results match the current filters. (${results.length} total results available)`}
                  </td></tr>
                ) : (
                  filteredResults.map((report) => ([
                    <tr
                      key={report.id}
                      className={`report-table__row${expandedRow === report.id ? ' expanded' : ''} clickable-row`}
                      onClick={() => setExpandedRow(expandedRow === report.id ? null : report.id)}
                      style={{ cursor: 'pointer', backgroundColor: expandedRow === report.id ? '#f8f9fa' : 'transparent' }}
                      title="Click to expand details"
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
                      <td className="report-table__cell report-table__cell--police">
                        {editingPoliceStation === report.id ? (
                          <div className="police-station-edit-form-inline">
                            <div className="autocomplete-container">
                              <input 
                                type="text" 
                                value={policeStationValue} 
                                onChange={(e) => handleInputChange(e.target.value)}
                                placeholder="Enter police station name"
                                className="police-station-input-inline"
                                autoFocus
                              />
                              {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="suggestions-dropdown">
                                  {filteredSuggestions.map((suggestion, idx) => (
                                    <div
                                      key={idx}
                                      className="suggestion-item"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSuggestionClick(suggestion);
                                      }}
                                    >
                                      {suggestion}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSavePoliceStation(report.id);
                              }}
                              className="btn-save-inline"
                              title="Save"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="btn-cancel-inline"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="police-station-display-inline">
                            <span>{report.policeStation}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPoliceStation(report.id, report.policeStation);
                              }}
                              className="btn-edit-inline"
                              title="Edit Police Station"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>,
                    expandedRow === report.id && (
                      <tr key={`expand-${report.id}`} className="report-table__row expanded-info-row">
                        <td colSpan={9} className="expanded-info-cell">
                          <div className="expanded-info-grid">
                            <div className="expanded-info-section post-details">
                              <h4 className="expanded-info-heading">Full Post Content</h4>
                              <p className="expanded-info-text">{highlightHashtags(report.post)}</p>
                            </div>
                            <div className="expanded-info-section user-details-exp">
                              <h4 className="expanded-info-heading">User Details</h4>
                              <div className="info-grid">
                                <div className="info-item"><strong>Name:</strong><span>{report.user?.name}</span></div>
                                <div className="info-item"><strong>Username:</strong><span>{report.user?.username}</span></div>
                                {report.user?.email && <div className="info-item"><strong>Email:</strong><span>{report.user.email}</span></div>}
                                {report.user?.phone && <div className="info-item"><strong>Phone:</strong><span>{report.user.phone}</span></div>}
                              </div>
                            </div>
                            <div className="expanded-info-section toxicity-details">
                              <h4 className="expanded-info-heading">Toxicity Analysis</h4>
                              <div className="info-grid">
                                <div className="info-item"><strong>Tags:</strong><span>{Array.isArray(report.toxicityTags) ? report.toxicityTags.join(', ') : 'N/A'}</span></div>
                              </div>
                            </div>
                            <div className="expanded-info-section report-meta">
                              <h4 className="expanded-info-heading">Report Metadata</h4>
                              <div className="info-grid">
                                <div className="info-item"><strong>Police Station:</strong><span>{report.policeStation}</span></div>
                                <div className="info-item"><strong>Reported At:</strong><span>{new Date(report.reportedAt).toLocaleString()}</span></div>
                              </div>
                            </div>
                          </div>
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
