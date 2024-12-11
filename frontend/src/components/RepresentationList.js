import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchRepresentations,
    deleteRepresentation,
    updateRepresentation
} from '../actions/representationActions';
import './RepresentationList.css';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const RepresentationList = () => {
    const dispatch = useDispatch();
    const { representations, loading, error } = useSelector((state) => state.representations);

    const [editingId, setEditingId] = useState(null); // Track which representation is being edited
    const [editFormData, setEditFormData] = useState({}); // Store form data for editing

    useEffect(() => {
        dispatch(fetchRepresentations());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this representation?')) {
            dispatch(deleteRepresentation(id));
        }
    };

    const handleEditClick = (representation) => {
        setEditingId(representation.id); // Set the editing ID
        setEditFormData({ ...representation }); // Populate the form with existing data
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
            if (key !== 'file') {
                formData.append(key, editFormData[key]);
            }
        });
    
        // Append the file only if it's actually a File object
        if (editFormData.file && editFormData.file instanceof File) {
            formData.append('file', editFormData.file);
        }
    
        try {
            await dispatch(updateRepresentation(editingId, formData));
            setEditingId(null);
        } catch (error) {
            console.error('Error saving representation:', error);
        }
    };
    
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="representation-list">
            <h2>لیست وکالت نامه ها</h2>
            <table>
                <thead>
                    <tr>
                        <th>وکیل</th>
                        <th>موکل</th>
                        <th>درخواست دهنده</th>
                        <th>تاریخ شروع</th>
                        <th>تاریخ پایان</th>
                        <th>توکل به غیر</th>
                        <th>عزل وکیل</th>
                        <th>خلاصه وکالت</th>
                        <th>فایل</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {representations.map((rep) =>
                        editingId === rep.id ? (
                            <tr key={rep.id}>
                                <td>
                                    <input
                                        type="text"
                                        name="representor"
                                        value={editFormData.representor || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="representi"
                                        value={editFormData.representi || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="applicant"
                                        value={editFormData.applicant || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY-MM-DD"            // Tells the picker how to interpret the value string
                                value={editFormData.start_date} // This can be a simple string like "1403-09-13"
                                onChange={(value) => {
                                    setEditFormData({
                                    ...editFormData,
                                    start_date: value.format("YYYY-MM-DD") // Convert the returned DateObject to a string
                                    });
                                }}
                                />

                                </td>
                                <td>
                                <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY-MM-DD"            // Tells the picker how to interpret the value string
                                value={editFormData.end_date} // This can be a simple string like "1403-09-13"
                                onChange={(value) => {
                                    setEditFormData({
                                    ...editFormData,
                                    end_date: value.format("YYYY-MM-DD") // Convert the returned DateObject to a string
                                    });
                                }}
                                />

                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="another_deligation"
                                        checked={!!editFormData.another_deligation}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        name="representor_dismissal"
                                        checked={!!editFormData.representor_dismissal}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="representation_summary"
                                        value={editFormData.representation_summary || ''}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        name="file"
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
                                <td>{rep.representor}</td>
                                <td>{rep.representi}</td>
                                <td>{rep.applicant}</td>
                                <td>{rep.start_date}</td>
                                <td>{rep.end_date}</td>
                                <td>{rep.another_deligation ? 'بله' : 'خیر'}</td>
                                <td>{rep.representor_dismissal ? 'بله' : 'خیر'}</td>
                                <td>{rep.representation_summary}</td>
                                <td>
                                    {rep.file ? (
                                        <a
                                            href={rep.file}
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
