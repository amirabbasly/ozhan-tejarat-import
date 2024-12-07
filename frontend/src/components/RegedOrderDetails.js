import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus, deletePerformas } from '../actions/performaActions';
import { useLocation, useNavigate } from 'react-router-dom';
import './RegedOrderDetails.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const RegedOrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const OrderDetails = useSelector((state) => state.orderDetails) || {};
  const { order, loading, error } = OrderDetails;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});


  // Extract prfOrderNo from the URL manually
  const prfOrderNo = location.pathname.split('/').pop();

  useEffect(() => {
    if (prfOrderNo && prfOrderNo !== 'undefined') {
      // Fetch specific Performa details when component mounts
      dispatch(fetchOrderById(prfOrderNo));
    } else {
      navigate('/error'); // Redirect to an error page if prfOrderNo is undefined
    }
  }, [dispatch, prfOrderNo, navigate]);

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleInputChange = (e, fieldName) => {
    if (e?.target) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    } else if (fieldName) {
      // Handle DatePicker value
      setFormData({ ...formData, [fieldName]: e?.format("YYYY-MM-DD") });
    }
  };
  

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      // Dispatch the update action
      await dispatch(updateOrderStatus(prfOrderNo, formData));
      // Re-fetch the order details after the update
      await dispatch(fetchOrderById(prfOrderNo));
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating the order:', error);
    }
  };
  const handleDeleteOrder = () => {
    if (!window.confirm('آیا از حذف سفارش فعلی اطمینان دارید؟')) {
      return;
    }

    dispatch(deletePerformas([prfOrderNo]))
      .then(() => {
        alert('سفارش با موفقیت حذف شد.');
        navigate('/reged-orders'); // Redirect to the orders list page
      })
      .catch((error) => {
        console.error('Error deleting the order:', error);
        alert('خطا در حذف سفارش.');
      });
  };
  
  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا: {error}</div>;
  }

  if (!order || Object.keys(order).length === 0) {
    return <div>اطلاعاتی موجود نیست</div>;
  }

  return (
    <div className="order-details-container">
      <h2>جزئیات ثبت سفارش </h2>
      <div className="order-field">
        <label>شماره سفارش:</label>
        <span>{formData.prf_order_no}</span>
      </div>
      <div className="order-field">
        <label>نام فروشنده:</label>
        {editMode ? (
          <input
            type="text"
            name="prf_seller_name"
            value={formData.prf_seller_name || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_seller_name}</span>
        )}
      </div>
      <div className="order-field">
        <label>قیمت کل:</label>
        {editMode ? (
          <input
            type="text"
            name="prf_total_price"
            value={formData.prf_total_price || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_total_price}</span>
        )}
      </div>
      <div className="order-field">
        <label>نوع ارز:</label>
        {editMode ? (
          <input
            type="text"
            name="prf_currency_type"
            value={formData.prf_currency_type || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_currency_type}</span>
        )}
      </div>
      <div className="order-field">
        <label>کشور فروشنده:</label>
        {editMode ? (
          <input
            type="text"
            name="prf_seller_country"
            value={formData.prf_seller_country || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_seller_country}</span>
        )}
      </div>
      <div className="order-field">
  <label>تاریخ سفارش:</label>
  {editMode ? (
    <DatePicker
      value={formData.prf_date}
      onChange={(value) => handleInputChange(value, "prf_date")}
      calendar={persian}
      locale={persian_fa}
      format="YYYY-MM-DD"
      placeholder="تاریخ را انتخاب کنید"
      required
    />
  ) : (
    <span>{order.prf_date}</span>
  )}
</div>
<div className="order-field">
  <label>تاریخ اعتبار سفارش:</label>
  {editMode ? (
    <DatePicker
      value={formData.prf_expire_date}
      onChange={(value) => handleInputChange(value, "prf_expire_date")}
      calendar={persian}
      locale={persian_fa}
      format="YYYY-MM-DD"
      placeholder="تاریخ را انتخاب کنید"
      required
    />
  ) : (
    <span>{order.prf_expire_date}</span>
  )}
</div>
      <div className="order-field">
        <label>کد پروفرما:</label>
        <span>{formData.prfVCodeInt}</span>
      </div>
      <div className="order-buttons">
        {editMode ? (
          <button className="primary-button" onClick={handleSaveClick}>ذخیره</button>
        ) : (
          <button className="primary-button" onClick={handleEditClick}>ویرایش</button>
        )}
        <button
          onClick={handleDeleteOrder}
          className="delete-button"
        >
          حذف سفارش
        </button>

      </div>
    </div>
  );
};

export default RegedOrderDetails;