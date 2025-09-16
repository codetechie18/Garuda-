import React, { useState } from 'react';
import PostModal from './PostModal.jsx';
import ReportModal from './ReportModal.jsx';
import { truncateText, openGoogleMaps } from '../utils.js';
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
    //   email: 'kartik.bisen@company.com',
    //   phone: '+1-555-0167'
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

  const handlePostClick = (report) => {
    setSelectedPost(report);
    setIsPostModalOpen(true);
  };

  const handleReportClick = (report) => {
    setReportingPost(report);
    setIsReportModalOpen(true);
  };

  const handleLocationClick = (lat, lng) => {
    // Option A: Open Google Maps in new tab (currently implemented)
    openGoogleMaps(lat, lng);
    
    // Option B: To use embedded Leaflet map instead, uncomment below and comment out the line above:
    // setSelectedLocation({ lat, lng });
    // setIsMapModalOpen(true);
  };

  const getSeverityClass = (severity) => {
    return `report-table__severity report-table__severity--${severity.toLowerCase()}`;
  };

  return (
    <div className="report-table-container">
      {/* Desktop Table View */}
      <div className="report-table__wrapper">
        <table className="report-table" role="table">
          <thead>
            <tr>
              <th scope="col">Platform</th>
              <th scope="col">Post</th>
              <th scope="col">User Details</th>
              <th scope="col">Severity</th>
              <th scope="col">Toxicity</th>
              <th scope="col">Post Link</th>
              <th scope="col">Location</th>
              <th scope="col">Police Station</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleReports.map((report) => (
              <tr key={report.id} className="report-table__row">
                <td className="report-table__cell report-table__cell--platform">
                  <span className={`platform-badge platform-badge--${report.platform.toLowerCase()}`}>
                    {report.platform}
                  </span>
                </td>
                
                <td className="report-table__cell report-table__cell--post">
                  <button 
                    className="post-preview"
                    onClick={() => handlePostClick(report)}
                    aria-label={`View full post: ${truncateText(report.post, 50)}`}
                  >
                    {truncateText(report.post, 80)}
                  </button>
                </td>

                <td className="report-table__cell report-table__cell--user">
                  <div className="user-details">
                    <div className="user-details__name">{report.user.name}</div>
                    <div className="user-details__username">{report.user.username}</div>
                    {report.user.email && (
                      <div className="user-details__contact">{report.user.email}</div>
                    )}
                    {report.user.phone && (
                      <div className="user-details__contact">{report.user.phone}</div>
                    )}
                  </div>
                </td>

                <td className="report-table__cell">
                  <span className={getSeverityClass(report.toxicitySeverity)}>
                    {report.toxicitySeverity}
                  </span>
                </td>

                <td className="report-table__cell report-table__cell--toxicity">
                  <div className="toxicity-info">
                    <div className="toxicity-info__score">{report.toxicityScore}/10</div>
                    <div className="toxicity-info__tags">
                      {report.toxicityTags.map((tag, index) => (
                        <span key={index} className="toxicity-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>

                <td className="report-table__cell">
                  <a 
                    href={report.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="post-link"
                    aria-label="Open original post in new tab"
                  >
                    View Post
                  </a>
                </td>

                <td className="report-table__cell">
                  <button
                    className="location-coords"
                    onClick={() => handleLocationClick(report.location.lat, report.location.lng)}
                    aria-label={`View location ${report.location.lat}, ${report.location.lng} on map`}
                  >
                    {report.location.lat}, {report.location.lng}
                  </button>
                </td>

                <td className="report-table__cell report-table__cell--police">
                  {report.policeStation}
                </td>

                <td className="report-table__cell">
                  <button 
                    className="report-button"
                    onClick={() => handleReportClick(report)}
                    aria-label={`Report this post from ${report.platform}`}
                  >
                    Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="report-cards">
        {sampleReports.map((report) => (
          <div key={`card-${report.id}`} className="report-card">
            <div className="report-card__header">
              <span className={`platform-badge platform-badge--${report.platform.toLowerCase()}`}>
                {report.platform}
              </span>
              <span className={getSeverityClass(report.toxicitySeverity)}>
                {report.toxicitySeverity}
              </span>
            </div>

            <div className="report-card__content">
              <div className="report-card__section">
                <h4>Post Content</h4>
                <button 
                  className="post-preview"
                  onClick={() => handlePostClick(report)}
                >
                  {truncateText(report.post, 120)}
                </button>
              </div>

              <div className="report-card__section">
                <h4>User</h4>
                <div className="user-details">
                  <div className="user-details__name">{report.user.name}</div>
                  <div className="user-details__username">{report.user.username}</div>
                  {report.user.email && (
                    <div className="user-details__contact">{report.user.email}</div>
                  )}
                  {report.user.phone && (
                    <div className="user-details__contact">{report.user.phone}</div>
                  )}
                </div>
              </div>

              <div className="report-card__section">
                <h4>Toxicity</h4>
                <div className="toxicity-info">
                  <div className="toxicity-info__score">{report.toxicityScore}/10</div>
                  <div className="toxicity-info__tags">
                    {report.toxicityTags.map((tag, index) => (
                      <span key={index} className="toxicity-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="report-card__section">
                <h4>Location</h4>
                <button
                  className="location-coords"
                  onClick={() => handleLocationClick(report.location.lat, report.location.lng)}
                >
                  {report.location.lat}, {report.location.lng}
                </button>
                <div className="police-station">{report.policeStation}</div>
              </div>

              <div className="report-card__actions">
                <a 
                  href={report.postLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-link"
                >
                  View Post
                </a>
                <button 
                  className="report-button"
                  onClick={() => handleReportClick(report)}
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
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