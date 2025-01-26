import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CottageForm.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Select from 'react-select';
import { fetchOrders } from '../actions/performaActions'; 
import { createCottage } from '../actions/cottageActions';
import { RESET_COTTAGE_CREATION } from '../actions/actionTypes';

const CottageForm = () => {
  const dispatch = useDispatch();

  // Redux state for orders and cottage creation
  const ordersState = useSelector((state) => state.order);
  const { loading, orders, error } = ordersState;
  const { cottageCreation } = useSelector((state) => state.cottages);

  // Local state for form data
  const [formData, setFormData] = useState({
    cottage_number: '',
    cottage_date: '',
    proforma: '',
    total_value: '',
    quantity: '',
    currency_price: '',
    rewatch: false,  // Set default to false
    docs_recieved: false,  // Set default to false
    rafee_taahod: false, 
    cottage_customer:'',
    cottage_status:'',
  });
  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files[0] });
};

  // Local state for goods
  const [cottage_goods, setGoods] = useState([]);
  const [newGood, setNewGood] = useState({ goodscode: '', quantity: '', goods_description: '', customs_value: '', import_rights: '', red_cersent: '', total_value: '', added_value: '', discount: ''  });
  const [showGoodsForm, setShowGoodsForm] = useState(false);

  // Fetch orders when the component mounts
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Handle input changes for cottage form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input changes for new good
  const handleGoodsChange = (e) => {
    setNewGood({ ...newGood, [e.target.name]: e.target.value });
  };

  // Add a new good to the goods list
  const addGood = () => {
    setGoods([...cottage_goods, newGood]);
    setNewGood({  goodscode: '', quantity: '', goods_description: '', customs_value: '', import_rights: '', red_cersent: '', total_value: '', added_value: '', discount: ''}); // Reset the goods form
    setShowGoodsForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cottage_goods.length) {
        alert('حداقل یک کالا باید اضافه شود.');
        return;
    }
    const finalData = { ...formData, cottage_goods };
    console.log(finalData); // Log the data to ensure it's correctly structured
    dispatch(createCottage(finalData));
    
};


  
  // Handle success or error messages
  useEffect(() => {
    if (cottageCreation.success) {
      alert('Cottage created successfully!');
      setFormData({
        cottage_number: '',
        cottage_date: '',
        proforma: '',
        total_value: '',
        quantity: '',
        currency_price: '',
        rewatch: false,  // Set default to false
        docs_recieved: false,  // Set default to false
        rafee_taahod: false, 
        cottage_customer:'',
        cottage_status:'',
      });
      setGoods([]); // Clear goods
      dispatch({ type: RESET_COTTAGE_CREATION });
    }
    if (cottageCreation.error) {
      alert('Failed to create cottage: ' + cottageCreation.error && cottageCreation.error.total_value);
      dispatch({ type: RESET_COTTAGE_CREATION });
    }
  }, [cottageCreation, dispatch]);

  // Prepare options for react-select
  const orderOptions = orders.map((order) => ({
    value: order.prf_order_no,
    label: order.prf_order_no,
  }));

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, proforma: selectedOption ? selectedOption.value : '' });
  };

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2>اظهارنامه جدید</h2>
      <div className="form-group">
      <span>تاریخ</span>

        <DatePicker
        className='selectPrf'
          value={formData.cottage_date}
          onChange={(date) => setFormData({ ...formData, cottage_date: date.format("YYYY-MM-DD") })}
          calendar={persian}
          locale={persian_fa}
          format="YYYY-MM-DD"
          placeholder="تاریخ را انتخاب کنید"
          required
        />
        <span>شماره کوتاژ</span>
        <input
          type="number"
          name="cottage_number"
          value={formData.cottage_number}
          onChange={handleChange}
          placeholder="شماره کوتاژ"
          required
        />
        <span>شماره ثبت سفارش</span>
        <Select
          name="proforma"
          className='selectPrf'
          value={orderOptions.find(option => option.value === formData.proforma) || null}
          onChange={handleSelectChange}
          options={orderOptions}
          isLoading={loading}
          isClearable
          placeholder={loading ? 'در حال بارگذاری...' : error ? 'خطا در بارگذاری' : 'انتخاب سفارش'}
          noOptionsMessage={() => (!loading && !error ? 'سفارشی موجود نیست' : 'در حال بارگذاری...')}
        />
        <span>ارزش کل</span>
        <input
          type="number"
          name="total_value"
          value={formData.total_value}
          onChange={handleChange}
          placeholder="ارزش کل"
          required
        />
        <span>تعداد کالا</span>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="تعداد کالا"
          required
        />
        <span>نرخ ارز</span>
        <input
          type="number"
          name="currency_price"
          value={formData.currency_price}
          onChange={handleChange}
          placeholder="نرخ ارز"
        />
        <span>مشتری</span>
        <input
          type="text"
          name="cottage_customer"
          value={formData.cottage_customer}
          onChange={handleChange}
          placeholder="نام مشتری"
        />
        <span>وضعیت</span>
        <input
          type="text"
          name="cottage_status"
          value={formData.cottage_status}
          onChange={handleChange}
          placeholder="وضعیت"
        />
                <span>رفع تعهد</span>
                <input
              type="checkbox"
              name="rafee_taahod"
              checked={formData.rafee_taahod}
              onChange={(e) => setFormData({ ...formData, rafee_taahod: e.target.checked ? true : false })}
            />
             <span>بازبینی</span>
                <input
              type="checkbox"
              name="rewatch"
              checked={formData.rewatch}
              onChange={(e) => setFormData({ ...formData, rewatch: e.target.checked ? true : false })}
              />
               <span>دریافت مدارک</span>
                <input
              type="checkbox"
              name="docs_recieved"
              checked={formData.docs_recieved}
              onChange={(e) => setFormData({ ...formData, docs_recieved: e.target.checked ? true : false })}
              />
             <span>آپلود مدارک</span>
                <input
              name="documents"
              type="file"
              onChange={handleFileChange}
            />



      </div>
      {/* Goods Section */}
      <div className="goods-section">
        <button
          type="button"
          onClick={() => setShowGoodsForm(!showGoodsForm)}
          className="btn-grad"
        >
          افزودن کالا
        </button>
        {showGoodsForm && (
      <div className="goods-form">
      <input
        type="number"
        name="goodscode"
        value={newGood.goodscode}
        onChange={handleGoodsChange}
        placeholder="کد کالا"
        required
      />
      <input
        type="number"
        name="quantity"
        value={newGood.quantity}
        onChange={handleGoodsChange}
        placeholder="تعداد"
        required
      />
      <input
        type="text"
        name="goods_description"
        value={newGood.goods_description}
        onChange={handleGoodsChange}
        placeholder="شرح تجاری"
        required
      />
      <input
        type="number"
        name="customs_value"
        value={newGood.customs_value}
        onChange={handleGoodsChange}
        placeholder="ارزش گمرکی"
        required
      />
      <input
        type="number"
        name="import_rights"
        value={newGood.import_rights}
        onChange={handleGoodsChange}
        placeholder="حقوق ورودی"
        required
      />
      <input
        type="number"
        name="red_cersent"
        value={newGood.red_cersent}
        onChange={handleGoodsChange}
        placeholder="حلال احمر"
        required
      />
      <input
        type="number"
        name="total_value"
        value={newGood.total_value}
        onChange={handleGoodsChange}
        placeholder="ارزش کالا"
        required
      />
      <input
        type="number"
        name="added_value"
        value={newGood.added_value}
        onChange={handleGoodsChange}
        placeholder="ارزش افزوده"
        required
      />
      <input
        type="number"
        name="discount"
        value={newGood.discount}
        onChange={handleGoodsChange}
        placeholder="تخفیف"
        required
      />
      <button type="button"  onClick={addGood}>
        افزودن
      </button>

    
          </div>
        )}
        {cottage_goods.length > 0 && (
          <div className="goods-list">
            <h3>کالاهای اضافه شده</h3>
            <ul>
              {cottage_goods.map((good, index) => (
                <li key={index}>
           شرح کالا: {good.goods_description} تعداد: {good.quantity} 
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button type="submit" className="btn-grad1" disabled={cottageCreation.loading}>
        {cottageCreation.loading ? 'در حال ایجاد...' : 'ایجاد کوتاژ'}
      </button>
    </form>
  );
};

export default CottageForm;
