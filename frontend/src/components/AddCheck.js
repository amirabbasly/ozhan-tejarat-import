import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createRepresentation } from '../actions/representationActions';
import './CottageForm.css'; // Include your CSS file for styling
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom'; // import useNavigate

const RepresentationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // initialize navigate
    const [formData, setFormData] = useState({
        issuer: '',
        value: '',
        issued_for: '',
        bank: '',
        end_date: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleStartDateChange = (value) => {
        setFormData({ ...formData, start_date: value?.format("YYYY-MM-DD") });
    };
    
    const handleEndDateChange = (value) => {
        setFormData({ ...formData, end_date: value?.format("YYYY-MM-DD") });
    };
    

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
    
        // Append all fields except file
        Object.keys(formData).forEach((key) => {
            if (key !== 'file') {
                data.append(key, formData[key]);
            }
        });
    
        // Append the file only if it's actually selected
        if (formData.file && formData.file instanceof File) {
            data.append('file', formData.file);
        }

        // Dispatch the create action and then navigate
        dispatch(createRepresentation(data))
            .then(() => {
                alert('وکالتنامه با موفقیت ایجاد شد!');
                navigate('/representations');
            })
            .catch(err => {
                console.error("Error creating representation:", err);
                // handle error if needed
            });
    };
    

    return (
        <form className="cottage-form" onSubmit={handleSubmit}>
            <h2 className="form-title">افزودن وکالت‌نامه</h2>
            
            <div className="form-group">
                <label className="form-label" htmlFor="representi">موکل:</label>
                <input
                    className="form-input"
                    id="representi"
                    name="representi"
                    placeholder="نام موکل را وارد کنید"
                    value={formData.representi}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="representor">وکیل:</label>
                <input
                    className="form-input"
                    id="representor"
                    name="representor"
                    placeholder="نام وکیل را وارد کنید"
                    value={formData.representor}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="applicant">درخواست دهنده:</label>
                <input
                    className="form-input"
                    id="applicant"
                    name="applicant"
                    placeholder="نام درخواست دهنده را وارد کنید"
                    value={formData.applicant}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="start_date">تاریخ شروع:</label>
                <DatePicker
                className="form-input"
                id="start_date"
                name="start_date"
                calendar={persian}
                locale={persian_fa}
                value={formData.start_date}
                onChange={handleStartDateChange}
                required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="end_date">تاریخ پایان:</label>
                <DatePicker
                className="form-input"
                id="end_date"
                name="end_date"
                calendar={persian}
                locale={persian_fa}
                value={formData.end_date}
                onChange={handleEndDateChange}
                required
                />
            </div>
            
            <div className="form-group checkbox-group">
                <label className="form-label" htmlFor="another_deligation">توکل به غیر:</label>
                <input
                    className="form-checkbox"
                    id="another_deligation"
                    name="another_deligation"
                    type="checkbox"
                    checked={formData.another_deligation}
                    onChange={handleChange}

                />
            </div>
            
            <div className="form-group checkbox-group">
                <label className="form-label" htmlFor="representor_dismissal">عزل وکیل:</label>
                <input
                    className="form-checkbox"
                    id="representor_dismissal"
                    name="representor_dismissal"
                    type="checkbox"
                    checked={formData.representor_dismissal}
                    onChange={handleChange}

                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="representation_summary">خلاصه وکالت:</label>
                <input
                    className="form-textarea"
                    id="representation_summary"
                    name="representation_summary"
                    placeholder="خلاصه‌ای از وکالت را وارد کنید"
                    value={formData.representation_summary}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="doc_number">شماره سند:</label>
                <input
                    type='number'
                    className="form-input"
                    id="doc_number"
                    name="doc_number"
                    placeholder="شماره سند را وارد کنید"
                    value={formData.doc_number}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="verification_code">کد تصدیق:</label>
                <input
                    type='number'
                    className="form-input"
                    id="verification_code"
                    name="verification_code"
                    placeholder="کد تصدیق را وارد کنید"
                    value={formData.verification_code}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="file">فایل:</label>
                <input
                    className="form-input-file"
                    id="file"
                    name="file"
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
            
            <button className="form-button" type="submit">ثبت</button>
        </form>
    );
};

export default RepresentationForm;
