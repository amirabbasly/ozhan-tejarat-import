import React from 'react';
import {
  FaCheckCircle,
  FaUndoAlt,
  FaHeadset,
  FaMapMarkerAlt,
  FaShippingFast,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaTelegramPlane,
} from 'react-icons/fa';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import certification1 from '../../assets/logo.png';
import certification2 from '../../assets/logo.png';
import certification3 from '../../assets/logo.png';
import certification4 from '../../assets/logo.png';
import brand1 from '../../assets/enamad.png';
import brand2 from '../../assets/enamad.png';
import brand3 from '../../assets/enamad.png';
import brand4 from '../../assets/enamad.png';
import brand5 from '../../assets/enamad.png';
import brand6 from '../../assets/enamad.png';
import brand7 from '../../assets/enamad.png';
import brand8 from '../../assets/enamad.png';
import brand9 from '../../assets/enamad.png';
import brand10 from '../../assets/enamad.png';
import brand11 from '../../assets/enamad.png';
import brand12 from '../../assets/enamad.png';

const Footer = () => (
  <footer dir="rtl" className="bg-white font-vazir text-gray-800">
    {/* Top Features */}
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
      {[
        { icon: FaCheckCircle, label: 'ضمانت اصل بودن کالا' },
        { icon: FaUndoAlt, label: '۷ روز ضمانت بازگشت کالا' },
        { icon: FaHeadset, label: '۷ روز هفته، ۲۴ ساعته' },
        { icon: FaMapMarkerAlt, label: 'امکان پرداخت در محل' },
        { icon: FaShippingFast, label: 'امکان تحویل اکسپرس' },
      ].map(({ icon: Icon, label }, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <Icon className="text-3xl text-blue-600" />
          <span className="mt-2 text-sm text-blue-700">{label}</span>
        </div>
      ))}
    </div>

    {/* Social & Newsletter */}
    <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="flex flex-col items-center lg:items-start">
        <h4 className="text-lg font-bold mb-4 text-blue-800">همراه ما باشید!</h4>
        <div className="flex space-x-4 rtl:space-x-reverse text-xl text-gray-600">
          <FaInstagram />
          <FaLinkedinIn />
          <FaTwitter />
          <FaTelegramPlane />
        </div>
      </div>
      <div className="col-span-2 flex flex-col items-center lg:items-end">
        <h4 className="text-lg font-bold mb-4 text-blue-800">با ثبت ایمیل از جدیدترین تخفیف‌ها باخبر شوید</h4>
        <div className="flex w-full max-w-md">
          <input
            type="email"
            placeholder="ایمیل شما"
            className="w-full px-4 py-2 border border-blue-300 rounded-l-md focus:outline-none"
          />
          <button className="px-6 bg-blue-600 text-white rounded-r-md">ثبت</button>
        </div>
      </div>
    </div>

    {/* Links Sections */}
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
      <div>
        <h5 className="font-bold mb-4 text-blue-800">راهنمای خرید</h5>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>نحوه ثبت سفارش</li>
          <li>رویه ارسال سفارش</li>
          <li>شیوه‌های پرداخت</li>
          <li>پیگیری سفارش</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-4 text-blue-800">خدمات مشتریان</h5>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>پرسش‌های متداول</li>
          <li>رویه‌های بازگرداندن کالا</li>
          <li>شرایط استفاده</li>
          <li>حریم خصوصی</li>
          <li>گزارش باگ</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-4 text-blue-800">درباره اوژن تجارت کیان</h5>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>اتاق خبر اوژن</li>
          <li>فرصت‌های شغلی</li>
          <li>تماس با ما</li>
          <li>درباره ما</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-4 text-blue-800">راهنمای بیشتر</h5>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>سوالات متداول</li>
          <li>مشاهده بیشتر</li>
        </ul>
      </div>
    </div>

    {/* App Download Bar */}
    <div className="bg-blue-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold">دانلود نرم‌افزار بازرگانی اوژن تجارت کیان</span>
        <div className="flex space-x-4 rtl:space-x-reverse text-2xl">
          <FaApple />
          <FaGooglePlay />
        </div>
      </div>
    </div>

    {/* Certifications */}
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 items-center">
        {[certification1, certification2, certification3, certification4].map((src, idx) => (
          <img key={idx} src={src} alt={`cert${idx}`} className="mx-auto h-16 object-contain" />
        ))}
      </div>
    </div>

    {/* About Text */}
    <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 text-sm text-gray-600">
      <p>
        نرم‌افزار بازرگانی اوژن تجارت کیان ارائه‌دهنده راهکارهای جامع در مدیریت عملیات بازرگانی و زنجیره تأمین.
        <a href="#" className="text-blue-600 mr-2">مشاهده بیشتر</a>
      </p>
    </div>

    {/* Bottom Brands */}
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center">
        {[
          brand1, brand2, brand3, brand4, brand5, brand6,
          brand7, brand8, brand9, brand10, brand11, brand12
        ].map((src, idx) => (
          <img key={idx} src={src} alt={`brand${idx}`} className="mx-auto h-10 object-contain" />
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
