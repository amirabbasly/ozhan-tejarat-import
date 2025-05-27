import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useNavigate } from 'react-router-dom';
import { createRepresentation } from '../actions/representationActions';
import { fetchCostumers } from '../actions/authActions';
import './CottageForm.css';

/* ---------- helpers ---------- */
const extractErrorData = axiosError =>
  axiosError?.response?.data ?? { detail: axiosError.message };

const RepresentationForm = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  /* -------------- data from store ------------- */
  const { costumerList = [], customersLoading, customersError } = useSelector(
    s => s.costumers || {}
  );

  /* -------------- local state ------------- */
  const [formData, setFormData] = useState({
    representi: [],
    representor: [],
    applicant:  '',
    start_date: '',
    end_date:   '',
    another_deligation:     false,
    representor_dismissal:  false,
    representation_summary: '',
    doc_number:        '',
    verification_code: '',
    file: null,
  });

  const [submitting, setSubmitting]   = useState(false);
  const [serverErrors, setServerErrors] = useState({});   // holds 400‑level errors

  /* -------------- fetch customers once ------------- */
  useEffect(() => { dispatch(fetchCostumers()); }, [dispatch]);

  /* -------------- helper generators ------------- */
  const customerOptions = costumerList.map(c => ({
    value: c.id.toString(), label: c.full_name,
  }));

  const handleMultiChange = field => options =>
    setFormData(p => ({ ...p, [field]: options ? options.map(o => o.value) : [] }));

  const handleSelectChange = field => option =>
    setFormData(p => ({ ...p, [field]: option ? option.value : '' }));

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleStartDateChange = v =>
    setFormData(p => ({ ...p, start_date: v?.format('YYYY-MM-DD') || '' }));
  const handleEndDateChange   = v =>
    setFormData(p => ({ ...p,   end_date: v?.format('YYYY-MM-DD') || '' }));

  const handleFileChange = e =>
    setFormData(p => ({ ...p, file: e.target.files[0] || null }));

  /* -------------- submit ------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setServerErrors({});               // reset previous errors

    /* build multipart form‑data */
    const data = new FormData();
    formData.representi.forEach(id  => data.append('representi',  id));
    formData.representor.forEach(id => data.append('representor', id));
    data.append('applicant',               formData.applicant);
    data.append('start_date',              formData.start_date);
    data.append('end_date',                formData.end_date);
    data.append('another_deligation',      formData.another_deligation);
    data.append('representor_dismissal',   formData.representor_dismissal);
    data.append('representation_summary',  formData.representation_summary);
    data.append('doc_number',              formData.doc_number);
    data.append('verification_code',       formData.verification_code);
    if (formData.file) data.append('file', formData.file);

    try {
      /* ‑‑ If you used RTK’s createAsyncThunk call unwrap() here ‑‑
         await dispatch(createRepresentation(data)).unwrap();
         otherwise plain dispatch below works when the thunk
         *throws* on non‑2xx HTTP */
      await dispatch(createRepresentation(data));
      alert('وکالت‌نامه با موفقیت ایجاد شد!');
      navigate('/representations');
    } catch (err) {
      /* Axios / fetch error */
      const errData = extractErrorData(err);
      setServerErrors(errData);
      console.error('Representation create failed:', errData);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI helpers ---------- */
  const fieldError = key =>
    serverErrors?.[key] ? (
      <div className="field-error">{Array.isArray(serverErrors[key])
        ? serverErrors[key][0]
        : serverErrors[key]}</div>
    ) : null;

  /* ========== RENDER ========== */
  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2 className="form-title">افزودن وکالت‌نامه</h2>

      {customersError && (
        <div className="add-error">خطا در دریافت لیست مشتریان</div>
      )}
      {serverErrors.detail && (      /* non‑field error */
        <div className="add-error">{serverErrors.detail}</div>
      )}

      {/* ---- موکل ---- */}
      <div className="form-group">
        <label className="form-label">موکل:</label>
        {customersLoading ? (
          <p>در حال بارگذاری...</p>
        ) : (
          <Select
            isMulti
            inputId="representi"
            className='selectPrf'
            name="representi"
            classNamePrefix="form-input"
            options={customerOptions}
            value={customerOptions.filter(o => formData.representi.includes(o.value))}
            onChange={handleMultiChange('representi')}
            placeholder="انتخاب موکل"
            isClearable
            required
          />
        )}
        {fieldError('representi')}
      </div>

      {/* ---- وکیل ---- */}
      <div className="form-group">
        <label className="form-label">وکیل:</label>
        {customersLoading ? (
          <p>در حال بارگذاری...</p>
        ) : (
          <Select
            isMulti
            inputId="representor"
            className='selectPrf'
            name="representor"
            classNamePrefix="form-input"
            options={customerOptions}
            value={customerOptions.filter(o => formData.representor.includes(o.value))}
            onChange={handleMultiChange('representor')}
            placeholder="انتخاب وکیل"
            isClearable
            required
          />
        )}
        {fieldError('representor')}
      </div>

      {/* ---- درخواست دهنده ---- */}
      <div className="form-group">
        <label className="form-label">درخواست دهنده:</label>
        {customersLoading ? (
          <p>در حال بارگذاری...</p>
        ) : (
          <Select
            inputId="applicant"
            className='selectPrf'
            name="applicant"
            classNamePrefix="form-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.applicant) || null}
            onChange={handleSelectChange('applicant')}
            placeholder="انتخاب درخواست دهنده"
            isClearable
          />
        )}
        {fieldError('applicant')}
      </div>

      {/* ---- تاریخ شروع / پایان ---- */}
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
        {fieldError('start_date')}
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
        />
        {fieldError('end_date')}
      </div>

      {/* ---- چک‌باکس‌ها ---- */}
      <div className="form-group checkbox-group">
        <label className="form-label">توکل به غیر</label>
        <input
          type="checkbox"
          name="another_deligation"
          checked={formData.another_deligation}
          onChange={handleChange}
          className="form-checkbox"
        />
      </div>

      <div className="form-group checkbox-group">
        <label className="form-label">عزل وکیل</label>
        <input
          type="checkbox"
          name="representor_dismissal"
          checked={formData.representor_dismissal}
          onChange={handleChange}
          className="form-checkbox"
        />
      </div>

      {/* ---- متن خلاصه ---- */}
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
        {fieldError('representation_summary')}
      </div>

      {/* ---- شماره سند ---- */}
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
        {fieldError('doc_number')}
      </div>

      {/* ---- کد تصدیق ---- */}
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
        {fieldError('verification_code')}
      </div>

      {/* ---- فایل ---- */}
      <div className="form-group">
        <label className="form-label">فایل:</label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="form-input-file"
        />
        {fieldError('file')}
      </div>

      <button
        type="submit"
        className="form-button"
        disabled={submitting}
      >
        {submitting ? 'در حال ثبت...' : 'ثبت'}
      </button>
    </form>
  );
};

export default RepresentationForm;
