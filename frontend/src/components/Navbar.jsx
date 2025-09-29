import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, FileText, User, LogOut, ChevronDown, Menu, X, Search, Settings, Calendar } from 'lucide-react';
import '../Styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => { 1.68
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
            {/* Scrape removed from top nav per request */}
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
              
              {/* Social Insights Section with Submenu */}
              <div className="nav-section">
                <div className="nav-section-header">
                  <Search size={16} />
                  <span>Social Insights</span>
                </div>
                <div className="nav-submenu">
                  <Link to="/scrape" className={`drawer-sublink ${isActive('/scrape') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                    <span>Scrape</span>
                  </Link>
                  <Link to="/searchposts" className={`drawer-sublink ${isActive('/searchposts') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                    <span>Search Posts</span>
                  </Link>
                </div>
              </div>
              {/* <Link to="/reports" className={`drawer-link ${isActive('/reports') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <FileText size={16} />
                <span>Reporting</span>
              </Link> */}
              <Link to="/Reportstable" className={`drawer-link ${isActive('/Reportstable') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <FileText size={16} />
                <span>Reportstable</span>
              </Link>
              <Link 
                to="/usermanagement" 
                className={`drawer-link ${isActive('/usermanagement') ? 'active' : ''}`} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} />
                <span>User Management</span>
              </Link>
              <Link to="/admin" className={`drawer-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <Settings size={16} />
                <span>Administration</span>
              </Link>
              <Link to="/scheduler" className={`drawer-link ${isActive('/scheduler') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <Calendar size={16} />
                <span>Scheduler</span>
              </Link>
            </nav>
          </aside>
        </>
      )}
      
 
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