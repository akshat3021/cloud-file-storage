import React from 'react';
import FileItem from './FileItem'; // 1. Import the new component

// 2. Create some sample file data for testing
const sampleFiles = [
  { id: 1, name: 'Project-Proposal.pdf', size: 1200 },
  { id: 2, name: 'Team-Photo.jpg', size: 850 },
];

function Dashboard() {
  // ... (keep the handleLogout and handleFileChange functions)
  const handleLogout = () => {
    console.log('User is logging out...');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  };

  return (
    <div>
      {/* ... (keep the header and upload section) ... */}
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
        {/* 3. Map over the sample data and render a FileItem for each one */}
        {sampleFiles.map(file => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;