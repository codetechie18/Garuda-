import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Shield, User, Lock } from 'lucide-react';
import '../Styles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState({});
  // If Backend error will be occures
  const [apiError, setApiError] = useState('');

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
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  // Login logic 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setApiError(data.msg || 'An error occurred. Please try again.');
            return;
        }

        localStorage.setItem('token', data.token);
        onLogin(data.user);

    } catch (error) {
        console.error('Login Error:', error);
        setApiError('Could not connect to the server. Please check your connection.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert('Password reset link has been sent to your registered email address.');
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
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your registered email"
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
                Email
              </label>
              <input
                type="text"
                name="email" // 'Email' se 'email' kiya gaya
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your Email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
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

            {apiError && <p className="error-text api-error">{apiError}</p>}
            
            <div style={{textAlign: 'center', marginTop: '20px'}}>
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

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;

