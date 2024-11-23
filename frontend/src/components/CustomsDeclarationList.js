// CustomsDeclarationList.js

import React, { useState } from 'react';
import axios from 'axios';
import './CustomsDeclarationList.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const CustomsDeclarationList = () => {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State variables for form inputs
  const [ssdsshGUID, setSsdsshGUID] = useState('');
  const [urlVCodeInt, setUrlVCodeInt] = useState('');
  const [pageSize, setPageSize] = useState(20000); // Default PageSize

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setError(null);
    setDeclarations([]);

    // Validate inputs
    if (!ssdsshGUID || !urlVCodeInt || !pageSize) {
      setError('لطفاً همه فیلدها را پر کنید.');
      setLoading(false);
      return;
    }

    // Prepare the payload
    const payload = {
      ssdsshGUID: ssdsshGUID,
      urlVCodeInt: parseInt(urlVCodeInt, 10),
      PageSize: parseInt(pageSize, 10),
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/customs-declarations/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data); // Inspect the response

      if (response.data.ErrorCode === 0) {
        // Check if 'CustomizeCustomsDeclarationList' exists and is an array
        if (Array.isArray(response.data.CustomizeCustomsDeclarationList)) {
          setDeclarations(response.data.CustomizeCustomsDeclarationList);
        }
        // Else, check if response.data itself is an array
        else if (Array.isArray(response.data)) {
          setDeclarations(response.data);
        }
        // If neither, set an error
        else {
          setError('فرمت پاسخ غیرمنتظره است.');
        }
      } else {
        setError(response.data.ErrorDesc || 'خطایی رخ داده است.');
      }
    } catch (err) {
      console.error('Error during API call:', err); // Enhanced error logging
      setError('خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customs-declaration-container">
      <h2 className="title">لیست اظهارنامه‌های گمرکی</h2>

      {/* Form for user inputs */}
      <form className="declaration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ssdsshGUID">ssdsshGUID:</label>
          <input
            type="text"
            id="ssdsshGUID"
            value={ssdsshGUID}
            onChange={(e) => setSsdsshGUID(e.target.value)}
            required
            placeholder="مثال: 603FF82E-5EAF-4DFA-BBC1-FA0030D686DB"
          />
        </div>

        <div className="form-group">
          <label htmlFor="urlVCodeInt">urlVCodeInt:</label>
          <input
            type="number"
            id="urlVCodeInt"
            value={urlVCodeInt}
            onChange={(e) => setUrlVCodeInt(e.target.value)}
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

        <button type="submit" className="submit-button">
          دریافت اطلاعات
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && <p className="loading">در حال بارگذاری...</p>}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Declarations Table */}
      {!loading && !error && declarations.length > 0 && (
        <div className='customdec-list-container'>
          {console.log('Declarations:', declarations)} {/* Verify declarations */}
          <table className="customs-table">
            <thead>
              <tr>
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
                  <td>{index + 1}</td> {/* Row Index */}
                  <td>{item.NationalCode || 'نامشخص'}</td>
                  <td>{item.FullSerialNumber || 'نامشخص'}</td>
                  <td>{item.gcupreDeclarationDate || 'نامشخص'}</td>
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
                      state={{
                        ssdsshGUID: ssdsshGUID,
                        urlVCodeInt: urlVCodeInt
                      }}
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
      {!loading && !error && declarations.length === 0 && (
        <p className="no-data">هیچ اظهارنامه‌ای یافت نشد.</p>
      )}
    </div>
  );
};

export default CustomsDeclarationList;
