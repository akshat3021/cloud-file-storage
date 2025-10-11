import React from 'react';

function Dashboard() {
  // This function will handle the logout process
  const handleLogout = () => {
    console.log('User is logging out...');
    // Later, Yasharth's Firebase logout function will be called here.
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <hr />
      <p>This is where the user's files will be displayed.</p>
    </div>
  );
}

export default Dashboard;