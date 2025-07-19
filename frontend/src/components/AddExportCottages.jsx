import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createExportCottage } from '../actions/cottageActions';
import '../style/CottageForm.css'; // Include your CSS file for styling
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom'; // import useNavigate
import Select from 'react-select';

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
        declaration_status:''
    });

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === "full_serial_number") {
        // حذف تمام کاراکترهای غیر عددی و غیر خط تیره
        formattedValue = value.replace(/[^\d-]/g, '');

        // جدا کردن ارقام قبل و بعد از خط تیره
        const parts = formattedValue.split('-');

        // بخش قبل از خط تیره باید حداکثر ۴ رقم باشد
        if (parts[0].length > 4) {
            parts[0] = parts[0].slice(0, 4);
        }

        // بخش بعد از خط تیره باید حداکثر ۱۰ رقم باشد (یا هر تعداد دلخواه شما)
        if (parts[1] && parts[1].length > 10) { 
            parts[1] = parts[1].slice(0, 10);
        }

        // افزودن خط تیره بعد از ۴ رقم
        if (parts[0].length === 4 && !formattedValue.includes('-')) {
            formattedValue = `${parts[0]}-`;
        } else {
            formattedValue = parts.join('-');
        }
    }

    setFormData({
        ...formData,
        [name]: formattedValue,
    });

    // اگر نیاز به مدیریت خطا دارید، می‌توانید اینجا اضافه کنید
};

    const handleDateChange = (value) => {
        setFormData({ ...formData, cottage_date: value?.format("YYYY-MM-DD") });
    };
    
    const options = [
        { value: 'تایید شده' , label: 'تایید شده' },
        { value: 'در حال بررسی', label: 'در حال بررسی' },
        { value: 'رد شده', label: 'رد شده' },
    ];
    const currencyTypeOptions = [
        { value: 'usd', label: 'دلار آمریکا' },
        { value: 'eur', label: 'یورو' },
        { value: 'irr', label: 'ریال ایران' },
    ];
    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData({
            ...formData,
            [name]: selectedOption.value,
        });
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

        dispatch(createExportCottage(data))
            .then(() => {
                alert('اظهارنامه صادراتی با موفقیت ایجاد شد!');
                navigate('/export-cottages');
            })
            .catch(err => {
                alert("خطا:", err);
            });
    };
    

    return (
        <form className="cottage-form" onSubmit={handleSubmit}>
            <h2 className="form-title">افزودن اظهارنامه صادراتی</h2>

            <div className="form-group">
    <label className="form-label" htmlFor="full_serial_number">سریال اظهار کامل:</label>
    <input
        className="form-input"
        id="full_serial_number"
        name="full_serial_number"
        placeholder="XXXX-XXXXXX"
        value={formData.full_serial_number}
        onChange={handleChange}
        required
        pattern="\d{4}-\d{6,}" // الگوی مورد نظر
        title="لطفاً سریال را به فرمت ۴ رقم-۶ رقم یا بیشتر وارد کنید (مثال: 1234-567890)"
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
                <label className="form-label" htmlFor="currency_type">نوع ارز:</label>
                <Select
                    name="currency_type"
                    className="selectPrf"
                    value={currencyTypeOptions.find(option => option.value === formData.currency_type)}
                    onChange={handleSelectChange}
                    options={currencyTypeOptions}
                    placeholder="انتخاب نوع ارز"
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="remaining_total"> مانده:</label>
                <input
                    className="form-input"
                    id="remaining_total"
                    name="remaining_total"
                    placeholder="مانده اظهارنامه را وارد کنید"
                    value={formData.remaining_total}
                    onChange={handleChange}
                    required
                />
            </div>
         
            <div className="form-group">
                <label className="form-label" htmlFor="declaration_status">وضعیت:</label>
                <Select
                    name="declaration_status"
                    className="selectPrf"
                    value={options.find(option => option.value === formData.declaration_status)}
                    onChange={handleSelectChange}
                    options={options}
                    placeholder="انتخاب وضعیت"
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
            <button className="btn-grad1" type="submit">ثبت</button>
        </form>
    );
};

export default AddExportCottages;
