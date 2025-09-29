import { useState } from 'react';
import { Search, RefreshCw, ExternalLink, MapPin } from 'lucide-react';
import '../Styles/SearchPosts.css';

const SearchPosts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('hashtag');
  const [platform, setPlatform] = useState('all');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
    },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(sampleResults);
      setIsSearching(false);
    }, 1500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setLocation('');
    setPlatform('all');
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      Twitter: '🐦',
      Facebook: '📘',
      Instagram: '📷',
      LinkedIn: '💼',
      TikTok: '🎵',
    };
    return icons[platform] || '🌐';
  };

  return (
    <div className="search-posts-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <Search size={24} />
            Search Posts
          </h1>
          <p className="page-description">
            Search across social media platforms for specific content, hashtags, or users
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-main">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'hashtag' ? 'Enter hashtag (e.g., #cybersecurity)' : 'Enter username (e.g., @username)'}
                className="search-input"
                required
              />
            </div>
            <button 
              type="submit" 
              className="search-btn"
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <>
                  <RefreshCw className="spinning" size={16} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search
                </>
              )}
            </button>
          </div>

          <div className="search-filters">
            <div className="filter-group">
              <label className="filter-label">Search Type</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="hashtag"
                    checked={searchType === 'hashtag'}
                    onChange={(e) => setSearchType(e.target.value)}
                  />
                  <span>Hashtag</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="username"
                    checked={searchType === 'username'}
                    onChange={(e) => setSearchType(e.target.value)}
                  />
                  <span>Username</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Platform</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Platforms</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or region"
                className="filter-input"
              />
            </div>

            <button 
              type="button" 
              onClick={clearSearch}
              className="clear-btn"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h2>Search Results</h2>
            <span className="results-count">{searchResults.length} posts found</span>
          </div>
          
          <div className="results-grid">
            {searchResults.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="platform-info">
                    <span className="platform-icon">{getPlatformIcon(post.platform)}</span>
                    <span className="platform-name">{post.platform}</span>
                  </div>
                  <span className="post-time">{post.timestamp}</span>
                </div>
                
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                
                <div className="post-author">
                  <strong>{post.authorName}</strong>
                  <span className="author-handle">{post.author}</span>
                </div>
                
                <div className="post-stats">
                  <div className="stats-left">
                    <span className="stat">
                      ❤️ {post.likes}
                    </span>
                    {post.retweets && (
                      <span className="stat">
                        🔄 {post.retweets}
                      </span>
                    )}
                    {post.shares && (
                      <span className="stat">
                        📤 {post.shares}
                      </span>
                    )}
                    {post.comments && (
                      <span className="stat">
                        💬 {post.comments}
                      </span>
                    )}
                  </div>
                  <div className="stats-right">
                    {post.location && (
                      <span className="location">
                        <MapPin size={12} />
                        {post.location}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="post-actions">
                  <a 
                    href={post.postUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-post-btn"
                  >
                    <ExternalLink size={14} />
                    View Post
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !isSearching && (
        <div className="empty-state">
          <Search size={48} className="empty-icon" />
          <h3>Start Searching</h3>
          <p>Enter a hashtag or username to search across social media platforms</p>
        </div>
      )}
    </div>
  );
};

export default SearchPosts;