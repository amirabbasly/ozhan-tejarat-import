// src/components/InvoiceForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCostumers } from "../actions/authActions";
import axiosInstance from "../utils/axiosInstance";
import Select from "react-select"; // Import ReactSelect
import "./CottageForm.css";
import { iranCustoms } from "../data/iranCustoms";

function ProformaInvoiceForm() {
  const navigate = useNavigate();
  const costumerstate = useSelector((state) => state.costumers);
  const { costumerList, customersLoading, customersError } = costumerstate || {
    costumerList: [],
    costumersLoading: false,
    costumersError: null,
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCostumers());
  }, [dispatch]);

  // Fetch sellers & buyers to populate dropdowns
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const customerOptions = costumerList.map((cmr) => ({
    value: cmr.id,
    label: cmr.full_name,
  }));

  // Options for currency, delivery terms, payment terms, and standard types
  const currencyOptions = [
    { value: "USD", label: "دلار آمریکا" },
    { value: "EUR", label: "یورو" },
    { value: "CNY", label: "یوان چین" },

    { value: "GBP", label: "پوند استرلینگ" },
    { value: "IRR", label: "ریال" },
    { value: "AED", label: "درهم امارات" },
  ];
  const meansOfTransportOptions = [
    { value: "By Truck", label: "By Truck" },
    { value: "By AirPlane", label: "By AirPlane" },
    { value: "By Ship", label: "By Ship" },
    { value: "By Train", label: "By Train" },
  ];
  const standardOptions = [
    { value: "JIS", label: "JIS" },
    { value: "ISO", label: "ISO" },
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

  const termsOfPaymentOptions = [
    { value: "T/T", label: "T/T" },
    { value: "L/C", label: "L/C" },
    { value: "D/P", label: "D/P" },
    { value: "D/A", label: "D/A" },
  ];

  const unitOptions = [
    { value: "KGS", label: "KGS" },
    { value: "M3", label: "M3" },
    { value: "M2", label: "M2" },
    { value: "M", label: "M" },

    { value: "PCS", label: "PCS" },
  ];
  const iranCustomsOptions = iranCustoms.map((custom) => ({
    value: custom.ctmNameStr, // or combine with ctmNameStr if needed
    label: `${custom.ctmNameStr} (${custom.ctmVCodeInt})`,
  }));
  const [invoiceData, setInvoiceData] = useState({
    seller: "",
    buyer: "",
    proforma_invoice_number: "",
    proforma_invoice_currency: "AED", // default value
    proforma_freight_charges: 0,
    terms_of_delivery: "CPT", // default value
    terms_of_payment: "T/T",
    standard: "JIS",
    partial_shipment: false,
    relevant_location: "",
    means_of_transport: "By Ship",
    country_of_origin: "",
    port_of_loading: "",
    proforma_invoice_date: "", // Add this line

    items: [
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        nw_kg: 0,
        gw_kg: 0,
        unit: "PCS",
        commodity_code: "",
        pack: 1,
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

  // Handle input changes (including checkboxes)
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
          unit: "U",
          commodity_code: "",
          pack: 1,
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
    const payload = {
      ...invoiceData,
      proforma_freight_charges:
        parseFloat(invoiceData.proforma_freight_charges) || 0,
      items: invoiceData.items.map((item) => ({
        description: item.description,
        quantity: parseInt(item.quantity, 10) || 0,
        unit_price: parseFloat(item.unit_price) || 0,
        nw_kg: parseFloat(item.nw_kg) || 0,
        gw_kg: parseFloat(item.gw_kg) || 0,
        commodity_code: item.commodity_code,
        pack: parseInt(item.pack, 10) || 0,
        unit: item.unit,
        origin: item.origin,
      })),
    };

    try {
      await axiosInstance.post("documents/proforma-invoices/", payload);
      alert("فاکتور با موفقیت ایجاد شد!");
      navigate("/proforma-invoices/list");
    } catch (error) {
      console.error("خطا در ایجاد فاکتور:", error);
      alert("ایجاد فاکتور با خطا مواجه شد.");
    }
  };

  // Create options for ReactSelect from fetched sellers and buyers
  const sellerOptions = sellers.map((sel) => ({
    value: sel.id,
    label: sel.seller_name,
  }));

  const buyerOptions = buyers.map((buyer) => ({
    value: buyer.id,
    label: buyer.buyer_name,
  }));

  return (
    <form className="cottage-form" dir="rtl" onSubmit={handleSubmit}>
      <h2>ایجاد پروفورم</h2>

      <div className="form-group">
        <label htmlFor="seller">فروشنده:</label>
        <Select
          id="seller"
          name="seller"
          options={sellerOptions}
          className="selectPrf"
          value={
            sellerOptions.find(
              (option) => option.value === invoiceData.seller
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              seller: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="-- انتخاب فروشنده --"
        />
      </div>

      <div className="form-group">
        <label htmlFor="buyer">خریدار:</label>
        <Select
          id="buyer"
          name="buyer"
          className="selectPrf"
          options={buyerOptions}
          value={
            buyerOptions.find((option) => option.value === invoiceData.buyer) ||
            null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              buyer: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="-- انتخاب خریدار --"
        />
      </div>

      <div className="form-group">
        <label htmlFor="invoice_number">شماره فاکتور:</label>
        <input
          type="text"
          id="proforma_invoice_number"
          name="proforma_invoice_number"
          value={invoiceData.proforma_invoice_number}
          onChange={handleChange}
          placeholder="شماره فاکتور را وارد کنید"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="proforma_invoice_date">تاریخ فاکتور:</label>
        <input
          type="date"
          id="proforma_invoice_date"
          name="proforma_invoice_date"
          value={invoiceData.proforma_invoice_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="proforma_invoice_currency">ارز:</label>
        <Select
          className="selectPrf"
          id="proforma_invoice_currency"
          name="proforma_invoice_currency"
          options={currencyOptions}
          value={
            currencyOptions.find(
              (option) => option.value === invoiceData.proforma_invoice_currency
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              proforma_invoice_currency: selectedOption
                ? selectedOption.value
                : "",
            }))
          }
          placeholder="انتخاب ارز"
        />
      </div>

      <div className="form-group">
        <label htmlFor="proforma_freight_charges">هزینه حمل:</label>
        <input
          type="number"
          id="proforma_freight_charges"
          name="proforma_freight_charges"
          value={invoiceData.proforma_freight_charges}
          onChange={handleChange}
          placeholder="هزینه حمل"
        />
      </div>
      <div className="form-group">
        <label htmlFor="partial_shipment">حمل به دفعات:</label>
        <input
          type="checkbox"
          id="partial_shipment"
          name="partial_shipment"
          checked={invoiceData.partial_shipment} // Use checked instead of value
          onChange={handleChange} // Correctly update state
        />
      </div>

      <div className="form-group">
        <label htmlFor="country_of_origin"> کشور مبدا:</label>
        <input
          type="text"
          id="country_of_origin"
          name="country_of_origin"
          value={invoiceData.country_of_origin}
          onChange={handleChange}
          placeholder="کشور مبدا"
        />
      </div>
      <div className="form-group">
        <label htmlFor="port_of_loading"> بندر بارگیری:</label>
        <input
          type="text"
          id="port_of_loading"
          name="port_of_loading"
          value={invoiceData.port_of_loading}
          onChange={handleChange}
          placeholder="بندر بارگیری"
        />
      </div>

      <div className="form-group">
        <label htmlFor="terms_of_delivery">شرایط تحویل:</label>
        <Select
          id="terms_of_delivery"
          name="terms_of_delivery"
          options={termsOfDeliveryOptions}
          className="selectPrf"
          value={
            termsOfDeliveryOptions.find(
              (option) => option.value === invoiceData.terms_of_delivery
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              terms_of_delivery: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="انتخاب شرایط تحویل"
        />
      </div>
      <div className="form-group">
        <label htmlFor="terms_of_payment">شرایط پرداخت:</label>
        <Select
          id="terms_of_payment"
          name="terms_of_payment"
          options={termsOfPaymentOptions}
          className="selectPrf"
          value={
            termsOfPaymentOptions.find(
              (option) => option.value === invoiceData.terms_of_payment
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              terms_of_payment: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="انتخاب شرایط پرداخت"
        />
      </div>
      <div className="form-group">
        <label htmlFor="standard">استاندارد:</label>
        <Select
          id="standard"
          name="stabdard"
          options={standardOptions}
          className="selectPrf"
          value={
            standardOptions.find(
              (option) => option.value === invoiceData.standard
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              terms_of_payment: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="انتخاب استاندارد"
        />
      </div>

      <div className="form-group">
        <label htmlFor="means_of_transport">وسیله حمل:</label>
        <Select
          id="means_of_transport"
          name="means_of_transport"
          className="selectPrf"
          isMulti
          options={meansOfTransportOptions}
          value={
            invoiceData.means_of_transport
              ? invoiceData.means_of_transport
                  .split("-")
                  .map((val) =>
                    meansOfTransportOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            // When user changes selection, join the option values with "-"
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              means_of_transport: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب وسیله حمل"
        />
      </div>

      <div className="form-group">
        <label htmlFor="relevant_location">گمرک مقصد:</label>
        <Select
          className="selectPrf"
          id="relevant_location"
          name="relevant_location"
          options={iranCustomsOptions}
          isMulti
          value={
            invoiceData.relevant_location
              ? invoiceData.relevant_location
                  .split("-")
                  .map((val) =>
                    iranCustomsOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            // When user changes selection, join the option values with "-"
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              relevant_location: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب گمرک مقصد"
        />
      </div>

      <h3>کالاها</h3>
      {invoiceData.items.map((item, index) => (
        <div
          key={index}
          className="form-group"
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div className="form-group">
            <label htmlFor={`description-${index}`}>شرح کالا:</label>
            <textarea
              className="form-textarea"
              type="text"
              id={`description-${index}`}
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="شرح کالا"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`quantity-${index}`}>تعداد:</label>
            <input
              type="number"
              id={`quantity-${index}`}
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="تعداد"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`unit_price-${index}`}>قیمت واحد:</label>
            <input
              type="number"
              id={`unit_price-${index}`}
              name="unit_price"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="قیمت واحد"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`commodity_code-${index}`}>کد کالا (HS):</label>
            <input
              type="number"
              id={`commodity_code-${index}`}
              name="commodity_code"
              min={0}
              value={item.commodity_code}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="کد کالا"
            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">واحد:</label>
            <Select
              id={`unit-${index}`}
              name="unit"
              options={unitOptions}
              className="selectPrf"
              value={
                unitOptions.find((option) => option.value === item.unit) || null
              }
              onChange={(selectedOption) =>
                setInvoiceData((prev) => {
                  const updatedItems = [...prev.items];
                  updatedItems[index].unit = selectedOption
                    ? selectedOption.value
                    : "";
                  return { ...prev, items: updatedItems };
                })
              }
              placeholder="انتخاب واحد"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`nw_kg-${index}`}>وزن خالص (کیلوگرم):</label>
            <input
              type="number"
              id={`nw_kg-${index}`}
              name="nw_kg"
              step="0.01"
              value={item.nw_kg}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="وزن خالص"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`gw_kg-${index}`}>وزن ناخالص (کیلوگرم):</label>
            <input
              type="number"
              id={`gw_kg-${index}`}
              name="gw_kg"
              step="0.01"
              value={item.gw_kg}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="وزن ناخالص"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`pack-${index}`}>تعداد بسته بندی :</label>
            <input
              type="number"
              id={`pack-${index}`}
              name="pack"
              value={item.pack}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="تعداد بسته بندی"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`origin-${index}`}>مبدأ:</label>
            <input
              type="text"
              id={`origin-${index}`}
              name="origin"
              value={item.origin}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="مبدأ کالا"
            />
          </div>
          <div className="form-group">
            <label htmlFor="customer">مشتری:</label>
            <Select
              id={`customer-${index}`}
              name="customer"
              options={customerOptions}
              className="selectPrf"
              value={
                customerOptions.find(
                  (option) => option.value === item.customer
                ) || null
              }
              onChange={(selectedOption) =>
                setInvoiceData((prev) => {
                  const updatedItems = [...prev.items];
                  updatedItems[index].customer = selectedOption
                    ? selectedOption.value
                    : "";
                  return { ...prev, items: updatedItems };
                })
              }
              placeholder="انتخاب مشتری"
            />
          </div>
          <button
            type="button"
            onClick={() => removeItemRow(index)}
            className="btn-grad1"
          >
            حذف کالا
          </button>
        </div>
      ))}

      <button type="button" onClick={addItemRow} className="btn-grad1">
        افزودن کالا
      </button>

      <br />
      <br />
      <button type="submit" className="btn-grad1">
        ذخیره فاکتور
      </button>
    </form>
  );
}

export default ProformaInvoiceForm;
