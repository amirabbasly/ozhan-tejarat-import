// src/components/CottageDetails.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExportCottageDetails, updateExportCottageDetails, deleteExportCottages, uploadFile } from '../actions/cottageActions';
import { useParams } from 'react-router-dom';
import "../style/CottageDetails.css";
import DatePicker from 'react-multi-date-picker';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CottageGoodsList from '../components/CottageGoodsList';
import Select from 'react-select';

const CottageDetails = () => {
    const [cottageId, setCottageId] = useState('');
    const dispatch = useDispatch();
    const { fullSerialNumber } = useParams();
    const cottageDetails = useSelector((state) => state.exportedCottageDetails);
    const { loading, cottage, error } = cottageDetails;
    const [isEditing, setIsEditing] = useState(false); // Tracks if in edit mode
    const options = [
        { value: 'تایید شده' , label: 'تایید شده' },
        { value: 'در حال بررسی', label: 'در حال بررسی' },
        { value: 'رد شده', label: 'رد شده' },
        { value: 'پروانه کامل', label: 'پروانه کامل' },
    ];
    const currencyTypeOptions = [
        { value: 'دلار امریکا', label: 'دلار آمریکا' },
        { value: 'یورو', label: 'یورو' },
        { value: 'ریال ایران', label: 'ریال ایران' },
    ];


    // State variables for each cottage field
    const [currencyPrice, setCurrencyPrice] = useState('');

    const [cottageNum, setCottageNum] = useState('');
    const [cottageDate, setCottageDate] = useState(null);
    const [totalValue, setTotalValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [status, setStatus] = useState('');
    const [documents, setDocuments] = useState('');
    const [remaining_total, setRemainingTotal] = useState('');
    const [currencyType, setCurrencyType] = useState('');

    const navigate = useNavigate();

const handleDeleteCottage = () => {
    if (!window.confirm('آیا از حذف این اظهارنامه اطمینان دارید؟')) {
        return;
    }

    if (cottageId) {
        dispatch(deleteExportCottages([cottageId]))
            .then(() => {
                alert('اظهارنامه با موفقیت حذف شد.');
                navigate('/export-cottages'); // Redirect to the cottage list page
            })
            .catch((error) => {
                console.error('Error deleting cottage:', error);
                alert('خطا در حذف اظهارنامه.');
            });
    }
};

useEffect(() => {
        if (fullSerialNumber) {
            dispatch(fetchExportCottageDetails(fullSerialNumber));
        }
    }, [dispatch, fullSerialNumber]);

    useEffect(() => {
        if (cottage) {
            setCottageId(cottage.id || '');
            setCurrencyPrice(cottage.currency_price || '');
            setCottageNum(cottage.full_serial_number || '');
            setTotalValue(cottage.total_value || '');
            setQuantity(cottage.quantity || '');
            setDocuments(cottage.documents || '');
            setStatus(cottage.declaration_status || '');
            setRemainingTotal(cottage.remaining_total);
            setCurrencyType(cottage.currency_type);


            if (cottage.cottage_date) {
                const dateObject = new DateObject({
                    date: cottage.cottage_date,
                    format: "YYYY-MM-DD",
                    calendar: persian,
                    locale: persian_fa,
                });
                setCottageDate(dateObject);
            } else {
                setCottageDate(null);
            }
        }
    }, [cottage]);



    const handleDetailsSubmit = () => {
        if (isEditing) {
            if (cottageId) {
                const updatedCottage = {
                    cottage_number: cottageNum,
                    cottage_date: cottageDate ? cottageDate.format("YYYY-MM-DD") : null,
                    total_value: totalValue,
                    quantity: quantity,
                    declaration_status: status,
                    currency_price: currencyPrice,
                    currency_type: currencyType,
                    remaining_total: remaining_total,
                };
                dispatch(updateExportCottageDetails(cottageId, updatedCottage, fullSerialNumber));
                dispatch(uploadFile(documents, cottageId))
            }
        }
        setIsEditing((prev) => !prev); // Toggle edit mode
    };

      

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        const errorMessage =
          typeof error === 'object'
            ? (error.detail && error.detail.total_value) || JSON.stringify(error)
            : error;
        
        return (
          <div className="error-message">
            <p>خطا:</p>
            <p>{errorMessage}</p>
            <button onClick={() => dispatch(fetchExportCottageDetails(fullSerialNumber))}>
                    تلاش دوباره
                </button>
          </div>
        );
      }
    if (!cottage) {
        return <div className="no-details">No cottage details found.</div>;
    }

    return (
        <div className="cottage-details-container">
        <h1 className="header">جزئیات اظهارنامه کامل</h1>
        <div className="cottage-info">
            <div className="input-group">
                <label htmlFor="cottageNum"><strong>شماره سریال :</strong></label>

                    <span className="readonly-text">{cottageNum}</span>
                
            </div>

            <div className="input-group">
                <label htmlFor="cottageDate"><strong>تاریخ :</strong></label>
                {isEditing ? (
                    <DatePicker
                        id="cottageDate"
                        value={cottageDate}
                        onChange={setCottageDate}
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD"
                        className="editable-datepicker"
                    />
                ) : (
                    <span className="readonly-text">{cottageDate ? cottageDate.format("YYYY/MM/DD") : 'N/A'}</span>
                )}
            </div>


            <div className="input-group">
                <label htmlFor="totalValue"><strong>ارزش کل :</strong></label>
                {isEditing ? (
                    <input
                        type="number"
                        id="totalValue"
                        value={totalValue}
                        onChange={(e) => setTotalValue(e.target.value)}
                        className="editable-input"
                    />
                ) : (
                    <span className="readonly-text">{totalValue}</span>
                )}
            </div>
            <div className="input-group">
                <label htmlFor="remaining_total"><strong>ارزش باقیمانده :</strong></label>
                {isEditing ? (
                    <input
                        type="number"
                        id="remaining_total"
                        value={remaining_total}
                        onChange={(e) => setRemainingTotal(e.target.value)}
                        className="editable-input"
                    />
                ) : (
                    <span className="readonly-text">{remaining_total}</span>
                )}
            </div>

            <div className="input-group">
                <label htmlFor="quantity"><strong>تعداد کالا ها :</strong></label>
                {isEditing ? (
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="editable-input"
                    />
                ) : (
                    <span className="readonly-text">{quantity}</span>
                )}
            </div>
            <div className="select-group">
                <label htmlFor="status"><strong>وضعیت :</strong></label>
                {isEditing ? (
                    <Select
                name="declaration_status"
                className="editable-select"
                value={options.find(option => option.value === status)}
                onChange={(selectedOption) => setStatus(selectedOption ? selectedOption.value : '')}
                options={options}
                placeholder="انتخاب وضعیت"
            />

                ) : (
                        <span className="readonly-text">{status || ' وضعیت را وارد کنید'}</span>
                )}
            </div>
            <div className="select-group">
                <label htmlFor="currencyType"><strong>نوع ارز :</strong></label>
                {isEditing ? (
                    <Select
                    name="currencyType"
                    className="editable-select"
                    value={currencyTypeOptions.find(option => option.value === currencyType)}
                    onChange={(selectedOption) => setCurrencyType(selectedOption ? selectedOption.value : '')}
                    options={currencyTypeOptions}
                    placeholder="انتخاب ارز"
                />

                ) : (
                        <span className="readonly-text">{currencyType || ' نوع ارز را وارد کنید'}</span>
                )}
            </div>

            <div className="input-group">
                <label htmlFor="currencyPrice"><strong>نرخ ارز :</strong></label>
                {isEditing ? (
                    <input
                        type="number"
                        id="currencyPrice"
                        placeholder='نرخ ارز را وارد کنید'
                        value={currencyPrice}
                        onChange={(e) => setCurrencyPrice(e.target.value)}
                        className="editable-input"
                    />
                ) : (
                        <span className="readonly-text">{currencyPrice || 'نرخ ارز را وارد کنید'}</span>
                )}
            </div>
            
            <div className="input-group">
                <label htmlFor="documents"><strong>مدارک :</strong></label>
                {isEditing ? (
                    <input
                        type="file"
                        id="documents"
                        placeholder=' مدارک را اضافه کنید'
                        onChange={(e) => setDocuments(e.target.files[0])}
                        className="editable-input"
                    />
                ) : (
                        <span className="readonly-text"><Link to={documents}>{ 'دانلود' || ' مدارک را اضافه کنید'}</Link></span>
                )}
            </div>
            
            <button onClick={handleDetailsSubmit} className="primary-button">
                {isEditing ? 'ذخیره' : 'ویرایش'}
            </button>

            <button onClick={handleDeleteCottage} className="delete-button">
                حذف اظهارنامه
            </button>
            </div>
            

            <h2 className="goods-header">کالا ها</h2>
            {cottage.cottage_goods && cottage.cottage_goods.length > 0 ? (
                <CottageGoodsList goods={cottage.cottage_goods} />
            ) : (
                <p className="no-goods">کالایی یافت نشد</p>
            )}
        </div>
    );
};

export default CottageDetails;
