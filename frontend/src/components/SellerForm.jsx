// // src/components/SellerForm.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import "../style/CottageForm.css";

// function SellerForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     seller_name: "",
//     seller_address: "",
//     seller_refrence: "",
//     seller_country: "",
//     seller_bank_name: "",
//     seller_account_name: "",
//     seller_iban: "",
//     seller_swift: "",
//     seller_seal: null, // for file upload
//     seller_logo: null, // for file upload
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append("seller_name", formData.seller_name);
//     data.append("seller_address", formData.seller_address);
//     data.append("seller_refrence", formData.seller_refrence);
//     data.append("seller_country", formData.seller_country);
//     data.append("seller_bank_name", formData.seller_bank_name);
//     data.append("seller_account_name", formData.seller_account_name);
//     data.append("seller_iban", formData.seller_iban);
//     data.append("seller_swift", formData.seller_swift);

//     if (formData.seller_seal instanceof File) {
//       data.append("seller_seal", formData.seller_seal);
//     }
//     if (formData.seller_logo instanceof File) {
//       data.append("seller_logo", formData.seller_logo);
//     }

//     // Debugging: Log the FormData values
//     for (let pair of data.entries()) {
//       console.log(pair[0], pair[1]);
//     }

//     try {
//       await axiosInstance.post("documents/sellers/", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("فروشنده با موفقیت ایجاد شد!");
//       navigate("/");
//     } catch (error) {
//       console.error("خطا در ایجاد فروشنده:", error);
//       alert("ایجاد فروشنده با خطا مواجه شد.");
//     }
//   };

//   return (
//     <form
//       className="cottage-form "
//       dir="rtl"
//       onSubmit={handleSubmit}
//       encType="multipart/form-data"
//     >
//       <h2>ایجاد فروشنده</h2>

//       <div className="form-group">
//         <label htmlFor="seller_name">نام فروشنده:</label>
//         <input
//           type="text"
//           id="seller_name"
//           name="seller_name"
//           value={formData.seller_name}
//           onChange={handleChange}
//           placeholder="نام فروشنده را وارد کنید"
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_address">آدرس فروشنده:</label>
//         <textarea
//           id="seller_address"
//           className="form-textarea"
//           name="seller_address"
//           value={formData.seller_address}
//           onChange={handleChange}
//           placeholder="آدرس فروشنده را وارد کنید"
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="seller_country">کشور:</label>
//         <input
//           type="text"
//           id="seller_country"
//           name="seller_country"
//           value={formData.seller_country}
//           onChange={handleChange}
//           placeholder="کشور فروشنده را وارد کنید"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_bank_name">نام بانک:</label>
//         <input
//           type="text"
//           id="seller_bank_name"
//           name="seller_bank_name"
//           value={formData.seller_bank_name}
//           onChange={handleChange}
//           placeholder="نام بانک را وارد کنید"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_account_name">نام حساب:</label>
//         <input
//           type="text"
//           id="seller_account_name"
//           name="seller_account_name"
//           value={formData.seller_account_name}
//           onChange={handleChange}
//           placeholder="نام حساب را وارد کنید"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_iban">شماره IBAN:</label>
//         <input
//           type="text"
//           id="seller_iban"
//           name="seller_iban"
//           value={formData.seller_iban}
//           onChange={handleChange}
//           placeholder="شماره IBAN را وارد کنید"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_swift">کد سوئیفت:</label>
//         <input
//           type="text"
//           id="seller_swift"
//           name="seller_swift"
//           value={formData.seller_swift}
//           onChange={handleChange}
//           placeholder="کد سوئیفت را وارد کنید"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_seal">مهر:</label>
//         <input
//           type="file"
//           id="seller_seal"
//           name="seller_seal"
//           accept="image/*"
//           onChange={handleFileChange}
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="seller_logo">لوگو:</label>
//         <input
//           type="file"
//           id="seller_logo"
//           name="seller_logo"
//           accept="image/*"
//           onChange={handleFileChange}
//         />
//       </div>

//       <button type="submit" className="btn-grad1">
//         ذخیره فروشنده
//       </button>
//     </form>
//   );
// }

