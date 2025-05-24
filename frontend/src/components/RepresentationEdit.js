import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import axiosInstance from '../utils/axiosInstance';
import { updateRepresentation } from '../actions/representationActions';
import { fetchCostumers } from "../actions/authActions";
import Select from 'react-select';
import './CottageForm.css';
const EMPTY_FORM = {
  principal:            { full_name: '' },
  attorney:             { full_name: '' },
  applicant_info:              { full_name: '' },
  start_date:             '',
  end_date:               '',
  another_deligation:     false,
  representor_dismissal:  false,
  representation_summary: '',
  file:                   null,
};

export default function RepresentationEdit() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [formData,   setFormData] = useState(EMPTY_FORM);
  const [loading,    setLoading]  = useState(true);
  const [error,      setError]    = useState(null);
  const { costumerList = [], customersLoading, customersError } = useSelector(
    (state) => state.costumers || {}
  );

  useEffect(() => {
    dispatch(fetchCostumers());
  }, [dispatch]);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const { data } = await axiosInstance.get(`/representations/${id}/`);
        setFormData({
          ...EMPTY_FORM,
          ...data,
          principal: data.principal  || EMPTY_FORM.principal,
          attorney:  data.attorney   || EMPTY_FORM.attorney,
          applicant_info:   data.applicant_info    || EMPTY_FORM.applicant,
        });
      } catch (err) {
        console.error(err);
        setError('نمی‌توان وکالت‌نامه را بارگذاری کرد.');
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  const handleChange = ({ target }) => {
    const { name, value, type, checked, files } = target;
    setFormData((prev) => {
      if (type === 'file') return { ...prev, [name]: files[0] };
      if (type === 'checkbox') return { ...prev, [name]: checked };
      return { ...prev, [name]: value };
    });
  };
  const customerOptions = costumerList.map(c => ({ value: c.id, label: c.full_name }));
  const handleSelectChange = (key) => (option) => {
    const selected = option ? { id: option.value, full_name: option.label } : { id: '', full_name: '' };
    setFormData(prev => ({ ...prev, [key]: selected }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = new FormData();
  
  // 1) Append the three FK IDs:
  payload.append('representi',   formData.principal.id);
  payload.append('representor',  formData.attorney.id);
  payload.append('applicant',    formData.applicant_info.id);

  // 2) All the other scalar fields:
  payload.append('start_date',             formData.start_date);
  payload.append('end_date',               formData.end_date);
  payload.append('another_deligation',     formData.another_deligation);
  payload.append('representor_dismissal',  formData.representor_dismissal);
  payload.append('representation_summary', formData.representation_summary);
  payload.append('doc_number',             formData.doc_number);
  payload.append('verification_code',      formData.verification_code);

  // 3) And finally the file, if any:
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
        {/* Representor */}
        {/* Representor */}
        <div className="form-group">
          <label>وکیل:</label>
          <Select
            className="editable-input selectPrf"
            classNamePrefix="editable-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.principal.id) || null}
            onChange={handleSelectChange('principal')}
            isClearable
          />
        </div>

        {/* Representi */}
        <div className="form-group">
          <label>موکل:</label>
          <Select
            className="editable-input selectPrf"
            classNamePrefix="editable-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.attorney.id) || null}
            onChange={handleSelectChange('attorney')}
            isClearable
          />
        </div>
        {/* Applicant */}
        <div className="form-group">
          <label>درخواست‌دهنده:</label>
          <Select

            className="editable-input selectPrf"
            classNamePrefix="editable-input"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.applicant_info.id) || null}
            onChange={handleSelectChange('applicant_info')}
            isClearable
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
            onChange={(d) =>
              setFormData((f) => ({ ...f, start_date: d.format('YYYY-MM-DD') }))
            }
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
            onChange={(d) =>
              setFormData((f) => ({ ...f, end_date: d.format('YYYY-MM-DD') }))
            }
            inputClass="editable-input"
          />
        </div>

        {/* Flags */}
        <div className="form-group">
          <label>
                        توکل به غیر
                        
          </label>
            <input
              type="checkbox"
              name="another_deligation"
              checked={formData.another_deligation}
              onChange={handleChange}
            />

        </div>

        <div className="form-group">
          <label>
                        عزل وکیل
                        
          </label>
            <input
              type="checkbox"
              name="representor_dismissal"
              checked={formData.representor_dismissal}
              onChange={handleChange}
            />

        </div>

        {/* Summary */}
        <div className="form-group">
          <label htmlFor="representation_summary">خلاصه وکالت:</label>
          <textarea
            id="representation_summary"
            name="representation_summary"
            className="editable-input form-textarea"
            value={formData.representation_summary}
            onChange={handleChange}
          />
        </div>

        {/* File */}
        <div className="form-group">
          <label htmlFor="file">آپلود فایل جدید:</label>
          <input
            id="file"
            name="file"
            type="file"
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
