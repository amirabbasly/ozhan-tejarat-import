// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import '../style/CottageForm.css';
// import DatePicker from 'react-multi-date-picker';
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { createOrder } from '../actions/performaActions';
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';
// import { RESET_ADD_PERFORMA } from '../actions/actionTypes';

// const AddOrder = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Redux state for orders and order creation
//   const { orderCreation } = useSelector((state) => state.order);

//   // Local state for form data and error messages
//   const [formData, setFormData] = useState({
//     prf_order_no: '',
//     prf_number: '',
//     prf_date: '',
//     prf_expire_date: '',
//     prf_freight_price:'',
//     FOB:'',
//     prf_total_price: '',
//     prf_seller_country: '',
//     prf_status:'',
//     prfVCodeInt:'',
//     payment_instrument:'',
//     purchased_total:'',
//     bank_info:'',
//     rial_deposit:'',

//   });

//   const [errors, setErrors] = useState({}); // For backend validation errors

//   // Mapping backend English errors to Persian
//   const errorTranslationMap = {
//     "performa with this prf order no already exists.": "پرفورما با این شماره ثبت سفارش از قبل وجود دارد.",
//     "performa with this prfVCodeInt already exists.": "پرفورما با این شماره پرونده از قبل وجود دارد.",
//     "performa with this prf number already exists.": "پرفورما با این شماره پیش فاکتور از قبل وجود دارد.",
//     // Add other known error translations as needed
//   };

//   // A helper function to translate errors to Persian
//   const translateErrors = (errorObj) => {
//     const translatedErrors = {};
//     for (const key in errorObj) {
//       if (Array.isArray(errorObj[key])) {
//         translatedErrors[key] = errorObj[key].map(msg => errorTranslationMap[msg] || msg);
//       } else {
//         translatedErrors[key] = errorTranslationMap[errorObj[key]] || errorObj[key];
//       }
//     }
//     return translatedErrors;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' }); // Clear error for the field being modified
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const finalData = { ...formData };
//     dispatch(createOrder(finalData));
//   };

//   useEffect(() => {
//     if (orderCreation.success) {
//       setErrors({});
//       setFormData({
//         prf_order_no: '',
//         prf_number: '',
//         prf_date: '',
//         prf_expire_date: '',
//         prf_freight_price:'',
//         FOB:'',
//         prf_total_price: '',
//         prf_seller_name:'',
//         prf_seller_country: '',
//         prf_status:'',
//         prfVCodeInt:'',
//         payment_instrument:'',
//         purchased_total:'',
//         bank_info:'',
//         rial_deposit:'',

//       });
//       alert('سفارش با موفقیت ایجاد شد!');
//       navigate('/reged-orders');
//       dispatch({ type: RESET_ADD_PERFORMA });
//     } else if (orderCreation.error) {
//       // Check if the error is an object with validation messages
//       if (typeof orderCreation.error === 'object' && orderCreation.error !== null) {
//         const translated = translateErrors(orderCreation.error);
//         setErrors(translated);
//       } else {
//         alert(`ایجاد سفارش ناموفق بود: ${orderCreation.error}`);
//       }
//       dispatch({ type: RESET_ADD_PERFORMA });
//     }
//   }, [orderCreation, dispatch, navigate]);

//   const orderOptions = [
//     { value: 'در انتظار', label: 'در انتظار' },
//     { value: 'ثبت سفارش', label: 'ثبت سفارش' },
//     { value: 'رد شده', label: 'رد شده' },
//   ];

//   const handleSelectChange = (selectedOption) => {
//     setFormData({ ...formData, prf_status: selectedOption ? selectedOption.value : '' });
//     setErrors({ ...errors, prf_status: '' }); // Clear error for status
//   };

//   // Auto calculate prf_total_price whenever prf_freight_price or FOB changes
//   useEffect(() => {
//     const freightPrice = parseFloat(formData.prf_freight_price) || 0;
//     const fobPrice = parseFloat(formData.FOB) || 0;
//     setFormData((prevState) => ({
//       ...prevState,
//       prf_total_price: (freightPrice + fobPrice).toFixed(2),
//     }));
//   }, [formData.prf_freight_price, formData.FOB]);

