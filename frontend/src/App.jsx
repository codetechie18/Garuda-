import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Reports from './Pages/Reports';
import Scrape from './Pages/Scrape';
import Profile from './Pages/Profile';
import Navbar from './components/Navbar';
import UserManagement from './Pages/UserManagement';
import ReportTable from './Pages/ReportTable.jsx';
import './App.css';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('garudaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('garudaUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('garudaUser');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('garudaUser', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? 
              <Dashboard user={user} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/reports" 
            element={
              isLoggedIn ? 
              <Reports user={user} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/scrape" 
            element={
              isLoggedIn ? 
              <Scrape user={user} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isLoggedIn ? 
              <Profile user={user} updateUser={updateUser} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/usermanagement" 
            element={
              isLoggedIn ? 
              <UserManagement user={user} /> : 
              <Navigate to="/login" replace />
            }
          />
          <Route 
            path="/reportstable" 
            element={<ReportTable />}
          />  
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;