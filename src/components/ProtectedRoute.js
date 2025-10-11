import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    // Placeholder authentication check
  return true;
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // If the user is not authenticated, redirect them to the login page.
    return <Navigate to="/login" />;
  }
  return children; // If authenticated, show the component (e.g., the Dashboard).
}

export default ProtectedRoute;