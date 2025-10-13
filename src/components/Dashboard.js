import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../user';
import FileItem from './FileItem';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user);
        setProfile(userProfile);
      }
    };
    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      alert(`The upload functionality for "${selectedFile.name}" is not connected yet.`);
    }
  };

  const sampleFiles = [
    { id: 1, name: 'Project-Proposal.pdf', size: 1200 },
    { id: 2, name: 'Team-Photo.jpg', size: 850 },
  ];

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        {}
        <h1>{profile ? `${profile.username}'s Dashboard` : 'Dashboard'}</h1>
        <div>
          {}
          {profile && <span style={{ marginRight: '15px' }}>Role: {profile.role}</span>}
          <Link to="/profile">
            <button>My Profile</button>
          </Link>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </header>
      <hr />

      <div>
        <h2>Upload a New File</h2>
        <input type="file" onChange={handleFileChange} />
        {selectedFile && (
          <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
            Upload
          </button>
        )}
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

export default Dashboard;                            