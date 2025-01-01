import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createExportCottage } from '../actions/cottageActions';
import './CottageForm.css'; // Include your CSS file for styling
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom'; // import useNavigate

const AddExportCottages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // initialize navigate
    const [formData, setFormData] = useState({
        cottage_date: '',
        full_serial_number: '',
        quantity: '',
        total_value: '',
        currency_type:'',
        currency_price:'',
        remaining_total:'',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleDateChange = (value) => {
        setFormData({ ...formData, cottage_date: value?.format("YYYY-MM-DD") });
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
        dispatch(createExportCottage(data))
            .then(() => {
                alert('اظهارنامه صادراتی با موفقیت ایجاد شد!');
                navigate('/export-cottages');
            })
            .catch(err => {
                alert("خطا:", err);
                // handle error if needed
            });
    };
    

    return (
        <form className="cottage-form" onSubmit={handleSubmit}>
            <h2 className="form-title">افزودن چک</h2>

            <div className="form-group">
                <label className="form-label" htmlFor="full_serial_number"> سریال اظهار کامل:</label>
                <input
                    className="form-input"
                    id="full_serial_number"
                    name="full_serial_number"
                    placeholder="سریال اظهار کامل را وارد کنید"
                    value={formData.full_serial_number}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="quantity">تعداد کالاها:</label>
                <input
                    className="form-input"
                    id="quantity"
                    name="quantity"
                    placeholder="تعداد کالا ها را وارد کنید"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="total_value">ارزش کل:</label>
                <input
                    className="form-input"
                    id="total_value"
                    name="total_value"
                    placeholder="ارزش کل را وارد کنید"
                    value={formData.total_value}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="currency_price"> نرخ ارز:</label>
                <input
                    className="form-input"
                    id="currency_price"
                    name="currency_price"
                    placeholder="نرخ ارز را وارد کنید"
                    value={formData.currency_price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="currency_type"> نوع ارز:</label>
                <input
                    className="form-input"
                    id="currency_type"
                    name="currency_type"
                    placeholder="نوع ارز را وارد کنید"
                    value={formData.currency_type}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="remaining_total"> مانده:</label>
                <input
                    className="form-input"
                    id="remaining_total"
                    name="remaining_total"
                    placeholder=" مانده اظهارنامه را وارد کنید"
                    value={formData.remaining_total}
                    onChange={handleChange}
                    required
                />
            </div>


            

            <div className="form-group">
                <label className="form-label" htmlFor="cottage_date">تاریخ اظهار:</label>
                <DatePicker
                className="form-input"
                id="cottage_date"
                name="cottage_date"
                calendar={persian}
                locale={persian_fa}
                value={formData.cottage_date}
                onChange={handleDateChange}
                required
                />
            </div>

            
          
            

            
            <button className="form-button" type="submit">ثبت</button>
        </form>
    );
};

export default AddExportCottages;
