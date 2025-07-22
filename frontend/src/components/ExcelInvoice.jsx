import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function ExcelInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [goods, setGoods] = useState([
    { name: "", country_of_origin: "", commodity_code: "", gw: "", nw: "", quantity: "", unit: "", unit_price: "" }
  ]);

  const handleGoodsChange = (index, event) => {
    const updatedGoods = [...goods];
    updatedGoods[index][event.target.name] = event.target.value;
    setGoods(updatedGoods);
  };

  const handleAddGood = () => {
    setGoods([
      ...goods,
      { name: "", country_of_origin: "", commodity_code: "", gw: "", nw: "", quantity: "", unit: "", unit_price: "" }
    ]);
  };

  const handleRemoveGood = (index) => {
    const updatedGoods = goods.filter((_, i) => i !== index);
    setGoods(updatedGoods);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/documents/fill_inv/",
        {
          invoice_number: invoiceNumber,
          date,
          amount,
          goods, // Send the goods list to the backend
        },
        {
          responseType: "blob", // so we receive the file as a blob
        }
      );

      // Create a temporary blob URL
      const blobUrl = URL.createObjectURL(response.data);

      // Create a link and click it programmatically
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "filled_template.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  return (
    <div>
      <h2>ساخت اینوویس</h2>
      <form onSubmit={handleDownload}>
        <div>
          <label>شماره فاکتور(Invoice Number):</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div>
          <label>تاریخ:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>ارزش کل:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <h3>Goods List</h3>
          {goods.map((good, index) => (
            <div key={index}>
              <h4>Good {index + 1}</h4>
              <input
                type="text"
                name="name"
                value={good.name}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Goods Name"
              />
              <input
                type="text"
                name="country_of_origin"
                value={good.country_of_origin}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Country of Origin"
              />
              <input
                type="text"
                name="commodity_code"
                value={good.commodity_code}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Commodity Code"
              />
              <input
                type="number"
                name="gw"
                value={good.gw}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Gross Weight"
              />
              <input
                type="number"
                name="nw"
                value={good.nw}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Net Weight"
              />
              <input
                type="number"
                name="quantity"
                value={good.quantity}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Quantity"
              />
              <input
                type="text"
                name="unit"
                value={good.unit}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Unit"
              />
              <input
                type="number"
                name="unit_price"
                value={good.unit_price}
                onChange={(e) => handleGoodsChange(index, e)}
                placeholder="Unit Price"
              />
              <button type="button" onClick={() => handleRemoveGood(index)}>
                Remove Good
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddGood}>
            Add Another Good
          </button>
        </div>

        <button type="submit">Download Excel</button>
      </form>
    </div>
  );
}

export default ExcelInvoice;
