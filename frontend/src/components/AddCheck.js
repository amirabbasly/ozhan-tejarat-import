import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCheck } from '../actions/representationActions';
import './CottageForm.css'; // Include your CSS file for styling
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom'; // import useNavigate

const RepresentationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // initialize navigate
    const [formData, setFormData] = useState({
        check_code: '',
        issuer: '',
        value: '',
        issued_for: '',
        bank: '',
        date: '',
        is_paid:'',
        document: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleDateChange = (value) => {
        setFormData({ ...formData, date: value?.format("YYYY-MM-DD") });
    };
    
    

    const handleFileChange = (e) => {
        setFormData({ ...formData, document: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
    
        // Append all fields except file
        Object.keys(formData).forEach((key) => {
            if (key !== 'document') {
                data.append(key, formData[key]);
            }
        });
    
        // Append the file only if it's actually selected
        if (formData.document && formData.document instanceof File) {
            data.append('document', formData.document);
        }

        // Dispatch the create action and then navigate
        dispatch(createCheck(data))
            .then(() => {
                alert('چک با موفقیت ایجاد شد!');
                navigate('/checks');
            })
            .catch(err => {
                alert("Error creating representation:", err);
                // handle error if needed
            });
    };
    

    return (
        <form className="cottage-form" onSubmit={handleSubmit}>
            <h2 className="form-title">افزودن چک</h2>

            <div className="form-group">
                <label className="form-label" htmlFor="check_code"> کد چک:</label>
                <input
                    className="form-input"
                    id="check_code"
                    name="check_code"
                    placeholder="کد چک را وارد کنید"
                    value={formData.check_code}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="issuer">صادر کننده:</label>
                <input
                    className="form-input"
                    id="issuer"
                    name="issuer"
                    placeholder="نام صادر کننده چک را وارد کنید"
                    value={formData.issuer}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="issued_for">در وجه:</label>
                <input
                    className="form-input"
                    id="issued_for"
                    name="issued_for"
                    placeholder="نام صاحب امتیاز را وارد کنید"
                    value={formData.issued_for}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="bank">بانک:</label>
                <input
                    className="form-input"
                    id="bank"
                    name="bank"
                    placeholder="نام بانک را وارد کنید"
                    value={formData.bank}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="value">ارزش:</label>
                <input
                    className="form-input"
                    type='number'
                    id="value"
                    name="value"
                    placeholder="مبلغ چک را وارد کنید"
                    value={formData.value}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="date">تاریخ چک:</label>
                <DatePicker
                className="form-input"
                id="date"
                name="date"
                calendar={persian}
                locale={persian_fa}
                value={formData.date}
                onChange={handleDateChange}
                required
                />
            </div>
            <div className="form-group checkbox-group">
                <label className="form-label" htmlFor="is_paid">پاس شده:</label>
                <input
                    className="form-checkbox"
                    id="is_paid"
                    name="is_paid"
                    type="checkbox"
                    checked={formData.is_paid}
                    onChange={handleChange}

                />
            </div>
            
            
          
            
            <div className="form-group">
                <label className="form-label" htmlFor="document">فایل:</label>
                <input
                    className="form-input-document"
                    id="document"
                    name="document"
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
            
            <button className="form-button" type="submit">ثبت</button>
        </form>
    );
};

export default RepresentationForm;
