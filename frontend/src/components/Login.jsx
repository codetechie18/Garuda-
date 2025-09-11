import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // Server se aane wale error ke liye

  // Input field me kuch bhi type karne par state update karega
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Backend API ka URL
    const API_URL = 'http://localhost:4000/api/login';

    // API ko bhejne wala data
    const payload = { 
        email: formData.email, 
        password: formData.password 
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        // Agar server se error aaye to use state me set karo
        setApiError(data.msg || "Login failed.");
        return;
      }

      // Login successful hone par
      if (data.token) {
        localStorage.setItem("token", data.token); // Token ko localStorage me save karo
      }
      onLogin(data.user); // Parent component ko user data bhejo

    } catch (error) {
      console.error("Error:", error);
      setApiError("Something went wrong. Please try again.");
    }
  };

  // Password reset form submit hone par yeh function chalega
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!resetIdentifier.trim()) {
        setApiError('Please enter your username or email.');
        return;
    }
    
    try {
        const res = await fetch("http://localhost:4000/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: resetIdentifier }),
        });

        const data = await res.json();

        if (!res.ok) {
            setApiError(data.msg || "Failed to send reset link.");
            return;
        }

        alert('Password reset link has been sent to your registered email address.');
        setShowResetPassword(false);
        setResetIdentifier('');

    } catch(error) {
        console.error("Error:", error);
        setApiError("Something went wrong. Please try again.");
    }
  };

  // Agar Reset Password form dikhana hai
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
              <p>Reset Your Password</p>
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
                  value={resetIdentifier}
                  onChange={(e) => {
                      setResetIdentifier(e.target.value);
                      setApiError('');
                  }}
                  required
                />
              </div>
              
              {apiError && <span className="error-text api-error">{apiError}</span>}

              <button type="submit" className="btn btn-primary w-full mb-3">
                Send Reset Link
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline w-full"
                onClick={() => {
                  setShowResetPassword(false);
                  setApiError('');
                }}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
        <style jsx>{`
            /* Styling same as original */
            .api-error {
                text-align: center;
                margin-bottom: 16px;
            }
        `}</style>
      </div>
    );
  }

  // Login form
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
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
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
            
            <div className="forgot-password">
              <button
                type="button"
                className="reset-link"
                onClick={() => {
                  setShowResetPassword(true);
                  setErrors({});
                  setApiError('');
                }}
              >
                Reset Password
              </button>
            </div>

            {apiError && <span className="error-text api-error">{apiError}</span>}
            
            <button type="submit" className="btn btn-primary w-full mb-3">
              Login
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
          font-family: 'Inter', sans-serif; /* Added a professional font */
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
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        .login-form-container {
          max-width: 400px;
          width: 100%;
        }

        .fade-in {
            animation: fadeInAnimation 0.5s ease-in-out;
        }

        @keyframes fadeInAnimation {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .login-form {
          background: rgba(255, 255, 255, 0.98);
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
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

        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
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
          display: flex;
          align-items: center;
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
        }
        
        .reset-link:hover {
          text-decoration: underline;
          color: #1d4ed8;
        }
        
        .error-text {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .api-error {
            text-align: center;
            margin-bottom: 16px;
        }
        
        .form-input.error {
          border-color: #ef4444;
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
        }

        .btn {
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: none;
        }
        .btn-primary {
            background-color: #3b82f6;
            color: white;
        }
        .btn-primary:hover {
            background-color: #2563eb;
        }
        .btn-outline {
            background-color: transparent;
            color: #3b82f6;
            border: 1px solid #3b82f6;
        }
        .btn-outline:hover {
            background-color: #eff6ff;
        }
        .w-full {
            width: 100%;
        }
        .mb-3 {
            margin-bottom: 12px;
        }
        
        @media (max-width: 480px) {
          .login-form {
            padding: 24px;
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


