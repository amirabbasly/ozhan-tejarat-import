// src/components/InvoiceDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceItemsEditor from "./InvoiceItemsEditor";
import "../style/CottageDetails.css";
import { countries } from "../constants/countryList";
import { fetchOrders } from "../actions/performaActions";
import { useSelector, useDispatch } from "react-redux";

const InvoiceDetail = () => {
  const { invoiceNumber } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cottages, setCottages] = useState([]);
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order?.orders) ?? [];
  // Options for selects
  const currencyOptions = [
    { value: "USD", label: "دلار آمریکا" },
    { value: "EUR", label: "یورو" },
    { value: "GBP", label: "پوند استرلینگ" },
    { value: "IRR", label: "ریال" },
    { value: "AED", label: "درهم امارات" },
  ];

  const meansOfTransportOptions = [
    { value: "By Truck", label: "By Truck" },
    { value: "By AirPlane", label: "By AirPlane" },
    { value: "By Vessel", label: "By Vessel" },
    { value: "By Train", label: "By Train" },
  ];

  const termsOfDeliveryOptions = [
    { value: "CFR", label: "CFR" },
    { value: "CIF", label: "CIF" },
    { value: "CIP", label: "CIP" },
    { value: "CPT", label: "CPT" },
    { value: "DAP", label: "DAP" },
    { value: "DDP", label: "DDP" },
    { value: "DPU", label: "DPU" },
    { value: "EXW", label: "EXW" },
    { value: "FAS", label: "FAS" },
    { value: "FCA", label: "FCA" },
    { value: "FOB", label: "FOB" },
  ];

  const unitOptions = [
    { value: "KG", label: "KG" },
    { value: "M3", label: "M3" },
    { value: "M2", label: "M2" },
    { value: "M", label: "M" },
    { value: "PCS", label: "PCS" },
    { value: "SET", label: "SET" },
    
  ];
  const cottageOptions = cottages.map((c) => ({ value: c.cottage_number, label: String(c.cottage_number) }));
  const proformaOptions = orders.map((c) => ({ value: c.prfVCodeInt, label: String(c.prf_order_no) }));

  const sellerOptions = sellers.map((sel) => ({
    value: sel.id,
    label: sel.seller_name,
  }));
    const countryOptions = countries.map((country) => ({
        value: country.name, // or combine with ctmNameStr if needed
        label: `${country.name} (${country.persianName})`,
      }));

  const buyerOptions = buyers.map((buyer) => ({
    value: buyer.id,
    label: buyer.buyer_name,
  }));

  useEffect(() => {
    dispatch(fetchOrders());
    const fetchData = async () => {
      try {
        const [
          invoiceRes,
          sellersRes,
          buyersRes,
          cottagesRes
        ] = await Promise.all([
          axiosInstance.get(`/documents/invoices/by-number/${invoiceNumber}/`),
          axiosInstance.get("/documents/sellers/"),
          axiosInstance.get("/documents/buyers/"),
          axiosInstance.get("cottages/numbers/"),
        ]);

        setInvoice(invoiceRes.data);
        setSellers(sellersRes.data);
        setBuyers(buyersRes.data);
        // Extract array of {id, cottage_number}
        const list = Array.isArray(cottagesRes.data)
          ? cottagesRes.data
          : Array.isArray(cottagesRes.data.results)
            ? cottagesRes.data.results
            : [];
        setCottages(list);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };
    fetchData();
  }, [invoiceNumber]);

  const handleInvoiceFieldChange = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemsChange = (updatedItems) => {
    setInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/documents/invoices/${invoice.id}/`, invoice)
      .then((response) => {
        setInvoice(response.data);
        setSuccessMessage("تغییرات با موفقیت ذخیره شدند.");
        setError("");
      })
      .catch((err) => {
        setError("خطا در ذخیره تغییرات.");
        setSuccessMessage("");
      });
  };
  const handleDelete = async () => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این فاکتور را حذف کنید؟")
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/documents/invoices/${invoice.id}/`);
      alert("فاکتور با موفقیت حذف شد.");
      window.location.href = "/invoices/list"; // Redirect to the seller list page
    } catch (err) {
      setError("خطا در حذف فاکتور.");
    }
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (!invoice) return <div className="error">{error}</div>;

  return (
    <div className="cottage-details-container">
      <div className="header">جزئیات فاکتور</div>
      <form onSubmit={handleSubmit}>
        <InvoiceDetails
          invoice={invoice}
          onFieldChange={handleInvoiceFieldChange}
          sellerOptions={sellerOptions}
          buyerOptions={buyerOptions}
          currencyOptions={currencyOptions}
          termsOfDeliveryOptions={termsOfDeliveryOptions}
          meansOfTransportOptions={meansOfTransportOptions}
          countryOptions={countryOptions}
          cottageOptions={cottageOptions}
          proformaOptions={proformaOptions} 
        />
        <InvoiceItemsEditor
          items={invoice.items}
          onItemsChange={handleItemsChange}
          unitOptions={unitOptions}
          countryOptions={countryOptions}

        />
        <button type="submit" className="primary-button">
          ثبت تغییرات
        </button>
        <button type="button" className="delete-button" onClick={handleDelete}>
          حذف فاکتور
        </button>
      </form>
      {successMessage && <div className="cottage-info">{successMessage}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default InvoiceDetail;
