// src/components/CottageDetails.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCottageDetails, updateCottageCurrencyPrice } from '../actions/cottageActions';
import { useParams } from 'react-router-dom';
import './CottageDetails.css';

const CottageDetails = () => {
    const [cottageId, setCottageId] = useState('');
    const dispatch = useDispatch();
    const {cottageNumber} = useParams();

    const cottageDetails = useSelector((state) => state.cottageDetails);
    const { loading, cottage, error } = cottageDetails;

    const [currencyPrice, setCurrencyPrice] = useState('');

    useEffect(() => {
        if (cottageNumber) {
            dispatch(fetchCottageDetails(cottageNumber));
        }
    }, [dispatch, cottageNumber]);

    useEffect(() => {
        if (cottage) {
            setCurrencyPrice(cottage.currency_price || '');
        }
    }, [cottage]);
    useEffect(() => {
        if (cottage) {
            setCottageId(cottage.id || '');
        }
    }, [cottage]);

    const handleCurrencyPriceChange = (e) => {
        setCurrencyPrice(e.target.value);
    };

    const handleCurrencyPriceSubmit = () => {
        if (cottageId && currencyPrice) {
            dispatch(updateCottageCurrencyPrice(cottageId, currencyPrice));
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        // If error is an object, display the appropriate field or convert to string
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

                <p><strong>شماره کوتاژ :</strong> {cottage.cottage_number}</p>
                <p><strong>تاریخ :</strong> {cottage.cottage_date}</p>
                <p><strong>ارزش کل :</strong> {cottage.total_value}</p>
                <p><strong>تعداد کالا ها :</strong> {cottage.quantity}</p>
                <p><strong>شماره ثبت سفارش :</strong> {cottage.proforma}</p>

                <div className="currency-price-input">
                    <label htmlFor="currencyPrice"><strong>نرخ ارز : </strong></label>
                    <input
                        type="number"
                        id="currencyPrice"
                        value={currencyPrice}
                        onChange={handleCurrencyPriceChange}
                        placeholder="Enter currency price"
                    />

                </div>
                <button onClick={handleCurrencyPriceSubmit}>ثبت</button>
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
                                <td>{good.customs_value}</td>
                                <td>{good.riali}</td>
                                <td>{good.hhhg}</td>
                                <td>{good.other_expense}</td>
                                <td>{good.final_price}</td>
                                <td>{good.quantity}</td>
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
