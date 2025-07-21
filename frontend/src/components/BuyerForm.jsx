// // src/components/BuyerForm.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// function BuyerForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     buyer_name: "",
//     buyer_card_number: "",
//     buyer_address: "",
//     buyer_tel: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.post("documents/buyers/", formData);
//       alert("خریدار با موفقیت ایجاد شد!");
//       navigate("/");
//     } catch (error) {
//       console.error("خطا در ایجاد خریدار:", error);
//       alert("ایجاد خریدار با خطا مواجه شد.");
//     }
//   };

//   return (
//     <form className="cottage-form" dir="rtl" onSubmit={handleSubmit}>
//       <h2>ایجاد خریدار</h2>

//       <div className="form-group">
//         <label htmlFor="buyer_name">نام خریدار:</label>
//         <input
//           type="text"
//           id="buyer_name"
//           name="buyer_name"
//           value={formData.buyer_name}
//           onChange={handleChange}
//           placeholder="نام خریدار را وارد کنید"
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="buyer_card_number">شماره کارت:</label>
//         <input
//           type="text"
//           id="buyer_card_number"
//           name="buyer_card_number"
//           value={formData.buyer_card_number}
//           onChange={handleChange}
//           placeholder="شماره کارت را وارد کنید"
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="buyer_address">کشور خریدار:</label>
//         <input
//           type="text"
//           id="buyer_address"
//           name="buyer_address"
//           value={formData.buyer_address}
//           onChange={handleChange}
//           placeholder="کشور خریدار را وارد کنید"
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="buyer_tel">شماره تلفن خریدار:</label>
//         <input
//           type="text"
//           id="buyer_tel"
//           name="buyer_tel"
//           value={formData.buyer_tel}
//           onChange={handleChange}
//           placeholder="شماره تلفن خریدار را وارد کنید"
//           required
//         />
//       </div>

//       <button type="submit" className="btn-grad1">
//         ذخیره خریدار
//       </button>
//     </form>
//   );
// }

// export default BuyerForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function BuyerForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_card_number: "",
    buyer_address: "",
    buyer_tel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("documents/buyers/", formData);
      alert("خریدار با موفقیت ایجاد شد!");
      navigate("/");
    } catch (error) {
      console.error("خطا در ایجاد خریدار:", error);
      alert("ایجاد خریدار با خطا مواجه شد.");
    }
  };

  return (
    <form
      className="mt-10 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
      dir="rtl"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ایجاد خریدار
      </h2>

      {/* Buyer Name */}
      <div className="mb-4">
        <label
          htmlFor="buyer_name"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          نام خریدار:
        </label>
        <input
          type="text"
          id="buyer_name"
          name="buyer_name"
          value={formData.buyer_name}
          onChange={handleChange}
          placeholder="نام خریدار را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
        />
      </div>

      {/* Buyer Card Number */}
      <div className="mb-4">
        <label
          htmlFor="buyer_card_number"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          شماره کارت:
        </label>
        <input
          type="text"
          id="buyer_card_number"
          name="buyer_card_number"
          value={formData.buyer_card_number}
          onChange={handleChange}
          placeholder="شماره کارت را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
        />
      </div>

      {/* Buyer Address */}
      <div className="mb-4">
        <label
          htmlFor="buyer_address"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          کشور خریدار:
        </label>
        <input
          type="text"
          id="buyer_address"
          name="buyer_address"
          value={formData.buyer_address}
          onChange={handleChange}
          placeholder="کشور خریدار را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
        />
      </div>

      {/* Buyer Telephone */}
      <div className="mb-4">
        <label
          htmlFor="buyer_tel"
          className="block text-sm font-medium text-gray-700 mb-1 text-right"
        >
          شماره تلفن خریدار:
        </label>
        <input
          type="text"
          id="buyer_tel"
          name="buyer_tel"
          value={formData.buyer_tel}
          onChange={handleChange}
          placeholder="شماره تلفن خریدار را وارد کنید"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-right"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-1/2 mx-auto min-w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300"
      >
        ذخیره خریدار
      </button>
    </form>
  );
}

export default BuyerForm;
