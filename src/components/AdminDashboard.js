import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';
import { getAllUserProfiles } from '../admin'; // Make sure this path is correct
import { getUserProfile } from '../user'; // Import getUserProfile

function AdminDashboard() {
  // --- FIX: Call useAuth() at the top level ---
  const { user, signOut } = useAuth(); 
  // ---------------------------------------------
  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (!user) { // Check if user exists before proceeding
        setLoading(false);
        setError("Please log in.");
        return;
      }

      try {
        setLoading(true);
        setError(null); 

        // 1. Check current user's role first
        const currentUserProfile = await getUserProfile(user); 
        if (currentUserProfile?.role !== 'admin') {
           console.warn("Access denied: User is not an admin.");
           setError("Access denied. You do not have permission to view this page.");
           setIsAdmin(false);
           setUsers([]); 
        } else {
           // 2. If user is admin, fetch all users
           setIsAdmin(true);
           const userList = await getAllUserProfiles();
           setUsers(userList);
        }
        
      } catch (err) {
          console.error("Error in AdminDashboard:", err);
          setError(err.message || "An error occurred.");
          setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, [user]); // Re-run effect if the user object changes

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Display loading or error messages early
  if (loading) {
      return <p>Loading...</p>;
  }
  if (error) {
      return (
          <div>
              <p style={{ color: 'red' }}>Error: {error}</p>
              <button onClick={handleLogout}>Logout</button> 
          </div>
      );
  }
  // If not loading, no error, but also not admin (handles edge case)
  if (!isAdmin) {
       return (
           <div>
               <p style={{ color: 'red' }}>Access Denied. You are not an administrator.</p>
               <button onClick={() => navigate('/')}>Go to Dashboard</button>
               <button onClick={handleLogout} style={{marginLeft: '10px'}}>Logout</button> 
           </div>
       );
  }


  // Only render the table if loading is done, no errors, and user is admin
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <hr />
      
      <h2>User Management</h2>
        <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid black' }}>User ID</th>
              <th style={{ padding: '8px', border: '1px solid black' }}>Username</th> 
              <th style={{ padding: '8px', border: '1px solid black' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(userItem => ( // Renamed map variable to avoid conflict
                <tr key={userItem.id}>
                  <td style={{ padding: '8px', border: '1px solid black' }}>{userItem.id}</td>
                  <td style={{ padding: '8px', border: '1px solid black' }}>{userItem.username}</td> 
                  <td style={{ padding: '8px', border: '1px solid black' }}>{userItem.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '8px', textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>
  );
}

export default AdminDashboard;