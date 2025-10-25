import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
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

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (signInError) throw signInError;
      if (loginData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', loginData.user.id)
          .single();
        if (profileError) {
          console.error("Error fetching profile after login:", profileError);
          navigate('/');
        } else {
          if (profile?.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // No specific background image here, relies on global background
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
            // Use theme's paper background (semi-transparent white)
            backgroundColor: 'background.paper', // Or explicitly 'rgba(255, 255, 255, 0.8)'
            backdropFilter: 'blur(8px)',
            borderRadius: '1.5rem',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography component="p" variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Log in to access your files.
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username or Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Use outlined variant to contrast with paper background
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Use outlined variant
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'text.secondary' }} // Adjust icon color if needed
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && <Alert severity="error" sx={{ width: '100%', mt: 2, borderRadius: '0.5rem' }}>{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 1,
                borderRadius: '0.75rem',
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: 3, // Use theme shadow
                '&:hover': { transform: 'scale(1.02)' },
                transition: 'transform 0.15s',
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
             <Box sx={{ textAlign: 'center', my: 1 }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: 'text.secondary' }}>
                    Forgot Password?
                </Link>
             </Box>

             <Box sx={{ textAlign: 'center', mt: 3 }}>
               <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: 'text.secondary' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;