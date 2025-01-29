import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus, deletePerformas } from '../actions/performaActions';
import { useLocation, useNavigate } from 'react-router-dom';
import './RegedOrderDetails.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Link } from 'react-router-dom';

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
        <label>شماره ثبت سفارش:</label>
        <span>{formData.prf_order_no}</span>
      </div>
      <div className="order-field">
        <label>شماره پرفورم:</label>
        {editMode ? (
          <input
            type="text"
            name="prf_number"
            value={formData.prf_number || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_number}</span>
        )}
      </div>
      
      <div className="order-field">
        <label>شماره پرونده:</label>
        <span>{formData.prfVCodeInt}</span>
      </div>
      <div className="order-field">
        <label>نوع کالا :</label>
        {editMode ? (
          <input
            type="text"
            name="goods_type"
            value={formData.goods_type || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.goods_type}</span>
        )}
      </div>
      <div className="order-field">
        <label>ابزار پرداخت:</label>
        {editMode ? (
          <input
            type="number"
            name="payment_instrument"
            value={formData.payment_instrument || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.payment_instrument}</span>
        )}
      </div>
      <div className="order-field">
        <label>اطلاعات بانک :</label>
        {editMode ? (
          <input
            type="text"
            name="bank_info"
            value={formData.bank_info || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.bank_info}</span>
        )}
      </div>
      

      <div className="order-field">
        <label>FOB:</label>
        {editMode ? (
          <input
            type="number"
            name="FOB"
            value={formData.FOB || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.FOB}</span>
        )}
      </div>
      <div className="order-field">
        <label>کرایه حمل:</label>
        {editMode ? (
          <input
            type="number"
            name="prf_freight_price"
            value={formData.prf_freight_price || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_freight_price}</span>
        )}
      </div>
      
      <div className="order-field">
        <label>ارزش کل:</label>
        {editMode ? (
          <input
            type="number"
            name="prf_total_price"
            value={formData.prf_total_price || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_total_price}</span>
        )}
      </div>

      <div className="order-field">
        <label>باقیمانده سفارش:</label>
        {
                      order.remaining_total > -1
                        ? `باقی مانده : ${new Intl.NumberFormat('fa-IR').format(order.remaining_total)}`
                        : `مابع تفاوت : ${new Intl.NumberFormat('fa-IR').format(Math.abs(order.remaining_total))}`
                    }
      </div>
      <div className="order-field">
        <label>خریداری شده:</label>
        {editMode ? (
          <input
            type="number"
            name="purchased_total"
            value={formData.purchased_total || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.purchased_total}</span>
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
        <label>نرخ ارز:</label>
        {editMode ? (
          <input
            type="number"
            name="prf_currency_price"
            value={formData.prf_currency_price || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.prf_currency_price}</span>
        )}
      </div>
      <div className="order-field">
        <label>ریال واریزی:</label>
        {editMode ? (
          <input
            type="number"
            name="rial_deposit"
            value={formData.rial_deposit || ''}
            onChange={handleInputChange}
          />
        ) : (
          <span>{order.rial_deposit}</span>
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
      <hr />
      <div className="cottages-container">
        <h3>لیست کوتاژها</h3>
        {order.cottages && order.cottages.length > 0 ? (
          <table className="cottages-table">
            <thead>
              <tr>
                <th>شماره کوتاژ</th>
                <th>تاریخ کوتاژ</th>
                <th>مبلغ کوتاژ</th>
                <th>وضعیت</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {order.cottages.map((cottage) => (
                <tr key={cottage.cottage_number}>
                  <td>{cottage.cottage_number}</td>
                  <td>{cottage.cottage_date}</td>
                  <td>{new Intl.NumberFormat('fa-IR').format(cottage.total_value)}</td>
                  <td>{cottage.cottage_status || 'نامشخص'}</td>
                  <td>
                    <Link to={`/cottages/${cottage.cottage_number}`} className="cottage-link">
                      مشاهده
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>هیچ کوتاژی ثبت نشده است.</p>
        )}
      </div>

    </div>
  );
};

export default RegedOrderDetails;