//   return (
//     <form className="cottage-form" onSubmit={handleSubmit}>
//       <h2>ثبت سفارش جدید</h2>
//       <div className="form-group">
//         <span>تاریخ ثبت</span>
//         <DatePicker
//           className='selectPrf'
//           value={formData.prf_date}
//           onChange={(date) => setFormData({ ...formData, prf_date: date.format("YYYY-MM-DD") })}
//           calendar={persian}
//           locale={persian_fa}
//           format="YYYY-MM-DD"
//           placeholder="تاریخ را انتخاب کنید"
//           required
//         />
//         <span>تاریخ اعتبار</span>
//         <DatePicker
//           className='selectPrf'
//           value={formData.prf_expire_date}
//           onChange={(date) => setFormData({ ...formData, prf_expire_date: date.format("YYYY-MM-DD") })}
//           calendar={persian}
//           locale={persian_fa}
//           format="YYYY-MM-DD"
//           placeholder="تاریخ اعتبار را انتخاب کنید"
//           required
//         />
//         <span>شماره ثبت سفارش</span>
//         <input
//           type="number"
//           name="prf_order_no"
//           value={formData.prf_order_no}
//           onChange={handleChange}
//           placeholder={errors.prf_order_no ? errors.prf_order_no[0] : "شماره ثبت سفارش"}
//           className={errors.prf_order_no ? "error-input" : ""}
//           required
//           min={0}

//         />
//         {errors.prf_order_no && <div className="add-error">{errors.prf_order_no[0]}</div>}

//         <span>شماره پرونده</span>
//         <input
//           type="number"
//           name="prfVCodeInt"
//           value={formData.prfVCodeInt}
//           onChange={handleChange}
//           placeholder={errors.prfVCodeInt ? errors.prfVCodeInt[0] : "شماره پرونده"}
//           className={errors.prfVCodeInt ? "error-input" : ""}
//           required
//           min={0}

//         />
//         {errors.prfVCodeInt && <div className="add-error">{errors.prfVCodeInt[0]}</div>}

//         <span>شماره پیش فاکتور</span>
//         <input
//           type="text"
//           name="prf_number"
//           value={formData.prf_number}
//           onChange={handleChange}
//           placeholder={errors.prf_number ? errors.prf_number[0] :"شماره پیش فاکتور"}
//           className={errors.prfVCodeInt ? "error-input" : ""}
//           required
          
//         />
//         {errors.prf_number && <div className="add-error">{errors.prf_number[0]}</div>}
//         <span>ابزار پرداخت</span>
//         <input
//           type="number"
//           name="payment_instrument"
//           value={formData.payment_instrument}
//           onChange={handleChange}
//           placeholder="ابزار پرداخت"
//           min={0}

//         />
//         <span>FOB</span>
//         <input
//           type="number"
//           name="FOB"
//           value={formData.FOB}
//           onChange={handleChange}
//           placeholder="FOB"
//           required
//           min={0}

//         />
//         <span>کرایه حمل</span>
//         <input
//           type="number"
//           name="prf_freight_price"
//           value={formData.prf_freight_price}
//           onChange={handleChange}
//           placeholder="کرایه حمل"
//           required
//           min={0}

//         />

//         <span>ارزش کل</span>
//         <input
//           type="number"
//           name="prf_total_price"
//           value={formData.prf_total_price}
//           onChange={handleChange}
//           placeholder="ارزش کل"
//           min={0}
//           required
//           readOnly
//         />
//                 <span>خرید شده</span>
//         <input
//           type="number"
//           name="purchased_total"
//           value={formData.purchased_total}
//           onChange={handleChange}
//           placeholder="ارزش کل خریداری شده"
//           min={0}

//         />
//               <span>ریال واریزی</span>
//         <input
//           type="number"
//           name="rial_deposit"
//           value={formData.rial_deposit}
//           onChange={handleChange}
//           placeholder="ریال واریزی"
//           min={0}
//         />
      
//         <span>کشور فروشنده</span>
//         <input
//           type="text"
//           name="prf_seller_country"
//           value={formData.prf_seller_country}
//           onChange={handleChange}
//           placeholder="کشور فروشنده"
//           required
//         />
//                 <span>اطلاعات بانک</span>
//         <input
//           type="text"
//           name="bank_info"
//           value={formData.bank_info}
//           onChange={handleChange}
//           placeholder="اطلاعات بانک"
          
//         />
        
//         <span>وضعیت</span>
//         <Select
//           className='selectPrf'
//           name="prf_status"
//           value={orderOptions.find((option) => option.value === formData.prf_status)}
//           onChange={handleSelectChange}
//           options={orderOptions}
//           placeholder="وضعیت"
//           isClearable
//         />
//         {errors.prf_status && <div className="error">{errors.prf_status[0]}</div>}
//       </div>
//       <button type="submit" className="btn-grad1" disabled={orderCreation.loading}>
//         {orderCreation.loading ? 'در حال ایجاد...' : 'ایجاد ثبت سفارش'}
//       </button>
//     </form>
//   );
// };

