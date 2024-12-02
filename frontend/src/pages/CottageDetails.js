// src/components/CottageDetails.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCottageDetails, updateCottageDetails } from '../actions/cottageActions';
import { useParams } from 'react-router-dom';
import './CottageDetails.css';
import DatePicker from 'react-multi-date-picker';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const CottageDetails = () => {
    const [cottageId, setCottageId] = useState('');
    const dispatch = useDispatch();
    const { cottageNumber } = useParams();
    const cottageDetails = useSelector((state) => state.cottageDetails);
    const { loading, cottage, error } = cottageDetails;

    // State variables for each cottage field
    const [currencyPrice, setCurrencyPrice] = useState('');
    const [cottageNum, setCottageNum] = useState('');
    const [cottageDate, setCottageDate] = useState(null);
    const [totalValue, setTotalValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [proforma, setProforma] = useState('');

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

    // Handlers for input changes
    const handleCurrencyPriceChange = (e) => {
        setCurrencyPrice(e.target.value);
    };

    const handleCottageNumChange = (e) => {
        setCottageNum(e.target.value);
    };

    const handleCottageDateChange = (date) => {
        setCottageDate(date);
    };

    const handleTotalValueChange = (e) => {
        setTotalValue(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleProformaChange = (e) => {
        setProforma(e.target.value);
    };

    const handleDetailsSubmit = () => {
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
                    <input
                        type="text"
                        id="cottageNum"
                        value={cottageNum}
                        onChange={handleCottageNumChange}
                        placeholder="Enter cottage number"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="cottageDate"><strong>تاریخ :</strong></label>
                    <DatePicker
                        id="cottageDate"
                        value={cottageDate}
                        onChange={handleCottageDateChange}
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD"
                        placeholder="تاریخ را انتخاب کنید"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="totalValue"><strong>ارزش کل :</strong></label>
                    <input
                        type="number"
                        id="totalValue"
                        value={totalValue}
                        onChange={handleTotalValueChange}
                        placeholder="Enter total value"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="quantity"><strong>تعداد کالا ها :</strong></label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        placeholder="Enter quantity"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="proforma"><strong>شماره ثبت سفارش :</strong></label>
                    <input
                        type="text"
                        id="proforma"
                        value={proforma}
                        onChange={handleProformaChange}
                        placeholder="Enter proforma number"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="currencyPrice"><strong>نرخ ارز :</strong></label>
                    <input
                        type="number"
                        id="currencyPrice"
                        value={currencyPrice}
                        onChange={handleCurrencyPriceChange}
                        placeholder="Enter currency price"
                    />
                </div>

                <button onClick={handleDetailsSubmit}>ثبت</button>
            </div>

            <h2 className="goods-header">کالا ها</h2>
            {cottage.cottage_goods && cottage.cottage_goods.length > 0 ? (
                <table className="goods-table">
                    <thead>
                        <tr>
                            <th>ردیف</th>
                            <th>کد کالا</th>
                            <th>ارزش گمرکی</th>
                            <th>حواله ریالی</th>
                            <th>حواله + حقوق</th>
                            <th>سایر هزینه ها</th>
                            <th>بهای تمام شده</th>
                            <th>Quantity</th>
                            <th>شرح کالا</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cottage.cottage_goods.map((good, index) => (
                            <tr key={good.id}>
                                <td>{index + 1}</td>
                                <td>{good.goodscode}</td>
                                <td>{new Intl.NumberFormat('fa-IR').format(good.customs_value)}</td>
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
            ) : (
                <p className="no-goods">No goods found for this cottage.</p>
            )}
        </div>
    );
};

export default CottageDetails;
