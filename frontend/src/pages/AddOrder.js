import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../components/CottageForm.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { createOrder } from '../actions/performaActions';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { RESET_ADD_PERFORMA } from '../actions/actionTypes';

const AddOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for orders and order creation
  const { orderCreation } = useSelector((state) => state.order);

  // Local state for form data and error messages
  const [formData, setFormData] = useState({
    prf_order_no: '',
    prf_number: '',
    prf_date: '',
    prf_expire_date: '',
    prf_freight_price:'',
    FOB:'',
    prf_total_price: '',
    prf_seller_country: '',
    prf_status:'',
    prfVCodeInt:'',
  });

  const [errors, setErrors] = useState({}); // For backend validation errors

  // Mapping backend English errors to Persian
  const errorTranslationMap = {
    "performa with this prf order no already exists.": "پرفورما با این شماره ثبت سفارش از قبل وجود دارد.",
    "performa with this prfVCodeInt already exists.": "پرفورما با این شماره پرونده از قبل وجود دارد.",
    "performa with this prf number already exists.": "پرفورما با این شماره پیش فاکتور از قبل وجود دارد.",
    // Add other known error translations as needed
  };

  // A helper function to translate errors to Persian
  const translateErrors = (errorObj) => {
    const translatedErrors = {};
    for (const key in errorObj) {
      if (Array.isArray(errorObj[key])) {
        translatedErrors[key] = errorObj[key].map(msg => errorTranslationMap[msg] || msg);
      } else {
        translatedErrors[key] = errorTranslationMap[errorObj[key]] || errorObj[key];
      }
    }
    return translatedErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error for the field being modified
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    dispatch(createOrder(finalData));
  };

  useEffect(() => {
    if (orderCreation.success) {
      setErrors({});
      setFormData({
        prf_order_no: '',
        prf_number: '',
        prf_date: '',
        prf_expire_date: '',
        prf_freight_price:'',
        FOB:'',
        prf_total_price: '',
        prf_seller_name:'',
        prf_seller_country: '',
        prf_status:'',
        prfVCodeInt:'',
      });
      alert('سفارش با موفقیت ایجاد شد!');
      navigate('/reged-orders');
      dispatch({ type: RESET_ADD_PERFORMA });
    } else if (orderCreation.error) {
      // Check if the error is an object with validation messages
      if (typeof orderCreation.error === 'object' && orderCreation.error !== null) {
        const translated = translateErrors(orderCreation.error);
        setErrors(translated);
      } else {
        alert(`ایجاد سفارش ناموفق بود: ${orderCreation.error}`);
      }
      dispatch({ type: RESET_ADD_PERFORMA });
    }
  }, [orderCreation, dispatch, navigate]);

  const orderOptions = [
    { value: 'در انتظار', label: 'در انتظار' },
    { value: 'ثبت سفارش', label: 'ثبت سفارش' },
    { value: 'رد شده', label: 'رد شده' },
  ];

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, prf_status: selectedOption ? selectedOption.value : '' });
    setErrors({ ...errors, prf_status: '' }); // Clear error for status
  };

  // Auto calculate prf_total_price whenever prf_freight_price or FOB changes
  useEffect(() => {
    const freightPrice = parseFloat(formData.prf_freight_price) || 0;
    const fobPrice = parseFloat(formData.FOB) || 0;
    setFormData((prevState) => ({
      ...prevState,
      prf_total_price: (freightPrice + fobPrice).toFixed(2),
    }));
  }, [formData.prf_freight_price, formData.FOB]);

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2>ثبت سفارش جدید</h2>
      <div className="form-group">
        <span>تاریخ ثبت</span>
        <DatePicker
          className='selectPrf'
          value={formData.prf_date}
          onChange={(date) => setFormData({ ...formData, prf_date: date.format("YYYY-MM-DD") })}
          calendar={persian}
          locale={persian_fa}
          format="YYYY-MM-DD"
          placeholder="تاریخ را انتخاب کنید"
          required
        />
        <span>تاریخ اعتبار</span>
        <DatePicker
          className='selectPrf'
          value={formData.prf_expire_date}
          onChange={(date) => setFormData({ ...formData, prf_expire_date: date.format("YYYY-MM-DD") })}
          calendar={persian}
          locale={persian_fa}
          format="YYYY-MM-DD"
          placeholder="تاریخ اعتبار را انتخاب کنید"
          required
        />
        <span>شماره ثبت سفارش</span>
        <input
          type="number"
          name="prf_order_no"
          value={formData.prf_order_no}
          onChange={handleChange}
          placeholder={errors.prf_order_no ? errors.prf_order_no[0] : "شماره ثبت سفارش"}
          className={errors.prf_order_no ? "error-input" : ""}
          required
        />
        {errors.prf_order_no && <div className="add-error">{errors.prf_order_no[0]}</div>}

        <span>شماره پرونده</span>
        <input
          type="number"
          name="prfVCodeInt"
          value={formData.prfVCodeInt}
          onChange={handleChange}
          placeholder={errors.prfVCodeInt ? errors.prfVCodeInt[0] : "شماره پرونده"}
          className={errors.prfVCodeInt ? "error-input" : ""}
          required
        />
        {errors.prfVCodeInt && <div className="add-error">{errors.prfVCodeInt[0]}</div>}

        <span>شماره پیش فاکتور</span>
        <input
          type="text"
          name="prf_number"
          value={formData.prf_number}
          onChange={handleChange}
          placeholder={errors.prf_number ? errors.prf_number[0] :"شماره پیش فاکتور"}
          className={errors.prfVCodeInt ? "error-input" : ""}
          required
        />
        {errors.prf_number && <div className="add-error">{errors.prf_number[0]}</div>}

        <span>FOB</span>
        <input
          type="number"
          name="FOB"
          value={formData.FOB}
          onChange={handleChange}
          placeholder="FOB"
          required
        />
        <span>کرایه حمل</span>
        <input
          type="number"
          name="prf_freight_price"
          value={formData.prf_freight_price}
          onChange={handleChange}
          placeholder="کرایه حمل"
          required
        />

        <span>ارزش کل</span>
        <input
          type="number"
          name="prf_total_price"
          value={formData.prf_total_price}
          onChange={handleChange}
          placeholder="ارزش کل"
          required
          readOnly
        />
      
        <span>کشور فروشنده</span>
        <input
          type="text"
          name="prf_seller_country"
          value={formData.prf_seller_country}
          onChange={handleChange}
          placeholder="کشور فروشنده"
          required
        />
        
        <span>وضعیت</span>
        <Select
          className='selectPrf'
          name="prf_status"
          value={orderOptions.find((option) => option.value === formData.prf_status)}
          onChange={handleSelectChange}
          options={orderOptions}
          placeholder="وضعیت"
          isClearable
        />
        {errors.prf_status && <div className="error">{errors.prf_status[0]}</div>}
      </div>
      <button type="submit" className="btn-grad1" disabled={orderCreation.loading}>
        {orderCreation.loading ? 'در حال ایجاد...' : 'ایجاد ثبت سفارش'}
      </button>
    </form>
  );
};

export default AddOrder;
