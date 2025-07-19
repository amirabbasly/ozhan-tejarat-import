// src/components/InvoiceForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCostumers } from "../actions/authActions";
import axiosInstance from "../utils/axiosInstance";
import Select from "react-select";
import "../style/CottageForm.css";
import { iranCustoms } from "../constants/iranCustoms";
import { countries } from "../constants/countryList";
import { fetchOrders } from "../actions/performaActions";

function ProformaInvoiceForm() {
  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  // Toggle state to show/hide translations
  const [enableTranslation, setEnableTranslation] = useState(false);

  // Toggling translation logic
  const handleToggleTranslation = async () => {
    const newValue = !enableTranslation;
    setEnableTranslation(newValue);

    if (newValue === true) {
      // Translation is turning ON
      try {
        // For each item, request an English translation from /documents/translate/
        const updatedItems = await Promise.all(
          invoiceData.items.map(async (item) => {
            // If no Farsi text, skip calling the API
            if (!item.original_description.trim()) {
              return { ...item, translated_description: "" };
            }
            const response = await axiosInstance.post("/translate/", {
              text: item.original_description,
            });
            const translatedText = response.data.translation || "";
            return {
              ...item,
              translated_description: translatedText,
            };
          })
        );
        setInvoiceData((prev) => ({
          ...prev,
          items: updatedItems,
        }));
      } catch (err) {
        console.error("Translation error:", err);
        // You can show a user-friendly error here if you wish
      }
    } else {
      // Translation is turning OFF -> clear existing translations or just hide them in the UI
      const clearedItems = invoiceData.items.map((item) => ({
        ...item,
        translated_description: "",
      }));
      setInvoiceData((prev) => ({
        ...prev,
        items: clearedItems,
      }));
    }
  };

  useEffect(() => {
    dispatch(fetchOrders());
    // Fetch the list of costumers (buyers/sellers)
    dispatch(fetchCostumers());
  }, [dispatch]);
  const [proformas, setProformas] = useState([]);

  // Fetch sellers & buyers to populate dropdowns
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);


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

  // Create options for ReactSelect from fetched sellers and buyers
  const sellerOptions = sellers.map((sel) => ({
    value: sel.id,
    label: sel.seller_name,
  }));
  const buyerOptions = buyers.map((buyer) => ({
    value: buyer.id,
    label: buyer.buyer_name,
  }));

  // Options for various dropdowns
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
    { value: "By Vessel", label: "By Vessel" },
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
    { value: "SET", label: "SET" },

  ];
  const iranCustomsOptions = iranCustoms.map((custom) => ({
    value: custom.ctmNameStr,
    label: `${custom.ctmNameStr} (${custom.ctmVCodeInt})`,
  }));
  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: `${country.name} (${country.persianName})`,
  }));

  // Main invoice form data
  const [invoiceData, setInvoiceData] = useState({
    seller: "",
    buyer: "",
    proforma_invoice_number: "",
    proforma_invoice_currency: "AED",
    proforma_freight_charges: 0,
    terms_of_delivery: "CPT",
    terms_of_payment: "T/T",
    standard: "JIS",
    partial_shipment: false,
    relevant_location: "",
    means_of_transport: "By Ship",
    country_of_origin: "",
    customer_tel: "",
    port_of_loading: "",
    proforma_invoice_date: "",
    proforma_invoice_exp_date: "",
    items: [
      {
        original_description: "",
        quantity: 1,
        unit_price: 0,
        nw_kg: 0,
        gw_kg: 0,
        unit: "PCS",
        commodity_code: "",
        pack: 1,
        origin: "",
        // We'll store the translation here when toggle is ON
        translated_description: "",
      },
    ],
  });

  // Handle changes for top-level fields (including checkboxes)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle changes for item-level fields
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

  // Add another item row
  const addItemRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          original_description: "",
          quantity: 1,
          unit_price: 0,
          nw_kg: 0,
          gw_kg: 0,
          unit: "U",
          commodity_code: "",
          pack: 1,
          origin: "",
          translated_description: "",
        },
      ],
    }));
  };

  // Remove an item row
  const removeItemRow = (index) => {
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      return { ...prev, items: updatedItems };
    });
  };

  // Submit the form
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // build payload, respecting enableTranslation
    const payload = {
      ...invoiceData,
      proforma_freight_charges:
        parseFloat(invoiceData.proforma_freight_charges) || 0,
      items: invoiceData.items.map((item) => ({
        // decide which description goes where
        original_description: enableTranslation
          ? item.original_description
          : null,
        translated_description: enableTranslation
          ? item.translated_description
          : item.original_description,
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


  return (
    <form className="cottage-form" dir="rtl" onSubmit={handleSubmit}>
      <h2>ایجاد پروفورم</h2>

      {/* Seller */}
      <div className="form-group">
        <label htmlFor="seller">فروشنده:</label>
        <Select
          id="seller"
          name="seller"
          options={sellerOptions}
          className="selectPrf"
          value={
            sellerOptions.find((option) => option.value === invoiceData.seller) ||
            null
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

      {/* Buyer */}
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

      {/* Invoice Number */}
      <div className="form-group">
        <label htmlFor="proforma_invoice_number">شماره فاکتور:</label>
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

      {/* Invoice Date */}
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

      {/* Invoice Expiration Date */}
      <div className="form-group">
        <label htmlFor="proforma_invoice_exp_date">تاریخ اعتبار:</label>
        <input
          type="date"
          id="proforma_invoice_exp_date"
          name="proforma_invoice_exp_date"
          value={invoiceData.proforma_invoice_exp_date}
          onChange={handleChange}
          required
        />
      </div>

      {/* Invoice Currency */}
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

      {/* Freight Charges */}
      <div className="form-group">
        <label htmlFor="proforma_freight_charges">هزینه حمل:</label>
        <input
          type="number"
          id="proforma_freight_charges"
          name="proforma_freight_charges"
          value={invoiceData.proforma_freight_charges}
          onChange={handleChange}
          placeholder="هزینه حمل"
          onWheel={(e) => e.target.blur()}
        />
      </div>

      {/* Partial Shipment */}
      <div className="form-group">
        <label htmlFor="partial_shipment">حمل به دفعات:</label>
        <input
          type="checkbox"
          id="partial_shipment"
          name="partial_shipment"
          checked={invoiceData.partial_shipment}
          onChange={handleChange}
        />
      </div>

      {/* Country of Origin (Multi) */}
      <div className="form-group">
        <label htmlFor="country_of_origin">کشور مبدأ</label>
        <Select
          className="selectPrf"
          id="country_of_origin"
          name="country_of_origin"
          options={countryOptions}
          isMulti
          value={
            invoiceData.country_of_origin
              ? invoiceData.country_of_origin.split("-").map((val) =>
                  countryOptions.find((option) => option.value === val.trim())
                )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              country_of_origin: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب کشور مبدأ"
        />
      </div>

      {/* Port of Loading (Multi) */}
      <div className="form-group">
        <label htmlFor="port_of_loading">بندر بارگیری:</label>
        <Select
          className="selectPrf"
          id="port_of_loading"
          name="port_of_loading"
          options={countryOptions}
          isMulti
          value={
            invoiceData.port_of_loading
              ? invoiceData.port_of_loading.split("-").map((val) =>
                  countryOptions.find((option) => option.value === val.trim())
                )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              port_of_loading: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب بندر بارگیری"
        />
      </div>

      {/* Terms of Delivery */}
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

      {/* Terms of Payment */}
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

      {/* Standard */}
      <div className="form-group">
        <label htmlFor="standard">استاندارد:</label>
        <Select
          id="standard"
          name="standard"
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
              standard: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="انتخاب استاندارد"
        />
      </div>

      {/* Means of Transport (Multi) */}
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
              ? invoiceData.means_of_transport.split("-").map((val) =>
                  meansOfTransportOptions.find(
                    (option) => option.value === val.trim()
                  )
                )
              : []
          }
          onChange={(selectedOptions) => {
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

      {/* Relevant Location (Iran Customs) */}
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
              ? invoiceData.relevant_location.split("-").map((val) =>
                  iranCustomsOptions.find(
                    (option) => option.value === val.trim()
                  )
                )
              : []
          }
          onChange={(selectedOptions) => {
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

      {/* Toggle for translating all items */}
      <div className="form-group" style={{ margin: "1rem 0" }}>
        <label>نمایش ترجمه انگلیسی تمامی اقلام
        </label>
          <input
            type="checkbox"
            checked={enableTranslation}
            onChange={handleToggleTranslation}
            style={{ marginLeft: "0.5rem" }}
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
          {/* Original Description */}
          <div className="form-group">
            <label htmlFor={`original_description-${index}`}>شرح کالا:</label>
            <textarea
              className="form-textarea"
              autoCorrect="on"
              autoCapitalize="sentences"
              spellCheck={true}
              id={`original_description-${index}`}
              name="original_description"
              value={item.original_description}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="شرح کالا"
              required
            />
          </div>

          {/* Show translated text if translations are enabled */}
          {enableTranslation && item.translated_description && (
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label>ترجمه انگلیسی:</label>
              <div className="translation-preview">
                {item.translated_description}
              </div>
            </div>
          )}

          {/* Quantity */}
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
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Unit Price */}
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
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Commodity Code (HS) */}
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
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Unit */}
          <div className="form-group">
            <label htmlFor={`unit-${index}`}>واحد:</label>
            <Select
              id={`unit-${index}`}
              name="unit"
              options={unitOptions}
              className="selectPrf"
              value={unitOptions.find((opt) => opt.value === item.unit) || null}
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

          {/* NW (kg) */}
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
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* GW (kg) */}
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
              onWheel={(e) => e.target.blur()}
            />
          </div>

{/* Origin */}
<div className="form-group">
  <label htmlFor={`origin-${index}`}>مبدأ:</label>

  <Select
    id={`origin-${index}`}
    name="origin"
    options={countryOptions}
    isMulti
    className="selectPrf"
    /* ---------- show the currently-saved values ---------- */
    value={
      item.origin
        ? item.origin
            .split("-")                         // "IR-TR-CN"  ➜  ["IR","TR","CN"]
            .map(val =>
              countryOptions.find(o => o.value === val.trim())
            )
        : []
    }
    /* ---------- save the newly-picked values ---------- */
    onChange={selectedOptions => {
      const selectedValues = selectedOptions
        ? selectedOptions.map(o => o.value)     // ["IR","TR","CN"]
        : [];

      setInvoiceData(prev => {
        const updatedItems = [...prev.items];
        updatedItems[index].origin = selectedValues.join("-"); // "IR-TR-CN"
        return { ...prev, items: updatedItems };
      });
    }}
    placeholder="انتخاب مبدأ"
  />
</div>




          {/* Remove Item Button */}
          <button
            type="button"
            onClick={() => removeItemRow(index)}
            className="btn-grad1"
          >
            حذف کالا
          </button>
        </div>
      ))}

      {/* Add Item Button */}
      <button type="button" onClick={addItemRow} className="btn-grad1">
        افزودن کالا
      </button>

      <br />
      <br />

      {/* Submit Button */}
      <button type="submit" className="btn-grad1">
        ذخیره فاکتور
      </button>
    </form>
  );
}

export default ProformaInvoiceForm;