// export default AddOrder;



// New COde For The contanst theme 


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    prf_freight_price: '',
    FOB: '',
    prf_total_price: '',
    prf_seller_country: '',
    prf_status: '',
    prfVCodeInt: '',
    payment_instrument: '',
    purchased_total: '',
    bank_info: '',
    rial_deposit: '',
  });

  const [errors, setErrors] = useState({}); // For backend validation errors

  // Mapping backend English errors to Persian
  const errorTranslationMap = {
    "performa with this prf order no already exists.": "پرفورما با این شماره ثبت سفارش از قبل وجود دارد.",
    "performa with this prfVCodeInt already exists.": "پرفورما با این شماره پرونده از قبل وجود دارد.",
    "performa with this prf number already exists.": "پرفورما با این شماره پیش فاکتور از قبل وجود دارد.",
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
        prf_freight_price: '',
        FOB: '',
        prf_total_price: '',
        prf_seller_country: '',
        prf_status: '',
        prfVCodeInt: '',
        payment_instrument: '',
        purchased_total: '',
        bank_info: '',
        rial_deposit: '',
      });
      alert('سفارش با موفقیت ایجاد شد!');
      navigate('/reged-orders');
      dispatch({ type: RESET_ADD_PERFORMA });
    } else if (orderCreation.error) {
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

  // Custom styles for react-select to match RepresentationForm
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      fontFamily: 'Vazirmatn, sans-serif',
      direction: 'rtl',
      borderColor: '#D1D5DB', // gray-300
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      boxShadow: 'none',
      backgroundColor: '#FFFFFF', // white
      '&:hover': {
        borderColor: '#2563EB', // primary
      },
      '&:focus': {
        borderColor: '#2563EB', // primary
        boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.5)', // focus:ring-primary
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF', // gray-400 for placeholder
      textAlign: 'right',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151', // gray-700
      textAlign: 'right',
    }),
    menu: (provided) => ({
      ...provided,
      fontFamily: 'Vazirmatn, sans-serif',
      direction: 'rtl',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backgroundColor: '#FFFFFF', // white
    }),
    option: (provided, state) => ({
      ...provided,
      textAlign: 'right',
      backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#DBEAFE' : '#FFFFFF', // primary, blue-100, white
      color: state.isSelected ? '#FFFFFF' : '#374151', // white, gray-700
      '&:hover': {
        backgroundColor: '#DBEAFE', // blue-100
        color: '#2563EB', // primary
      },
    }),
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ثبت سفارش جدید
      </h2>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          تاریخ ثبت:
        </span>
        <div className="relative">
          <DatePicker
            value={formData.prf_date}
            onChange={(date) => setFormData({ ...formData, prf_date: date.format("YYYY-MM-DD") })}
            calendar={persian}
            locale={persian_fa}
            format="YYYY-MM-DD"
            placeholder="تاریخ را انتخاب کنید"
            required
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right bg-white shadow-sm hover:border-primary transition-colors duration-200 font-vazirmatn"
            calendarPosition="bottom-right"
            inputClass="w-full"
            containerStyle={{ direction: "rtl" }}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </span>
        </div>
        {errors.prf_date && <div className="text-red-600 text-sm mt-1 text-right">{errors.prf_date[0]}</div>}
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          تاریخ اعتبار:
        </span>
        <div className="relative">
          <DatePicker
            value={formData.prf_expire_date}
            onChange={(date) => setFormData({ ...formData, prf_expire_date: date.format("YYYY-MM-DD") })}
            calendar={persian}
            locale={persian_fa}
            format="YYYY-MM-DD"
            placeholder="تاریخ اعتبار را انتخاب کنید"
            required
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right bg-white shadow-sm hover:border-primary transition-colors duration-200 font-vazirmatn"
            calendarPosition="bottom-right"
            inputClass="w-full"
            containerStyle={{ direction: "rtl" }}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </span>
        </div>
        {errors.prf_expire_date && <div className="text-red-600 text-sm mt-1 text-right">{errors.prf_expire_date[0]}</div>}
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          شماره ثبت سفارش:
        </span>
        <input
          type="number"
          name="prf_order_no"
          value={formData.prf_order_no}
          onChange={handleChange}
          placeholder={errors.prf_order_no ? errors.prf_order_no[0] : "شماره ثبت سفارش"}
          className={`w-full px-3 py-2 border ${errors.prf_order_no ? 'border-red-600' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right`}
          required
          min={0}
        />
        {errors.prf_order_no && <div className="text-red-600 text-sm mt-1 text-right">{errors.prf_order_no[0]}</div>}
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          شماره پرونده:
        </span>
        <input
          type="number"
          name="prfVCodeInt"
          value={formData.prfVCodeInt}
          onChange={handleChange}
          placeholder={errors.prfVCodeInt ? errors.prfVCodeInt[0] : "شماره پرونده"}
          className={`w-full px-3 py-2 border ${errors.prfVCodeInt ? 'border-red-600' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right`}
          required
          min={0}
        />
        {errors.prfVCodeInt && <div className="text-red-600 text-sm mt-1 text-right">{errors.prfVCodeInt[0]}</div>}
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          شماره پیش فاکتور:
        </span>
        <input
          type="text"
          name="prf_number"
          value={formData.prf_number}
          onChange={handleChange}
          placeholder={errors.prf_number ? errors.prf_number[0] : "شماره پیش فاکتور"}
          className={`w-full px-3 py-2 border ${errors.prf_number ? 'border-red-600' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right`}
          required
        />
        {errors.prf_number && <div className="text-red-600 text-sm mt-1 text-right">{errors.prf_number[0]}</div>}
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          ابزار پرداخت:
        </span>
        <input
          type="number"
          name="payment_instrument"
          value={formData.payment_instrument}
          onChange={handleChange}
          placeholder="ابزار پرداخت"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          min={0}
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          FOB:
        </span>
        <input
          type="number"
          name="FOB"
          value={formData.FOB}
          onChange={handleChange}
          placeholder="FOB"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
          min={0}
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          کرایه حمل:
        </span>
        <input
          type="number"
          name="prf_freight_price"
          value={formData.prf_freight_price}
          onChange={handleChange}
          placeholder="کرایه حمل"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
          min={0}
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          ارزش کل:
        </span>
        <input
          type="number"
          name="prf_total_price"
          value={formData.prf_total_price}
          onChange={handleChange}
          placeholder="ارزش کل"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          min={0}
          required
          // readOnly
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          خرید شده:
        </span>
        <input
          type="number"
          name="purchased_total"
          value={formData.purchased_total}
          onChange={handleChange}
          placeholder="ارزش کل خریداری شده"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          min={0}
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          ریال واریزی:
        </span>
        <input
          type="number"
          name="rial_deposit"
          value={formData.rial_deposit}
          onChange={handleChange}
          placeholder="ریال واریزی"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          min={0}
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          کشور فروشنده:
        </span>
        <input
          type="text"
          name="prf_seller_country"
          value={formData.prf_seller_country}
          onChange={handleChange}
          placeholder="کشور فروشنده"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          اطلاعات بانک:
        </span>
        <input
          type="text"
          name="bank_info"
          value={formData.bank_info}
          onChange={handleChange}
          placeholder="اطلاعات بانک"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1 text-right">
          وضعیت:
        </span>
        <Select
          name="prf_status"
          value={orderOptions.find((option) => option.value === formData.prf_status)}
          onChange={handleSelectChange}
          options={orderOptions}
          placeholder="وضعیت"
          isClearable
          styles={selectStyles}
        />
        {errors.prf_status && <div className="text-red-600 text-sm mt-1 text-right">{errors.prf_status[0]}</div>}
      </div>

      <button
        type="submit"
        className="w-1/2 mx-auto px-4 py-2 min-w-full bg-primary text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={orderCreation.loading}
      >
        {orderCreation.loading ? 'در حال ایجاد...' : 'ایجاد ثبت سفارش'}
      </button>

      <style jsx>{`
        .rmdp-container {
          direction: rtl;
          font-family: "Vazirmatn", sans-serif;
        }
        .rmdp-calendar {
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          background-color: #ffffff;
        }
        .rmdp-day-picker div,
        .rmdp-header-values,
        .rmdp-week-day {
          font-family: "Vazirmatn", sans-serif !important;
        }
        .rmdp-day span {
          color: #374151;
        }
        .rmdp-day.rmdp-selected span {
          background-color: #2563EB;
          color: #ffffff;
        }
        .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden):hover span {
          background-color: #DBEAFE;
          color: #2563EB;
        }
        .rmdp-arrow-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rmdp-arrow {
          border-color: #374151;
        }
      `}</style>
    </form>
  );
};

export default AddOrder;