import React, { useState } from 'react';
import axios from 'axios';
import './CottageForm.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"



const CottageForm = () => {
  const [formData, setFormData] = useState({
    cottage_number: '',
    cottage_date: '',
    proforma: '',
    total_value: '',
    quantity: '',
    customs_value: '',
    import_rights: '',
    red_cersent: '',
    added_value: '',
    discount: '',
    currency_price: '',
    other_expense: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/cottages/', formData);
      console.log('Cottage created:', response.data);
      alert('Cottage created successfully!');
    } catch (error) {
      console.error('Error creating cottage:', error);
      alert('Failed to create cottage.');
    }
  };
  const [value, setValue] = useState(new Date());

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2>کوتاژ جدید</h2>
      <div className="form-group">
      <DatePicker
          value={value}
          onChange={(date) => {
            setValue(date);
            setFormData({ ...formData, cottage_date: date.format("YYYY/MM/DD") }); // Update formData with formatted date
          }}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="تاریخ را انتخاب کنید"
        />
        <input type="number" name="cottage_number" onChange={handleChange} placeholder="شماره کوتاژ" required />
        <input type="text" name="proforma" onChange={handleChange} placeholder="شماره ثبت سقارش" required />
        <input type="number" name="total_value" onChange={handleChange} placeholder="ارزش کل" required />
        <input type="number" name="quantity" onChange={handleChange} placeholder="تعداد" required />
        <input type="number" name="customs_value" onChange={handleChange} placeholder="ارزش گمرکی" />
        <input type="number" name="import_rights" onChange={handleChange} placeholder="حق گمرکی" />
        <input type="number" name="red_cersent" onChange={handleChange} placeholder="حلال احمر" />
        <input type="number" name="added_value" onChange={handleChange} placeholder="ارزش افزوده" />
        <input type="number" name="discount" onChange={handleChange} placeholder="تخفیف" />
        <input type="number" name="currency_price" onChange={handleChange} placeholder="نرخ ارز" />
      </div>
      <button type="submit" className="submit-button">ایجاد کوتاژ</button>
    </form>
  );
};

export default CottageForm;
