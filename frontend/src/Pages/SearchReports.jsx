import React, { useState } from 'react';
import PostModal from './PostModal.jsx';
import ReportModal from '../components/ReportModal.jsx';
import { truncateText, openGoogleMaps } from '../utils.js';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, RefreshCw, Eye, AlertTriangle, Flag } from 'lucide-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/SearchReports.css';


// Sample data 
const sampleReports = [
  {
    id: 1,
    platform: 'Facebook',
    post: 'This is absolutely disgusting behavior from these people. They should all be banned and removed from our community immediately. This kind of hate speech cannot be tolerated.',
    user: {
      name: 'satish kumar',
      username: '@satish_kumar',
   
    },
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
    user: {
      name: 'harish',
      username: '@harish_2024',
    },
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
    user: {
      name: 'Ramesh gade',
      username: '@ramesh_gade',

    }, 
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
    user: {
      name: 'Nazim Ansari',
      username: '@nazim_ansari_2024',
   
    },
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
    user: {
      name: 'Omen ',
      username: '@omen_yt',
     
    },
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
    user: {
      name: 'Kartik Bisen',
      username: '@kartik_bisen',
    },
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
    user: {
      name: 'Anonymous User',
      username: 'u/throwaway_2024_spam'
    },
    toxicitySeverity: 'Medium',
    toxicityScore: 6.7,
    toxicityTags: ['spam', 'misinformation'],
    postLink: 'https://reddit.com/r/example/comments/abc123',
    location: { lat: 43.6532, lng: -79.3832 },
    policeStation: 'Toronto Police Service - 52 Division',
    reportedAt: '2025-01-05T12:30:00Z'
  }
];

