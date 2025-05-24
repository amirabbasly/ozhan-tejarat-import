import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import axiosInstance from '../utils/axiosInstance';
import { updateRepresentation } from '../actions/representationActions';
import { fetchCostumers } from '../actions/authActions';
import './CottageForm.css';

export default function RepresentationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { costumerList = [], customersLoading } = useSelector(
    state => state.costumers || {}
  );

  const [formData, setFormData] = useState({
    representi: [],           // array of principal IDs
    representor: [],          // array of attorney IDs
    applicant: '',            // single applicant ID
    start_date: '',
    end_date: '',
    another_deligation: false,
    representor_dismissal: false,
    representation_summary: '',
    doc_number: '',
    verification_code: '',
    file: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load customer options
  const customerOptions = costumerList.map(c => ({
    value: String(c.id),
    label: c.full_name
  }));

  // fetch one representation
  useEffect(() => {
    dispatch(fetchCostumers());
    const fetchOne = async () => {
      try {
        const { data } = await axiosInstance.get(`/representations/${id}/`);
        setFormData({
          representi:   data.principal.map(c => String(c.id)),
          representor:  data.attorney.map(c => String(c.id)),
          applicant:    data.applicant_info?.id ? String(data.applicant_info.id) : '',
          start_date:             data.start_date || '',
          end_date:               data.end_date   || '',
          another_deligation:     !!data.another_deligation,
          representor_dismissal:  !!data.representor_dismissal,
          representation_summary: data.representation_summary || '',
          doc_number:             data.doc_number?.toString() || '',
          verification_code:      data.verification_code?.toString() || '',
          file:                   null,
        });
      } catch (err) {
        console.error(err);
        setError('نمی‌توان وکالت‌نامه را بارگذاری کرد.');
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [dispatch, id]);

  const handleMultiChange = field => options => {
    setFormData(prev => ({
      ...prev,
      [field]: options ? options.map(o => o.value) : []
    }));
  };

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file'
        ? files[0]
        : type === 'checkbox'
          ? checked
          : value
    }));
  };

  const handleDateChange = field => dateObj => {
    setFormData(prev => ({
      ...prev,
      [field]: dateObj ? dateObj.format('YYYY-MM-DD') : ''
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = new FormData();

    // append many-to-many IDs
    formData.representi.forEach(id => payload.append('representi', id));
    formData.representor.forEach(id => payload.append('representor', id));
    // append single FK
    payload.append('applicant', formData.applicant);

    // append other fields
    payload.append('start_date',             formData.start_date);
    payload.append('end_date',               formData.end_date);
    payload.append('another_deligation',     String(formData.another_deligation));
    payload.append('representor_dismissal',  String(formData.representor_dismissal));
    payload.append('representation_summary', formData.representation_summary);
    payload.append('doc_number',             formData.doc_number);
    payload.append('verification_code',      formData.verification_code);

    // append file if present
    if (formData.file instanceof File) {
      payload.append('file', formData.file);
    }

    try {
      await dispatch(updateRepresentation(id, payload));
      navigate('/representations');
    } catch (err) {
      console.error(err);
      setError('ارسال تغییرات با خطا مواجه شد.');
    }
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="cottage-details-container">
      <div className="header">ویرایش وکالت‌نامه #{id}</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Principals (representi) */}
        <div className="form-group">
          <label>موکل‌ها:</label>
          <Select
            isMulti
            options={customerOptions}
            value={customerOptions.filter(o => formData.representi.includes(o.value))}
            onChange={handleMultiChange('representi')}
            placeholder="انتخاب موکل‌ها"
            className="editable-input"
            classNamePrefix="editable-input"
            isClearable
            required
          />
        </div>

        {/* Attorneys (representor) */}
        <div className="form-group">
          <label>وکیل‌ها:</label>
          <Select
            isMulti
            options={customerOptions}
            value={customerOptions.filter(o => formData.representor.includes(o.value))}
            onChange={handleMultiChange('representor')}
            placeholder="انتخاب وکیل‌ها"
            className="editable-input"
            classNamePrefix="editable-input"
            isClearable
            required
          />
        </div>

        {/* Applicant */}
        <div className="form-group">
          <label>درخواست‌دهنده:</label>
          <Select
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.applicant) || null}
            onChange={opt => setFormData(prev => ({
              ...prev,
              applicant: opt ? opt.value : ''
            }))}
            placeholder="انتخاب درخواست‌دهنده"
            className="editable-input"
            classNamePrefix="editable-input"
            isClearable
            required
          />
        </div>

        {/* Start Date */}
        <div className="form-group">
          <label>تاریخ شروع:</label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            format="YYYY-MM-DD"
            value={formData.start_date}
            onChange={handleDateChange('start_date')}
            inputClass="editable-input"
          />
        </div>

        {/* End Date */}
        <div className="form-group">
          <label>تاریخ پایان:</label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            format="YYYY-MM-DD"
            value={formData.end_date}
            onChange={handleDateChange('end_date')}
            inputClass="editable-input"
          />
        </div>

        {/* Delegation to another */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="another_deligation"
              checked={formData.another_deligation}
              onChange={handleChange}
              className="form-checkbox"
            />
            توکل به غیر
          </label>
        </div>

        {/* Attorney dismissal */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="representor_dismissal"
              checked={formData.representor_dismissal}
              onChange={handleChange}
              className="form-checkbox"
            />
            عزل وکیل
          </label>
        </div>

        {/* Summary */}
        <div className="form-group">
          <label>خلاصه وکالت:</label>
          <textarea
            name="representation_summary"
            value={formData.representation_summary}
            onChange={handleChange}
            className="editable-input form-textarea"
          />
        </div>

        {/* Document number */}
        <div className="form-group">
          <label>شماره سند:</label>
          <input
            type="number"
            name="doc_number"
            value={formData.doc_number}
            onChange={handleChange}
            className="editable-input"
          />
        </div>

        {/* Verification code */}
        <div className="form-group">
          <label>کد تصدیق:</label>
          <input
            type="number"
            name="verification_code"
            value={formData.verification_code}
            onChange={handleChange}
            className="editable-input"
          />
        </div>

        {/* File upload */}
        <div className="form-group">
          <label>فایل:</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="editable-input"
          />
        </div>

        {/* Actions */}
        <div className="form-group">
          <button type="submit" className="primary-button">ذخیره</button>
          <button
            type="button"
            className="delete-button"
            onClick={() => navigate('/representations')}
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
