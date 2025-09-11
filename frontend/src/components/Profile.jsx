import { useState } from 'react';
import { User, Edit2, Save, X, Lock, Shield, Calendar, Mail, Phone, MapPin } from 'lucide-react';

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

      <style jsx>{`
        .profile {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 24px 0;
        }
        
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .profile-header {
          margin-bottom: 32px;
        }
        
        .profile-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .profile-header p {
          color: #64748b;
          font-size: 16px;
        }
        
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .profile-card {
          padding: 32px;
        }
        
        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 36px;
          position: relative;
          overflow: hidden;
        }
        
        .profile-info h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .profile-username {
          color: #64748b;
          font-size: 16px;
          margin-bottom: 16px;
        }
        
        .profile-meta {
          display: flex;
          gap: 20px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #64748b;
        }
        
        .info-card {
          padding: 24px;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .card-title h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .info-display {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .info-item label {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .info-item span {
          font-size: 16px;
          color: #1e293b;
        }
        
        .edit-form, .password-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        
        .security-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .security-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .security-details h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .security-details p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
        
        .security-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .security-status.active {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .error-text {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .form-input.error {
          border-color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .profile-container {
            padding: 0 16px;
          }
          
          .profile-header h1 {
            font-size: 24px;
          }
          
          .profile-avatar-section {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 28px;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .info-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .security-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;