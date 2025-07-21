// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';
// import DatePicker from 'react-multi-date-picker';
// import persian from 'react-date-object/calendars/persian';
// import persian_fa from 'react-date-object/locales/persian_fa';
// import { useNavigate } from 'react-router-dom';
// import { createRepresentation } from '../actions/representationActions';
// import { fetchCostumers } from '../actions/authActions';
// import '../style/CottageForm.css';

// /* ---------- helpers ---------- */
// const extractErrorData = axiosError =>
//   axiosError?.response?.data ?? { detail: axiosError.message };

// const RepresentationForm = () => {
//   const dispatch = useDispatch();
//   const navigate  = useNavigate();

//   /* -------------- data from store ------------- */
//   const { costumerList = [], customersLoading, customersError } = useSelector(
//     s => s.costumers || {}
//   );

//   /* -------------- local state ------------- */
//   const [formData, setFormData] = useState({
//     representi: [],
//     representor: [],
//     applicant:  '',
//     start_date: '',
//     end_date:   '',
//     another_deligation:     false,
//     representor_dismissal:  false,
//     representation_summary: '',
//     doc_number:        '',
//     verification_code: '',
//     file: null,
//   });

//   const [submitting, setSubmitting]   = useState(false);
//   const [serverErrors, setServerErrors] = useState({});   // holds 400‑level errors

//   /* -------------- fetch customers once ------------- */
//   useEffect(() => { dispatch(fetchCostumers()); }, [dispatch]);

//   /* -------------- helper generators ------------- */
//   const customerOptions = costumerList.map(c => ({
//     value: c.id.toString(), label: c.full_name,
//   }));

//   const handleMultiChange = field => options =>
//     setFormData(p => ({ ...p, [field]: options ? options.map(o => o.value) : [] }));

//   const handleSelectChange = field => option =>
//     setFormData(p => ({ ...p, [field]: option ? option.value : '' }));

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleStartDateChange = v =>
//     setFormData(p => ({ ...p, start_date: v?.format('YYYY-MM-DD') || '' }));
//   const handleEndDateChange   = v =>
//     setFormData(p => ({ ...p,   end_date: v?.format('YYYY-MM-DD') || '' }));

//   const handleFileChange = e =>
//     setFormData(p => ({ ...p, file: e.target.files[0] || null }));

//   /* -------------- submit ------------- */
//   const handleSubmit = async e => {
//     e.preventDefault();
//     setSubmitting(true);
//     setServerErrors({});               // reset previous errors

//     /* build multipart form‑data */
//     const data = new FormData();
//     formData.representi.forEach(id  => data.append('representi',  id));
//     formData.representor.forEach(id => data.append('representor', id));
//     data.append('applicant',               formData.applicant);
//     data.append('start_date',              formData.start_date);
//     data.append('end_date',                formData.end_date);
//     data.append('another_deligation',      formData.another_deligation);
//     data.append('representor_dismissal',   formData.representor_dismissal);
//     data.append('representation_summary',  formData.representation_summary);
//     data.append('doc_number',              formData.doc_number);
//     data.append('verification_code',       formData.verification_code);
//     if (formData.file) data.append('file', formData.file);

//     try {
//       /* ‑‑ If you used RTK’s createAsyncThunk call unwrap() here ‑‑
//          await dispatch(createRepresentation(data)).unwrap();
//          otherwise plain dispatch below works when the thunk
//          *throws* on non‑2xx HTTP */
//       await dispatch(createRepresentation(data));
//       alert('وکالت‌نامه با موفقیت ایجاد شد!');
//       navigate('/representations');
//     } catch (err) {
//       /* Axios / fetch error */
//       const errData = extractErrorData(err);
//       setServerErrors(errData);
//       console.error('Representation create failed:', errData);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ---------- UI helpers ---------- */
//   const fieldError = key =>
//     serverErrors?.[key] ? (
//       <div className="field-error">{Array.isArray(serverErrors[key])
//         ? serverErrors[key][0]
//         : serverErrors[key]}</div>
//     ) : null;

