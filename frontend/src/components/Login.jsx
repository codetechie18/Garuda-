import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isRegistering) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
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

    if (isRegistering) {
      // Registration logic
      const userData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: `${formData.username}@garuda.gov.in`,
        avatar: `${formData.firstName[0]}${formData.lastName[0]}`,
        joinDate: new Date().toLocaleDateString()
      };
      onLogin(userData);
    } else {
      // Login logic - for demo, any valid credentials work
      const userData = {
        username: formData.username,
        firstName: 'Agent',
        lastName: 'Smith',
        email: `${formData.username}@garuda.gov.in`,
        avatar: 'AS',
        joinDate: '2024-01-15'
      };
      onLogin(userData);
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
                  Username or Email
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your username or email"
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
            {isRegistering && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <User size={20} />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <User size={20} />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label">
                <User size={20} />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Enter your username"
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
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
            
            {!isRegistering && (
              <div className="forgot-password">
                <button
                  type="button"
                  className="reset-link"
                  onClick={() => setShowResetPassword(true)}
                >
                  Reset Password
                </button>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-full mb-3">
              {isRegistering ? 'Register' : 'Login'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline w-full"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 20px;
        }
        
        .login-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
          z-index: -1;
        }
        
        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .login-form-container {
          max-width: 400px;
          width: 100%;
        }
        
        .login-form {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .login-icon {
          color: #1e3a8a;
          margin-bottom: 16px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .login-header h1 {
          color: #1e3a8a;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .login-header p {
          color: #64748b;
          font-size: 14px;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }
        
        .password-input {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
        }
        
        .password-toggle:hover {
          color: #374151;
        }
        
        .forgot-password {
          text-align: right;
          margin-bottom: 24px;
        }
        
        .reset-link {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 14px;
          text-decoration: underline;
        }
        
        .reset-link:hover {
          color: #1d4ed8;
        }
        
        .error-text {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
        
        .form-input.error {
          border-color: #dc2626;
        }
        
        @media (max-width: 480px) {
          .login-form {
            padding: 24px;
            margin: 20px;
          }
          
          .login-header h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;