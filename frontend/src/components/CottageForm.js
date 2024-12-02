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
  });

  // Local state for goods
  const [goods, setGoods] = useState([]);
  const [newGood, setNewGood] = useState({ name: '', quantity: '', price: '' });
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
    setGoods([...goods, newGood]);
    setNewGood({ name: '', quantity: '', price: '' }); // Reset the goods form
    setShowGoodsForm(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, goods }; // Include goods in the submission
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
      });
      setGoods([]); // Clear goods
      dispatch({ type: RESET_COTTAGE_CREATION });
    }
    if (cottageCreation.error) {
      alert('Failed to create cottage: ' + cottageCreation.error);
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
      <h2>کوتاژ جدید</h2>
      <div className="form-group">
        <DatePicker
        className='selectPrf'
          value={formData.cottage_date}
          onChange={(date) => setFormData({ ...formData, cottage_date: date.format("YYYY-MM-DD") })}
          calendar={persian}
          locale={persian_fa}
          format="YYYY-MM-DD"
          placeholder="تاریخ را انتخاب کنید"
        />
        <input
          type="number"
          name="cottage_number"
          value={formData.cottage_number}
          onChange={handleChange}
          placeholder="شماره کوتاژ"
          required
        />
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
        <input
          type="number"
          name="total_value"
          value={formData.total_value}
          onChange={handleChange}
          placeholder="ارزش کل"
          required
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="تعداد کالا"
          required
        />
        <input
          type="number"
          name="currency_price"
          value={formData.currency_price}
          onChange={handleChange}
          placeholder="نرخ ارز"
        />
      </div>
      {/* Goods Section */}
      <div className="goods-section">
        <button
          type="button"
          onClick={() => setShowGoodsForm(!showGoodsForm)}
          className="add-goods-button"
        >
          افزودن کالا
        </button>
        {showGoodsForm && (
          <div className="goods-form">
            <input
              type="text"
              name="name"
              value={newGood.name}
              onChange={handleGoodsChange}
              placeholder="نام کالا"
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
              type="number"
              name="price"
              value={newGood.price}
              onChange={handleGoodsChange}
              placeholder="قیمت"
              required
            />
            <button type="button" onClick={addGood}>
              افزودن
            </button>
          </div>
        )}
        {goods.length > 0 && (
          <div className="goods-list">
            <h3>کالاهای اضافه شده</h3>
            <ul>
              {goods.map((good, index) => (
                <li key={index}>
                  {good.name} - تعداد: {good.quantity} - قیمت: {good.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button type="submit" className="submit-button" disabled={cottageCreation.loading}>
        {cottageCreation.loading ? 'در حال ایجاد...' : 'ایجاد کوتاژ'}
      </button>
    </form>
  );
};

export default CottageForm;
