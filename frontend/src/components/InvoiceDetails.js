// src/components/InvoiceDetails.jsx
import Select from "react-select";
import { iranCustoms } from "../data/iranCustoms";
import React, { useEffect } from "react";

const InvoiceDetails = ({
  invoice,
  onFieldChange,
  sellerOptions,
  buyerOptions,
  currencyOptions,
  termsOfDeliveryOptions,
  meansOfTransportOptions,
  countryOptions,
  cottageOptions,
  proformaOptions,
}) => {
    useEffect(() => {
    if (
      !invoice.proforma && 
      invoice.proforma_details?.prfVCodeInt != null
    ) {
      // Make sure to convert to string if your options’ values are strings
      onFieldChange(
        "proforma",
        String(invoice.proforma_details.prfVCodeInt)
      );
    }
  }, [invoice.proforma, invoice.proforma_details, onFieldChange]);
  const iranCustomsOptions = iranCustoms.map((custom) => ({
    value: custom.ctmNameStr, // or combine with ctmNameStr if needed
    label: `${custom.ctmNameStr} (${custom.ctmVCodeInt})`,
  }));
  return (
    <div>
      <div className="form-group">
        <label htmlFor="proforma">ثبت سفارش:</label>
        <Select
          id="proforma"
          className="selectPrf"
          name="proforma"
          options={proformaOptions}
          value={
            proformaOptions.find(
              (o) =>
                o.value ===
                // Try invoice.proforma first; if that’s still empty,
                // fall back to invoice.proforma_details.prfVCodeInt (as string)
                (invoice.proforma !== "" && invoice.proforma != null
                  ? invoice.proforma
                  : invoice.proforma_details?.prfVCodeInt?.toString())
            ) || null
          }
          onChange={(opt) =>
            onFieldChange("proforma", opt ? opt.value : "")
          }
          placeholder="-- انتخاب ثبت سفارش --"
        />
      </div>
        <div className="form-group">
        <label htmlFor="cottage">شماره اظهارنامه:</label>
        <Select
          id="cottage"
          className="selectPrf"
          name="cottage"
          options={cottageOptions}
          value={cottageOptions.find((o) => o.value === invoice.cottage) || null}
          onChange={(opt) => onFieldChange("cottage", opt ? opt.value : "")}
          placeholder="-- انتخاب شماره اظهارنامه --"
        />
      </div>
      {/* Seller */}
      <div className="form-group">
        <label htmlFor="seller">فروشنده:</label>
        <Select
          className="selectPrf"
          id="seller"
          name="seller"
          options={sellerOptions}
          value={
            sellerOptions.find((option) => option.value === invoice.seller) ||
            null
          }
          onChange={(selectedOption) =>
            onFieldChange("seller", selectedOption ? selectedOption.value : "")
          }
          placeholder="-- انتخاب فروشنده --"
        />
      </div>

      {/* Buyer */}
      <div className="form-group">
        <label htmlFor="buyer">خریدار:</label>
        <Select
          className="selectPrf"
          id="buyer"
          name="buyer"
          options={buyerOptions}
          value={
            buyerOptions.find((option) => option.value === invoice.buyer) ||
            null
          }
          onChange={(selectedOption) =>
            onFieldChange("buyer", selectedOption ? selectedOption.value : "")
          }
          placeholder="-- انتخاب خریدار --"
        />
      </div>

      {/* Invoice Number */}
      <div className="form-group">
        <label htmlFor="invoice_number">شماره فاکتور:</label>
        <input
          type="text"
          id="invoice_number"
          name="invoice_number"
          value={invoice.invoice_number || ""}
          onChange={(e) => onFieldChange("invoice_number", e.target.value)}
          placeholder="شماره فاکتور را وارد کنید"
          required
          className="editable-input"
        />
      </div>

      {/* Invoice Date */}
      <div className="form-group">
        <label htmlFor="invoice_date">تاریخ فاکتور:</label>
        <input
          type="date"
          id="invoice_date"
          name="invoice_date"
          value={invoice.invoice_date || ""}
          onChange={(e) => onFieldChange("invoice_date", e.target.value)}
          required
          className="editable-datepicker"
        />
      </div>

      {/* Invoice Currency */}
      <div className="form-group">
        <label htmlFor="invoice_currency">ارز:</label>
        <Select
          className="selectPrf"
          id="invoice_currency"
          name="invoice_currency"
          options={currencyOptions}
          value={
            currencyOptions.find(
              (option) => option.value === invoice.invoice_currency
            ) || null
          }
          onChange={(selectedOption) =>
            onFieldChange(
              "invoice_currency",
              selectedOption ? selectedOption.value : ""
            )
          }
          placeholder="انتخاب ارز"
        />
      </div>

      {/* Freight Charges */}
      <div className="form-group">
        <label htmlFor="freight_charges">هزینه حمل:</label>
        <input
          type="number"
          id="freight_charges"
          name="freight_charges"
          value={invoice.freight_charges}
          onChange={(e) => onFieldChange("freight_charges", e.target.value)}
          placeholder="هزینه حمل"
          className="editable-input"
          onWheel={(e) => e.target.blur()}  // <-- add this line

        />
      </div>
            {/* Customer Tel */}
            <div className="form-group">
        <label htmlFor="customer_tel">شماره مشتری :</label>
        <input
          type="text"
          id="customer_tel"
          name="customer_tel"
          value={invoice.customer_tel || ""}
          onChange={(e) => onFieldChange("customer_tel", e.target.value)}
          placeholder="شماره تماس مشتری را وارد کنید"
          className="editable-input"
        />
      </div>


      {/* Country of Origin */}
      <div className="form-group">
        <label htmlFor="country_of_origin">کشور مبدأ:</label>
        <Select
          className="selectPrf"
          id="country_of_origin"
          name="country_of_origin"
          options={countryOptions}
          isMulti
          value={
            invoice.country_of_origin
              ? invoice.country_of_origin
                  .split("-")
                  .map((val) =>
                    countryOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            onFieldChange("country_of_origin", selectedValues.join("-"));
          }}
          placeholder="انتخاب کشور مبدأ"
        />
      </div>
      {/* Port of Loading */}
      <div className="form-group">
        <label htmlFor="port_of_loading">کشور مبدأ:</label>
        <Select
          className="selectPrf"
          id="port_of_loading"
          name="port_of_loading"
          options={countryOptions}
          isMulti
          value={
            invoice.port_of_loading
              ? invoice.port_of_loading
                  .split("-")
                  .map((val) =>
                    countryOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            onFieldChange("port_of_loading", selectedValues.join("-"));
          }}
          placeholder="انتخاب بندر بارگیری"
        />
      </div>
      {/* Terms of Delivery */}
      <div className="form-group">
        <label htmlFor="terms_of_delivery">شرایط تحویل:</label>
        <Select
          className="selectPrf"
          id="terms_of_delivery"
          name="terms_of_delivery"
          options={termsOfDeliveryOptions}
          value={
            termsOfDeliveryOptions.find(
              (option) => option.value === invoice.terms_of_delivery
            ) || null
          }
          onChange={(selectedOption) =>
            onFieldChange(
              "terms_of_delivery",
              selectedOption ? selectedOption.value : ""
            )
          }
          placeholder="انتخاب شرایط تحویل"
        />
      </div>

      {/* Means of Transport */}
      <div className="form-group">
        <label htmlFor="means_of_transport">وسیله حمل:</label>
        <Select
          className="selectPrf"
          id="means_of_transport"
          name="means_of_transport"
          options={meansOfTransportOptions}
          isMulti
          value={
            invoice.means_of_transport
              ? invoice.means_of_transport
                  .split("-")
                  .map((val) =>
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
            onFieldChange("means_of_transport", selectedValues.join("-"));
          }}
          placeholder="انتخاب وسیله حمل"
        />
      </div>

      {/* Customs Destination */}
      <div className="form-group">
        <label htmlFor="relevant_location">گمرک مقصد:</label>
        <Select
          className="selectPrf"
          id="relevant_location"
          name="relevant_location"
          options={iranCustomsOptions}
          isMulti
          value={
            invoice.relevant_location
              ? invoice.relevant_location
                  .split("-")
                  .map((val) =>
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
            onFieldChange("relevant_location", selectedValues.join("-"));
          }}
          placeholder="انتخاب گمرک مقصد"
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
