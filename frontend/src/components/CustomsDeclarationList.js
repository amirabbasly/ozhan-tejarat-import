// src/components/CustomsDeclarationList.js

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDeclarations, saveMultipleDeclarations } from '../actions/customsDeclarationActions';
import { setCustomsParams, clearCustomsParams } from '../actions/customsParamsAction';
import './CustomsDeclarationList.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const CustomsDeclarationList = () => {
  const dispatch = useDispatch();

  // Redux state with default values to prevent undefined
  const customsDeclarations = useSelector((state) => state.customsDeclarations) || {};
  const {
    declarations = [],
    loadingDeclarations: loading,
    errorDeclarations: error,
    ssdsshGUID,
    urlVCodeInt,
    savingMultipleDeclarations,
    saveMultipleDeclarationsError,
    saveMultipleDeclarationsMessage,
    savingMultipleDeclarationsProgress = { current: 0, total: 0 },
    failedDeclarations = [],
  } = customsDeclarations;

  // Local state
  const [selectedDeclarations, setSelectedDeclarations] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [guidInput, setGuidInput] = useState(ssdsshGUID || '');
  const [codeInput, setCodeInput] = useState(urlVCodeInt || '');
  const [pageSize, setPageSize] = useState(20);

  // Debugging: Log Redux state
  useEffect(() => {
    console.log('Declarations:', declarations);
    console.log('Saving Progress:', savingMultipleDeclarationsProgress);
    console.log('Failed Declarations:', failedDeclarations);
    console.log('Save Message:', saveMultipleDeclarationsMessage);
    console.log('Save Message Type:', typeof saveMultipleDeclarationsMessage);
  }, [declarations, savingMultipleDeclarationsProgress, failedDeclarations, saveMultipleDeclarationsMessage]);

  // Handle individual declaration selection
  const handleSelectDeclaration = (event, declaration) => {
    const { checked } = event.target;
    let updatedSelections = [];

    if (checked) {
      updatedSelections = [...selectedDeclarations, declaration];
    } else {
      updatedSelections = selectedDeclarations.filter(
        (item) => item.FullSerialNumber !== declaration.FullSerialNumber
      );
    }

    setSelectedDeclarations(updatedSelections);
    setAreAllSelected(updatedSelections.length === declarations.length);
  };

  // Handle "Select All"
  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setAreAllSelected(checked);
    setSelectedDeclarations(checked ? [...declarations] : []);
  };

  // Synchronize input state with Redux
  useEffect(() => {
    setGuidInput(ssdsshGUID || '');
    setCodeInput(urlVCodeInt || '');
  }, [ssdsshGUID, urlVCodeInt]);

  // Handle form submission to fetch declarations
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guidInput || !codeInput || !pageSize) {
      alert('لطفاً همه فیلدها را پر کنید.');
      return;
    }

    dispatch(setCustomsParams(guidInput.trim(), codeInput.trim()));
    dispatch(fetchDeclarations(guidInput.trim(), codeInput.trim(), pageSize));
  };

  // Clear parameters
  const handleClearParams = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید پارامترها را پاک کنید؟')) {
      dispatch(clearCustomsParams());
      setGuidInput('');
      setCodeInput('');
      setSelectedDeclarations([]);
      setAreAllSelected(false);
      alert('پارامترها پاک شدند.');
    }
  };

  // Save selected declarations
  const handleSaveSelected = () => {
    if (selectedDeclarations.length === 0) {
      alert('لطفاً حداقل یک اظهارنامه را انتخاب کنید.');
      return;
    }
    dispatch(saveMultipleDeclarations(selectedDeclarations, ssdsshGUID, urlVCodeInt));
  };

  return (
    <div className="customs-declaration-container">
      <h2 className="title">لیست اظهارنامه‌های گمرکی</h2>

      {/* Form for inputs */}
      <form className="declaration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ssdsshGUID">ssdsshGUID:</label>
          <input
            type="text"
            id="ssdsshGUID"
            value={guidInput}
            onChange={(e) => setGuidInput(e.target.value)}
            required
            placeholder="مثال: 603FF82E-5EAF-4DFA-BBC1-FA0030D686DB"
          />
        </div>

        <div className="form-group">
          <label htmlFor="urlVCodeInt">urlVCodeInt:</label>
          <input
            type="number"
            id="urlVCodeInt"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            required
            placeholder="مثال: 124013"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pageSize">PageSize:</label>
          <input
            type="number"
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            required
            min="1"
            max="10000"
            placeholder="تعداد موارد هر صفحه (مثال: 100)"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            دریافت اطلاعات
          </button>
          <button
            type="button"
            className="clear-button"
            onClick={handleClearParams}
            disabled={!ssdsshGUID && !urlVCodeInt}
          >
            پاک کردن پارامترها
          </button>
        </div>
      </form>

      {/* Loading Indicator */}
      {loading && <p className="loading">در حال بارگذاری...</p>}

      {/* Error Message */}
      {error && (
  <p className="error">
    {typeof error === 'string' ? error : JSON.stringify(error)}
  </p>
)}

      {/* Current Parameters */}
      {ssdsshGUID && urlVCodeInt && (
        <div className="current-params">
          <h3>پارامترهای فعلی:</h3>
          <p><strong>SSDSSH GUID:</strong> {ssdsshGUID}</p>
          <p><strong>URL VCode Int:</strong> {urlVCodeInt}</p>
        </div>
      )}

      {/* Save Selected Button */}
      <button
        className="save-selected-button"
        onClick={handleSaveSelected}
        disabled={selectedDeclarations.length === 0 || savingMultipleDeclarations}
      >
        {savingMultipleDeclarations
          ? `در حال ذخیره (${savingMultipleDeclarationsProgress.current}/${savingMultipleDeclarationsProgress.total})`
          : 'ذخیره اظهارنامه‌های انتخاب‌شده'}
      </button>

      {/* Progress Bar */}
      {savingMultipleDeclarations && (
        <div className="progress-container">
          <progress
            value={savingMultipleDeclarationsProgress.current || 0}
            max={savingMultipleDeclarationsProgress.total || selectedDeclarations.length || 1} // Prevent max=0
          />
          <p>{`در حال ذخیره ${savingMultipleDeclarationsProgress.current || 0}/${savingMultipleDeclarationsProgress.total || selectedDeclarations.length || 0}`}</p>
        </div>
      )}

      {/* Success and Error Messages */}
      {saveMultipleDeclarationsMessage && typeof saveMultipleDeclarationsMessage === 'string' && (
        <div>
          <p className="save-message">{saveMultipleDeclarationsMessage}</p>
          {failedDeclarations.length > 0 && (
            <div>
              <h3>موارد ذخیره نشده:</h3>
              <ul>
                {failedDeclarations.map((serial) => (
                  <li key={serial}>Declaration Serial: {serial}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
{saveMultipleDeclarationsError && (
  <p className="error">
    {typeof saveMultipleDeclarationsError === 'string'
      ? saveMultipleDeclarationsError
      : JSON.stringify(saveMultipleDeclarationsError)}
  </p>
)}

      {/* Declarations Table */}
      {!loading && !error && declarations.length > 0 && (
        <div className="customdec-list-container">
          <table className="customs-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={areAllSelected}
                  />
                </th>
                <th>ردیف</th>
                <th>کد ملی</th>
                <th>شماره سریال کامل</th>
                <th>تاریخ اظهار</th>
                <th>گمرک ورودی</th>
                <th>ارزش ارزی کل</th>
                <th>نوع ارز</th>
                <th>کشور</th>
                <th>وضعیت اظهارنامه</th>
                <th>شماره ثبت سفارش</th>
                <th>شماره ارجاع</th>
                <th>تعداد اقلام</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {declarations.map((item, index) => (
                <tr key={item.FullSerialNumber || index}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectDeclaration(e, item)}
                      checked={selectedDeclarations.some((decl) => decl.FullSerialNumber === item.FullSerialNumber)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{item.NationalCode || 'نامشخص'}</td>
                  <td>{item.FullSerialNumber || 'نامشخص'}</td>
                  <td>{item.gcupreDeclarationDateSH || 'نامشخص'}</td>
                  <td>{item.EntranceCustomsName || 'نامشخص'}</td>
                  <td>{item.gcutotalCurrencyValue || 'نامشخص'}</td>
                  <td>{item.curNameStr || 'نامشخص'}</td>
                  <td>{item.cnyNameStr || 'نامشخص'}</td>
                  <td>{item.gcudeclarationStatus || 'نامشخص'}</td>
                  <td>{item.OrderRegistrationNumber || 'نامشخص'}</td>
                  <td>{item.gculCReferenceNumber || 'نامشخص'}</td>
                  <td>{item.gcuCommodityItemQuantity || 'نامشخص'}</td>
                  <td>
                    <Link
                      to={`/declarations/${encodeURIComponent(item.FullSerialNumber)}`}
                      className="details-link"
                    >
                      جزئیات
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Declarations Message */}
      {!loading && !error && declarations.length === 0 && <p className="no-data">هیچ اظهارنامه‌ای یافت نشد.</p>}
    </div>
  );
};

export default CustomsDeclarationList;
