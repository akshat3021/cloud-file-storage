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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Link from '@mui/material/Link';

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
  const [currentTab, setCurrentTab] = useState(0);

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

  const handleLogout = async () => { // Function definition
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
    if (!selectedFile) return;
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
      if(document.getElementById('file-input-hidden')) {
         document.getElementById('file-input-hidden').value = null;
      }
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{
         backgroundColor: 'rgba(255, 255, 255, 0.4)',
         backdropFilter: 'blur(10px)',
         boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
         borderRadius: '1.5rem',
         margin: '1.25rem auto',
         width: { xs: 'calc(100% - 2rem)', md: 'calc(100% - 5rem)', lg: 'calc(100% - 10rem)'},
         maxWidth: '960px',
         borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
         color: 'text.primary',
        }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WbSunnyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Sunny Storage
                </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                 <Link component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', fontWeight: 500 }}>My Files</Link>
                 <Link component={RouterLink} to="#" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>Shared</Link>
                 <Link component={RouterLink} to="#" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>Trash</Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <TextField
                    placeholder="Search files..."
                    size="small"
                    variant="outlined"
                    sx={{ display: { xs: 'none', sm: 'block' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            fieldset: { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                          },
                          input: { color: 'text.primary' }
                    }}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary' }}/>
                        </InputAdornment>
                        ),
                    }}
                 />
                 <Button
                    variant="contained"
                    color="primary"
                    onClick={() => document.getElementById('file-input-hidden')?.click()}
                    sx={{ boxShadow: 'lg', '&:hover': { transform: 'scale(1.05)'}, transition: 'transform 0.2s' }}
                 >
                    Upload File
                 </Button>
                 <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, border: '2px solid rgba(255, 255, 255, 0.5)' }}>
                    {profile?.username ? profile.username[0].toUpperCase() : '?'}
                 </Avatar>
                  <input id="file-input-hidden" type="file" hidden onChange={handleFileChange} />
                   {/* ADD onClick BACK TO THIS BUTTON */}
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
            My Files
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.3)', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="file type tabs"
            textColor="primary"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { fontWeight: 'bold'} }}
           >
            <Tab label="All" />
            <Tab label="Documents" />
            <Tab label="Images" />
            <Tab label="Videos" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 4 }}>
             {selectedFile && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}>
                    <Typography variant="body1">Selected: {selectedFile.name}</Typography>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      variant="contained"
                      size="small"
                      startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {uploading ? 'Uploading...' : 'Confirm Upload'}
                    </Button>
                </Stack>
             )}
             {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
        </Box>

        <Box>
          {loadingFiles && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
          {fileError && <Alert severity="error" sx={{ mt: 2 }}>{fileError}</Alert>}
          {!loadingFiles && !fileError && files.length === 0 && <Typography sx={{ mt: 4, textAlign: 'center' }}>You haven't uploaded any files yet.</Typography>}

          <Grid container spacing={3}>
            {files.map(file => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <FileItem
                  file={file}
                  onDelete={handleDeleteFile}
                  onDownload={handleDownloadFile}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Box component="footer" sx={{ textAlign: 'center', py: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)', mt: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }}>
          <Typography variant="caption" color="text.secondary">© 2025 Sunny Storage. All Rights Reserved.</Typography>
          <Box sx={{ mt: 1 }}>
             <Link component={RouterLink} to="#" variant="caption" color="text.secondary" sx={{ mx: 1 }}>Terms of Service</Link>
             <Link component={RouterLink} to="#" variant="caption" color="text.secondary" sx={{ mx: 1 }}>Privacy Policy</Link>
          </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;