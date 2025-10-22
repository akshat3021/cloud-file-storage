import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await resetPasswordForEmail(email);
      setMessage('If an account with this email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '1.5rem',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 1 }}>
            Forgot Password
          </Typography>
          <Typography component="p" variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 3 }}>
            Enter your email address and we will send you a link to reset your password.
          </Typography>

          <Box component="form" onSubmit={handlePasswordReset} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '0.75rem',
                  '&:before, &:after': { borderBottom: 'none' },
                  '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                },
                input: { color: 'white' },
                label: { color: '#ccc' },
              }}
            />

            {message && <Alert severity="success" sx={{ width: '100%', mt: 2, borderRadius: '0.5rem' }}>{message}</Alert>}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'text.secondary' }}>
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;