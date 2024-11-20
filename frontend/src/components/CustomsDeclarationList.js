import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomsDeclarationList.css'; // Import the CSS file

const CustomsDeclarationList = () => {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeclarations = async () => {
      setLoading(true);
      try {
        const payload = {};
        const response = await axios.post(
          'http://127.0.0.1:8000/api/customs-declarations/',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data.ErrorCode === 0) {
          setDeclarations(response.data.CustomizeCustomsDeclarationList);
        } else {
          setError(response.data.ErrorDesc || 'خطایی رخ داده است.');
        }
      } catch (err) {
        setError('خطا در برقراری ارتباط با سرور.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, []);

  if (loading) {
    return <p className="loading">در حال بارگذاری...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="customs-declaration-container">
      <h2 className="title">لیست اظهارنامه‌های گمرکی</h2>
      <table className="customs-table">
        <thead>
          <tr>
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
          </tr>
        </thead>
        <tbody>
          {declarations.map((item, index) => (
            <tr key={index}>
              <td>{item.NationalCode}</td>
              <td>{item.FullSerialNumber}</td>
              <td>{item.gcupreDeclarationDate}</td>
              <td>{item.EntranceCustomsName}</td>
              <td>{item.gcutotalCurrencyValue}</td>
              <td>{item.curNameStr}</td>
              <td>{item.cnyNameStr}</td>
              <td>{item.gcudeclarationStatus}</td>
              <td>{item.OrderRegistrationNumber}</td>
              <td>{item.gculCReferenceNumber}</td>
              <td>{item.gcuCommodityItemQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomsDeclarationList;
