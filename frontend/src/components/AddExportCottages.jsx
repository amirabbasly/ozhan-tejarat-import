// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { createExportCottage } from '../actions/cottageActions';
// import '../style/CottageForm.css'; // Include your CSS file for styling
// import DatePicker from 'react-multi-date-picker';
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { useNavigate } from 'react-router-dom'; // import useNavigate
// import Select from 'react-select';

// const AddExportCottages = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate(); // initialize navigate
//     const [formData, setFormData] = useState({
//         cottage_date: '',
//         full_serial_number: '',
//         quantity: '',
//         total_value: '',
//         currency_type:'',
//         currency_price:'',
//         remaining_total:'',
//         declaration_status:''
//     });

// const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let formattedValue = value;

//     if (name === "full_serial_number") {
//         // حذف تمام کاراکترهای غیر عددی و غیر خط تیره
//         formattedValue = value.replace(/[^\d-]/g, '');

//         // جدا کردن ارقام قبل و بعد از خط تیره
//         const parts = formattedValue.split('-');

//         // بخش قبل از خط تیره باید حداکثر ۴ رقم باشد
//         if (parts[0].length > 4) {
//             parts[0] = parts[0].slice(0, 4);
//         }

//         // بخش بعد از خط تیره باید حداکثر ۱۰ رقم باشد (یا هر تعداد دلخواه شما)
//         if (parts[1] && parts[1].length > 10) { 
//             parts[1] = parts[1].slice(0, 10);
//         }

//         // افزودن خط تیره بعد از ۴ رقم
//         if (parts[0].length === 4 && !formattedValue.includes('-')) {
//             formattedValue = `${parts[0]}-`;
//         } else {
//             formattedValue = parts.join('-');
//         }
//     }

//     setFormData({
//         ...formData,
//         [name]: formattedValue,
//     });

//     // اگر نیاز به مدیریت خطا دارید، می‌توانید اینجا اضافه کنید
// };

//     const handleDateChange = (value) => {
//         setFormData({ ...formData, cottage_date: value?.format("YYYY-MM-DD") });
//     };
    
//     const options = [
//         { value: 'تایید شده' , label: 'تایید شده' },
//         { value: 'در حال بررسی', label: 'در حال بررسی' },
//         { value: 'رد شده', label: 'رد شده' },
//     ];
//     const currencyTypeOptions = [
//         { value: 'usd', label: 'دلار آمریکا' },
//         { value: 'eur', label: 'یورو' },
//         { value: 'irr', label: 'ریال ایران' },
//     ];
//     const handleSelectChange = (selectedOption, actionMeta) => {
//         const { name } = actionMeta;
//         setFormData({
//             ...formData,
//             [name]: selectedOption.value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const data = new FormData();

//         // Append all fields except file
//         Object.keys(formData).forEach((key) => {
//             if (key !== 'document') {
//                 data.append(key, formData[key]);
//             }
//         });

//         dispatch(createExportCottage(data))
//             .then(() => {
//                 alert('اظهارنامه صادراتی با موفقیت ایجاد شد!');
//                 navigate('/export-cottages');
//             })
//             .catch(err => {
//                 alert("خطا:", err);
//             });
//     };
    

//     return (
//         <form className="cottage-form" onSubmit={handleSubmit}>
//             <h2 className="form-title">افزودن اظهارنامه صادراتی</h2>

//             <div className="form-group">
//     <label className="form-label" htmlFor="full_serial_number">سریال اظهار کامل:</label>
//     <input
//         className="form-input"
//         id="full_serial_number"
//         name="full_serial_number"
//         placeholder="XXXX-XXXXXX"
//         value={formData.full_serial_number}
//         onChange={handleChange}
//         required
//         pattern="\d{4}-\d{6,}" // الگوی مورد نظر
//         title="لطفاً سریال را به فرمت ۴ رقم-۶ رقم یا بیشتر وارد کنید (مثال: 1234-567890)"
//     />
// </div>

            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="quantity">تعداد کالاها:</label>
//                 <input
//                     className="form-input"
//                     id="quantity"
//                     name="quantity"
//                     placeholder="تعداد کالا ها را وارد کنید"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="total_value">ارزش کل:</label>
//                 <input
//                     className="form-input"
//                     id="total_value"
//                     name="total_value"
//                     placeholder="ارزش کل را وارد کنید"
//                     value={formData.total_value}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label className="form-label" htmlFor="currency_price"> نرخ ارز:</label>
//                 <input
//                     className="form-input"
//                     id="currency_price"
//                     name="currency_price"
//                     placeholder="نرخ ارز را وارد کنید"
//                     value={formData.currency_price}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label className="form-label" htmlFor="currency_type">نوع ارز:</label>
//                 <Select
//                     name="currency_type"
//                     className="selectPrf"
//                     value={currencyTypeOptions.find(option => option.value === formData.currency_type)}
//                     onChange={handleSelectChange}
//                     options={currencyTypeOptions}
//                     placeholder="انتخاب نوع ارز"
//                 />
//             </div>

