import React, { useState } from "react";
import {
  FaInfoCircle,
  FaMapMarkerAlt,
  FaBrain,
  FaCode,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import Footer from "./ui/Footer";

const UserGuide = () => {
  // All sections open by default
  const [openSections, setOpenSections] = useState({
    company: true,
    address: true,
    aiModel: true,
    architecture: true,
    faq: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Data omitted for brevity (companyInfo, aiModelInfo, faqData)...

  return (
    <div
      dir="rtl"
      className="min-h-screen mt-20 bg-gray-100 flex flex-col font-vazir text-right"
    >
      <Toaster />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 sm:p-8 md:p-10 space-y-6">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4 sm:mb-0">
              <FaInfoCircle className="text-3xl text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-blue-800">
                راهنمای نرم‌افزار اوژن تجارت کیان
              </h1>
            </div>
            <button
              onClick={() =>
                toast.success("راهنما با موفقیت ذخیره شد!", {
                  position: "top-right",
                  duration: 3000,
                  style: {
                    borderRadius: "10px",
                    background: "#fff",
                    color: "#333",
                  },
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ذخیره راهنما
            </button>
          </header>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {/** Company Section **/}
            <section className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("company")}
                className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FaCog className="text-xl text-blue-700" />
                  <span className="text-lg font-medium text-blue-700">
                    معرفی شرکت اوژن تجارت کیان
                  </span>
                </div>
                {openSections.company ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSections.company && (
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1">درباره ما</h3>
                      <p className="text-sm text-gray-700">
                        شرکت اوژن تجارت کیان یکی از پیشروهای صنعت بازرگانی...
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1">ماموریت</h3>
                      <p className="text-sm text-gray-700">
                        ایجاد تحول در صنعت بازرگانی با استفاده از فناوری...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/** Address Section **/}
            <section className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("address")}
                className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FaMapMarkerAlt className="text-xl text-blue-700" />
                  <span className="text-lg font-medium text-blue-700">
                    آدرس شرکت
                  </span>
                </div>
                {openSections.address ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSections.address && (
                <div className="p-4 bg-white">
                  <div className="p-3 bg-blue-50 rounded">
                    <h3 className="font-semibold mb-1">دفتر مرکزی</h3>
                    <p className="text-sm text-gray-700">
                      تهران، خیابان ولیعصر، کوچه کیان، پلاک ۱۲۳
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      مشاهده در نقشه
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/** AI Model Section **/}
            <section className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("aiModel")}
                className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FaBrain className="text-xl text-blue-700" />
                  <span className="text-lg font-medium text-blue-700">
                    مدل هوش مصنوعی اوژن تجارت کیان
                  </span>
                </div>
                {openSections.aiModel ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSections.aiModel && (
                <div className="p-4 bg-white">
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1">معرفی مدل</h3>
                      <p className="text-sm text-gray-700">
                        اوژن تجارت کیان یک مدل هوش مصنوعی کاملاً بومی...
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1">ویژگی‌ها</h3>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>پیش‌بینی روندهای بازار با دقت بالا (تا 95%)</li>
                        <li>تحلیل رفتار مشتریان و پیشنهادات شخصی‌سازی‌شده</li>
                        <li>بهینه‌سازی زنجیره تأمین با کاهش 30% هدررفت</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/** Architecture Section **/}
            <section className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("architecture")}
                className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FaCode className="text-xl text-blue-700" />
                  <span className="text-lg font-medium text-blue-700">
                    معماری و فناوری‌ها
                  </span>
                </div>
                {openSections.architecture ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
              {openSections.architecture && (
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1">معماری مدل</h3>
                      <p className="text-sm text-gray-700">
                        شبکه‌های عصبی عمیق (DNN) ...
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1">
                        زبان‌ها و الگوریتم‌ها
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Python, React, SQL, R</li>
                        <li>LSTM-CNN, NLP, Clustering</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/** FAQ Section **/}
            <section className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("faq")}
                className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FaQuestionCircle className="text-xl text-blue-700" />
                  <span className="text-lg font-medium text-blue-700">
                    سوالات متداول
                  </span>
                </div>
                {openSections.faq ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSections.faq && (
                <div className="p-4 bg-white">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1 text-sm">
                        چگونه شروع کنم؟
                      </h3>
                      <p className="text-sm text-gray-700">
                        به وب‌سایت ما مراجعه و ثبت‌نام کنید.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1 text-sm">حفاظت داده</h3>
                      <p className="text-sm text-gray-700">
                        رمزنگاری AES-256 و ISO 27001.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-1 text-sm">پشتیبانی</h3>
                      <p className="text-sm text-gray-700">
                        24/7 از طریق ایمیل، چت و تلفن.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserGuide;
