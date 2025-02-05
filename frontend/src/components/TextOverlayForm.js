import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const TextOverlayForm = () => {
  const [formData, setFormData] = useState({
    exporter: "",
    consignee: "",
    quantity: "",
    description: "",
  });
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("exporter", formData.exporter);
    formDataToSend.append("consignee", formData.consignee);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("description", formData.description);

    try {
      const response = await axiosInstance.post("/documents/origin-cert/", formDataToSend, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer", // Important for receiving the image as a blob
      });

      const imageBlob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl); // Set processed image URL for display
    } catch (error) {
      setError("Error processing data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Overlay Text on Template</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Exporter:
            <input
              type="text"
              name="exporter"
              value={formData.exporter}
              onChange={handleChange}
              placeholder="Exporter"
            />
          </label>
        </div>
        <div>
          <label>
            Consignee:
            <input
              type="text"
              name="consignee"
              value={formData.consignee}
              onChange={handleChange}
              placeholder="Consignee"
            />
          </label>
        </div>
        <div>
          <label>
            Quantity:
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {processedImage && (
        <div>
          <h2>Processed Image</h2>
          <img src={processedImage} alt="Processed" />
        </div>
      )}
    </div>
  );
};

export default TextOverlayForm;
