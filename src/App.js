import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import ForgotPassword from './components/ForgotPassword';
import UpdatePassword from './components/UpdatePassword';
import ProtectedRoute from './components/ProtectedRoute';

const AnimatedBackground = () => (
  <div className="background-container">
    <div className="sun-effect">
      <div className="sun-center"></div>
    </div>
    <div className="cloud cloud-1"></div>
    <div className="cloud cloud-2"></div>
    <div className="cloud cloud-3"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AnimatedBackground />
      <div className="App" style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
          <Route path="/profile" element={ <ProtectedRoute><ProfilePage /></ProtectedRoute> } />
          <Route
            path="/admin-dashboard"
            element={ <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute> }
          />
          <Route path="/dashboard" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;