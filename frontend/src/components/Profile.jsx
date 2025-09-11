import { useState } from 'react';
import { User, Edit2, Save, X, Lock, Shield, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import '../Styles/Profile.css';

const Profile = ({ user, updateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || 'Cybersecurity',
    location: user?.location || 'New Delhi'
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      ...editForm,
      avatar: editForm.firstName[0] + editForm.lastName[0]
    };
    
    updateUser(updatedUser);
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, this would make an API call
    alert('Password updated successfully!');
    setIsChangingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header fade-in">
          <h1>Profile Settings</h1>
          <p>Manage your account information and security settings</p>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card card fade-in">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user?.avatar || 'AS'}
              </div>
              <div className="profile-info">
                <h2>{user?.firstName} {user?.lastName}</h2>
                <p className="profile-username">@{user?.username}</p>
                <div className="profile-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Joined {user?.joinDate || 'Recently'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="info-card card fade-in">
            <div className="card-header">
              <div className="card-title">
                <User size={20} />
                <h3>Personal Information</h3>
              </div>
              {!isEditing && (
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleEditChange}
                      className="form-input"
                      placeholder="Agent"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleEditChange}
                      className="form-input"
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="agent.smith@garuda.gov.in"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="form-input"
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      name="department"
                      value={editForm.department}
                      onChange={handleEditChange}
                      className="form-input"
                    >
                      <option>Cybersecurity</option>
                      <option>Network Security</option>
                      <option>Data Protection</option>
                      <option>Incident Response</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <select
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      className="form-input"
                    >
                      <option>New Delhi</option>
                      <option>Mumbai</option>
                      <option>Bangalore</option>
                      <option>Chennai</option>
                      <option>Hyderabad</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        department: user?.department || 'Cybersecurity',
                        location: user?.location || 'New Delhi'
                      });
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <div className="info-item">
                    <label>First Name</label>
                    <span>{user?.firstName || 'Agent'}</span>
                  </div>
                  <div className="info-item">
                    <label>Last Name</label>
                    <span>{user?.lastName || 'Smith'}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <label>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <span>{user?.email || 'agent.smith@garuda.gov.in'}</span>
                </div>
                
                <div className="info-item">
                  <label>
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <span>{user?.phone || '+91 9876543210'}</span>
                </div>
                
                <div className="info-row">
                  <div className="info-item">
                    <label>Department</label>
                    <span>{user?.department || 'Cybersecurity'}</span>
                  </div>
                  <div className="info-item">
                    <label>
                      <MapPin size={16} />
                      Location
                    </label>
                    <span>{user?.location || 'New Delhi'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="info-card card fade-in">
            <div className="card-header">
              <div className="card-title">
                <Shield size={20} />
                <h3>Security Settings</h3>
              </div>
              {!isChangingPassword && (
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Lock size={16} />
                  Change Password
                </button>
              )}
            </div>
            
            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Enter new password"
                    required
                  />
                  {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm new password"
                    required
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} />
                    Update Password
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setErrors({});
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="security-info">
                <div className="security-item">
                  <div className="security-details">
                    <h4>Password</h4>
                    <p>Last changed: 30 days ago</p>
                    <p>Strong password with special characters</p>
                  </div>
                </div>
                
                <div className="security-item">
                  <div className="security-details">
                    <h4>Two-Factor Authentication</h4>
                    <p>Enabled via authenticator app</p>
                  </div>
                  <div className="security-status active">
                    Active
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

  {/* styles moved to Profile.css */}
    </div>
  );
};

export default Profile;