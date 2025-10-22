import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Username is required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, username, adminCode || null);
      alert('Sign up successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #87CEEB, #a7d8ed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4, // Add vertical padding
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '1.5rem',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 3 }}>
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, },
                input: { color: 'white' }, label: { color: '#ccc' },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, },
                input: { color: 'white' }, label: { color: '#ccc' },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
               sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, },
                input: { color: 'white' }, label: { color: '#ccc' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#ccc' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="filled"
               sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, },
                input: { color: 'white' }, label: { color: '#ccc' },
              }}
               InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle confirm password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: '#ccc' }}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="adminCode"
              label="Admin Code (Optional)"
              name="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.75rem', '&:before, &:after': { borderBottom: 'none' }, '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, },
                input: { color: 'white' }, label: { color: '#ccc' },
              }}
            />

            {error && <Alert severity="error" sx={{ width: '100%', mt: 2, borderRadius: '0.5rem' }}>{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: '0.75rem',
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: 'lg',
                '&:hover': { transform: 'scale(1.02)' },
                transition: 'transform 0.15s',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit"/> : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'text.secondary' }}>
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;