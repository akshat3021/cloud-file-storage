import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { getUserProfile } from '../user';
import FileItem from './FileItem';
import { supabase } from '../supabaseClient';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// Removed IconButton, Link, TextField imports
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user);
        setProfile(userProfile);
      }
    };
    loadProfile();
  }, [user]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (user) {
        try {
          setLoadingFiles(true);
          setFileError(null);
          const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setFiles(data);
        } catch (err) {
          console.error('Error fetching files:', err.message);
          setFileError(err.message);
        } finally {
          setLoadingFiles(false);
        }
      }
    };
    fetchFiles();
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

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    try {
      setUploading(true);
      setError(null);
      const file = selectedFile;
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: newFileRecord, error: insertError } = await supabase
        .from('files')
        .insert({ name: file.name, size: file.size, user_id: user.id, path: filePath })
        .select()
        .single();
      if (insertError) throw insertError;
      setFiles((prevFiles) => [newFileRecord, ...prevFiles]);
      setSelectedFile(null);
      document.getElementById('file-input').value = null;
    } catch (err) {
      setError(err.message);
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    try {
      setError(null);
      const { error: storageError } = await supabase.storage.from('user-files').remove([file.path]);
      if (storageError) throw storageError;
      const { error: dbError } = await supabase.from('files').delete().eq('id', file.id);
      if (dbError) throw dbError;
      setFiles(files.filter((f) => f.id !== file.id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting file:', err);
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      setError(null);
      const { data, error } = await supabase.storage.from('user-files').download(file.path);
      if (error) throw error;
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      console.error('Error downloading file:', err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {profile ? `${profile.username}'s Cloud Storage` : 'Cloud Storage'}
          </Typography>
          {profile && <Typography sx={{ mr: 2 }}>Role: {profile.role}</Typography>}
          <Button color="inherit" component={RouterLink} to="/profile">My Profile</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, p: 2, border: '1px dashed grey', borderRadius: '4px' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Upload a New File
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
             <Button
                variant="contained"
                component="label"
                disabled={uploading}
              >
                Choose File
                <input
                  id="file-input"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
             {selectedFile && <Typography variant="body1">{selectedFile.name}</Typography>}
             {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={20} /> : null}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
             )}
          </Stack>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Files
          </Typography>
          {loadingFiles && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
          {fileError && <Alert severity="error" sx={{ mt: 2 }}>{fileError}</Alert>}
          {!loadingFiles && !fileError && files.length === 0 && <Typography sx={{ mt: 2 }}>You haven't uploaded any files yet.</Typography>}

          <Stack spacing={2} sx={{ mt: 2 }}>
            {files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onDelete={handleDeleteFile}
                onDownload={handleDownloadFile}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;