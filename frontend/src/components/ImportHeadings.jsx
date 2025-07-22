import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importData } from "../actions/hscodeActions";

const ImportComponent = ({ endpoint, title }) => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { loading, successMessage, errorMessage } = useSelector((state) => state.import);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            dispatch(importData(endpoint, file));
        } else {
            alert("Please select a file to upload.");
        }
    };

    return (
        <div>
            <h1>{title}</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
};

export default ImportComponent;
