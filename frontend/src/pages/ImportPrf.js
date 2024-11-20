import React, { useState } from 'react';
import axios from 'axios';
import '../components/CottageForm.css'; // Importing the same CSS file for consistent styling


const ImportPf = () => {
  const [formData, setFormData] = useState({
    ssdsshGUID: '',
    pageSize:'',
    urlVCodeInt: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // If you need to use a date picker for any date fields, uncomment and use the following lines:
  // const [value, setValue] = useState(new Date());

  const handleChange = (e) => {
    // For the DatePicker, you might need to handle date objects differently
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/guid/', formData);
      setMessage(response.data.message);
      alert('داده‌ها با موفقیت وارد شدند!');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'خطایی رخ داده است.');
        alert('خطایی در ورود داده‌ها رخ داد.');
      } else {
        setError('خطای غیرمنتظره‌ای رخ داده است.');
        alert('خطای غیرمنتظره‌ای رخ داده است.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2>دریافت پرفورم ها از سامانه جامع</h2>
      <div className="form-group">
        <input
          type="text"
          name="ssdsshGUID"
          onChange={handleChange}
          placeholder="ssdsshGUID"
          required
        />
        <input
          type="number"
          name="pageSize"
          onChange={handleChange}
          placeholder="تعداد صفحه"
          value={formData.pageSize}
          min="1"
          required
        />
        <input
          type="text"
          name="urlVCodeInt"
          onChange={handleChange}
          placeholder="urlVCodeInt"
          required
        />
        {/* If you have date fields, use the DatePicker component
        <DatePicker
          value={value}
          onChange={(date) => {
            setValue(date);
            setFormData({ ...formData, dateFieldName: date.format("YYYY/MM/DD") });
          }}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="تاریخ را انتخاب کنید"
        />
        */}
      </div>
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'در حال وارد کردن...' : 'وارد کردن'}
      </button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default ImportPf;
