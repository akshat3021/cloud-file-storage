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
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const getFileType = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (!extension) return 'Other';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension)) return 'Images';
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'Documents';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'Videos';
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) return 'Audio';
  return 'Other';
};

function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setFileError(null);
        try { 
          const userProfile = await getUserProfile(user); 
          setProfile(userProfile); 
        }
        catch (profileError) { 
          console.error("Error loading profile:", profileError); 
          showSnackbar("Failed to load user profile.", 'error'); 
        }
      }
    };
    loadProfile();
  }, [user]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (user) {
        try {
          setLoadingFiles(true); setFileError(null);
          const { data, error: fetchError } = await supabase.from('files').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
          if (fetchError) throw fetchError;
          setAllFiles(data || []);
        } catch (err) {
          console.error('Error fetching files:', err.message); setFileError(err.message || "Failed to fetch files.");
          setAllFiles([]);
        } finally { setLoadingFiles(false); }
      } else { setAllFiles([]); setLoadingFiles(false); }
    };
    fetchFiles();
  }, [user]);

  useEffect(() => {
    let currentFiles = [...allFiles];
    let category;
    switch (currentTab) {
        case 1: category = 'Documents'; break;
        case 2: category = 'Images'; break;
        case 3: category = 'Videos'; break;
        default: category = 'All';
    }
    if (category !== 'All') {
      currentFiles = currentFiles.filter(file => getFileType(file.name) === category);
    }
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (lowerSearchTerm !== '') {
      currentFiles = currentFiles.filter(file =>
        file.name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredFiles(currentFiles);
  }, [allFiles, currentTab, searchTerm]);

  const handleLogout = async () => {
    try { await signOut(); navigate('/login'); }
    catch (error) { console.error('Error logging out:', error.message); showSnackbar("Failed to log out.", 'error'); }
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    try {
      setUploading(true);
      const file = selectedFile; const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('user-files').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: newFileRecord, error: insertError } = await supabase.from('files').insert({ name: file.name, size: file.size, user_id: user.id, path: filePath }).select().single();
      if (insertError) throw insertError;
      setAllFiles((prevFiles) => [newFileRecord, ...prevFiles]);
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input-hidden'); if(fileInput) { fileInput.value = null; }
      showSnackbar('File uploaded successfully!', 'success');
    } catch (err) { showSnackbar(err.message || "File upload failed.", 'error'); console.error('Error uploading file:', err); }
    finally { setUploading(false); }
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setFileToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      const { error: storageError } = await supabase.storage.from('user-files').remove([fileToDelete.path]);
      if (storageError) console.error("Storage deletion error:", storageError.message);
      const { error: dbError } = await supabase.from('files').delete().eq('id', fileToDelete.id);
      if (dbError) throw dbError;
      setAllFiles(allFiles.filter((f) => f.id !== fileToDelete.id));
      showSnackbar('File deleted successfully!', 'success');
    } catch (err) { showSnackbar(err.message || "Failed to delete file.", 'error'); console.error('Error deleting file:', err); }
    finally { handleCloseDeleteDialog(); }
  };

  const handleDownloadFile = async (file) => {
    try {
      const { data, error } = await supabase.storage.from('user-files').download(file.path); if (error) throw error;
      const blob = new Blob([data]); const url = window.URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url);
    } catch (err) { showSnackbar(err.message || "Failed to download file.", 'error'); console.error('Error downloading file:', err); }
  };

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleComingSoon = (featureName) => (event) => {
      event.preventDefault();
      showSnackbar(`${featureName} feature coming soon!`, 'info');
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', borderRadius: '1.5rem', margin: '1.25rem auto', width: { xs: 'calc(100% - 2rem)', md: 'calc(100% - 5rem)', lg: 'calc(100% - 10rem)'}, maxWidth: '960px', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WbSunnyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Sunny Storage</Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                 <Link component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', fontWeight: 500 }}>My Files</Link>
                 <Link component="button" onClick={handleComingSoon('Shared Files')} color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' }, cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit', fontSize: 'inherit' }}>Shared</Link>
                 <Link component="button" onClick={handleComingSoon('Trash Bin')} color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' }, cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit', fontSize: 'inherit' }}>Trash</Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <TextField placeholder="Search files..." size="small" variant="outlined" value={searchTerm} onChange={handleSearchChange} sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiOutlinedInput-root': { borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.4)', fieldset: { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'primary.main' }, }, input: { color: 'text.primary' } }} InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }}/></InputAdornment> ), }} />
                 <Button variant="contained" color="primary" onClick={() => document.getElementById('file-input-hidden')?.click()} sx={{ boxShadow: 'lg', '&:hover': { transform: 'scale(1.05)'}, transition: 'transform 0.2s' }} > Upload File </Button>
                 
                 <IconButton
                    onClick={() => navigate('/profile')}
                    sx={{ p: 0 }}
                 >
                    <Avatar 
                      sx={{ bgcolor: 'secondary.main', width: 40, height: 40, border: '2px solid rgba(255, 255, 255, 0.5)' }}
                      src={profile?.avatar_url || undefined} 
                    >
                        {!(profile?.avatar_url) && (profile?.username ? profile.username[0].toUpperCase() : <PersonIcon />)}
                    </Avatar>
                 </IconButton>

                  <input id="file-input-hidden" type="file" hidden onChange={handleFileChange} />
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1, backgroundColor: 'transparent' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}> My Files </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.3)', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="file type tabs" textColor="primary" indicatorColor="primary" sx={{ '& .MuiTab-root': { fontWeight: 'bold'} }}>
            <Tab label="All" />
            <Tab label="Documents" />
            <Tab label="Images" />
            <Tab label="Videos" />
          </Tabs>
        </Box>
         <Box sx={{ mb: 4 }}>
             {selectedFile && ( <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}> <Typography variant="body1" noWrap sx={{ maxWidth: 'calc(100% - 200px)'}} title={selectedFile.name}> Selected: {selectedFile.name} </Typography> <Button onClick={handleUpload} disabled={uploading} variant="contained" size="small" startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : null} > {uploading ? 'Uploading...' : 'Confirm Upload'} </Button> </Stack> )}
             {/* General error Alert removed, handled by Snackbar */}
        </Box>
        <Box>
          {loadingFiles && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
          {fileError && <Alert severity="error" sx={{ mt: 2 }}>{fileError}</Alert>}
          {!loadingFiles && !fileError && filteredFiles.length === 0 &&
            <Typography sx={{ mt: 4, textAlign: 'center' }}>
                {searchTerm ? `No files found matching "${searchTerm}".` : (currentTab === 0 ? "You haven't uploaded any files yet." : "No files found in this category.")}
            </Typography>
          }
          <Grid container spacing={3}>
            {filteredFiles.map(file => (
              <Grid xs={12} sm={6} md={4} lg={3} key={file.id}>
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
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '8px', boxShadow: 3 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" PaperProps={{ sx: { borderRadius: '1rem' } }} >
        <DialogTitle id="alert-dialog-title"> Confirm Deletion </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> Are you sure you want to delete the file "{fileToDelete?.name}"? This action cannot be undone. </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 20px' }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus> Delete </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;