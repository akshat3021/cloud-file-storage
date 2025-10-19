import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../user';
import FileItem from './FileItem';
import { supabase } from '../supabaseClient'; 

function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // State for file management
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]); 
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect for loading the profile
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user);
        setProfile(userProfile);
      }
    };
    loadProfile();
  }, [user]);

  // useEffect to fetch the user's files
  useEffect(() => {
    const fetchFiles = async () => {
      if (user) {
        try {
          setLoadingFiles(true);
          setError(null);
          const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('user_id', user.id); 

          if (error) throw error;
          
          setFiles(data);
        } catch (error) {
          console.error('Error fetching files:', error.message);
          setError(error.message);
        } finally {
          setLoadingFiles(false);
        }
      }
    };
    
    fetchFiles();
  }, [user]); 

  // handleLogout function
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

  // handleUpload function
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    try {
      setUploading(true);
      const file = selectedFile;
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-files') 
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: newFileRecord, error: insertError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          size: file.size,
          user_id: user.id,
          path: filePath, 
        })
        .select() 
        .single(); 
      if (insertError) throw insertError;
      setFiles((prevFiles) => [...prevFiles, newFileRecord]);
      setSelectedFile(null); 
      alert('File uploaded successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  // handleDeleteFile function
  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }
    try {
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([file.path]); 
      if (storageError) throw storageError;
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id); 
      if (dbError) throw dbError;
      setFiles(files.filter((f) => f.id !== file.id));
      alert('File deleted successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error deleting file:', error);
    }
  };

  // --- NEW FUNCTION ---
  // handleDownloadFile function
  const handleDownloadFile = async (file) => {
    try {
      // 1. Get the file from Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-files')
        .download(file.path); // 'path' is the column where we stored the file path

      if (error) throw error;

      // 2. Create a temporary URL and trigger a browser download
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name; // Set the file name for the download
      a.click(); // Click the link to start the download
      window.URL.revokeObjectURL(url); // Clean up the temporary URL

    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Error downloading file:', error);
    }
  };


  return (
    <div>
      {/* Header section (no changes) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
        <h1>{profile ? `${profile.username}'s Dashboard` : 'Dashboard'}</h1>
        <div>
          {profile && <span style={{ marginRight: '15px' }}>Role: {profile.role}</span>}
          <Link to="/profile">
            <button>My Profile</button>
          </Link>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </header>
      <hr />

      {/* Upload Section (no changes) */}
      <div>
        <h2>Upload a New File</h2>
        <input type="file" onChange={handleFileChange} />
        {selectedFile && (
          <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: '10px' }}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>
      <hr />

      {/* File List Section (UPDATED) */}
      <div>
        <h2>Your Files</h2>
        {loadingFiles && <p>Loading your files...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loadingFiles && !error && files.length === 0 && <p>You haven't uploaded any files yet.</p>}
        
        {/* --- UPDATED PART --- */}
        {files.map(file => (
          <FileItem 
            key={file.id} 
            file={file} 
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile} // Pass the download function
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;