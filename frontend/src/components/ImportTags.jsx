import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // Adjust the import path as needed

const ImportTags = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle the file upload form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setMessage("");
      const response = await axiosInstance.post(
        "customs/import-tags/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message || "Import successful!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "An error occurred";
      setMessage(`Error uploading file: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Import HS Code Tags</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImportTags;
