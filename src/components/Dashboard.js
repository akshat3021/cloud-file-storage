import React from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import { useNavigate } from 'react-router-dom';   // 2. Import useNavigate

function Dashboard() {
  const { signOut } = useAuth(); // 3. Get the signOut function
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to the login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // ... (The rest of your Dashboard component code remains the same)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  };

  const sampleFiles = [
    { id: 1, name: 'Project-Proposal.pdf', size: 1200 },
    { id: 2, name: 'Team-Photo.jpg', size: 850 },
  ];


  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <hr />

      <div>
        <h2>Upload a New File</h2>
        <input type="file" onChange={handleFileChange} />
      </div>

      <hr />

      <div>
        <h2>Your Files</h2>
        {sampleFiles.map(file => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

// You will need to import FileItem if it's not already
import FileItem from './FileItem';

export default Dashboard;