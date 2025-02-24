import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./InvoiceList.css"; // Import the CSS file
import { Link } from "react-router-dom";

function ProformaInvoiceList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("documents/proforma-invoices/")
      .then((res) => setInvoices(res.data.results))
      .catch((err) => console.error("خطا در دریافت صورتحساب‌ها:", err));
  }, []);

  const downloadPDF = async (invoiceId) => {
    try {
      // Pass the template_id as a query parameter in the URL
      const response = await axiosInstance.get(
        `documents/proforma-invoice/${invoiceId}/pdf`, // Passing template_id in the URL
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `invoice_${invoiceId}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error("خطا در دانلود PDF:", error);
    }
  };

  return (
    <div className="invoice-list-container">
      <h2>فهرست فاکتور ها</h2>
      <table className="invoice-list-table">
        <thead>
          <tr>
            <th>شناسه پروفورما</th>
            <th>شماره پروفورما</th>
            <th>مبلغ کل</th>
            <th>هزینه حمل</th>
            <th>واحد پول</th>
            <th>تاریخ</th>
            <th>پروفورما</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.proforma_invoice_id}</td>
              <td>{inv.proforma_invoice_number}</td>
              <td>{inv.total_amount}</td>
              <td>{inv.proforma_freight_charges}</td>
              <td>{inv.proforma_invoice_currency}</td>
              <td>{inv.proforma_invoice_date}</td>

              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() => downloadPDF(inv.id)}
                >
                  دانلود پروفورما
                </button>
              </td>
              <td>
                <Link
                  to={`/proforma-invoices/details/${inv.proforma_invoice_id}`}
                >
                  {" "}
                  جزئیات
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProformaInvoiceList;
