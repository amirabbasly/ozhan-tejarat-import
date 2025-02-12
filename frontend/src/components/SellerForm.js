// src/components/SellerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function SellerForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    seller_name: "",
    seller_address: "",
    seller_refrence: "",
    seller_country: "",
    seller_bank_name: "",
    seller_account_name: "",
    seller_iban: "",
    seller_swift: "",
    seller_seal: null, // for file upload
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, seller_seal: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We need multipart/form-data to upload the image (if any)
    const data = new FormData();
    data.append("seller_name", formData.seller_name);
    data.append("seller_address", formData.seller_address);
    data.append("seller_refrence", formData.seller_refrence);
    data.append("seller_country", formData.seller_country);
    data.append("seller_bank_name", formData.seller_bank_name);
    data.append("seller_account_name", formData.seller_account_name);
    data.append("seller_iban", formData.seller_iban);
    data.append("seller_swift", formData.seller_swift);
    if (formData.seller_seal) {
      data.append("seller_seal", formData.seller_seal);
    }

    try {
      await axiosInstance.post("documents/sellers/", data);
      alert("Seller created successfully!");
      navigate("/"); // redirect as you wish
    } catch (error) {
      console.error("Error creating seller:", error);
      alert("Failed to create seller.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Seller</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Seller Name:</label>
          <input
            type="text"
            name="seller_name"
            value={formData.seller_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Seller Address:</label>
          <textarea
            name="seller_address"
            value={formData.seller_address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Reference:</label>
          <input
            type="text"
            name="seller_refrence"
            value={formData.seller_refrence}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Country:</label>
          <input
            type="text"
            name="seller_country"
            value={formData.seller_country}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Bank Name:</label>
          <input
            type="text"
            name="seller_bank_name"
            value={formData.seller_bank_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Account Name:</label>
          <input
            type="text"
            name="seller_account_name"
            value={formData.seller_account_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>IBAN:</label>
          <input
            type="text"
            name="seller_iban"
            value={formData.seller_iban}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Swift:</label>
          <input
            type="text"
            name="seller_swift"
            value={formData.seller_swift}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Seal:</label>
          <input
            type="file"
            accept="image/*"
            name="seller_seal"
            onChange={handleFileChange}
          />
        </div>

        <br />
        <button type="submit">Save Seller</button>
      </form>
    </div>
  );
}

export default SellerForm;
