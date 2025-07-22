import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importCottagesAction } from '../actions/cottageActions';
import '../style/ImportComponents.css'; // <-- import the shared CSS

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
    <div className="import-container">
      <h3>دریافت اظهارنامه از اکسل</h3>
      <form onSubmit={handleImport}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" className="import-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ImportExcelCottages;
