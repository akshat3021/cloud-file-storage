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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          
          {/* Protected Routes */}
          <Route path="/" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
          <Route path="/profile" element={ <ProtectedRoute><ProfilePage /></ProtectedRoute> } />
          
          {/* --- THIS LINE IS UPDATED --- */}
          <Route 
            path="/admin-dashboard" 
            element={ <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute> } 
          />

          {/* Redirect */}
          <Route path="/dashboard" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;