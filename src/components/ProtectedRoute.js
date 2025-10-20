import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../user';
import { useState, useEffect } from 'react'; 

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user);
        setProfile(userProfile);
        setLoading(false);
      } else {
        setLoading(false); 
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>; 
  }

  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    
    return <Navigate to="/" />;
  }

 
  return children;
}

export default ProtectedRoute;