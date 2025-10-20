import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // 1. Import supabase directly

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- UPDATED HANDLELOGIN FUNCTION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Sign in the user using Supabase auth
      const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      // Step 2: If login is successful, get the user's profile to check their role
      if (loginData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role') // Only fetch the role
          .eq('id', loginData.user.id) // Match the profile ID to the logged-in user's ID
          .single(); // Expect only one profile row

        if (profileError) {
          // Handle cases where profile might not exist (though trigger should prevent this)
          console.error("Error fetching profile after login:", profileError);
          navigate('/'); // Default to user dashboard if profile fetch fails
        } else {
          // Step 3: Redirect based on the fetched role
          if (profile?.role === 'admin') {
            navigate('/admin-dashboard'); // Redirect admins
          } else {
            navigate('/'); // Redirect regular users to the main dashboard
          }
        }
      } else {
        // Handle unexpected case where login succeeds but no user data is returned
        console.warn("Login successful but no user data returned.");
        navigate('/'); // Default redirect
      }

    } catch (err) { // Catch errors from either signIn or profile fetch
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  // --- END OF UPDATED HANDLELOGIN FUNCTION ---

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Good to add basic required validation
        />
        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Good to add basic required validation
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;