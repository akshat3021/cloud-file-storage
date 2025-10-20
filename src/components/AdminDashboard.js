import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUserProfiles, updateUserRole } from '../admin'; // 1. Import updateUserRole
import { getUserProfile } from '../user';

function AdminDashboard() {
  const { user, signOut } = useAuth(); 
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      // ... (keep your existing useEffect logic to fetch users) ...
      if (!user) { 
        setLoading(false);
        setError("Please log in.");
        return;
      }
      try {
        setLoading(true);
        setError(null); 
        const currentUserProfile = await getUserProfile(user); 
        if (currentUserProfile?.role !== 'admin') {
           setError("Access denied. You do not have permission to view this page.");
           setIsAdmin(false);
           setUsers([]); 
        } else {
           setIsAdmin(true);
           const userList = await getAllUserProfiles();
           setUsers(userList);
        }
      } catch (err) {
          setError(err.message || "An error occurred.");
          setUsers([]); 
      } finally {
        setLoading(false);
      }
    };
    checkAdminAndFetchUsers();
  }, [user]); 

  const handleLogout = async () => {
    // ... (keep existing logout logic) ...
     try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // --- 2. ADD THIS FUNCTION to handle role change ---
  const handleRoleChange = async (userIdToUpdate, newRole) => {
    if (!isAdmin) return; // Extra safety check

    // Prevent admin from changing their own role via this UI
    if (userIdToUpdate === user.id) {
        alert("Admins cannot change their own role from this interface.");
        return;
    }

    try {
      // Call the function from admin.js
      const updatedProfile = await updateUserRole(userIdToUpdate, newRole);
      
      // Update the user list in the local state to reflect the change immediately
      setUsers(currentUsers => 
        currentUsers.map(u => 
          u.id === userIdToUpdate ? { ...u, role: updatedProfile.role } : u
        )
      );
      alert('User role updated successfully!');
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };
  // --- END OF NEW FUNCTION ---


  if (loading) { return <p>Loading...</p>; }
  if (error) { /* ... (keep error display logic) ... */ 
      return (
          <div>
              <p style={{ color: 'red' }}>Error: {error}</p>
              <button onClick={handleLogout}>Logout</button> 
          </div>
      );
  }
  if (!isAdmin) { /* ... (keep access denied logic) ... */ 
       return (
           <div>
               <p style={{ color: 'red' }}>Access Denied. You are not an administrator.</p>
               <button onClick={() => navigate('/')}>Go to Dashboard</button>
               <button onClick={handleLogout} style={{marginLeft: '10px'}}>Logout</button> 
           </div>
       );
  }

  return (
    <div>
      {/* ... (keep header) ... */}
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
              {/* --- 3. ADD 'Actions' header --- */}
              <th style={{ padding: '8px', border: '1px solid black' }}>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(userItem => ( 
                <tr key={userItem.id}>
                  <td style={{ padding: '8px', border: '1px solid black' }}>{userItem.id}</td>
                  <td style={{ padding: '8px', border: '1px solid black' }}>{userItem.username}</td> 
                  <td style={{ padding: '8px', border: '1px solid black' }}>{userItem.role}</td>
                  {/* --- 4. ADD buttons/dropdown for actions --- */}
                  <td style={{ padding: '8px', border: '1px solid black' }}>
                    {/* Don't allow changing the current admin's role */}
                    {userItem.id !== user.id && ( 
                      <select 
                        value={userItem.role} 
                        onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>No users found.</td> 
              </tr>
            )}
          </tbody>
        </table>
    </div>
  );
}

export default AdminDashboard;