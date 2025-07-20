import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdIosShare } from "react-icons/md";
import logo from "../assets/logo.png";

// دستورالعمل نصب برای iOS
const InstallInstructions = () => (
  <div
    dir="rtl"
    className="flex flex-col justify-center items-center h-screen w-full p-4 bg-white"
  >
    <img
      src={logo}
      alt="App Logo"
      className="mb-6 w-24 h-24"
    />
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

  // تشخیص iOS
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIosDevice(isiOS);
  }, []);

  // لیسنر نصب PWA (غیر iOS)
  useEffect(() => {
    if (isIosDevice) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isIosDevice]);

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

  // اگر iOS بود، دستورالعمل نصب iOS نمایش داده شود
  if (isIosDevice) {
    return <InstallInstructions />;
  }

  // در غیر این صورت، دکمه نصب PWA نمایش داده شود
  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Install App
    </button>
  );
};

export default InstallButton;