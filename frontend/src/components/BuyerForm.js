// src/components/BuyerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
function BuyerForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_card_number: "",
    buyer_country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("documents/buyers/", formData);
      alert("Buyer created successfully!");
      navigate("/"); // or wherever you want
    } catch (error) {
      console.error("Error creating buyer:", error);
      alert("Failed to create buyer.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Buyer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Buyer Name:</label>
          <input
            type="text"
            name="buyer_name"
            value={formData.buyer_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Card Number:</label>
          <input
            type="text"
            name="buyer_card_number"
            value={formData.buyer_card_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Buyer Country:</label>
          <input
            type="text"
            name="buyer_country"
            value={formData.buyer_country}
            onChange={handleChange}
          />
        </div>

        <br />
        <button type="submit">Save Buyer</button>
      </form>
    </div>
  );
}

export default BuyerForm;
