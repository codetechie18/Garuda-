import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, FileText, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import '../Styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // close mobile drawer on Escape key for accessibility
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${mobileMenuOpen ? 'drawer-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/dashboard" className="navbar-brand">
            <Shield size={32} className="brand-icon" />
            <div className="brand-text">
              <span className="brand-name">GARUDA</span>
              <span className="brand-subtitle">Cybersecurity Portal</span>
            </div>
          </Link>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/reports" 
              className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={20} />
              <span>Reports</span>
            </Link>
            <Link 
              to="/scrape" 
              className={`nav-link ${isActive('/scrape') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={20} />
              <span>Scrape</span>
            </Link>
          </div>

          <span className="welcome-text">Welcome, {user?.firstName}</span>
          <div className="profile-dropdown" ref={profileRef}>
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="nav-profile-avatar">
                {user?.avatar && typeof user.avatar === 'string' && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
                  <img src={user.avatar} alt={`${user?.firstName || ''} avatar`} className="profile-img" />
                ) : (
                  (user?.avatar) ? user.avatar : ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || ''))
                )}
              </div>
              <span className="profile-initials hidden-sm">{user?.avatar}</span>
              <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'rotated' : ''}`} />
            </button>
            
            {showProfileMenu && (
              <div className="profile-menu slide-in">
                <Link 
                  to="/profile" 
                  className="profile-menu-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={18} />
                  <span>Profile Settings</span>
                </Link>
                <button 
                  className="profile-menu-item logout-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Left drawer (visible when hamburger toggled) */}
      {mobileMenuOpen && (
        <>
          <div className="backdrop" onClick={() => setMobileMenuOpen(false)} aria-hidden />
          <aside className="side-drawer open" role="dialog" aria-modal="true">
            <div className="side-drawer-header">
              <Link to="/dashboard" className="drawer-brand" onClick={() => setMobileMenuOpen(false)}>
                <Shield size={24} className="brand-icon" />
                <span className="drawer-brand-text">GARUDA</span>
              </Link>
              <button className="close-drawer" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
            </div>
            <nav className="drawer-nav">
              <Link to="/dashboard" className={`drawer-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 size={16} />
                <span>Dashboard</span>
              </Link>
              <div className="drawer-section">
                <div className="drawer-section-title">Social Insights</div>
                <Link to="/social/search" className="drawer-sublink" onClick={() => setMobileMenuOpen(false)}>Search</Link>
                <Link to="/scrape" className="drawer-sublink" onClick={() => setMobileMenuOpen(false)}>Scrape</Link>
              </div>
              <div className="drawer-section">
                <div className="drawer-section-title">Reporting</div>
                <Link to="/reports" className="drawer-sublink" onClick={() => setMobileMenuOpen(false)}>Search</Link>
                <Link to="/reports/quick" className="drawer-sublink" onClick={() => setMobileMenuOpen(false)}>Quick Report</Link>
              </div>
<Link 
  to="/usermanagement" 
  className="drawer-link" 
  onClick={() => setMobileMenuOpen(false)}
>
  User Management
</Link>
              <Link to="/admin" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Administration</Link>
              <Link to="/scheduler" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Scheduler</Link>
            </nav>
          </aside>
        </>
      )}
      
  {/* styles moved to Navbar.css */}
    </nav>
  );
};

export default Navbar;

Navbar.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

Navbar.defaultProps = {
  user: {},
  onLogout: () => {},
};