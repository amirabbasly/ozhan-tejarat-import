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
    terms_of_delivery: "CPT",
    terms_of_payment: "TT",
    partial_shipment: false,
    relevant_location: "",
    standard: "JIS",
    items: [
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        nw_kg: 0,
        gw_kg: 0,
        commodity_code: "",
        origin: "",
      },
    ],
  });

  useEffect(() => {
    // Fetch sellers
    axiosInstance
      .get("documents/sellers/")
      .then((res) => setSellers(res.data))
      .catch((err) => console.error(err));

    // Fetch buyers
    axiosInstance
      .get("documents/buyers/")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Updated to handle checkboxes as well as text/number inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: type === "checkbox" ? checked : value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  const addItemRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          nw_kg: 0,
          gw_kg: 0,
          origin: "",
        },
      ],
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
      freight_charges: parseFloat(invoiceData.freight_charges) || 0,
      items: invoiceData.items.map((item) => ({
        description: item.description,
        quantity: parseInt(item.quantity, 10) || 0,
        unit_price: parseFloat(item.unit_price) || 0,
        nw_kg: parseFloat(item.nw_kg) || 0,
        gw_kg: parseFloat(item.gw_kg) || 0,
        origin: item.origin,
        commodity_code: item.commodity_code,
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

        <div>
          <label>Terms of Delivery:</label>
          <input
            type="text"
            name="terms_of_delivery"
            value={invoiceData.terms_of_delivery}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Terms of Payment:</label>
          <input
            type="text"
            name="terms_of_payment"
            value={invoiceData.terms_of_payment}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Partial Shipment:</label>
          <input
            type="checkbox"
            name="partial_shipment"
            checked={invoiceData.partial_shipment}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Relevant Location:</label>
          <input
            type="text"
            name="relevant_location"
            value={invoiceData.relevant_location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Standard:</label>
          <input
            type="text"
            name="standard"
            value={invoiceData.standard}
            onChange={handleChange}
          />
        </div>

        <h3>Items</h3>
        {invoiceData.items.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
            }}
          >
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <label>Unit Price:</label>
              <input
                type="number"
                step="0.01"
                name="unit_price"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
            <div>
              <label>commodity code (HsCode):</label>
              <input
                type="number"
                step="0.01"
                name="commodity_code"
                value={item.commodity_code}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
            <div>
              <label>Net Weight (kg):</label>
              <input
                type="number"
                step="0.01"
                name="nw_kg"
                value={item.nw_kg}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <label>Gross Weight (kg):</label>
              <input
                type="number"
                step="0.01"
                name="gw_kg"
                value={item.gw_kg}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <label>Origin:</label>
              <input
                type="text"
                name="origin"
                value={item.origin}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <button type="button" onClick={() => removeItemRow(index)}>
              Remove Item
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