const SearchReports = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [reportingPost, setReportingPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search and Filter state
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
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  
  // New state for hashtag/username search
  const [query, setQuery] = useState('');
  const [type, setType] = useState('hashtag'); // 'hashtag' or 'username'
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get unique platforms and severities for filter options (now using static lists)
  // const platforms = [...new Set(sampleReports.map(report => report.platform))];
  // const severities = [...new Set(sampleReports.map(report => report.toxicitySeverity))];

  // Refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would fetch fresh data from your API here
    // For now, we'll just reset to first page and show a refresh animation
    setCurrentPage(1);
    
    setIsRefreshing(false);
  };

  // Search functionality
  const performSearch = (e) => {
    if (e) e.preventDefault();
    // In a real app, you would make an API call here
    // For now, we'll just show the sample data
    console.log('Searching for:', query, 'Type:', type);
  };

  // Filter and search logic
  const filteredReports = sampleReports.filter(report => {
    // Hashtag/username search
    const matchesQuery = query === '' || 
      (type === 'hashtag' && report.post.toLowerCase().includes(query.toLowerCase())) ||
      (type === 'username' && (
        report.user.username.toLowerCase().includes(query.toLowerCase()) ||
        report.user.name.toLowerCase().includes(query.toLowerCase())
      ));

    // Platform filter (handle null/cleared value)
    const matchesPlatform = !selectedPlatform || (selectedPlatform.value && report.platform === selectedPlatform.value);

    // Severity filter (handle null/cleared value)
    const matchesSeverity = !selectedSeverity || (selectedSeverity.value && report.toxicitySeverity === selectedSeverity.value);

    // Location filter
    const matchesLocation = location === '' || 
      report.policeStation.toLowerCase().includes(location.toLowerCase());

    // Date filters
    const reportDate = new Date(report.reportedAt);
    const matchesStartDate = startDate === '' || reportDate >= new Date(startDate);
    const matchesEndDate = endDate === '' || reportDate <= new Date(endDate);

    return matchesQuery && matchesPlatform && matchesSeverity && 
           matchesLocation && matchesStartDate && matchesEndDate;
  });

  // Calculate pagination with filtered data
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset or fix pagination when filters change
  React.useEffect(() => {
    if (currentPage > 1 && (currentPage > Math.ceil(filteredReports.length / itemsPerPage))) {
      setCurrentPage(Math.max(1, Math.ceil(filteredReports.length / itemsPerPage)));
    } else if (currentPage === 1 && filteredReports.length === 0) {
      setCurrentPage(1);
    }
    // If filters change and currentPage is valid, do nothing
  }, [selectedPlatform, selectedSeverity, query, location, startDate, endDate, filteredReports.length, itemsPerPage]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedPlatform(null);
    setSelectedSeverity(null);
    setQuery('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = (selectedPlatform && selectedPlatform.value) || (selectedSeverity && selectedSeverity.value) || 
                          query || location || startDate || endDate;

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePostClick = (report) => {
    setSelectedPost(report);
    setIsPostModalOpen(true);
  };

  const handleReportClick = (report) => {
    setReportingPost(report);
    setIsReportModalOpen(true);
  };

  const handleLocationClick = (lat, lng) => {
    openGoogleMaps(lat, lng);
  };

  return (
    <div className="security-reports">
      {/* Page Header */}
      <div className="security-reports__header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="security-reports__title">Security Reports</h1>
            <p className="security-reports__subtitle">
              Monitor and manage reported content across social media platforms
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
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
              disabled={!query}
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
                isClearable
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
                isClearable
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
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`btn btn-outline refresh-btn-compact ${isRefreshing ? 'refreshing' : ''}`}
              title="Refresh data"
            >
              <RefreshCw size={16} className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
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
            <>Showing {totalItems} of {sampleReports.length} reports</>
          ) : (
            <>Total {totalItems} reports</>
          )}
        </span>
        {isRefreshing && (
          <span className="refresh-status">
            Refreshing data...
          </span>
        )}
      </div>

      {/* Reports Table */}
      <div className="security-reports__content">
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Content</th>
                <th>User</th>
                <th>Severity</th>
                <th>Toxicity Score</th>
                <th>Coordinates</th>
                <th>Police Station</th>
                <th>Actions</th>
              </tr>  
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <tr key={report.id} className="reports-table__row">
                    <td>
                      <span className={`platform-badge platform-badge--${report.platform.toLowerCase()}`}>
                        {report.platform}
                      </span>
                    </td>
                    
                    <td className="content-cell">
                      <button 
                        className="content-preview"
                        onClick={() => handlePostClick(report)}
                      >
                        {truncateText(report.post, 60)}
                      </button>
                    </td>

                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-name">{report.user.name}</div>
                        <div className="user-handle">{report.user.username}</div>
                      </div>
                    </td>

                    <td>
                      <span className={`severity-badge severity-${report.toxicitySeverity.toLowerCase()}`}>
                        {report.toxicitySeverity}
                      </span>
                    </td>

                    <td className="toxicity-cell">
                      <div className="toxicity-score">{report.toxicityScore}/10</div>
                      <div className="toxicity-tags">
                        {report.toxicityTags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="coordinates-cell">
                      <button
                        className="coordinates-btn"
                        onClick={() => handleLocationClick(report.location.lat, report.location.lng)}
                        title="Click to view on map"
                      >
                        <div className="coordinates-lat">Lat: {report.location.lat.toFixed(4)}</div>
                        <div className="coordinates-lng">Lng: {report.location.lng.toFixed(4)}</div>
                      </button>
                    </td>

                    <td className="station-cell">
                      {truncateText(report.policeStation, 20)}
                    </td>

                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="btn btn-view"
                          onClick={() => handlePostClick(report)}
                          title="View details"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        
                        <button 
                          className="btn btn-report"
                          onClick={() => handleReportClick(report)}
                          title="Report this content"
                        >
                          <Flag size={14} />
                          Report
                        </button>
                       
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    <div className="no-results-content">
                      <p>No reports found matching your criteria</p>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="btn btn-outline">
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

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
              </span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="items-per-page"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="pagination-controls">
              <button 
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronsLeft size={16} />
              </button>
              
              <button 
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="pagination-ellipsis">...</span>
                      )}
                      <button
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <ChevronRight size={16} />
              </button>
              
              <button 
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isPostModalOpen && selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setIsPostModalOpen(false)} 
        />
      )}

      {isReportModalOpen && reportingPost && (
        <ReportModal 
          report={reportingPost} 
          onClose={() => setIsReportModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default SearchReports;