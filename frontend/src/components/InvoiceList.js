import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./InvoiceList.css"; // Import the CSS file
import { Link } from "react-router-dom";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    axiosInstance
      .get("documents/invoices/")
      .then((res) => setInvoices(res.data.results))
      .catch((err) => console.error("خطا در دریافت صورتحساب‌ها:", err));

    // دریافت قالب‌ها برای انتخاب
    axiosInstance
      .get("documents/templates/")
      .then((res) => setTemplates(res.data))
      .catch((err) => console.error("خطا در دریافت قالب‌ها:", err));
  }, []);

  const downloadPDF = async (invoiceId) => {
    if (!selectedTemplate) {
      alert("لطفاً ابتدا یک قالب انتخاب کنید.");
      return;
    }

    try {
      // Pass the template_id as a query parameter in the URL
      const response = await axiosInstance.get(
        `documents/combined-pdf/${invoiceId}/?template_id=${selectedTemplate}`, // Passing template_id in the URL
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

  const downloadPacking = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(
        `documents/packing/${invoiceId}/pdf/`,
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `packing_${invoiceId}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error("خطا در دانلود بسته‌بندی:", error);
    }
  };
  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(
        `documents/invoices/${invoiceId}/pdf/`,
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
      console.error("خطا در دانلود بسته‌بندی:", error);
    }
  };

  const downloadOverlayImage = async (invoiceId) => {
    if (!selectedTemplate) {
      alert("لطفاً ابتدا یک قالب انتخاب کنید.");
      return;
    }

    try {
      const data = {
        invoice_id: invoiceId,
        template_id: selectedTemplate,
      };

      const response = await axiosInstance.post(
        `documents/origin-cert/`,
        data,
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", `invoice_overlay_${invoiceId}.jpg`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {
      console.error("خطا در دانلود تصویر اورلی:", error);
    }
  };

  return (
    <div className="invoice-list-container">
      <h2>فهرست صورتحساب</h2>
      <table className="invoice-list-table">
        <thead>
          <tr>
            <th>شناسه صورتحساب</th>
            <th>شماره صورتحساب</th>
            <th>مبلغ کل</th>
            <th>هزینه حمل</th>
            <th>واحد پول</th>
            <th>تاریخ</th>
            <th>صورتحساب</th>
            <th>بسته‌بندی</th>
            <th>گواهی مبدأ</th>
            <th>کل مدارک</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoice_id}</td>
              <td>{inv.invoice_number}</td>
              <td>{inv.total_amount}</td>
              <td>{inv.freight_charges}</td>
              <td>{inv.invoice_currency}</td>
              <td>{inv.invoice_date}</td>
              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() => downloadInvoice(inv.id)}
                >
                  دانلود اینوویس
                </button>
              </td>
              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() => downloadPacking(inv.id)}
                >
                  دانلود پکینگ
                </button>
              </td>
              <td>
                <select
                  className="invoice-list-select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">انتخاب قالب</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                <button
                  className="invoice-list-btn"
                  onClick={() => downloadOverlayImage(inv.id)}
                >
                  دانلود گواهی مبدا
                </button>
              </td>
              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() => downloadPDF(inv.id)}
                >
                  دانلود پکینگ
                </button>
              </td>
              <td>
                <Link to={`/invoices/details/${inv.invoice_number}`}>
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

export default InvoiceList;
