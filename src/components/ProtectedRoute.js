import React from 'react';
import { Navigate } from 'react-router-dom';

// This is a placeholder for now.
// Later, Yasharth's code will provide the real user status.
const isAuthenticated = () => {
  // For testing, we'll pretend the user is NOT logged in.
  // Change this to 'true' to test the logged-in state.
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