import React from 'react';

function FileItem({ file }) {
  const handleDelete = () => {
    console.log('Deleting file:', file.name);
  
  };

  const handleDownload = () => {
    console.log('Downloading file:', file.name);

  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px', display: 'flex', justifyContent: 'space-between' }}>
      <span>{file.name} ({file.size} KB)</span>
      <div>
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
      </div>
    </div>
  );
}

export default FileItem;