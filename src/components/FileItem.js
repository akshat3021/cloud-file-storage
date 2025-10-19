import React from 'react';

// 1. Receive 'onDownload' as a prop
function FileItem({ file, onDelete, onDownload }) { 
  
  const handleDelete = () => {
    onDelete(file); 
  };

  // 2. Call the onDownload function from props
  const handleDownload = () => {
    onDownload(file);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px', display: 'flex', justifyContent: 'space-between' }}>
      <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span> 
      <div>
        {/* 3. The Download button now works! */}
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
      </div>
    </div>
  );
}

export default FileItem;