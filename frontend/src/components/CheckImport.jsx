import React, { useState } from 'react';
import '../style/ImportComponents.css'; // Shared CSS
import axiosInstance from '../utils/axiosInstance';

const ImportCheck = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Reset messages when a new file is selected
    setSuccess('');
    setError('');
  };

  const handleImport = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('لطفاً یک فایل انتخاب کنید.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/import-check/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.success || 'چک ها با موفقیت بارگزاری شدند.');
    } catch (err) {
      // Handle different error scenarios
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during import.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-container">
      <h3>بارگذاری چک از اکسل</h3>
      <form onSubmit={handleImport}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" className="import-button" disabled={loading}>
          {loading ? 'در حال بارگذاری...' : 'بارگذاری'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ImportCheck;
