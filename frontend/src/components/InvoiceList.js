// src/components/InvoiceList.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axiosInstance.get("documents/invoices/")
      .then((res) => setInvoices(res.data.results))
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  const downloadPDF = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`documents/invoices/${invoiceId}/pdf/`, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `invoice_${invoiceId}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error("PDF download error:", error);
    }
  };

  const downloadExcel = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`documents/invoices/${invoiceId}/excel/`, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `invoice_${invoiceId}.xlsx`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error("Excel download error:", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Invoice List</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice ID</th>
            <th>Invoice Number</th>
            <th>Total Amount</th>
            <th>Freight Charges</th>
            <th>Currency</th>
            <th>Date</th>
            <th>PDF</th>
            <th>Excel</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.invoice_id}</td>
              <td>{inv.invoice_number}</td>
              <td>{inv.total_amount}</td>
              <td>{inv.freight_charges}</td>
              <td>{inv.invoice_currency}</td>
              <td>{inv.invoice_date}</td>
              <td>
                <button onClick={() => downloadPDF(inv.id)}>Download PDF</button>
              </td>
              <td>
                <button onClick={() => downloadExcel(inv.id)}>Download Excel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
