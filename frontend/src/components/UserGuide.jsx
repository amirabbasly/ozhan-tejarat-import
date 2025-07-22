
// src/components/UserGuide.jsx
import React, { useState } from 'react';
import { FaInfoCircle, FaMapMarkerAlt, FaBrain, FaCode, FaCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const UserGuide = () => {
  const [openSections, setOpenSections] = useState({});

  // تابع برای باز و بسته کردن آکاردیون
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // اطلاعات فرضی شرکت و مدل هوش مصنوعی
  const companyInfo = {
    name: 'اوژن تجارت کیان',
    description:
      'شرکت اوژن تجارت کیان یکی از پیشروهای صنعت بازرگانی در ایران است که با بهره‌گیری از فناوری‌های مدرن، به‌ویژه هوش مصنوعی، راهکارهای نوآورانه‌ای برای مدیریت زنجیره تأمین، تحلیل بازار و بهینه‌سازی فرآیندهای تجاری ارائه می‌دهد. این شرکت از سال 1395 فعالیت خود را آغاز کرده و با تکیه بر تیمی متخصص، به توسعه نرم‌افزارهای پیشرفته برای کسب‌وکارهای مدرن پرداخته است.',
    address: 'تهران، خیابان ولیعصر، کوچه کیان، پلاک ۱۲۳',
    mission: 'ایجاد تحول در صنعت بازرگانی با استفاده از فناوری‌های پیشرفته و هوش مصنوعی برای افزایش بهره‌وری و کارایی.',
  };

  const aiModelInfo = {
    name: 'اوژن تجارت کیان (Ozhan Ai)',
    description:
      'اوژن تجارت کیان یک مدل هوش مصنوعی کاملاً بومی است که توسط تیم اوژن تجارت کیان توسعه یافته است. این مدل برای تحلیل داده‌های بازرگانی، پیش‌بینی روندهای بازار، و بهینه‌سازی زنجیره تأمین طراحی شده است. اوژن تجارت کیان با استفاده از الگوریتم‌های یادگیری عمیق و پردازش زبان طبیعی، قابلیت‌های پیشرفته‌ای در تحلیل داده‌های پیچیده و ارائه پیشنهادات هوشمند ارائه می‌دهد.',
    architecture:
      'معماری اوژن تجارت کیان مبتنی بر شبکه‌های عصبی عمیق (DNN) و مدل‌های ترکیبی LSTM-CNN است که برای پردازش داده‌های سری زمانی مالی و بازرگانی بهینه شده‌اند. این مدل از یک معماری ماژولار استفاده می‌کند که شامل لایه‌های ورودی برای پردازش داده‌های ساختاریافته و بدون ساختار، لایه‌های مخفی برای استخراج ویژگی‌ها، و لایه‌های خروجی برای پیش‌بینی و تصمیم‌گیری است.',
    languages: [
      'Python: برای توسعه مدل‌های یادگیری ماشین و پردازش داده‌ها',
      'JavaScript (React): برای رابط‌های کاربری تعاملی و وب‌اپلیکیشن‌ها',
      'SQL: برای مدیریت پایگاه داده‌های بزرگ و تحلیل داده‌ها',
      'R: برای تحلیل‌های آماری پیشرفته',
    ],
    algorithms: [
      'یادگیری عمیق (Deep Learning): استفاده از شبکه‌های عصبی چندلایه برای تحلیل داده‌های پیچیده',
      'پردازش زبان طبیعی (NLP): برای تحلیل متون بازرگانی و استخراج معانی',
      'یادگیری تقویتی (Reinforcement Learning): برای بهینه‌سازی تصمیم‌گیری در زنجیره تأمین',
      'الگوریتم‌های خوشه‌بندی (Clustering): برای دسته‌بندی مشتریان و محصولات',
      'شبکه‌های کانولوشنی (CNN): برای تحلیل داده‌های سری زمانی و پیش‌بینی روندها',
      'LSTM: برای مدل‌سازی سری‌های زمانی مالی و پیش‌بینی بلندمدت',
    ],
    features: [
      'پیش‌بینی روندهای بازار با دقت بالا (تا 95%)',
      'تحلیل رفتار مشتریان و ارائه پیشنهادات شخصی‌سازی‌شده',
      'بهینه‌سازی زنجیره تأمین با کاهش 30% هدررفت',
      'پشتیبانی از چندزبانگی (فارسی، انگلیسی، عربی)',
      'رابط کاربری مبتنی بر وب با فناوری React',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-vazir">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl p-8 space-y-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-3xl text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              راهنمای نرم‌افزار اوژن تجارت کیان
            </h1>
          </div>
          <button
            onClick={() =>
              toast.success('راهنما با موفقیت ذخیره شد!', {
                position: 'top-right',
                duration: 3000,
                style: {
                  borderRadius: '10px',
                  background: '#fff',
                  color: '#333',
                },
              })
            }
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            ذخیره راهنما
          </button>
        </header>

        {/* بخش‌های آکاردیونی */}
        <div className="space-y-4">
          {/* معرفی شرکت */}
          <div className="border rounded-lg shadow-md">
            <button
              onClick={() => toggleSection('company')}
              className="w-full flex items-center justify-between p-4 text-lg font-medium text-blue-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FaCog className="text-xl" />
                <span>معرفی شرکت اوژن تجارت کیان</span>
              </div>
              {openSections.company ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.company && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">درباره ما</h3>
                    <p className="text-gray-600 dark:text-gray-300">{companyInfo.description}</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">ماموریت</h3>
                    <p className="text-gray-600 dark:text-gray-300">{companyInfo.mission}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* آدرس شرکت */}
          <div className="border rounded-lg shadow-md">
            <button
              onClick={() => toggleSection('address')}
              className="w-full flex items-center justify-between p-4 text-lg font-medium text-blue-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-xl" />
                <span>آدرس شرکت</span>
              </div>
              {openSections.address ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.address && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">دفتر مرکزی</h3>
                  <p className="text-gray-600 dark:text-gray-300">{companyInfo.address}</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    مشاهده در نقشه
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* مدل هوش مصنوعی */}
          <div className="border rounded-lg shadow-md">
            <button
              onClick={() => toggleSection('aiModel')}
              className="w-full flex items-center justify-between p-4 text-l g font-medium text-blue-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FaBrain className="text-xl" />
                <span>مدل هوش مصنوعی اوژن تجارت کیان</span>
              </div>
              {openSections.aiModel ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.aiModel && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">درباره اوژن تجارت کیان</h3>
                    <p className="text-gray-600 dark:text-gray-300">{aiModelInfo.description}</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">ویژگی‌ها</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {aiModelInfo.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* معماری و فناوری‌ها */}
          <div className="border rounded-lg shadow-md">
            <button
              onClick={() => toggleSection('architecture')}
              className="w-full flex items-center justify-between p-4 text-lg font-medium text-blue-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FaCode className="text-xl" />
                <span>معماری و فناوری‌های استفاده‌شده</span>
              </div>
              {openSections.architecture ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openSections.architecture && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">معماری مدل</h3>
                    <p className="text-gray-600 dark:text-gray-300">{aiModelInfo.architecture}</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">زبان‌های برنامه‌نویسی</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {aiModelInfo.languages.map((language, index) => (
                        <li key={index}>{language}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">الگوریتم‌های مدرن</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {aiModelInfo.algorithms.map((algorithm, index) => (
                        <li key={index}>{algorithm}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
