import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { uploadAvatar } from '../user'; // Corrected import
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setError('');
      setMessage('');
      try {
        setLoading(true);
        if (!user) return;

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('username, role, avatar_url')
          .eq('id', user.id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setUsername(data.username || '');
          setRole(data.role || '');
          setAvatarUrl(data.avatar_url || null);
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
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: username, role: role })
        .eq('id', user.id);
      if (updateError) throw updateError;
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    if (!user) return;

    const file = event.target.files[0];
    try {
      setUploadingAvatar(true);
      setError('');
      const newAvatarUrl = await uploadAvatar(user.id, file);
      setAvatarUrl(newAvatarUrl);
      setMessage('Avatar updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom, #87CEEB, #a7d8ed)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #87CEEB, #a7d8ed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '1.5rem',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
            Your Profile
          </Typography>

          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
            <Avatar
              src={avatarUrl || undefined}
              sx={{ width: 100, height: 100, fontSize: '3rem' }}
            >
              {!avatarUrl && username ? username[0].toUpperCase() : null}
            </Avatar>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              disabled={uploadingAvatar}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
              }}
            >
              {uploadingAvatar ? <CircularProgress size={24} /> : <EditIcon fontSize="small" />}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarUpload}
              />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={handleUpdateProfile} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={user?.email || ''}
              disabled
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&.Mui-disabled': { backgroundColor: 'rgba(0, 0, 0, 0.3)', } },
                '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#ECEFF1', color: '#ECEFF1', },
                '& .MuiInputLabel-root.Mui-disabled': { color: '#B0BEC5' }
              }}
              InputProps={{ readOnly: true }}
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
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, },
                input: { color: 'white' }, label: { color: '#ccc' },
                '& label.Mui-focused': { color: 'primary.main' },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="role"
              label="Role"
              name="role"
              value={role || ''}
              disabled
              variant="filled"
              sx={{
                 '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&.Mui-disabled': { backgroundColor: 'rgba(0, 0, 0, 0.3)', } },
                 '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#ECEFF1', color: '#ECEFF1', },
                 '& .MuiInputLabel-root.Mui-disabled': { color: '#B0BEC5' }
              }}
              InputProps={{ readOnly: true }}
            />

            {message && <Alert severity="success" sx={{ width: '100%', mt: 2, borderRadius: '0.5rem' }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ width: '100%', mt: 2, borderRadius: '0.5rem' }}>{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={updating || uploadingAvatar}
              sx={{
                mt: 3, mb: 2, borderRadius: '0.75rem', py: 1.5, fontWeight: 'bold',
                boxShadow: 3, '&:hover': { transform: 'scale(1.02)' }, transition: 'transform 0.15s',
              }}
            >
              {updating ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
              <Link component={RouterLink} to="/update-password" variant="body2" sx={{ color: 'text.secondary' }}>
                Change Password
              </Link>
              <Link component={RouterLink} to="/" variant="body2" sx={{ color: 'text.secondary' }}>
                Back to Dashboard
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProfilePage;