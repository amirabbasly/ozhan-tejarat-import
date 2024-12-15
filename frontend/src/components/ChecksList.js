import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchChecks,
    deleteCheck,
    updateCheck

} from '../actions/representationActions';
import './RepresentationList.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const RepresentationList = () => {
    const dispatch = useDispatch();
    const { checks, loading, error } = useSelector((state) => state.checks);

    const [editingId, setEditingId] = useState(null); // Track which representation is being edited
    const [editFormData, setEditFormData] = useState({}); // Store form data for editing

    useEffect(() => {
        dispatch(fetchChecks());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this check?')) {
            dispatch(deleteCheck(id));
        }
    };

    const handleEditClick = (check) => {
        setEditingId(check.id); // Set the editing ID
        setEditFormData({ ...check }); // Populate the form with existing data
    };

    const handleCancelEdit = () => {
        setEditingId(null); // Exit editing mode
        setEditFormData({}); // Clear form data
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setEditFormData({
                ...editFormData,
                [name]: files[0],
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleSaveEdit = async () => {
        const formData = new FormData();
    
        // Append fields except file
        Object.keys(editFormData).forEach((key) => {
            if (key !== 'document') {
                formData.append(key, editFormData[key]);
            }
        });
    
        // Append the file only if it's actually a File object
        if (editFormData.file && editFormData.file instanceof File) {
            formData.append('document', editFormData.file);
        }
    
        try {
            await dispatch(updateCheck(editingId, formData));
            setEditingId(null);
        } catch (error) {
            console.error('Error saving representation:', error);
        }
    };
    
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="representation-list">
            <h2>لیست چک ها</h2>
            <table>
                <thead>
                    <tr>
                        <th>کد چک</th>
                        <th>صادر کننده</th>
                        <th>مبلغ</th>
                        <th>در وجه</th>
                        <th>تاریخ چک</th>
                        <th>بانک</th>
                        <th>پاس شده</th>
                        <th>فایل</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {checks.map((rep) =>
                        editingId === rep.id ? (
                            <tr key={rep.id}>
                                <td>
                                    <input
                                        type="text"
                                        name="check_code"
                                        value={editFormData.check_code || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="issuer"
                                        value={editFormData.issuer || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="value"
                                        value={editFormData.value || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="issued_for"
                                        value={editFormData.issued_for || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY-MM-DD"            // Tells the picker how to interpret the value string
                                value={editFormData.date} // This can be a simple string like "1403-09-13"
                                onChange={(value) => {
                                    setEditFormData({
                                    ...editFormData,
                                    date: value.format("YYYY-MM-DD") // Convert the returned DateObject to a string
                                    });
                                }}
                                />

                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="bank"
                                        value={editFormData.bank || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="is_paid"
                                        checked={!!editFormData.is_paid}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        name="document"
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <button onClick={handleSaveEdit}>ذخیره</button>
                                    <button onClick={handleCancelEdit}>لغو</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={rep.id}>
                                <td>{rep.check_code}</td>
                                <td>{rep.issuer}</td>
                                <td>{rep.value}</td>
                                <td>{rep.issued_for}</td>
                                <td>{rep.date}</td>
                                <td>{rep.bank}</td>
                                <td>{rep.is_paid ? 'بله':'خیر'}</td>
                                <td>
                                    {rep.document ? (
                                        <a
                                            href={rep.document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View File
                                        </a>
                                    ) : (
                                        'No File'
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(rep)}>ویرایش</button>
                                    <button onClick={() => handleDelete(rep.id)}>حذف</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RepresentationList;