// export default SellerForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function SellerForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    seller_name: "",
    seller_address: "",
    seller_refrence: "",
    seller_country: "",
    seller_bank_name: "",
    seller_account_name: "",
    seller_iban: "",
    seller_swift: "",
    seller_seal: null, // for file upload
    seller_logo: null, // for file upload
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("seller_name", formData.seller_name);
    data.append("seller_address", formData.seller_address);
    data.append("seller_refrence", formData.seller_refrence);
    data.append("seller_country", formData.seller_country);
    data.append("seller_bank_name", formData.seller_bank_name);
    data.append("seller_account_name", formData.seller_account_name);
    data.append("seller_iban", formData.seller_iban);
    data.append("seller_swift", formData.seller_swift);

    if (formData.seller_seal instanceof File) {
      data.append("seller_seal", formData.seller_seal);
    }
    if (formData.seller_logo instanceof File) {
      data.append("seller_logo", formData.seller_logo);
    }

    // Debugging: Log the FormData values
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axiosInstance.post("documents/sellers/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("فروشنده با موفقیت ایجاد شد!");
      navigate("/");
    } catch (error) {
      console.error("خطا در ایجاد فروشنده:", error);
      alert("ایجاد فروشنده با خطا مواجه شد.");
    }
  };

  return (
    <form
      className="mt-10 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
      dir="rtl"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ایجاد فروشنده
      </h2>

      {/* Seller Name */}
      <div className="mb-4">
        <label
          htmlFor="seller_name"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          نام فروشنده:
        </label>
        <input
          type="text"
          id="seller_name"
          name="seller_name"
          value={formData.seller_name}
          onChange={handleChange}
          placeholder="نام فروشنده را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
        />
      </div>

      {/* Seller Address */}
      <div className="mb-4">
        <label
          htmlFor="seller_address"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          آدرس فروشنده:
        </label>
        <textarea
          id="seller_address"
          name="seller_address"
          value={formData.seller_address}
          onChange={handleChange}
          placeholder="آدرس فروشنده را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right resize-y"
          required
        />
      </div>

      {/* Seller Country */}
      <div className="mb-4">
        <label
          htmlFor="seller_country"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          کشور:
        </label>
        <input
          type="text"
          id="seller_country"
          name="seller_country"
          value={formData.seller_country}
          onChange={handleChange}
          placeholder="کشور فروشنده را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Seller Bank Name */}
      <div className="mb-4">
        <label
          htmlFor="seller_bank_name"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          نام بانک:
        </label>
        <input
          type="text"
          id="seller_bank_name"
          name="seller_bank_name"
          value={formData.seller_bank_name}
          onChange={handleChange}
          placeholder="نام بانک را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Seller Account Name */}
      <div className="mb-4">
        <label
          htmlFor="seller_account_name"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          نام حساب:
        </label>
        <input
          type="text"
          id="seller_account_name"
          name="seller_account_name"
          value={formData.seller_account_name}
          onChange={handleChange}
          placeholder="نام حساب را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Seller IBAN */}
      <div className="mb-4">
        <label
          htmlFor="seller_iban"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          شماره IBAN:
        </label>
        <input
          type="text"
          id="seller_iban"
          name="seller_iban"
          value={formData.seller_iban}
          onChange={handleChange}
          placeholder="شماره IBAN را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Seller SWIFT */}
      <div className="mb-4">
        <label
          htmlFor="seller_swift"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          کد سوئیفت:
        </label>
        <input
          type="text"
          id="seller_swift"
          name="seller_swift"
          value={formData.seller_swift}
          onChange={handleChange}
          placeholder="کد سوئیفت را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Seller Seal */}
      <div className="mb-4">
        <label
          htmlFor="seller_seal"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          مهر:
        </label>
        <input
          type="file"
          id="seller_seal"
          name="seller_seal"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Seller Logo */}
      <div className="mb-4">
        <label
          htmlFor="seller_logo"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          لوگو:
        </label>
        <input
          type="file"
          id="seller_logo"
          name="seller_logo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-1/2 mx-auto min-w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300"
      >
        ذخیره فروشنده
      </button>
    </form>
  );
}

export default SellerForm;
