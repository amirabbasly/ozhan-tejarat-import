import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom';
import './CustomsDeclarationDetails.css';

const CustomsDeclarationDetails = () => {
  const { FullSerialNumber } = useParams();
  const location = useLocation();
  const { ssdsshGUID, urlVCodeInt } = location.state || {};
  const [declaration, setDeclaration] = useState(null);
  const [goods, setGoods] = useState([]);
  const [customsDutyInfo, setCustomsDutyInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDuty, setActiveDuty] = useState(null); // Tracks which good's duty info is being shown
  const [saveMessage, setSaveMessage] = useState('');

  const fetchDeclarationDetails = async () => {
    if (!FullSerialNumber || !ssdsshGUID || !urlVCodeInt) {
      setError('اطلاعات لازم برای نمایش جزئیات موجود نیست.');
      setLoading(false);
      return;
    }

    const payload = {
      DeclarationType: 0,
      FullSerilaNumber: FullSerialNumber,
      ssdsshGUID: ssdsshGUID,
      urlVCodeInt: parseInt(urlVCodeInt, 10),
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/customs-green-declaration/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ErrorCode === 0) {
        setDeclaration(response.data.GreenCustomsDeclaration);
      } else {
        setError(response.data.ErrorDesc || 'خطایی رخ داده است.');
      }
    } catch (err) {
      console.error('Error fetching declaration details:', err);
      setError('خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoods = async (gcuVcodeInt) => {
    if (!gcuVcodeInt || !ssdsshGUID || !urlVCodeInt) {
      setError('اطلاعات لازم برای نمایش کالاها موجود نیست.');
      return;
    }

    const payload = {
      gcuVcodeInt: gcuVcodeInt,
      ssdsshGUID: ssdsshGUID,
      urlVCodeInt: parseInt(urlVCodeInt, 10),
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/fetch-goods/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ErrorCode === 0) {
        setGoods(response.data.GreenCustomsDeclarationGoodList || []);
      } else {
        setError(response.data.ErrorDesc || 'خطایی رخ داده است.');
      }
    } catch (err) {
      console.error('Error fetching goods:', err);
      setError('خطا در برقراری ارتباط با سرور.');
    }
  };

  const fetchCustomsDutyInformation = async (ggsVcodeInt) => {
    if (!ggsVcodeInt || !ssdsshGUID || !urlVCodeInt) {
      setError('اطلاعات لازم برای نمایش مالیات‌ها موجود نیست.');
      return;
    }

    const payload = {
      ggsVcodeInt: ggsVcodeInt,
      ssdsshGUID: ssdsshGUID,
      urlVCodeInt: parseInt(urlVCodeInt, 10),
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/fetch-customs-duty-info/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ErrorCode === 0) {
        setCustomsDutyInfo((prev) => ({
          ...prev,
          [ggsVcodeInt]: response.data.GreenCustomsDutyInformationList || [],
        }));
        setActiveDuty(ggsVcodeInt); // Show duty info for the clicked good
      } else {
        setError(response.data.ErrorDesc || 'خطایی رخ داده است.');
      }
    } catch (err) {
      console.error('Error fetching customs duty information:', err);
      setError('خطا در برقراری ارتباط با سرور.');
    }
  };

  const toggleDutyInfo = (ggsVcodeInt) => {
    if (activeDuty === ggsVcodeInt) {
      setActiveDuty(null); // Hide if already active
    } else if (!customsDutyInfo[ggsVcodeInt]) {
      fetchCustomsDutyInformation(ggsVcodeInt); // Fetch if not already fetched
    } else {
      setActiveDuty(ggsVcodeInt); // Show if already fetched
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDeclarationDetails();
    };
    fetchData();
  }, [FullSerialNumber, ssdsshGUID, urlVCodeInt]);

  useEffect(() => {
    if (declaration && declaration.gcuVcodeInt) {
      fetchGoods(declaration.gcuVcodeInt);
    }
  }, [declaration]);

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <Link to="/" className="back-link">بازگشت به لیست</Link>
      </div>
    );
  }

  return (
    <div className="customs-declaration-details-container">
      <h2 className="title">جزئیات اظهارنامه گمرکی و کالاها</h2>
      <div className="details-section">
        <p><strong>شماره اعلامیه:</strong> {declaration.gcucustomsDeclarationSerialNumber || 'نامشخص'}</p>
        <p><strong>تاریخ ارزیابی:</strong> {declaration.gcuassessmentDate ? new Date(declaration.gcuassessmentDate).toLocaleDateString('fa-IR') : 'نامشخص'}</p>
        <p><strong>نام بانک:</strong> {declaration.gcubankName || 'نامشخص'}</p>
        <p><strong>ارزش ارزی کل:</strong> {declaration.gcutotalCurrencyValue || 'نامشخص'}</p>
        <p><strong>وضعیت اعلامیه:</strong> {declaration.DeclarationStatus || 'نامشخص'}</p>
        <p><strong>تعداد اقلام:</strong> {declaration.gcuCommodityItemQuantity || 'نامشخص'}</p>
      </div>

      <h3>لیست کالاها</h3>
      {goods.length === 0 ? (
        <p>هیچ کالایی یافت نشد.</p>
      ) : (
        <table className="goods-table">
          <thead>
            <tr>
              <th>شماره کالا</th>
              <th>شرح کالا</th>
              <th>کد تعرفه</th>
              <th>ارزش ارزی</th>
              <th>وزن خالص</th>
              <th>تعداد بسته‌ها</th>
              <th>کد کشور</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {goods.map((item) => (
              <tr key={item.ggsVcodeInt}>
                <td>{item.ggscommodityItemNumber}</td>
                <td>{item.ggscommodityDescription}</td>
                <td>{item.ggscommodityHSCode}</td>
                <td>{item.ggscommodityItemCurrencyValue}</td>
                <td>{item.ggsnetWeightInKg}</td>
                <td>{item.ggspackageCount}</td>
                <td>{item.OriginCountryCode}</td>
                <td>
                  <button onClick={() => toggleDutyInfo(item.ggsVcodeInt)}>
                    نمایش مالیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeDuty && customsDutyInfo[activeDuty] && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>مالیات‌های گمرکی</h3>
              <button className="close-button" onClick={() => setActiveDuty(null)}>
                ×
              </button>
            </div>
            <table className="customs-duty-table">
              <thead>
                <tr>
                  <th>کد عوارض</th>
                  <th>مقدار عوارض</th>
                  <th>پایه عوارض</th>
                  <th>نرخ عوارض</th>
                  <th>تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody>
                {customsDutyInfo[activeDuty].map((duty) => (
                  <tr key={duty.cinVcodeInt}>
                    <td>{duty.cintaxesCode}</td>
                    <td>{duty.cintaxesAmount}</td>
                    <td>{duty.cintaxesBase}</td>
                    <td>{duty.cintaxesRate}</td>
                    <td>{new Date(duty.cinInsertDate).toLocaleDateString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Link to="/" className="back-link">بازگشت به لیست</Link>
    </div>
  );
};

export default CustomsDeclarationDetails;
