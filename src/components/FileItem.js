import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const getFileTypeIcon = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (!extension) return <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.secondary' }} />;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension)) return <ImageIcon sx={{ fontSize: 48, color: 'success.light' }} />;
  if (extension === 'pdf') return <PictureAsPdfIcon sx={{ fontSize: 48, color: 'error.light' }} />;
  if (['doc', 'docx'].includes(extension)) return <DescriptionIcon sx={{ fontSize: 48, color: 'info.light' }} />;
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return <VideocamIcon sx={{ fontSize: 48, color: 'secondary.light' }} />;
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) return <AudioFileIcon sx={{ fontSize: 48, color: 'warning.light' }} />;
  return <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.secondary' }} />;
};

function FileItem({ file, onDelete, onDownload }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOptionsClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleCloseMenu();
    onDelete(file); // Call prop directly, confirmation is in Dashboard
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    handleCloseMenu();
    onDownload(file);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizeIndex = Math.max(0, i);
    return parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(1)) + ' ' + sizes[sizeIndex];
  };

  return (
    <Card
      sx={{
        textAlign: 'center', p: 2, height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, },
        cursor: 'pointer',
      }}
      elevation={1}
      onClick={handleDownloadClick} // Card click downloads
    >
       <IconButton
         aria-label="options"
         aria-controls={open ? 'file-options-menu' : undefined}
         aria-haspopup="true"
         aria-expanded={open ? 'true' : undefined}
         sx={{ position: 'absolute', top: 8, right: 8, opacity: 0.6, '&:hover': { opacity: 1 } }}
         size="small"
         onClick={handleOptionsClick}
       >
         <MoreVertIcon fontSize="small" />
       </IconButton>

      <Box sx={{ mb: 1 }}>
        {getFileTypeIcon(file.name)}
      </Box>

      <CardContent sx={{ p: '0 !important', flexGrow: 1, width: '100%' }}>
        <Typography variant="body2" noWrap title={file.name} sx={{ fontWeight: 500, mb: 0.5, px: 1 }}>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(file.size)}
        </Typography>
      </CardContent>

       <Menu
        id="file-options-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{ 'aria-labelledby': 'options-button', }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleDownloadClick}>
           <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
           <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

    </Card>
  );
}

export default FileItem;
