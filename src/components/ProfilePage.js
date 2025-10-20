import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Removed useNavigate import
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function ProfilePage() {
  const { user } = useAuth();
  // Removed navigate variable
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setError('');
      setMessage('');
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('username, role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUsername(data.username);
          setRole(data.role);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update({ username: username, role: role })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Profile updated successfully!');
      // Removed navigate call
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="xs" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Your Profile
        </Typography>

        <Box component="form" onSubmit={handleUpdateProfile} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={user?.email || ''}
            disabled
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="role"
            label="Role"
            name="role"
            value={role || ''}
            disabled
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />

          {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={updating}
            sx={{ mt: 3, mb: 2 }}
          >
            {updating ? 'Saving...' : 'Update Profile'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Link component={RouterLink} to="/update-password" variant="body2">
              Change Password
            </Link>
            <Link component={RouterLink} to="/" variant="body2">
              Back to Dashboard
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ProfilePage;