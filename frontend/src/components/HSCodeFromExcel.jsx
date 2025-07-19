// src/components/HSCodeImport.jsx

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';


function HSCodeImport() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('No file selected.');
      return;
    }

    // Prepare multipart/form-data
    const formData = new FormData();
    // 'excel_file' must match the key expected by the DRF view (request.FILES['excel_file'])
    formData.append('excel_file', file);

    try {
      // Adjust your endpoint URL accordingly. If you have a proxy, this might be "/api/hscode/import-hscode/"
      const response = await axiosInstance.post('/customs/import-hscode/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.detail || 'HSCode Excel imported successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error importing Excel file.');
    }
  };

  return (
    <div>
      <h1>Import HSCode Excel</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      
    </div>
  );
}

export default HSCodeImport;
