// src/components/CottageDetails.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCottageDetails, updateCottageDetails, deleteCottages } from '../actions/cottageActions';
import { useParams } from 'react-router-dom';
import './CottageDetails.css';
import DatePicker from 'react-multi-date-picker';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom';

const CottageDetails = () => {
    const [cottageId, setCottageId] = useState('');
    const dispatch = useDispatch();
    const { cottageNumber } = useParams();
    const cottageDetails = useSelector((state) => state.cottageDetails);
    const { loading, cottage, error } = cottageDetails;
    const [isEditing, setIsEditing] = useState(false); // Tracks if in edit mode



    // State variables for each cottage field
    const [currencyPrice, setCurrencyPrice] = useState('');
    const [cottageNum, setCottageNum] = useState('');
    const [cottageDate, setCottageDate] = useState(null);
    const [totalValue, setTotalValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [proforma, setProforma] = useState('');
    const navigate = useNavigate();

const handleDeleteCottage = () => {
    if (!window.confirm('آیا از حذف این اظهارنامه اطمینان دارید؟')) {
        return;
    }

    if (cottageId) {
        dispatch(deleteCottages([cottageId]))
            .then(() => {
                alert('اظهارنامه با موفقیت حذف شد.');
                navigate('/cottages'); // Redirect to the cottage list page
            })
            .catch((error) => {
                console.error('Error deleting cottage:', error);
                alert('خطا در حذف اظهارنامه.');
            });
    }
};



useEffect(() => {
        if (cottageNumber) {
            dispatch(fetchCottageDetails(cottageNumber));
        }
    }, [dispatch, cottageNumber]);

    useEffect(() => {
        if (cottage) {
            setCottageId(cottage.id || '');
            setCurrencyPrice(cottage.currency_price || '');
            setCottageNum(cottage.cottage_number || '');
            setTotalValue(cottage.total_value || '');
            setQuantity(cottage.quantity || '');
            setProforma(cottage.proforma || '');

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
                    proforma: proforma,
                    currency_price: currencyPrice,
                };
                dispatch(updateCottageDetails(cottageId, updatedCottage, cottageNumber));
            }
        }
        setIsEditing((prev) => !prev); // Toggle edit mode
    };

      

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        const errorMessage = typeof error === 'object' ? error.detail || JSON.stringify(error) : error;
        return <div className="error">Error: {errorMessage}</div>;
    }

    if (!cottage) {
        return <div className="no-details">No cottage details found.</div>;
    }

    return (
        <div className="cottage-details-container">
        <h1 className="header">جزئیات اظهارنامه</h1>
        <div className="cottage-info">
            <div className="input-group">
                <label htmlFor="cottageNum"><strong>شماره کوتاژ :</strong></label>

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

            <div className="input-group">
                <label htmlFor="proforma"><strong>شماره ثبت سفارش :</strong></label>

                    <span className="readonly-text">{proforma}</span>
               
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

            <button onClick={handleDetailsSubmit} className="primary-button">
                {isEditing ? 'ذخیره' : 'ویرایش'}
            </button>

            <button onClick={handleDeleteCottage} className="delete-button">
                حذف اظهارنامه
            </button>
            </div>

            <h2 className="goods-header">کالا ها</h2>
            {cottage.cottage_goods && cottage.cottage_goods.length > 0 ? (
                <div className='goods-table-container'>
                <table className="goods-table">
                    <thead>
                        <tr>
                            <th>ردیف</th>
                            <th>ارزش گمرکی</th>
                            <th>حقوق ورودی</th>
                            <th>ارزش کل ارزی</th>
                            <th>ارزش افزوده</th>
                            <th>حلال احمر</th>
                            <th>حواله ریالی</th>
                            <th>حواله + حقوق</th>
                            <th>سایر هزینه ها</th>
                            <th>بهای تمام شده</th>
                            <th>تعداد</th>
                            <th>شرح کالا</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cottage.cottage_goods.map((good, index) => (
                            <tr key={good.id}>
                                <td>{index + 1}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.customs_value)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.import_rights)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.total_value)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.added_value)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.red_cersent)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.riali)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.hhhg)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.other_expense)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.final_price)}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.quantity)}</td>
                                <td>{good.goods_description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <p className="no-goods">No goods found for this cottage.</p>
            )}
        </div>
    );
};

export default CottageDetails;