//             <div className="form-group">
//                 <label className="form-label" htmlFor="remaining_total"> مانده:</label>
//                 <input
//                     className="form-input"
//                     id="remaining_total"
//                     name="remaining_total"
//                     placeholder="مانده اظهارنامه را وارد کنید"
//                     value={formData.remaining_total}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
         
//             <div className="form-group">
//                 <label className="form-label" htmlFor="declaration_status">وضعیت:</label>
//                 <Select
//                     name="declaration_status"
//                     className="selectPrf"
//                     value={options.find(option => option.value === formData.declaration_status)}
//                     onChange={handleSelectChange}
//                     options={options}
//                     placeholder="انتخاب وضعیت"
//                 />
//             </div>

//             <div className="form-group">
//                 <label className="form-label" htmlFor="cottage_date">تاریخ اظهار:</label>
//                 <DatePicker
//                 className="form-input"
//                 id="cottage_date"
//                 name="cottage_date"
//                 calendar={persian}
//                 locale={persian_fa}
//                 value={formData.cottage_date}
//                 onChange={handleDateChange}
//                 required
//                 />
//             </div> 
//             <button className="btn-grad1" type="submit">ثبت</button>
//         </form>
//     );
// };

// export default AddExportCottages;






import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createExportCottage } from '../actions/cottageActions';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AddExportCottages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cottage_date: '',
        full_serial_number: '',
        quantity: '',
        total_value: '',
        currency_type: '',
        currency_price: '',
        remaining_total: '',
        declaration_status: ''
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

            // بخش بعد از خط تیره باید حداکثر ۱۰ رقم باشد
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
    };

    const handleDateChange = (value) => {
        setFormData({ ...formData, cottage_date: value?.format("YYYY-MM-DD") });
    };

    const options = [
        { value: 'تایید شده', label: 'تایید شده' },
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
            [name]: selectedOption ? selectedOption.value : '',
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

    // Custom styles for react-select to match RepresentationForm
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

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-10 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
        >
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">افزودن اظهارنامه صادراتی</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="full_serial_number">
                    سریال اظهار کامل:
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
                    id="full_serial_number"
                    name="full_serial_number"
                    placeholder="XXXX-XXXXXX"
                    value={formData.full_serial_number}
                    onChange={handleChange}
                    required
                    pattern="\d{4}-\d{6,}"
                    title="لطفاً سریال را به فرمت ۴ رقم-۶ رقم یا بیشتر وارد کنید (مثال: 1234-567890)"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="quantity">
                    تعداد کالاها:
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
                    id="quantity"
                    name="quantity"
                    placeholder="تعداد کالا ها را وارد کنید"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="total_value">
                    ارزش کل:
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
                    id="total_value"
                    name="total_value"
                    placeholder="ارزش کل را وارد کنید"
                    value={formData.total_value}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="currency_price">
                    نرخ ارز:
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
                    id="currency_price"
                    name="currency_price"
                    placeholder="نرخ ارز را وارد کنید"
                    value={formData.currency_price}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="currency_type">
                    نوع ارز:
                </label>
                <Select
                    name="currency_type"
                    value={currencyTypeOptions.find(option => option.value === formData.currency_type)}
                    onChange={handleSelectChange}
                    options={currencyTypeOptions}
                    placeholder="انتخاب نوع ارز"
                    styles={selectStyles}
                    isClearable
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="remaining_total">
                    مانده:
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
                    id="remaining_total"
                    name="remaining_total"
                    placeholder="مانده اظهارنامه را وارد کنید"
                    value={formData.remaining_total}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="declaration_status">
                    وضعیت:
                </label>
                <Select
                    name="declaration_status"
                    value={options.find(option => option.value === formData.declaration_status)}
                    onChange={handleSelectChange}
                    options={options}
                    placeholder="انتخاب وضعیت"
                    styles={selectStyles}
                    isClearable
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right" htmlFor="cottage_date">
                    تاریخ اظهار:
                </label>
                <div className="relative">
                    <DatePicker
                        id="cottage_date"
                        name="cottage_date"
                        calendar={persian}
                        locale={persian_fa}
                        value={formData.cottage_date}
                        onChange={handleDateChange}
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
            </div>

            <button
                className="w-1/2 mx-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300"
                type="submit"
            >
                ثبت
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

export default AddExportCottages;