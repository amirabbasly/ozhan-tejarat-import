// src/components/CustomsDeclarationDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDeclarationDetails,
  fetchGoods,
  fetchCustomsDutyInformation,
  saveData,
} from '../actions/customsDeclarationActions';
import './CustomsDeclarationDetails.css';

const CustomsDeclarationDetails = () => {
  const { FullSerialNumber } = useParams();
  const dispatch = useDispatch();

  // State to manage the visibility of the customs duty overlay
  const [activeDutyOverlay, setActiveDutyOverlay] = useState(null);

  // Access ssdsshGUID and urlVCodeInt from Redux state
  const { ssdsshGUID, urlVCodeInt } = useSelector((state) => ({
    ssdsshGUID: state.customsDeclarations.ssdsshGUID,
    urlVCodeInt: state.customsDeclarations.urlVCodeInt,
  }));

  // Access other necessary state from Redux store
  const {
    declarationDetails,
    goods,
    customsDutyInfo,
    loadingDeclarationDetails,
    loadingGoods,
    loadingCustomsDuty,
    savingData,
    errorDeclarationDetails,
    errorGoods,
    errorCustomsDuty,
    saveError,
    saveMessage,
  } = useSelector((state) => state.customsDeclarations);

  // Fetch declaration details on component mount
  useEffect(() => {
    if (FullSerialNumber && ssdsshGUID && urlVCodeInt) {
      dispatch(fetchDeclarationDetails(FullSerialNumber, ssdsshGUID, urlVCodeInt));
    } else {
      console.error('Missing parameters: ssdsshGUID or urlVCodeInt');
    }
  }, [dispatch, FullSerialNumber, ssdsshGUID, urlVCodeInt]);

  // Fetch goods when declarationDetails are fetched
  useEffect(() => {
    if (declarationDetails && declarationDetails.gcuVcodeInt) {
      dispatch(fetchGoods(declarationDetails.gcuVcodeInt, ssdsshGUID, urlVCodeInt));
    }
  }, [dispatch, declarationDetails, ssdsshGUID, urlVCodeInt]);

  // Handler to fetch customs duty information for a specific good
  const handleFetchCustomsDuty = (ggsVcodeInt) => {
    dispatch(fetchCustomsDutyInformation(ggsVcodeInt, ssdsshGUID, urlVCodeInt));
    setActiveDutyOverlay(ggsVcodeInt); // Set the active duty to show overlay
  };

  // Handler to close the overlay
  const handleCloseOverlay = () => {
    setActiveDutyOverlay(null);
  };

  // Handler to save data to the database
  const handleSave = () => {
    if (declarationDetails && goods.length > 0) {
      dispatch(saveData(declarationDetails, goods, ssdsshGUID, urlVCodeInt));
    } else {
      console.warn('Cannot save data: Missing declarationDetails or goods');
    }
  };

  // Conditional Rendering based on loading and error states
  if (loadingDeclarationDetails || loadingGoods) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  if (errorDeclarationDetails) {
    return (
      <div className="error">
        <p>{errorDeclarationDetails}</p>
        <Link to="/" className="back-link">
          بازگشت به لیست
        </Link>
      </div>
    );
  }

  if (!declarationDetails) {
    return <div className="loading">در حال بارگذاری جزئیات...</div>;
  }

  return (
    <div className="customs-declaration-details-container">
      <h2 className="title">جزئیات اظهارنامه گمرکی و کالاها</h2>
      <div className="details-section">
        <p>
          <strong>شماره اعلامیه:</strong> {declarationDetails.gcucustomsDeclarationSerialNumber || 'نامشخص'}
        </p>
        <p>
          <strong>تاریخ ارزیابی:</strong>{' '}
          {declarationDetails.gcupreDeclarationDateSH || 'نامشخص'}
        </p>
        <p>
          <strong>نام بانک:</strong> {declarationDetails.gcubankName || 'نامشخص'}
        </p>
        <p>
          <strong>ارزش ارزی کل:</strong> {declarationDetails.gcutotalCurrencyValue || 'نامشخص'}
        </p>
        <p>
          <strong>وضعیت اعلامیه:</strong> {declarationDetails.DeclarationStatus || 'نامشخص'}
        </p>
        <p>
          <strong>تعداد اقلام:</strong> {declarationDetails.gcucommodityItemQuantity || 'نامشخص'}
        </p>
      </div>

      <h3>لیست کالاها</h3>
      {errorGoods && <p className="error">{errorGoods}</p>}
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
                  <button onClick={() => handleFetchCustomsDuty(item.ggsVcodeInt)}>
                    نمایش مالیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Customs Duty Overlay */}
      {activeDutyOverlay && customsDutyInfo[activeDutyOverlay] && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>مالیات‌های گمرکی</h3>
              <button className="close-button" onClick={handleCloseOverlay}>
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
                <tr>
                  <td>041</td>
                  <td>{customsDutyInfo[activeDutyOverlay].import_rights}</td>
                  <td>{customsDutyInfo[activeDutyOverlay].customs_value}</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>042</td>
                  <td>{customsDutyInfo[activeDutyOverlay].red_cersent}</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>047</td>
                  <td>{customsDutyInfo[activeDutyOverlay].added_value}</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>049</td>
                  <td>{customsDutyInfo[activeDutyOverlay].discount}</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Save Button and Messages */}
      <button className="save-button" onClick={handleSave} disabled={savingData}>
        {savingData ? 'در حال ذخیره...' : 'ذخیره در پایگاه داده'}
      </button>
      {saveMessage && <p className="save-message">{saveMessage}</p>}
      {saveError && <p className="error">{saveError}</p>}

      {/* Back Link */}
      <Link to="/decl" className="back-link">
        بازگشت به لیست
      </Link>
    </div>
  );
};

export default CustomsDeclarationDetails;
