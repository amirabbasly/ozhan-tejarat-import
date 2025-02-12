// src/components/InvoiceForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function InvoiceForm() {
  const navigate = useNavigate();

  // We'll fetch sellers & buyers to populate dropdowns
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    seller: "",
    buyer: "",
    invoice_number: "",
    invoice_currency: "USD",
    freight_charges: 0,
    items: [
      { description: "", quantity: 1, unit_price: 0 },
    ],
  });

  useEffect(() => {
    // Fetch sellers
    axiosInstance.get("documents/sellers/")
      .then((res) => setSellers(res.data))
      .catch((err) => console.error(err));

    // Fetch buyers
    axiosInstance.get("documents/buyers/")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  const addItemRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unit_price: 0 }],
    }));
  };

  const removeItemRow = (index) => {
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // convert numeric fields
    const payload = {
      ...invoiceData,
      freight_charges: parseInt(invoiceData.freight_charges, 10) || 0,
      items: invoiceData.items.map((item) => ({
        description: item.description,
        quantity: parseInt(item.quantity, 10) || 0,
        unit_price: parseFloat(item.unit_price) || 0,
      })),
    };

    try {
      await axiosInstance.post("documents/invoices/", payload);
      alert("Invoice created successfully!");
      navigate("/"); // or wherever you want
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Seller:</label>
          <select
            name="seller"
            value={invoiceData.seller}
            onChange={handleChange}
          >
            <option value="">-- Select Seller --</option>
            {sellers.map((sel) => (
              <option key={sel.id} value={sel.id}>
                {sel.seller_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Buyer:</label>
          <select
            name="buyer"
            value={invoiceData.buyer}
            onChange={handleChange}
          >
            <option value="">-- Select Buyer --</option>
            {buyers.map((byr) => (
              <option key={byr.id} value={byr.id}>
                {byr.buyer_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Invoice Number:</label>
          <input
            type="text"
            name="invoice_number"
            value={invoiceData.invoice_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Currency:</label>
          <input
            type="text"
            name="invoice_currency"
            value={invoiceData.invoice_currency}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Freight Charges:</label>
          <input
            type="number"
            name="freight_charges"
            value={invoiceData.freight_charges}
            onChange={handleChange}
          />
        </div>

        <h3>Items</h3>
        {invoiceData.items.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
            />

            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
            />

            <label>Unit Price:</label>
            <input
              type="number"
              step="0.01"
              name="unit_price"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, e)}
            />

            <button type="button" onClick={() => removeItemRow(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItemRow}>
          Add Item
        </button>

        <br />
        <br />
        <button type="submit">Save Invoice</button>
      </form>
    </div>
  );
}

export default InvoiceForm;
