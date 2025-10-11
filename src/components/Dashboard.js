import React from 'react';

function Dashboard() {
  const handleLogout = () => {
    console.log('User is logging out...');
    // Yasharth's Firebase logout function will be called here.
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      // Gagandeep's file upload function will be called here.
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <hr />

      {/* --- File Upload Section --- */}
      <div>
        <h2>Upload a New File</h2>
        <input type="file" onChange={handleFileChange} />
      </div>

      <hr />

      {/* --- File List Section --- */}
      <div>
        <h2>Your Files</h2>
        <p>File list will appear here...</p>
        {/* Later, we will map over user's files and display them. */}
      </div>
    </div>
  );
}

export default Dashboard;