import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const getFileTypeIcon = (fileName) => {
  if (/\.(jpg|jpeg|png|gif)$/i.test(fileName)) {
    return <InsertDriveFileIcon color="primary"/>;
  }
  if (/\.(pdf)$/i.test(fileName)) {
     return <InsertDriveFileIcon color="error"/>;
  }
   if (/\.(doc|docx)$/i.test(fileName)) {
     return <InsertDriveFileIcon color="info"/>;
  }
  return <InsertDriveFileIcon />;
};

function FileItem({ file, onDelete, onDownload }) {

  const handleDelete = () => {
    onDelete(file);
  };

  const handleDownload = () => {
    onDownload(file);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizeIndex = Math.max(0, i);
    return parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(2)) + ' ' + sizes[sizeIndex];
  };

  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1.5,
        transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-3px)',
        },
      }}
      elevation={2}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, p: 1, overflow: 'hidden' }}>
        {getFileTypeIcon(file.name)}
        <CardContent sx={{ flex: '1 1 auto', p: '0 16px !important', minWidth: 0 }}>
          <Typography
             component="div"
             variant="body1"
             noWrap
             title={file.name}
             sx={{ fontWeight: 500 }}
           >
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            {formatFileSize(file.size)} - {new Date(file.created_at).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Box>
      <CardActions sx={{ p: 1 }}>
        <IconButton aria-label="download" onClick={handleDownload} size="small">
          <DownloadIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDelete} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default FileItem;