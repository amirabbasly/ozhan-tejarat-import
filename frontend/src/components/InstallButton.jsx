import React, { useEffect, useState } from "react";
import { FiShare2, FiPlus } from "react-icons/fi";

const IOSInstallPrompt = () => (
  <div className="p-6 text-center">
    <h2 className="text-lg font-semibold mb-4">
      جهت نصب وب اپلیکیشن مراحل زیر را انجام دهید
    </h2>
    <ol className="text-right list-decimal list-inside space-y-2 text-gray-700">
      <li>
        در نوار پایین روی دکمه <FiShare2 className="inline-block mx-1" /> Share
        بزنید
      </li>
      <li>
        در منوی بازشده، در قسمت پایین، گزینه <strong>Add to Home Screen</strong>{" "}
        را انتخاب کنید
      </li>
      <li>
        در مرحله بعد روی دکمه <FiPlus className="inline-block mx-1" /> Add بزنید
      </li>
    </ol>
  </div>
);

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  // Detect iOS devices
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIosDevice(isiOS);
  }, []);

  // Listen for PWA install prompt on non-iOS
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

  // If iOS, show custom instructions
  if (isIosDevice) {
    return <IOSInstallPrompt />;
  }

  // On other devices, show install button when prompt is available
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
