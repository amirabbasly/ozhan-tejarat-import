import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { createRepresentation } from '../actions/representationActions';
import './CottageForm.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom';
import { fetchCostumers } from "../actions/authActions";

const RepresentationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { costumerList = [], customersLoading, customersError } = useSelector(
    (state) => state.costumers || {}
  );

  useEffect(() => {
    dispatch(fetchCostumers());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    representi: '',
    representor: '',
    applicant: '',
    start_date: '',
    end_date: '',
    another_deligation: false,
    representor_dismissal: false,
    representation_summary: '',
    doc_number: '',
    verification_code: '',
    file: null,
  });

  // Prepare react-select options
  const customerOptions = costumerList.map(c => ({ value: c.id.toString(), label: c.full_name }));

  const handleSelectChange = (field) => (option) => {
    setFormData(prev => ({ ...prev, [field]: option ? option.value : '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStartDateChange = (value) => {
    setFormData(prev => ({
      ...prev,
      start_date: value?.format("YYYY-MM-DD") || "",
    }));
  };

  const handleEndDateChange = (value) => {
    setFormData(prev => ({
      ...prev,
      end_date: value?.format("YYYY-MM-DD") || "",
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    // Manually append relationship IDs
    data.append('representi', formData.representi);
    data.append('representor', formData.representor);
    data.append('applicant', formData.applicant);
    // Append other fields explicitly
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    data.append('another_deligation', formData.another_deligation);
    data.append('representor_dismissal', formData.representor_dismissal);
    data.append('representation_summary', formData.representation_summary);
    data.append('doc_number', formData.doc_number);
    data.append('verification_code', formData.verification_code);
    // Append file if present
    if (formData.file) data.append('file', formData.file);

    dispatch(createRepresentation(data))
      .then(() => {
        alert('وکالت‌نامه با موفقیت ایجاد شد!');
        navigate('/representations');
      })
      .catch(err => console.error("Error creating representation:", err));
  };

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2 className="form-title">افزودن وکالت‌نامه</h2>

      {customersError && <div className="add-error">خطا در دریافت لیست مشتریان</div>}

      <div className="form-group">
        <label className="form-label">موکل:</label>
        {customersLoading ? (<p>در حال بارگذاری...</p>) : (
          <Select
            inputId="representi"
            name="representi"
            classNamePrefix="form-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.representi) || null}
            onChange={handleSelectChange('representi')}
            placeholder="انتخاب موکل"
            isClearable
            required
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">وکیل:</label>
        {customersLoading ? (<p>در حال بارگذاری...</p>) : (
          <Select
            inputId="representor"
            name="representor"
            classNamePrefix="form-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.representor) || null}
            onChange={handleSelectChange('representor')}
            placeholder="انتخاب وکیل"
            isClearable
            required
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">درخواست دهنده:</label>
        {customersLoading ? (<p>در حال بارگذاری...</p>) : (
          <Select
            inputId="applicant"
            name="applicant"
            classNamePrefix="form-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.applicant) || null}
            onChange={handleSelectChange('applicant')}
            placeholder="انتخاب درخواست دهنده"
            isClearable
            required
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">تاریخ شروع:</label>
        <DatePicker
          id="start_date"
          calendar={persian}
          locale={persian_fa}
          value={formData.start_date}
          onChange={handleStartDateChange}
          format="YYYY-MM-DD"
          placeholder="----/--/--"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">تاریخ پایان:</label>
        <DatePicker
          id="end_date"
          calendar={persian}
          locale={persian_fa}
          value={formData.end_date}
          onChange={handleEndDateChange}
          format="YYYY-MM-DD"
          placeholder="----/--/--"
          required
        />
      </div>

      <div className="form-group checkbox-group">
        <label className="form-label">توکل به غیر
        </label>
          <input
            type="checkbox"
            name="another_deligation"
            checked={formData.another_deligation}
            onChange={handleChange}
            className="form-checkbox"
          /> 
      </div>

      <div className="form-group checkbox-group">
        <label className="form-label">عزل وکیل
        </label>
          <input
            type="checkbox"
            name="representor_dismissal"
            checked={formData.representor_dismissal}
            onChange={handleChange}
            className="form-checkbox"
          /> 
      </div>

      <div className="form-group">
        <label className="form-label">خلاصه وکالت:</label>
        <textarea
          name="representation_summary"
          value={formData.representation_summary}
          onChange={handleChange}
          className="form-textarea"
          placeholder="خلاصه‌ای از وکالت را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">شماره سند:</label>
        <input
          type="number"
          name="doc_number"
          value={formData.doc_number}
          onChange={handleChange}
          className="form-input"
          placeholder="شماره سند را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">کد تصدیق:</label>
        <input
          type="number"
          name="verification_code"
          value={formData.verification_code}
          onChange={handleChange}
          className="form-input"
          placeholder="کد تصدیق را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">فایل:</label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="form-input-file"
        />
      </div>

      <button type="submit" className="form-button">ثبت</button>
    </form>
  );
};

export default RepresentationForm;