//   /* ========== RENDER ========== */
//   return (
//     <form className="cottage-form" onSubmit={handleSubmit}>
//       <h2 className="form-title">افزودن وکالت‌نامه</h2>

//       {customersError && (
//         <div className="add-error">خطا در دریافت لیست مشتریان</div>
//       )}
//       {serverErrors.detail && (      /* non‑field error */
//         <div className="add-error">{serverErrors.detail}</div>
//       )}

//       {/* ---- موکل ---- */}
//       <div className="form-group">
//         <label className="form-label">موکل:</label>
//         {customersLoading ? (
//           <p>در حال بارگذاری...</p>
//         ) : (
//           <Select
//             isMulti
//             inputId="representi"
//             className='selectPrf'
//             name="representi"
//             classNamePrefix="form-input"
//             options={customerOptions}
//             value={customerOptions.filter(o => formData.representi.includes(o.value))}
//             onChange={handleMultiChange('representi')}
//             placeholder="انتخاب موکل"
//             isClearable
//             required
//           />
//         )}
//         {fieldError('representi')}
//       </div>

//       {/* ---- وکیل ---- */}
//       <div className="form-group">
//         <label className="form-label">وکیل:</label>
//         {customersLoading ? (
//           <p>در حال بارگذاری...</p>
//         ) : (
//           <Select
//             isMulti
//             inputId="representor"
//             className='selectPrf'
//             name="representor"
//             classNamePrefix="form-input"
//             options={customerOptions}
//             value={customerOptions.filter(o => formData.representor.includes(o.value))}
//             onChange={handleMultiChange('representor')}
//             placeholder="انتخاب وکیل"
//             isClearable
//             required
//           />
//         )}
//         {fieldError('representor')}
//       </div>

//       {/* ---- درخواست دهنده ---- */}
//       <div className="form-group">
//         <label className="form-label">درخواست دهنده:</label>
//         {customersLoading ? (
//           <p>در حال بارگذاری...</p>
//         ) : (
//           <Select
//             inputId="applicant"
//             className='selectPrf'
//             name="applicant"
//             classNamePrefix="form-input"
//             options={customerOptions}
//             value={customerOptions.find(o => o.value === formData.applicant) || null}
//             onChange={handleSelectChange('applicant')}
//             placeholder="انتخاب درخواست دهنده"
//             isClearable
//           />
//         )}
//         {fieldError('applicant')}
//       </div>

//       {/* ---- تاریخ شروع / پایان ---- */}
//       <div className="form-group">
//         <label className="form-label">تاریخ شروع:</label>
//         <DatePicker
//           id="start_date"
//           calendar={persian}
//           locale={persian_fa}
//           value={formData.start_date}
//           onChange={handleStartDateChange}
//           format="YYYY-MM-DD"
//           placeholder="----/--/--"
//           required
//         />
//         {fieldError('start_date')}
//       </div>

//       <div className="form-group">
//         <label className="form-label">تاریخ پایان:</label>
//         <DatePicker
//           id="end_date"
//           calendar={persian}
//           locale={persian_fa}
//           value={formData.end_date}
//           onChange={handleEndDateChange}
//           format="YYYY-MM-DD"
//           placeholder="----/--/--"
//         />
//         {fieldError('end_date')}
//       </div>

//       {/* ---- چک‌باکس‌ها ---- */}
//       <div className="form-group checkbox-group">
//         <label className="form-label">توکل به غیر</label>
//         <input
//           type="checkbox"
//           name="another_deligation"
//           checked={formData.another_deligation}
//           onChange={handleChange}
//           className="form-checkbox"
//         />
//       </div>

//       <div className="form-group checkbox-group">
//         <label className="form-label">عزل وکیل</label>
//         <input
//           type="checkbox"
//           name="representor_dismissal"
//           checked={formData.representor_dismissal}
//           onChange={handleChange}
//           className="form-checkbox"
//         />
//       </div>

//       {/* ---- متن خلاصه ---- */}
//       <div className="form-group">
//         <label className="form-label">خلاصه وکالت:</label>
//         <textarea
//           name="representation_summary"
//           value={formData.representation_summary}
//           onChange={handleChange}
//           className="form-textarea"
//           placeholder="خلاصه‌ای از وکالت را وارد کنید"
//           required
//         />
//         {fieldError('representation_summary')}
//       </div>

