// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { createCheck } from '../actions/representationActions';
// import './CottageForm.css'; // Include your CSS file for styling
// import DatePicker from 'react-multi-date-picker';
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { useNavigate } from 'react-router-dom'; // import useNavigate

// const RepresentationForm = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate(); // initialize navigate
//     const [formData, setFormData] = useState({
//         check_code: '',
//         issuer: '',
//         value: '',
//         issued_for: '',
//         bank: '',
//         date: '',
//         is_paid:'',
//         document: null,
//     });

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData({
//             ...formData,
//             [name]: type === 'checkbox' ? checked : value,
//         });
//     };
//     const handleDateChange = (value) => {
//         setFormData({ ...formData, date: value?.format("YYYY-MM-DD") });
//     };
    
    

//     const handleFileChange = (e) => {
//         setFormData({ ...formData, document: e.target.files[0] });
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
    
//         // Append the file only if it's actually selected
//         if (formData.document && formData.document instanceof File) {
//             data.append('document', formData.document);
//         }

//         // Dispatch the create action and then navigate
//         dispatch(createCheck(data))
//             .then(() => {
//                 alert('چک با موفقیت ایجاد شد!');
//                 navigate('/checks');
//             })
//             .catch(err => {
//                 alert("Error creating representation:", err);
//                 // handle error if needed
//             });
//     };
    

//     return (
//         <form className="cottage-form" onSubmit={handleSubmit}>
//             <h2 className="form-title">افزودن چک</h2>

//             <div className="form-group">
//                 <label className="form-label" htmlFor="check_code"> کد چک:</label>
//                 <input
//                     className="form-input"
//                     id="check_code"
//                     name="check_code"
//                     placeholder="کد چک را وارد کنید"
//                     value={formData.check_code}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="issuer">صادر کننده:</label>
//                 <input
//                     className="form-input"
//                     id="issuer"
//                     name="issuer"
//                     placeholder="نام صادر کننده چک را وارد کنید"
//                     value={formData.issuer}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="issued_for">در وجه:</label>
//                 <input
//                     className="form-input"
//                     id="issued_for"
//                     name="issued_for"
//                     placeholder="نام صاحب امتیاز را وارد کنید"
//                     value={formData.issued_for}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div className="form-group">
//                 <label className="form-label" htmlFor="bank">بانک:</label>
//                 <input
//                     className="form-input"
//                     id="bank"
//                     name="bank"
//                     placeholder="نام بانک را وارد کنید"
//                     value={formData.bank}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="value">ارزش:</label>
//                 <input
//                     className="form-input"
//                     type='number'
//                     id="value"
//                     name="value"
//                     placeholder="مبلغ چک را وارد کنید"
//                     value={formData.value}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="date">تاریخ چک:</label>
//                 <DatePicker
//                 className="form-input"
//                 id="date"
//                 name="date"
//                 calendar={persian}
//                 locale={persian_fa}
//                 value={formData.date}
//                 onChange={handleDateChange}
//                 required
//                 />
//             </div>
//             <div className="form-group checkbox-group">
//                 <label className="form-label" htmlFor="is_paid">پاس شده:</label>
//                 <input
//                     className="form-checkbox"
//                     id="is_paid"
//                     name="is_paid"
//                     type="checkbox"
//                     checked={formData.is_paid}
//                     onChange={handleChange}

//                 />
//             </div>
            
            
          
            
//             <div className="form-group">
//                 <label className="form-label" htmlFor="document">فایل:</label>
//                 <input
//                     className="form-input-document"
//                     id="document"
//                     name="document"
//                     type="file"
//                     onChange={handleFileChange}
//                 />
//             </div>
            
//             <button className="form-button" type="submit">ثبت</button>
//         </form>
//     );
// };

// export default RepresentationForm;




import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCheck } from '../actions/representationActions';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from 'react-router-dom';

const RepresentationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        check_code: '',
        issuer: '',
        value: '',
        issued_for: '',
        bank: '',
        date: '',
        is_paid: '',
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
    
        Object.keys(formData).forEach((key) => {
            if (key !== 'document') {
                data.append(key, formData[key]);
            }
        });
    
        if (formData.document && formData.document instanceof File) {
            data.append('document', formData.document);
        }

        dispatch(createCheck(data))
            .then(() => {
                alert('چک با موفقیت ایجاد شد!');
                navigate('/checks');
            })
            .catch(err => {
                alert("Error creating representation:", err);
            });
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
        >
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                افزودن چک
            </h2>

            <div className="mb-4">
                <label 
                    htmlFor="check_code" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    کد چک:
                </label>
                <input
                    id="check_code"
                    name="check_code"
                    placeholder="کد چک را وارد کنید"
                    value={formData.check_code}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label 
                    htmlFor="issuer" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    صادر کننده:
                </label>
                <input
                    id="issuer"
                    name="issuer"
                    placeholder="نام صادر کننده چک را وارد کنید"
                    value={formData.issuer}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label 
                    htmlFor="issued_for" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    در وجه:
                </label>
                <input
                    id="issued_for"
                    name="issued_for"
                    placeholder="نام صاحب امتیاز را وارد کنید"
                    value={formData.issued_for}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label 
                    htmlFor="bank" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    بانک:
                </label>
                <input
                    id="bank"
                    name="bank"
                    placeholder="نام بانک را وارد کنید"
                    value={formData.bank}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label 
                    htmlFor="value" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    ارزش:
                </label>
                <input
                    type="number"
                    id="value"
                    name="value"
                    placeholder="مبلغ چک را وارد کنید"
                    value={formData.value}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label 
                    htmlFor="date" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    تاریخ چک:
                </label>
                <DatePicker
                    id="date"
                    name="date"
                    calendar={persian}
                    locale={persian_fa}
                    value={formData.date}
                    onChange={handleDateChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4 flex items-center">
                <label 
                    htmlFor="is_paid" 
                    className="text-sm font-medium text-gray-700 ml-2"
                >
                    پاس شده:
                </label>
                <input
                    id="is_paid"
                    name="is_paid"
                    type="checkbox"
                    checked={formData.is_paid}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label 
                    htmlFor="document" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    فایل:
                </label>
                <input
                    id="document"
                    name="document"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <button
                type="submit"
                className="w-1/2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300"
            >
                ثبت
            </button>
        </form>
    );
};

export default RepresentationForm;