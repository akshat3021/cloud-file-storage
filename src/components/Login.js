import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // New state for error messages

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- Start of Validation ---
    if (!email || !password) {
      setError('Email and password cannot be empty.');
      return; // Stop the function
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return; // Stop the function
    }
    // --- End of Validation ---

    console.log('Validation passed! Logging in with:', { email, password });
    // Yasharth's Firebase authentication logic will go here
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Display the error message if it exists */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email</label>
          <input
            type="email" // The type="email" provides some built-in browser validation
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;