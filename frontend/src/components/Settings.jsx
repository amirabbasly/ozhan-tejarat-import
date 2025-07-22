// // src/components/Settings.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   FaCog,
//   FaPalette,
//   FaFont,
//   FaLanguage,
//   FaSun,
//   FaMoon,
//   FaBell,
//   FaUser,
//   FaLock,
//   FaGlobe,
// } from 'react-icons/fa';
// import { toast, Toaster } from 'react-hot-toast';

// const Settings = () => {
//   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
//   const [font, setFont] = useState(localStorage.getItem('font') || 'vazir');
//   const [language, setLanguage] = useState(localStorage.getItem('language') || 'fa');
//   const [notifications, setNotifications] = useState(
//     localStorage.getItem('notifications') !== 'false'
//   );
//   const [officeAddress, setOfficeAddress] = useState(localStorage.getItem('officeAddress') || '');
//   const [activeTab, setActiveTab] = useState('general');

//   // مدیریت تم
//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', theme === 'dark');
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   // ذخیره تنظیمات در localStorage
//   const saveSettings = () => {
//     localStorage.setItem('font', font);
//     localStorage.setItem('language', language);
//     localStorage.setItem('notifications', notifications);
//     localStorage.setItem('officeAddress', officeAddress);
//     toast.success('تنظیمات با موفقیت ذخیره شد!', {
//       position: 'top-right',
//       duration: 3000,
//       style: {
//         borderRadius: '10px',
//         background: theme === 'dark' ? '#333' : '#fff',
//         color: theme === 'dark' ? '#fff' : '#333',
//       },
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-vazir">
//       <Toaster />
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-8 space-y-8">
//         <header className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-3">
//             <FaCog className="text-3xl text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//               تنظیمات اوژن تجارت کیان
//             </h1>
//           </div>
//           <button
//             onClick={saveSettings}
//             className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
//           >
//             ذخیره تغییرات
//           </button>
//         </header>

