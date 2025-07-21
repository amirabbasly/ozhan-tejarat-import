import React from "react";
import {
  FaRobot,
  FaChevronRight,
  FaChevronLeft,
  FaTimes,
  FaPlus,
  FaSearch,
  FaBook,
  FaCode,
  FaLightbulb,
  FaBrain,
  FaPaintBrush,
  FaMagic,
  FaGithub,
  FaFolderOpen,
  FaLock,
  FaBan,
  FaUserCircle,
} from "react-icons/fa";

const ChatSidebar = ({
  collapsedSidebar,
  toggleSidebar,
  isMobile,
  sidebarOpen,
  setShowProfile,
}) => {
  const navItems = [
    { icon: FaPlus, label: "چت جدید" },
    { icon: FaSearch, label: "جستجوی چت" },
    { icon: FaBook, label: "کتابخانه" },
  ];

  const environments = [
    { icon: FaCode, label: "Gemini" },
    { icon: FaLightbulb, label: "Lama-Pro" },
    { icon: FaBrain, label: "GPT-4O" },
    { icon: FaPaintBrush, label: "o3" },
    { icon: FaMagic, label: "Sora" },
    { icon: FaGithub, label: "Codex" },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out shadow-lg ${
        sidebarOpen
          ? isMobile
            ? "translate-x-0 w-64"
            : collapsedSidebar
            ? "w-16"
            : "w-64"
          : isMobile
          ? "translate-x-full w-64"
          : "w-16"
      } fixed top-0 bottom-0 right-0 z-20 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center mt-4 sm:mt-6 md:mt-12 lg:mt-14 xl:mt-16">
          <FaRobot className="text-blue-600 dark:text-blue-400 text-2xl flex-shrink-0" />
          {(!collapsedSidebar || isMobile) && (
            <span className="mr-2 font-bold text-blue-600 dark:text-blue-400 text-lg">
              هوش مصنوعی اوژن
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 transition-colors"
          >
            {isMobile ? (
              <FaTimes size={20} />
            ) : collapsedSidebar ? (
              <FaChevronLeft size={20} />
            ) : (
              <FaChevronRight size={20} />
            )}
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors ${
              collapsedSidebar && !isMobile
                ? "justify-center"
                : "space-x-reverse space-x-2"
            }`}
          >
            <item.icon className="text-blue-500 dark:text-blue-400 text-lg flex-shrink-0" />
            {(!collapsedSidebar || isMobile) && (
              <span className="text-sm">{item.label}</span>
            )}
          </button>
        ))}
        {(!collapsedSidebar || isMobile) && (
          <>
            <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 uppercase">
              محیط‌ها
            </div>
            {environments.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors ${
                  collapsedSidebar && !isMobile
                    ? "justify-center"
                    : "space-x-reverse space-x-2"
                }`}
              >
                <item.icon className="text-blue-500 dark:text-blue-400 text-lg flex-shrink-0" />
                {(!collapsedSidebar || isMobile) && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            ))}
            <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 uppercase">
              پروژه‌ها
            </div>
            <div
              className={`w-full flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors ${
                collapsedSidebar && !isMobile
                  ? "justify-center"
                  : "space-x-reverse space-x-2"
              }`}
            >
              <FaFolderOpen className="text-blue-500 dark:text-blue-400 text-lg flex-shrink-0" />
              {(!collapsedSidebar || isMobile) && (
                <div className="flex items-center space-x-reverse space-x-1">
                  <span className="text-sm">AHZ</span>
                  <FaLock className="text-gray-400 dark:text-gray-500 text-sm" />
                  <FaBan className="text-gray-400 dark:text-gray-500 text-sm" />
                </div>
              )}
            </div>
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div
          className={`flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
            collapsedSidebar && !isMobile
              ? "justify-center"
              : "space-x-reverse space-x-2"
          }`}
          onClick={() => setShowProfile((prev) => !prev)} // تغییر به toggle
        >
          <FaUserCircle className="text-blue-500 dark:text-blue-400 text-2xl flex-shrink-0" />
          {(!collapsedSidebar || isMobile) && (
            <div className="mr-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                کاربر
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                کاربر عادی
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
