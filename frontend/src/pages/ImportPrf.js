// src/components/ImportPf.js

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformas, saveSelectedPerformas } from '../actions/performaActions';
import { setCustomsParams, clearCustomsParams } from '../actions/customsParamsAction'; // Ensure correct import path
import '../components/CottageForm.css'; // Import your CSS file
import './importPrf.css'; // Create and import a dedicated CSS file for additional styling if needed

const ImportPf = () => {
  const dispatch = useDispatch();

  // Access performas state and customs parameters from Redux store
  const { loading, performas, error, message } = useSelector((state) => state.performa);
  const { ssdsshGUID, urlVCodeInt } = useSelector((state) => state.customsDeclarations);

  const [formData, setFormData] = useState({
    ssdsshGUID: ssdsshGUID || '',
    pageSize: '',
    urlVCodeInt: urlVCodeInt || '',
  });

  const [selectedPerformas, setSelectedPerformas] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const selectAllRef = useRef(null); // Initialize the ref
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (e, performa) => {
    if (e.target.checked) {
      setSelectedPerformas([...selectedPerformas, performa]);
    } else {
      setSelectedPerformas(selectedPerformas.filter((item) => item.prf_number !== performa.prf_number));
    }
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedPerformas(performas);
      setIsAllSelected(true);
    } else {
      setSelectedPerformas([]);
      setIsAllSelected(false);
    }
  };

  useEffect(() => {
    if (performas.length === 0) {
      if (selectAllRef.current) {
        selectAllRef.current.indeterminate = false;
      }
      return;
    }
  
    if (selectAllRef.current) {
      if (selectedPerformas.length > 0 && selectedPerformas.length < performas.length) {
        selectAllRef.current.indeterminate = true;
      } else {
        selectAllRef.current.indeterminate = false;
      }
    }
  }, [selectedPerformas, performas]);
  

  // Synchronize local formData with Redux store
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      ssdsshGUID: ssdsshGUID || '',
      urlVCodeInt: urlVCodeInt || '',
    }));
  }, [ssdsshGUID, urlVCodeInt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the setCustomsParams action to store parameters in Redux
    dispatch(setCustomsParams(formData.ssdsshGUID.trim(), formData.urlVCodeInt.trim()));
    // Dispatch the fetchPerformas action with the entered parameters
    dispatch(fetchPerformas(formData));
  };

  const handleClearParams = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید پارامترها را پاک کنید؟')) {
      dispatch(clearCustomsParams());
      setFormData({
        ssdsshGUID: '',
        pageSize: '',
        urlVCodeInt: '',
      });
      setSelectedPerformas([]);
      alert('پارامترها پاک شدند.');
    }
  };

  const handleSendSelected = () => {
    if (selectedPerformas.length === 0) {
      alert('لطفاً حداقل یک مورد را انتخاب کنید.');
      return;
    }
    dispatch(saveSelectedPerformas(selectedPerformas, formData.ssdsshGUID, formData.urlVCodeInt));
  };

  return (
    <div className="import-prf-container">
      <h2 className="title">دریافت پرفورم‌ها از سامانه جامع</h2>

      {/* Form for user inputs */}
      <form className="import-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ssdsshGUID">ssdsshGUID:</label>
          <input
            type="text"
            id="ssdsshGUID"
            name="ssdsshGUID"
            value={formData.ssdsshGUID}
            onChange={handleChange}
            placeholder="مثال: 603FF82E-5EAF-4DFA-BBC1-FA0030D686DB"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="urlVCodeInt">urlVCodeInt:</label>
          <input
            type="number"
            id="urlVCodeInt"
            name="urlVCodeInt"
            value={formData.urlVCodeInt}
            onChange={handleChange}
            placeholder="مثال: 124013"
            required
          />
        </div>



        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'در حال دریافت...' : 'دریافت پرفورم‌ها'}
          </button>
          <button
            type="button"
            className="clear-button"
            onClick={handleClearParams}
            disabled={!formData.ssdsshGUID && !formData.urlVCodeInt}
          >
            پاک کردن پارامترها
          </button>
          
        </div>
      </form>
      <button onClick={handleSendSelected} className="save-selected-button" disabled={loading}>
            {loading ? 'در حال ذخیره...' : 'ذخیره موارد انتخاب‌شده'}
          </button>
      {/* Loading Indicator */}
      {loading && <p className="loading">در حال بارگذاری...</p>}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Success Message */}
      {message && <p className="success-message">{message}</p>}

      {/* Display Current Parameters */}
      {ssdsshGUID && urlVCodeInt && (
        <div className="current-params">
          <h3>پارامترهای فعلی:</h3>
          <p>
            <strong>SSDSSH GUID:</strong> {ssdsshGUID}
          </p>
          <p>
            <strong>URL VCode Int:</strong> {urlVCodeInt}
          </p>
        </div>
      )}

      {/* Performas Table */}
      {performas.length > 0 && (
        <div className="performas-table-container">
          <h3>لیست پرفورم‌ها</h3>
          <table className="performas-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={selectAllRef}
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th>ردیف</th>
                <th>شماره پیش فاکتور</th>
                <th>شماره ثبت سفارش</th>
                <th>تاریخ اعتبار</th>
                <th>نام فروشنده</th>
                {/* Add other headers as needed */}
              </tr>
            </thead>
            <tbody>
              {performas.map((performa, index) => (
                <tr key={performa.prf_number || index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPerformas.some((item) => item.prf_number === performa.prf_number)}
                      onChange={(e) => handleCheckboxChange(e, performa)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{performa.prf_number}</td>
                  <td>{performa.prf_order_no}</td>
                  <td>{performa.prf_expire_date}</td>
                  <td>{performa.prf_seller_name}</td>
                  {/* Add other fields as needed */}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default ImportPf;