//       {/* ---- شماره سند ---- */}
//       <div className="form-group">
//         <label className="form-label">شماره سند:</label>
//         <input
//           type="number"
//           name="doc_number"
//           value={formData.doc_number}
//           onChange={handleChange}
//           className="form-input"
//           placeholder="شماره سند را وارد کنید"
//           required
//         />
//         {fieldError('doc_number')}
//       </div>

//       {/* ---- کد تصدیق ---- */}
//       <div className="form-group">
//         <label className="form-label">کد تصدیق:</label>
//         <input
//           type="number"
//           name="verification_code"
//           value={formData.verification_code}
//           onChange={handleChange}
//           className="form-input"
//           placeholder="کد تصدیق را وارد کنید"
//           required
//         />
//         {fieldError('verification_code')}
//       </div>

//       {/* ---- فایل ---- */}
//       <div className="form-group">
//         <label className="form-label">فایل:</label>
//         <input
//           type="file"
//           name="file"
//           onChange={handleFileChange}
//           className="form-input-file"
//         />
//         {fieldError('file')}
//       </div>

//       <button
//         type="submit"
//         className="form-button"
//         disabled={submitting}
//       >
//         {submitting ? 'در حال ثبت...' : 'ثبت'}
//       </button>
//     </form>
//   );
// };

// export default RepresentationForm;






import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useNavigate } from 'react-router-dom';
import { createRepresentation } from '../actions/representationActions';
import { fetchCostumers } from '../actions/authActions';

/* ---------- helpers ---------- */
const extractErrorData = axiosError =>
  axiosError?.response?.data ?? { detail: axiosError.message };

const RepresentationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* -------------- data from store ------------- */
  const { costumerList = [], customersLoading, customersError } = useSelector(
    s => s.costumers || {}
  );

  /* -------------- local state ------------- */
  const [formData, setFormData] = useState({
    representi: [],
    representor: [],
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

  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({}); // holds 400‑level errors

  /* -------------- fetch customers once ------------- */
  useEffect(() => { dispatch(fetchCostumers()); }, [dispatch]);

  /* -------------- helper generators ------------- */
  const customerOptions = costumerList.map(c => ({
    value: c.id.toString(),
    label: c.full_name,
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
  const handleEndDateChange = v =>
    setFormData(p => ({ ...p, end_date: v?.format('YYYY-MM-DD') || '' }));

  const handleFileChange = e =>
    setFormData(p => ({ ...p, file: e.target.files[0] || null }));

  /* -------------- submit ------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setServerErrors({}); // reset previous errors

    /* build multipart form‑data */
    const data = new FormData();
    formData.representi.forEach(id => data.append('representi', id));
    formData.representor.forEach(id => data.append('representor', id));
    data.append('applicant', formData.applicant);
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    data.append('another_deligation', formData.another_deligation);
    data.append('representor_dismissal', formData.representor_dismissal);
    data.append('representation_summary', formData.representation_summary);
    data.append('doc_number', formData.doc_number);
    data.append('verification_code', formData.verification_code);
    if (formData.file) data.append('file', formData.file);

    try {
      await dispatch(createRepresentation(data));
      alert('وکالت‌نامه با موفقیت ایجاد شد!');
      navigate('/representations');
    } catch (err) {
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
      <div className="text-red-600 text-sm mt-1 text-right">
        {Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key]}
      </div>
    ) : null;

  // Custom styles for react-select to match form aesthetic
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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#EFF6FF', // blue-50
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#374151', // gray-700
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#374151', // gray-700
      '&:hover': {
        backgroundColor: '#2563EB', // primary
        color: '#FFFFFF', // white
      },
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

  /* ========== RENDER ========== */
  return (
    <form
      className="mt-10 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">افزودن وکالت‌نامه</h2>

      {customersError && (
        <div className="text-red-600 text-sm mt-1 text-right">خطا در دریافت لیست مشتریان</div>
      )}
      {serverErrors.detail && (
        <div className="text-red-600 text-sm mt-1 text-right">{serverErrors.detail}</div>
      )}

      {/* ---- موکل ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">موکل:</label>
        {customersLoading ? (
          <p className="text-gray-700 text-right">در حال بارگذاری...</p>
        ) : (
          <Select
            isMulti
            inputId="representi"
            name="representi"
            options={customerOptions}
            value={customerOptions.filter(o => formData.representi.includes(o.value))}
            onChange={handleMultiChange('representi')}
            placeholder="انتخاب موکل"
            isClearable
            required
            styles={selectStyles}
          />
        )}
        {fieldError('representi')}
      </div>

      {/* ---- وکیل ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">وکیل:</label>
        {customersLoading ? (
          <p className="text-gray-700 text-right">در حال بارگذاری...</p>
        ) : (
          <Select
            isMulti
            inputId="representor"
            name="representor"
            options={customerOptions}
            value={customerOptions.filter(o => formData.representor.includes(o.value))}
            onChange={handleMultiChange('representor')}
            placeholder="انتخاب وکیل"
            isClearable
            required
            styles={selectStyles}
          />
        )}
        {fieldError('representor')}
      </div>

      {/* ---- درخواست دهنده ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">درخواست دهنده:</label>
        {customersLoading ? (
          <p className="text-gray-700 text-right">در حال بارگذاری...</p>
        ) : (
          <Select
            inputId="applicant"
            name="applicant"
            options={customerOptions}
            value={customerOptions.find(o => o.value === formData.applicant) || null}
            onChange={handleSelectChange('applicant')}
            placeholder="انتخاب درخواست دهنده"
            isClearable
            styles={selectStyles}
          />
        )}
        {fieldError('applicant')}
      </div>

      {/* ---- تاریخ شروع ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">تاریخ شروع:</label>
        <div className="relative">
          <DatePicker
            id="start_date"
            calendar={persian}
            locale={persian_fa}
            value={formData.start_date}
            onChange={handleStartDateChange}
            format="YYYY-MM-DD"
            placeholder="----/--/--"
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
        {fieldError('start_date')}
      </div>

      {/* ---- تاریخ پایان ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">تاریخ پایان:</label>
        <div className="relative">
          <DatePicker
            id="end_date"
            calendar={persian}
            locale={persian_fa}
            value={formData.end_date}
            onChange={handleEndDateChange}
            format="YYYY-MM-DD"
            placeholder="----/--/--"
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
        {fieldError('end_date')}
      </div>

      {/* ---- چک‌باکس‌ها ---- */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <label className="block text-sm font-medium text-gray-700 text-right">توکل به غیر</label>
        <input
          type="checkbox"
          name="another_deligation"
          checked={formData.another_deligation}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
      </div>

      <div className="mb-4 flex items-center justify-end gap-2">
        <label className="block text-sm font-medium text-gray-700 text-right">عزل وکیل</label>
        <input
          type="checkbox"
          name="representor_dismissal"
          checked={formData.representor_dismissal}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
      </div>

      {/* ---- متن خلاصه ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">خلاصه وکالت:</label>
        <textarea
          name="representation_summary"
          value={formData.representation_summary}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right resize-y"
          placeholder="خلاصه‌ای از وکالت را وارد کنید"
          required
        />
        {fieldError('representation_summary')}
      </div>

      {/* ---- شماره سند ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">شماره سند:</label>
        <input
          type="number"
          name="doc_number"
          value={formData.doc_number}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          placeholder="شماره سند را وارد کنید"
          required
        />
        {fieldError('doc_number')}
      </div>

      {/* ---- کد تصدیق ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">کد تصدیق:</label>
        <input
          type="number"
          name="verification_code"
          value={formData.verification_code}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          placeholder="کد تصدیق را وارد کنید"
          required
        />
        {fieldError('verification_code')}
      </div>

      {/* ---- فایل ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">فایل:</label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="w-full text-right text-gray-700"
        />
        {fieldError('file')}
      </div>

      <button
        type="submit"
        className="w-1/2 mx-auto min-w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={submitting}
      >
        {submitting ? 'در حال ثبت...' : 'ثبت'}
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

export default RepresentationForm;