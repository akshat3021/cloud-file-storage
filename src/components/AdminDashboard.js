import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUserProfiles, updateUserRole, deleteUserProfile } from '../admin'; // 1. Import deleteUserProfile
import { getUserProfile } from '../user';

function AdminDashboard() {
  const { user, signOut } = useAuth(); 
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    // ... (keep your existing useEffect logic to check admin and fetch users) ...
     const checkAdminAndFetchUsers = async () => {
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

  const handleRoleChange = async (userIdToUpdate, newRole) => {
    // ... (keep existing role change logic) ...
     if (!isAdmin) return; 
    if (userIdToUpdate === user.id) {
        alert("Admins cannot change their own role from this interface.");
        return;
    }
    try {
      const updatedProfile = await updateUserRole(userIdToUpdate, newRole);
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

  // --- 2. ADD THIS FUNCTION to handle user deletion ---
  const handleDeleteUser = async (userIdToDelete, usernameToDelete) => {
     if (!isAdmin) return; // Extra safety check
     if (userIdToDelete === user.id) {
        alert("Admins cannot delete their own account from this interface.");
        return;
    }
    if (!window.confirm(`Are you sure you want to delete user: ${usernameToDelete}? This action cannot be undone.`)) {
        return;
    }
    try {
        await deleteUserProfile(userIdToDelete);
        // Remove the user from the local state
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userIdToDelete));
        alert('User profile deleted successfully!');
    } catch (err) {
        alert(`Error deleting user: ${err.message}`);
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
                  <td style={{ padding: '8px', border: '1px solid black' }}>
                    {/* Role Change Dropdown */}
                    {userItem.id !== user.id && ( 
                      <select 
                        value={userItem.role} 
                        onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                        style={{ marginRight: '10px' }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                    {/* --- 3. ADD Delete Button --- */}
                    {userItem.id !== user.id && ( 
                       <button onClick={() => handleDeleteUser(userItem.id, userItem.username)}>
                           Delete User
                       </button>
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