// ImportExcelCottages.jsx (example)
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importCottagesAction } from '../actions/cottageActions';

const ImportExcelCottages = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.importCottage);

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file.');
      return;
    }

    dispatch(importCottagesAction(file));
  };

  return (
    <div>
      <h3>دریافت اظهارنامه از اکسل</h3>
      <form onSubmit={handleImport}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default ImportExcelCottages;
