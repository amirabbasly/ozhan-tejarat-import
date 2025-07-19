import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importPerforma } from '../actions/performaActions';
import '../style/ImportComponents.css'; // <-- import the shared CSS

const ImportExcel = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.importPerforma);

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = (e) => {
    e.preventDefault();
    if (!file) {
      alert('لطفاً یک فایل انتخاب کنید.');
      return;
    }
    dispatch(importPerforma(file));
  };

  return (
    <div className="import-container">
      <h3>بارگذاری فایل اکسل</h3>
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

export default ImportExcel;
