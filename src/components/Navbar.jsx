import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, FileText, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';

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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className="hamburger"
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

      {/* Mobile menu (visible when hamburger toggled) */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/dashboard" className={`mobile-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/reports" className={`mobile-link ${isActive('/reports') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <FileText size={18} />
            <span>Reports</span>
          </Link>
          <Link to="/scrape" className={`mobile-link ${isActive('/scrape') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <FileText size={18} />
            <span>Scrape</span>
          </Link>
        </div>
      )}
      
  <style>{`
        .navbar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          left: 0;
          right: 0;
          top: 0;
          /* make navbar sit above interactive layers like maps */
          z-index: 9999;
        }
        
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 8px; /* reduced left padding so logo sits more to the left */
        
          padding-top: 0;
          padding-bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 48px;
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #1e3a8a;
          position: absolute; /* pin brand to left edge of navbar */
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1100;
        }
        
        .brand-icon {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        
        .brand-name {
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
        }
        
        .brand-subtitle {
          font-size: 12px;
          color: #64748b;
          line-height: 1;
        }
        
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          text-decoration: none;
          color: #64748b;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .nav-link:hover {
          background: #f1f5f9;
          color: #1e3a8a;
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          background: #1e3a8a;
          color: white;
        }
        
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: 0;
          position: absolute; /* pin to right edge of navbar */
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .welcome-text {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }
        
        .profile-dropdown {
          position: relative;
        }
        
        .profile-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .profile-button:hover {
          background: #f1f5f9;
        }
        
        .nav-profile-avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          max-width: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
          overflow: hidden; /* prevent long text or images from expanding the box */
        }

        .nav-profile-avatar .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .profile-initials {
          font-weight: 600;
          color: #1e3a8a;
        }
        
        .chevron {
          transition: transform 0.3s ease;
          color: #64748b;
        }

        /* hide hamburger on desktop by default; show only in mobile media query */
        .hamburger {
          display: none;
        }
        
        .chevron.rotated {
          transform: rotate(180deg);
        }
        
        .profile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 1000;
          margin-top: 8px;
        }
        
        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          text-decoration: none;
          color: #374151;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .profile-menu-item:hover {
          background: #f9fafb;
          color: #1e3a8a;
        }
        
        .logout-item {
          border-top: 1px solid #e5e7eb;
          color: #dc2626;
        }
        
        .logout-item:hover {
          background: #fef2f2;
          color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 16px;
          }
          
          .navbar-left {
            gap: 24px;
          }
          /* keep brand icon visible on small screens; hide textual part */
          .brand-text {
            display: none;
          }

          /* show hamburger */
          .hamburger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            color: #1e3a8a;
            border-radius: 8px;
            transition: background 0.2s ease;
          }

          .hamburger:hover {
            background: #f1f5f9;
          }

          .navbar-nav {
            display: none; /* hide normal nav on small */
          }

          /* mobile menu styles */
          .mobile-menu {
            position: absolute;
            left: 0;
            right: 0;
            top: 70px;
            background: white;
            border-top: 1px solid #e5e7eb;
            box-shadow: 0 4px 8px rgba(0,0,0,0.06);
            display: flex;
            flex-direction: column;
            z-index: 900;
          }

          .mobile-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            text-decoration: none;
            color: #374151;
            border-bottom: 1px solid #f3f4f6;
          }

          .mobile-link.active {
            background: #1e3a8a;
            color: white;
          }
          
          .navbar-nav {
            gap: 4px;
          }
          
          .nav-link span {
            display: none;
          }
          
          .nav-link {
            padding: 12px;
          }
          
          .welcome-text {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .navbar-container {
            height: 60px;
          }
          
          .profile-avatar {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
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