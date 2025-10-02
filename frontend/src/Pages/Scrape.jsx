import { useState, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/SearchPosts.css';
import '../Styles/Scrape.css';

const SearchPosts = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  // Enhanced filter states similar to ReportTable
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [query, setQuery] = useState('');
  const [type, setType] = useState('hashtag'); // 'hashtag' or 'username'
  const [location, setLocation] = useState('');
  
  // Scheduled reports state
  const [scheduledReports] = useState([
    {
      id: 1,
      date: '2025-10-02T09:30:00Z',
      userName: 'John Doe',
      filters: {
        platform: 'Twitter',
        severity: 'High',
        hashtag: '#cybersecurity',
        location: 'Mumbai',
        dateRange: '2025-09-01 to 2025-09-30'
      },
      status: 'Scheduled'
    },
    {
      id: 2,
      date: '2025-10-02T11:15:00Z',
      userName: 'Jane Smith',
      filters: {
        platform: 'Facebook',
        severity: 'Medium',
        username: '@security_expert',
        location: 'Delhi',
        dateRange: '2025-09-15 to 2025-10-02'
      },
      status: 'In Progress'
    },
    {
      id: 3,
      date: '2025-10-01T16:45:00Z',
      userName: 'Mike Johnson',
      filters: {
        platform: 'Instagram',
        severity: 'Low',
        hashtag: '#staysafe',
        location: 'Bangalore',
        dateRange: '2025-09-20 to 2025-09-30'
      },
      status: 'Completed'
    },
    {
      id: 4,
      date: '2025-10-02T14:20:00Z',
      userName: 'Sarah Wilson',
      filters: {
        platform: 'LinkedIn',
        severity: 'High',
        hashtag: '#datasecurity',
        location: 'Pune',
        dateRange: '2025-09-25 to 2025-10-02'
      },
      status: 'Failed'
    },
    {
      id: 5,
      date: '2025-10-02T08:00:00Z',
      userName: 'Alex Kumar',
      filters: {
        platform: 'Twitter',
        severity: 'Medium',
        username: '@techsafety',
        location: 'Hyderabad',
        dateRange: '2025-09-28 to 2025-10-02'
      },
      status: 'Scheduled'
    }
  ]);

  // Filter options
  const platformOptions = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'reddit', label: 'Reddit' }
  ];
  
  const severityOptions = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  // Filtered scheduled reports using existing search and filter states
  const filteredReports = useMemo(() => {
    let filtered = [...scheduledReports];

    // Apply search filter (hashtag or username query)
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(report => 
        report.userName.toLowerCase().includes(searchTerm) ||
        report.status.toLowerCase().includes(searchTerm) ||
        Object.values(report.filters).some(filter => 
          filter && filter.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply platform filter
    if (selectedPlatform) {
      filtered = filtered.filter(report => 
        report.filters.platform && 
        report.filters.platform.toLowerCase() === selectedPlatform.label.toLowerCase()
      );
    }

    // Apply severity filter
    if (selectedSeverity) {
      filtered = filtered.filter(report => 
        report.filters.severity && 
        report.filters.severity === selectedSeverity.value
      );
    }

    // Apply location filter
    if (location.trim()) {
      const locationTerm = location.toLowerCase();
      filtered = filtered.filter(report => 
        report.filters.location && 
        report.filters.location.toLowerCase().includes(locationTerm)
      );
    }

    // Apply date range filter
    if (startDate || endDate) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && reportDate < start) return false;
        if (end && reportDate > end) return false;
        return true;
      });
    }

    return filtered;
  }, [scheduledReports, query, selectedPlatform, selectedSeverity, location, startDate, endDate]);

  // Sample search results for demonstration
  const sampleResults = [
    {
      id: 1,
      platform: 'Twitter',
      content: 'Check out this amazing cybersecurity tool! #cybersecurity #tech',
      author: '@techuser123',
      authorName: 'Tech User',
      timestamp: '2 hours ago',
      likes: 45,
      retweets: 12,
      location: 'Mumbai, India',
      postUrl: 'https://twitter.com/example',
      severity: 'Low',
      createdAt: '2025-01-05T14:30:00Z'
    },
    {
      id: 2,
      platform: 'Facebook',
      content: 'Important security update for all users. Please check your privacy settings.',
      author: 'Security Expert',
      authorName: 'Security Expert',
      timestamp: '4 hours ago',
      likes: 128,
      shares: 23,
      location: 'Delhi, India',
      postUrl: 'https://facebook.com/example',
      severity: 'Medium',
      createdAt: '2025-01-05T12:30:00Z'
    },
    {
      id: 3,
      platform: 'Instagram',
      content: 'New cybersecurity awareness campaign launched! #staysafe #cybersecurity',
      author: '@cybersafety_india',
      authorName: 'Cyber Safety India',
      timestamp: '6 hours ago',
      likes: 89,
      comments: 15,
      location: 'Bangalore, India',
      postUrl: 'https://instagram.com/example',
      severity: 'High',
      createdAt: '2025-01-05T10:30:00Z'
    },
    {
      id: 4,
      platform: 'LinkedIn',
      content: 'Professional cybersecurity insights and best practices #infosec #linkedin',
      author: '@security_pro',
      authorName: 'Security Professional',
      timestamp: '8 hours ago',
      likes: 67,
      comments: 8,
      location: 'Chennai, India',
      postUrl: 'https://linkedin.com/example',
      severity: 'Medium',
      createdAt: '2025-01-05T08:30:00Z'
    },
    {
      id: 5,
      platform: 'TikTok',
      content: 'Quick cybersecurity tips for everyone! #cybersafety #tips',
      author: '@cyber_tips',
      authorName: 'Cyber Tips',
      timestamp: '10 hours ago',
      likes: 234,
      comments: 45,
      location: 'Pune, India',
      postUrl: 'https://tiktok.com/example',
      severity: 'Low',
      createdAt: '2025-01-05T06:30:00Z'
    },
  ];

  // Check if any filters are active
  const hasActiveFilters = query || selectedPlatform || selectedSeverity || location || startDate || endDate;

  // Enhanced search functionality
  const performSearch = (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Searching for:', query, 'Type:', type);
      
      // Filter results based on all criteria
      const filtered = sampleResults.filter(result => {
      // Hashtag/username search
      const matchesQuery = query === '' || 
        (type === 'hashtag' && result.content.toLowerCase().includes(query.toLowerCase())) ||
        (type === 'username' && (
          result.author.toLowerCase().includes(query.toLowerCase()) ||
          result.authorName.toLowerCase().includes(query.toLowerCase())
        ));

      // Platform filter
      const matchesPlatform = !selectedPlatform || (selectedPlatform.value && result.platform.toLowerCase() === selectedPlatform.value.toLowerCase());

      // Severity filter
      const matchesSeverity = !selectedSeverity || (selectedSeverity.value && result.severity === selectedSeverity.value);

      // Location filter
      const matchesLocation = location === '' || 
        result.location.toLowerCase().includes(location.toLowerCase());

      // Date filters
      const resultDate = new Date(result.createdAt);
      const matchesStartDate = startDate === '' || resultDate >= new Date(startDate);
      const matchesEndDate = endDate === '' || resultDate <= new Date(endDate);

        return matchesQuery && matchesPlatform && matchesSeverity && 
               matchesLocation && matchesStartDate && matchesEndDate;
      });

      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedPlatform(null);
    setSelectedSeverity(null);
    setQuery('');
    setType('hashtag');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setSearchResults([]);
  };

  return (
    <div className="search-posts-page">
      <div className="security-reports__header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="security-reports__title">
              <Search size={24} />
              Scrape
            </h1>
            <p className="security-reports__subtitle">
              Search across social media platforms for specific content, hashtags, or users
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
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
                placeholder="City or region"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <button 
              className="btn btn-primary compact-search-btn" 
              type="button" 
              disabled={!query}
              onClick={performSearch}
            >
              <Search size={14} /> Scrape
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
                value={selectedPlatform}
                onChange={setSelectedPlatform}
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
                value={selectedSeverity}
                onChange={setSelectedSeverity}
                isClearable
                placeholder="All Severities"
              />
            </div>

            <div className="filter-input-group">
              <label className="compact-label">Start Date</label>
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={date => setStartDate(date ? date.toISOString().slice(0, 10) : '')}
                className="filter-input-compact"
                placeholderText="Select start date"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="filter-input-group">
              <label className="compact-label">End Date</label>
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={date => setEndDate(date ? date.toISOString().slice(0, 10) : '')}
                className="filter-input-compact"
                placeholderText="Select end date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            
            <button 
              type="button"
              className="btn btn-outline clear-filters-btn-compact"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              title="Clear all filters"
            >
              Clear Filters
            </button>

            <button 
              onClick={performSearch}
              disabled={isSearching}
              className={`btn btn-outline refresh-btn-compact ${isSearching ? 'refreshing' : ''}`}
              title="Refresh results"
            >
              <RefreshCw size={16} className={`refresh-icon ${isSearching ? 'spinning' : ''}`} />
              {isSearching ? 'Searching...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Status */}
      {hasActiveFilters && (
        <div className="filter-status">
          <span className="filter-status-text">Active filters:</span>
          {query && <span className="filter-tag">{type}: {query}</span>}
          {selectedPlatform && selectedPlatform.value && <span className="filter-tag">Platform: {selectedPlatform.label}</span>}
          {selectedSeverity && selectedSeverity.value && <span className="filter-tag">Severity: {selectedSeverity.label}</span>}
          {location && <span className="filter-tag">Location: {location}</span>}
          {startDate && <span className="filter-tag">From: {startDate}</span>}
          {endDate && <span className="filter-tag">Until: {endDate}</span>}
        </div>
      )}

      {/* Results Summary */}
      <div className="security-reports__summary">
        <span className="results-count">
          {hasActiveFilters ? (
            <>Showing {searchResults.length} of {sampleResults.length} posts</>
          ) : (
            <>Total {searchResults.length || sampleResults.length} posts available</>
          )}
        </span>
        {isSearching && (
          <span className="refreshing-text">
            <RefreshCw size={14} className="spinning" />
            Searching...
          </span>
        )}
      </div>

      {/* Scheduled Reports Table - Only show when filters are applied */}
      {hasActiveFilters && (
        <div className="scheduled-reports-section">
          <div className="scheduled-reports-header">
            <h2 className="scheduled-reports-title">
              Scheduled Reports
            </h2>
          </div>

          {/* Results Summary */}
          <div className="reports-filter-summary">
            <span className="results-count">
              {filteredReports.length} of {scheduledReports.length} reports
            </span>
          </div>
        
        <div className="scheduled-reports-table-container">
          <table className="scheduled-reports-table">
            <thead>
              <tr>
                <th className="sr-no-header">Sr. No.</th>
                <th className="date-header">Date Scheduled</th>
                <th className="user-header">User Name</th>
                <th className="filters-header">Applied Filters</th>
                <th className="status-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={report.id} className="scheduled-report-row">
                  <td className="sr-no-cell">
                    {index + 1}
                  </td>
                  
                  <td className="date-cell">
                    <div className="date-main">
                      {new Date(report.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="date-time">
                      {new Date(report.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>

                  <td className="user-cell">
                    <div className="user-name">{report.userName}</div>
                  </td>

                  <td className="filters-cell">
                    <div className="filter-chips-simple">
                      {report.filters.platform && (
                        <span className="filter-chip platform">
                          {report.filters.platform}
                        </span>
                      )}
                      {report.filters.severity && (
                        <span className="filter-chip severity">
                          {report.filters.severity}
                        </span>
                      )}
                      {report.filters.hashtag && (
                        <span className="filter-chip hashtag">
                          {report.filters.hashtag}
                        </span>
                      )}
                      {report.filters.username && (
                        <span className="filter-chip username">
                          {report.filters.username}
                        </span>
                      )}
                      {report.filters.location && (
                        <span className="filter-chip location">
                          {report.filters.location}
                        </span>
                      )}
                      {report.filters.dateRange && (
                        <span className="filter-chip date">
                          {report.filters.dateRange}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="status-cell">
                    <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-results">
                    <div className="no-results-content">
                      <p className="no-results-text">
                        {scheduledReports.length === 0 
                          ? 'No scheduled reports'
                          : 'No matching reports'
                        }
                      </p>
                      {scheduledReports.length > 0 && filteredReports.length === 0 && (
                        <button 
                          onClick={clearFilters}
                          className="clear-search-btn"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default SearchPosts;