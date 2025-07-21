// import React, { useEffect, useState } from "react";
// import { FiPlus } from "react-icons/fi";
// import { MdDownload, MdIosShare } from "react-icons/md";
// import logo from "../assets/logo.png";
// import { useLocation } from "react-router-dom"; // 👈 اضافه شده برای بررسی مسیر

// // دستورالعمل نصب برای iOS
// const InstallInstructions = () => (
//   <div
//     dir="rtl"
//     className="flex flex-col justify-center items-center h-screen w-full p-4 bg-white"
//   >
//     <img src={logo} alt="App Logo" className="mb-6 w-24 h-24" />
//     <h2 className="text-xl font-bold mb-4 text-gray-800">
//       جهت نصب وب اپلیکیشن مراحل زیر را انجام دهید
//     </h2>
//     <ol className="w-full max-w-md text-right space-y-4 text-gray-700 text-base leading-relaxed">
//       <li className="flex items-center">
//         <span className="flex-none">1-</span>
//         <span className="flex-1">
//           در نوار پایینی روی دکمه{" "}
//           <MdIosShare className="inline-block mx-1 text-xl" /> Share ضربه بزنید
//         </span>
//       </li>
//       <li className="flex items-center">
//         <span className="flex-none">2-</span>
//         <span className="flex-1">
//           در منوی بازشده، گزینه <strong>Add to Home Screen</strong> را انتخاب
//           کنید
//         </span>
//       </li>
//       <li className="flex items-center">
//         <span className="flex-none">3-</span>
//         <span className="flex-1">
//           در مرحله بعد روی دکمه <FiPlus className="inline-block mx-1 text-xl" />{" "}
//           Add ضربه بزنید
//         </span>
//       </li>
//     </ol>
//   </div>
// );

// // کامپوننت اصلی که شرط iOS را بررسی می‌کند
// const InstallButton = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showButton, setShowButton] = useState(false);
//   const [isIosDevice, setIsIosDevice] = useState(false);
//   const [isInstalled, setIsInstalled] = useState(false);
//   const location = useLocation(); // 👈 برای گرفتن مسیر فعلی

//   // تشخیص iOS
//   useEffect(() => {
//     const ua = window.navigator.userAgent;
//     const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
//     setIsIosDevice(isiOS);
//   }, []);

//   // تشخیص نصب بودن PWA
//   useEffect(() => {
//     const checkInstalled =
//       window.matchMedia("(display-mode: standalone)").matches ||
//       window.navigator.standalone === true;
//     setIsInstalled(checkInstalled);
//   }, []);

//   // لیسنر نصب PWA (غیر iOS)
//   useEffect(() => {
//     if (isIosDevice || isInstalled) return;
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowButton(true);
//     };
//     window.addEventListener("beforeinstallprompt", handler);
//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, [isIosDevice, isInstalled]);

//   // هندل کلیک روی دکمه نصب
//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const choice = await deferredPrompt.userChoice;
//     console.log(
//       choice.outcome === "accepted"
//         ? "User accepted the install prompt."
//         : "User dismissed the install prompt."
//     );
//     setDeferredPrompt(null);
//     setShowButton(false);
//   };

//   // نمایش فقط در مسیر /login و در صورتی که PWA نصب نیست
//   if (location.pathname !== "/login" || isInstalled) return null;

//   if (isIosDevice) {
//     return <InstallInstructions />;
//   }

//   if (!showButton) return null;

//   return (
//     <div className="flex items-center space-x-2">
//       <button
//         onClick={handleInstallClick}
//         className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//       >
//         <MdDownload className="text-xl" />
//         <span>نصب وب‌اپلیکیشن</span>
//       </button>
//     </div>
//   );
// };

// export default InstallButton;




import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdDownload, MdIosShare } from "react-icons/md";
import logo from "../assets/logo.png";
import { useLocation } from "react-router-dom"; // برای بررسی مسیر

// دستورالعمل نصب برای iOS
const InstallInstructions = () => (
  <div className="flex flex-col justify-center items-center p-6 bg-white rounded-lg">
    <img src={logo} alt="App Logo" className="mb-6 w-24 h-24" />
    <h2 className="text-xl font-bold mb-4 text-gray-800">
      جهت نصب وب اپلیکیشن مراحل زیر را انجام دهید
    </h2>
    <ol className="w-full max-w-md text-right space-y-4 text-gray-700 text-base leading-relaxed">
      <li className="flex items-center">
        <span className="flex-none">1-</span>
        <span className="flex-1">
          در نوار پایینی روی دکمه <MdIosShare className="inline-block mx-1 text-xl" /> Share ضربه بزنید
        </span>
      </li>
      <li className="flex items-center">
        <span className="flex-none">2-</span>
        <span className="flex-1">
          در منوی بازشده، گزینه <strong>Add to Home Screen</strong> را انتخاب کنید
        </span>
      </li>
      <li className="flex items-center">
        <span className="flex-none">3-</span>
        <span className="flex-1">
          در مرحله بعد روی دکمه <FiPlus className="inline-block mx-1 text-xl" /> Add ضربه بزنید
        </span>
      </li>
    </ol>
  </div>
);

// کامپوننت اصلی که شرط iOS را بررسی می‌کند
const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosModal, setShowIosModal] = useState(true); // کنترل نمایش مودال iOS
  const location = useLocation(); // برای گرفتن مسیر فعلی

  // تشخیص iOS
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIosDevice(isiOS);
  }, []);

  // تشخیص نصب بودن PWA
  useEffect(() => {
    const checkInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(checkInstalled);
  }, []);

  // لیسنر نصب PWA (غیر iOS)
  useEffect(() => {
    if (isIosDevice || isInstalled) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isIosDevice, isInstalled]);

  // هندل کلیک روی دکمه نصب
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log(
      choice.outcome === "accepted"
        ? "User accepted the install prompt."
        : "User dismissed the install prompt."
    );
    setDeferredPrompt(null);
    setShowButton(false);
  };

  // اگر مسیر /login نباشد یا اپ نصب باشد، هیچ چیزی نمایش نده
  if (location.pathname !== "/login" || isInstalled) return null;

  // برای iOS: نمایش مودال
  if (isIosDevice) {
    return showIosModal ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl max-w-md w-full relative">
          <button
            onClick={() => setShowIosModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <InstallInstructions />
        </div>
      </div>
    ) : null;
  }

  // برای اندروید/وب: دکمه نصب
  if (!showButton) return null;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MdDownload className="text-xl" />
        <span>نصب وب‌اپلیکیشن</span>
      </button>
    </div>
  );
};

export default InstallButton;
