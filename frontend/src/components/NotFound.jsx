// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-6">
      <div className="flex items-center gap-4">
        <FaExclamationTriangle className="text-sky-600 text-6xl" />
        <h1 className="text-5xl font-extrabold text-sky-700">404 - Page Not Found</h1>
      </div>

      <p className="mt-6 text-lg text-gray-600 max-w-xl text-center">
        متأسفیم، صفحه‌ای که به دنبالش هستید وجود ندارد یا ممکن است حذف شده باشد.
        لطفاً به صفحه اصلی نرم‌افزار بازرگانی اوژن بازگردید یا از منو استفاده کنید.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-300 shadow-md"
      >
        <FaArrowLeft />
        بازگشت به خانه
      </Link>

      <footer className="mt-10 text-sm text-gray-400">
        © {new Date().getFullYear()} اوژن تجارت کیان - تمام حقوق محفوظ است.
      </footer>
    </div>
  );
};

export default NotFound;