//         {/* تب‌های تنظیمات */}
//         <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
//           <button
//             onClick={() => setActiveTab('general')}
//             className={`py-2 px-4 font-medium transition-colors ${
//               activeTab === 'general'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-500 dark:text-gray-400'
//             }`}
//           >
//             عمومی
//           </button>
//           <button
//             onClick={() => setActiveTab('appearance')}
//             className={`py-2 px-4 font-medium transition-colors ${
//               activeTab === 'appearance'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-500 dark:text-gray-400'
//             }`}
//           >
//             ظاهر
//           </button>
//           <button
//             onClick={() => setActiveTab('notifications')}
//             className={`py-2 px-4 font-medium transition-colors ${
//               activeTab === 'notifications'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-500 dark:text-gray-400'
//             }`}
//           >
//             اعلان‌ها
//           </button>
//           <button
//             onClick={() => setActiveTab('account')}
//             className={`py-2 px-4 font-medium transition-colors ${
//               activeTab === 'account'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-500 dark:text-gray-400'
//             }`}
//           >
//             حساب کاربری
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {activeTab === 'general' && (
//             <>
//               {/* زبان */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaLanguage className="ml-2" /> زبان
//                 </h2>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
//                 >
//                   <option value="fa">فارسی</option>
//                   <option value="en">English</option>
//                   <option value="ar">العربية</option>
//                 </select>
//               </div>

//               {/* آدرس دفتر */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaGlobe className="ml-2" /> آدرس دفتر
//                 </h2>
//                 <input
//                   type="text"
//                   value={officeAddress}
//                   onChange={(e) => setOfficeAddress(e.target.value)}
//                   placeholder="مثلا تهران، خیابان ولیعصر"
//                   className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
//                 />
//               </div>
//             </>
//           )}

//           {activeTab === 'appearance' && (
//             <>
//               {/* تم رنگی */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaPalette className="ml-2" /> تم رنگی
//                 </h2>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={() => setTheme('light')}
//                     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition hover:bg-blue-50 dark:hover:bg-gray-600 ${
//                       theme === 'light'
//                         ? 'bg-blue-600 text-white border-blue-600'
//                         : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-200 border-blue-300 dark:border-gray-600'
//                     }`}
//                   >
//                     <FaSun /> روشن
//                   </button>
//                   <button
//                     onClick={() => setTheme('dark')}
//                     className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition hover:bg-blue-50 dark:hover:bg-gray-600 ${
//                       theme === 'dark'
//                         ? 'bg-blue-600 text-white border-blue-600'
//                         : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-200 border-blue-300 dark:border-gray-600'
//                     }`}
//                   >
//                     <FaMoon /> تیره
//                   </button>
//                 </div>
//               </div>

//               {/* فونت */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaFont className="ml-2" /> فونت
//                 </h2>
//                 <select
//                   value={font}
//                   onChange={(e) => setFont(e.target.value)}
//                   className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
//                 >
//                   <option value="vazir">وزیر</option>
//                   <option value="iransans">ایران‌سنس</option>
//                   <option value="shabnam">شبنم</option>
//                   <option value="sahel">ساحل</option>
//                 </select>
//               </div>
//             </>
//           )}

//           {activeTab === 'notifications' && (
//             <>
//               {/* اعلان‌ها */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaBell className="ml-2" /> اعلان‌ها
//                 </h2>
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={notifications}
//                     onChange={() => setNotifications(!notifications)}
//                     className="w-5 h-5 text-blue-600 rounded focus:ring-blue-400"
//                   />
//                   <span className="text-gray-700 dark:text-gray-200">
//                     فعال‌سازی اعلان‌ها
//                   </span>
//                 </label>
//               </div>
//             </>
//           )}

//           {activeTab === 'account' && (
//             <>
//               {/* نام کاربری */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaUser className="ml-2" /> نام کاربری
//                 </h2>
//                 <input
//                   type="text"
//                   placeholder="نام کاربری"
//                   className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
//                 />
//               </div>

//               {/* رمز عبور */}
//               <div className="space-y-2">
//                 <h2 className="flex items-center text-lg font-medium text-blue-600">
//                   <FaLock className="ml-2" /> تغییر رمز عبور
//                 </h2>
//                 <input
//                   type="password"
//                   placeholder="رمز عبور جدید"
//                   className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaPalette,
  FaFont,
  FaLanguage,
  FaSun,
  FaMoon,
  FaBell,
  FaUser,
  FaLock,
  FaGlobe,
  FaBuilding,
  FaSpinner,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { useCompany } from "../context/CompanyContext";
const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [font, setFont] = useState(localStorage.getItem("font") || "vazir");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "fa"
  );
  const { company } = useCompany();
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const [officeAddress, setOfficeAddress] = useState(
    localStorage.getItem("officeAddress") || ""
  );
  const [activeTab, setActiveTab] = useState("general");
  const [companyData, setCompanyData] = useState({
    full_name: "",
    phone_number: "",
    national_code: "",
    company_address: "",
    logo: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Theme management
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("font", font);
    localStorage.setItem("language", language);
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("officeAddress", officeAddress);
    toast.success("تنظیمات با موفقیت ذخیره شد!", {
      position: "top-right",
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      },
    });
  };

  // Handle company data input changes
  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logo file input
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setCompanyData((prev) => ({ ...prev, logo: file }));
  };

  // Save company settings to API
  const saveCompanySettings = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", companyData.full_name);
      formData.append("phone_number", companyData.phone_number);
      formData.append("national_code", companyData.national_code);
      formData.append("company_address", companyData.company_address);
      if (companyData.logo) {
        formData.append("logo", companyData.logo);
      }

      await axiosInstance.post("/accounts/company/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("اطلاعات شرکت با موفقیت ذخیره شد!", {
        position: "top-right",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#333",
        },
      });
    } catch (error) {
      toast.error("خطا در ذخیره اطلاعات شرکت!", {
        position: "top-right",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#333",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-vazir">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-8 space-y-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FaCog className="text-3xl text-blue-600" />
            <h1>{company?.full_name ?? "در حال بارگذاری..."}</h1>;
          </div>
          <button
            onClick={
              activeTab === "company" ? saveCompanySettings : saveSettings
            }
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading && <FaSpinner className="animate-spin" />}
            ذخیره تغییرات
          </button>
        </header>

        {/* Settings Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "general"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            عمومی
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "appearance"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            ظاهر
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "notifications"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            اعلان‌ها
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "account"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            حساب کاربری
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "company"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            شرکت
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === "general" && (
            <>
              {/* Language */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaLanguage className="ml-2" /> زبان
                </h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="fa">فارسی</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              {/* Office Address */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaGlobe className="ml-2" /> آدرس دفتر
                </h2>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="مثلا تهران، خیابان ولیعصر"
                  className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              {/* Theme */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaPalette className="ml-2" /> تم رنگی
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition hover:bg-blue-50 dark:hover:bg-gray-600 ${
                      theme === "light"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-200 border-blue-300 dark:border-gray-600"
                    }`}
                  >
                    <FaSun /> روشن
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition hover:bg-blue-50 dark:hover:bg-gray-600 ${
                      theme === "dark"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-200 border-blue-300 dark:border-gray-600"
                    }`}
                  >
                    <FaMoon /> تیره
                  </button>
                </div>
              </div>

              {/* Font */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaFont className="ml-2" /> فونت
                </h2>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="vazir">وزیر</option>
                  <option value="iransans">ایران‌سنس</option>
                  <option value="shabnam">شبنم</option>
                  <option value="sahel">ساحل</option>
                </select>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              {/* Notifications */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaBell className="ml-2" /> اعلان‌ها
                </h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-400"
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    فعال‌سازی اعلان‌ها
                  </span>
                </label>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <>
              {/* Username */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaUser className="ml-2" /> نام کاربری
                </h2>
                <input
                  type="text"
                  placeholder="نام کاربری"
                  className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaLock className="ml-2" /> تغییر رمز عبور
                </h2>
                <input
                  type="password"
                  placeholder="رمز عبور جدید"
                  className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </>
          )}

          {activeTab === "company" && (
            <>
              {/* Company Settings */}
              <div className="space-y-2">
                <h2 className="flex items-center text-lg font-medium text-blue-600">
                  <FaBuilding className="ml-2" /> اطلاعات شرکت
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="full_name"
                    value={companyData.full_name}
                    onChange={handleCompanyInputChange}
                    placeholder="نام کامل شرکت"
                    className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <input
                    type="text"
                    name="phone_number"
                    value={companyData.phone_number}
                    onChange={handleCompanyInputChange}
                    placeholder="شماره تلفن"
                    className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <input
                    type="text"
                    name="national_code"
                    value={companyData.national_code}
                    onChange={handleCompanyInputChange}
                    placeholder="کدملی شرکت"
                    className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <textarea
                    name="company_address"
                    value={companyData.company_address}
                    onChange={handleCompanyInputChange}
                    placeholder="آدرس شرکت"
                    className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                    rows="4"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full py-2 px-3 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
