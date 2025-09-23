import React, { useState } from 'react';
import PostModal from './PostModal.jsx';
import ReportModal from './ReportModal.jsx';
import { truncateText, openGoogleMaps } from '../utils.js';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, X, RefreshCw, Eye, AlertTriangle, Flag } from 'lucide-react';
import '../Styles/ReportTable.css';

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

const ReportTable = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [reportingPost, setReportingPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');

  // Get unique platforms and severities for filter options
  const platforms = [...new Set(sampleReports.map(report => report.platform))];
  const severities = [...new Set(sampleReports.map(report => report.toxicitySeverity))];

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

  // Filter and search logic
  const filteredReports = sampleReports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.post.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.policeStation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === '' || report.platform === selectedPlatform;
    const matchesSeverity = selectedSeverity === '' || report.toxicitySeverity === selectedSeverity;
    
    return matchesSearch && matchesPlatform && matchesSeverity;
  });

  // Calculate pagination with filtered data
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPlatform, selectedSeverity]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('');
    setSelectedSeverity('');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedPlatform || selectedSeverity;

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

  const getSeverityClass = (severity) => {
    return `report-table__severity report-table__severity--${severity.toLowerCase()}`;
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
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            title="Refresh data"
          >
            <RefreshCw size={20} className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="security-reports__filters">
        <div className="search-filter-row">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search posts, users, police stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search-btn"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <select
                id="platform-filter"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="filter-select"
              >
                <option value="">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                id="severity-filter"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="filter-select"
              >
                <option value="">All Severities</option>
                {severities.map(severity => (
                  <option key={severity} value={severity}>{severity}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-all-btn">
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="active-filters">
            {selectedPlatform && (
              <span className="filter-tag">
                Platform: {selectedPlatform}
                <button onClick={() => setSelectedPlatform('')}>
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedSeverity && (
              <span className="filter-tag">
                Severity: {selectedSeverity}
                <button onClick={() => setSelectedSeverity('')}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

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

              <div className="page-numbers">
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

export default ReportTable;