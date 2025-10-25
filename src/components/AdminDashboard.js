import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUserProfiles, updateUserRole, deleteUserProfile } from '../admin';
import { getUserProfile } from '../user';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (!user) {
        setLoading(false);
        setError("Please log in.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const currentUserProfile = await getUserProfile(user);
        if (currentUserProfile?.role !== 'admin') {
           setError("Access denied. You do not have permission to view this page.");
           setIsAdmin(false);
           setUsers([]);
        } else {
           setIsAdmin(true);
           const userList = await getAllUserProfiles();
           setUsers(userList);
        }
      } catch (err) {
          setError(err.message || "An error occurred.");
          setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    checkAdminAndFetchUsers();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
      setError("Failed to log out.");
    }
  };

  const handleRoleChange = async (userIdToUpdate, newRole) => {
    if (!isAdmin || userIdToUpdate === user.id) return;
    try {
      const updatedProfile = await updateUserRole(userIdToUpdate, newRole);
      setUsers(currentUsers =>
        currentUsers.map(u =>
          u.id === userIdToUpdate ? { ...u, role: updatedProfile.role } : u
        )
      );
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userIdToDelete, usernameToDelete) => {
     if (!isAdmin || userIdToDelete === user.id) return;
     if (!window.confirm(`Are you sure you want to delete user: ${usernameToDelete}? This action cannot be undone.`)) return;
     try {
        await deleteUserProfile(userIdToDelete);
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userIdToDelete));
        alert('User profile deleted successfully!');
     } catch (err) {
        alert(`Error deleting user: ${err.message}`);
     }
  };

  if (loading) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom, #87CEEB, #a7d8ed)' }}>
          <CircularProgress />
        </Box>
     );
   }

   if (error || !isAdmin) {
       return (
         <Box sx={{ flexGrow: 1, backgroundColor: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', boxShadow: 3, borderRadius: '1.5rem', margin: '1.25rem auto', width: { xs: 'calc(100% - 2rem)', md: 'calc(100% - 5rem)', lg: 'calc(100% - 10rem)'}, maxWidth: '960px', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', color: 'text.primary' }}>
               <Toolbar sx={{ justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <WbSunnyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                     <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Admin Panel</Typography>
                  </Box>
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
               </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4, flexGrow: 1 }}>
               <Alert severity={error ? "error" : "warning"}>{error || "Access Denied. You are not an administrator."}</Alert>
               <Button onClick={() => navigate('/')} sx={{mt: 2}}>Go to Dashboard</Button>
            </Container>
             <Box component="footer" sx={{ textAlign: 'center', py: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)', mt: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }}>
                <Typography variant="caption" color="text.secondary">© 2025 Sunny Storage</Typography>
             </Box>
         </Box>
       );
   }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{
         backgroundColor: 'rgba(255, 255, 255, 0.4)',
         backdropFilter: 'blur(10px)',
         boxShadow: 3,
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
                    Admin Dashboard
                </Typography>
            </Box>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1, backgroundColor: 'transparent' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
          User Management
        </Typography>

        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
          <Table sx={{ minWidth: 650 }} aria-label="user management table">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', color: 'text.primary' } }}>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((userItem) => (
                  <TableRow
                    key={userItem.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)'} }}
                  >
                    <TableCell component="th" scope="row">
                      {userItem.id}
                    </TableCell>
                    <TableCell>{userItem.username}</TableCell>
                    <TableCell>{userItem.role}</TableCell>
                    <TableCell align="right">
                      {userItem.id !== user.id && (
                        <Select
                          value={userItem.role}
                          onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                          size="small"
                          sx={{ minWidth: 100, mr: 1, borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.5)' }}
                          variant="outlined"
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      )}
                      {userItem.id !== user.id && (
                         <IconButton
                            aria-label="delete user"
                            onClick={() => handleDeleteUser(userItem.id, userItem.username)}
                            color="error"
                            size="small"
                         >
                            <DeleteIcon />
                         </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Box component="footer" sx={{ textAlign: 'center', py: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)', mt: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }}>
          <Typography variant="caption" color="text.secondary">© 2025 Sunny Storage. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
}

export default AdminDashboard;