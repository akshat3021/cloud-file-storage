import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// Removed CardActions import
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
// Removed FolderIcon import
import VideocamIcon from '@mui/icons-material/Videocam';
import AudioFileIcon from '@mui/icons-material/AudioFile';
// Removed DownloadIcon import
// Removed DeleteIcon import
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Keep options icon

const getFileTypeIcon = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return <ImageIcon sx={{ fontSize: 48, color: 'success.light' }} />;
  }
  if (extension === 'pdf') {
    return <PictureAsPdfIcon sx={{ fontSize: 48, color: 'error.light' }} />;
  }
  if (['doc', 'docx'].includes(extension)) {
    return <DescriptionIcon sx={{ fontSize: 48, color: 'info.light' }} />;
  }
  if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
    return <VideocamIcon sx={{ fontSize: 48, color: 'secondary.light' }} />;
  }
  if (['mp3', 'wav', 'ogg'].includes(extension)) {
    return <AudioFileIcon sx={{ fontSize: 48, color: 'warning.light' }} />;
  }
  return <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.secondary' }} />;
};

function FileItem({ file, onDelete, onDownload }) {

  // handleDelete is assigned but used inside handleOptionsClick or similar logic indirectly
  // ESLint might warn if not directly used, but it's needed for the prop.
  // We'll keep it for now as it's passed down and intended for use.

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownload(file);
  };

  const handleOptionsClick = (e) => {
      e.stopPropagation();
      // Placeholder: In a real app, open a menu here.
      // For now, let's just trigger delete as an example.
      console.log("Options clicked for", file.name);
      // Example: Call onDelete when options icon is clicked
      if (window.confirm(`Delete ${file.name}? (Using options button)`)) {
          onDelete(file);
      }
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
        textAlign: 'center',
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        cursor: 'pointer',
      }}
      elevation={1}
      onClick={handleDownloadClick}
    >
       <IconButton
         aria-label="options"
         sx={{ position: 'absolute', top: 8, right: 8, opacity: 0.6, '&:hover': { opacity: 1 } }}
         size="small"
         onClick={handleOptionsClick} // Connect options click
       >
         <MoreVertIcon fontSize="small" />
       </IconButton>

      <Box sx={{ mb: 1 }}>
        {getFileTypeIcon(file.name)}
      </Box>

      <CardContent sx={{ p: '0 !important', flexGrow: 1, width: '100%' }}>
        <Typography
           variant="body2"
           noWrap
           title={file.name}
           sx={{ fontWeight: 500, mb: 0.5, px: 1 }}
         >
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatFileSize(file.size)}
        </Typography>
      </CardContent>

       {/* Explicit actions removed */}

    </Card>
  );
}

export default FileItem;