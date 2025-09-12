import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Shield, User, Lock } from 'lucide-react';
import '../Styles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    Username: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Username.trim()) {
      newErrors.Username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Login logic - for demo, any valid credentials work
    const userData = {
      Username: formData.Username,
      firstName: 'Agent',
      lastName: 'Smith',
      Email: `${formData.Username}@garuda.gov.in`,
      avatar: 'AS',
      joinDate: '2024-01-15'
    };
    onLogin(userData);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your registered Username address.');
    setShowResetPassword(false);
  };

  if (showResetPassword) {
    return (
      <div className="login-container">
        <div className="login-background">
          <div className="grid-pattern"></div>
        </div>
        <div className="login-form-container fade-in">
          <div className="login-form">
            <div className="login-header">
              <Shield size={48} className="login-icon" />
              <h1>GARUDA CYBERSEC</h1>
              <p>Government Security Portal</p>
            </div>
            
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">
                  <User size={20} />
                  Username or Email
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your Username or Email"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full mb-3">
                Send Reset Link
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline w-full"
                onClick={() => setShowResetPassword(false)}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="grid-pattern"></div>
      </div>
      <div className="login-form-container fade-in">
        <div className="login-form">
          <div className="login-header">
            <Shield size={48} className="login-icon" />
            <h1>GARUDA CYBERSEC</h1>
            <p>Government Security Portal</p>
          </div>
          
          <form onSubmit={handleSubmit}>
           
            <div className="form-group">
              <label className="form-label">
                <User size={20} />
                Username
              </label>
              <input
                type="text"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
                className={`form-input ${errors.Username ? 'error' : ''}`}
                placeholder="Enter your Username"
              />
              {errors.Username && <span className="error-text">{errors.Username}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <Lock size={20} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div style={{textAlign: 'center'}}>
              <button type="submit" className="btn btn-primary btn-large mx-auto block mb-3">
                Login
              </button>

              <div className="forgot-password mt-2">
                <button
                  type="button"
                  className="reset-link"
                  onClick={() => setShowResetPassword(true)}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Login;

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};