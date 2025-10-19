import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

function ProfilePage() {
  const { user } = useAuth(); // Get the current user
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  // 1. Fetch the user's current profile data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!user) return; // Wait until the user is loaded

        const { data, error } = await supabase
          .from('profiles')
          .select('username, role') // Fetches these columns
          .eq('id', user.id) // Get the profile for the logged-in user
          .single(); // We only expect one row

        if (error) throw error;

        if (data) {
          setUsername(data.username);
          setRole(data.role);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Re-run this effect if the user object changes

  // 2. Handle the form submission to update the profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ username: username, role: role }) // Update username and role
        .eq('id', user.id); // For the current user

      if (error) throw error;
      
      alert('Profile updated successfully!');
      navigate('/'); // Go back to dashboard after update
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label htmlFor="email">Email</label>
          {/* Email is from auth and cannot be changed here */}
          <input id="email" type="text" value={user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            value={role || ''}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>

      <hr />

      {/* 3. Link to your Update Password page */}
      <Link to="/update-password">
        <button>Change Password</button>
      </Link>
      <br />
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
}

export default ProfilePage;