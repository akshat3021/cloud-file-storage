import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { getAllUserProfiles } from '../admin'; 

function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null); 

        const userList = await getAllUserProfiles();
        
        const currentUserProfile = users.find(u => u.id === useAuth()?.user?.id); 
        if (currentUserProfile?.role !== 'admin') {
           console.warn("Access denied: User is not an admin.");
           setError("Access denied. You do not have permission to view this page.");
           setUsers([]); 
           setLoading(false);
           return; 
        }

        setUsers(userList);
        
      } catch (err) {
          console.error("Error fetching users:", err);
          setError(err.message || "Failed to fetch users.");
          setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
   
  }, [useAuth()?.user]); 
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <hr />
      
      <h2>User Management</h2>

      {/* Display Loading or Error Messages */}
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {/* Display Table only if not loading and no error */}
      {!loading && !error && (
        <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid black' }}>User ID</th>
              {/* Added Username header */}
              <th style={{ padding: '8px', border: '1px solid black' }}>Username</th> 
              <th style={{ padding: '8px', border: '1px solid black' }}>Role</th>
              { }
              {}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '8px', border: '1px solid black' }}>{user.id}</td>
                  {/* Display the username */}
                  <td style={{ padding: '8px', border: '1px solid black' }}>{user.username}</td> 
                  <td style={{ padding: '8px', border: '1px solid black' }}>{user.role}</td>
                  {/* Optional: Add buttons for actions */}
                  {/* <td style={{ padding: '8px', border: '1px solid black' }}>
                      <button>Edit Role</button>
                      <button style={{ marginLeft: '5px' }}>Delete User</button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '8px', textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;