import React, { useState } from "react";
import {
  FaBars,
  FaShareAlt,
  FaCog,
  FaUserCircle,
  FaPaperPlane,
  FaMicrophone,
  FaFilter,
  FaRobot,
  FaHome,
  FaFileAlt,
  FaChevronDown,
  FaTimes,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ChatBubble from "./ui/ChatBubble";
import ChatSidebar from "./ui/ChatSidebar";
import ProfileDropdown from "./ui/ProfileDropdown";
import VersionSelector from "./ui/VersionSelector";
import { useChat } from "../hooks/useChat";
import { useDarkMode } from "../hooks/useDarkMode";
import { useResponsive } from "../hooks/useResponsive";
import { useSidebar } from "../hooks/useSidebar";
import { TbLayoutSidebarFilled } from "react-icons/tb";
const Chatbot = () => {
  const { isMobile } = useResponsive();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { sidebarOpen, collapsedSidebar, toggleSidebar } = useSidebar(isMobile);
  const { messages, loading, sendMessage } = useChat();
  const [showProfile, setShowProfile] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("Gemini");
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState({
    asnad: false,
    receiveOrder: false,
    declarations: false,
    exportDeclarations: false,
    checks: false,
    representations: false,
    issueDocuments: false,
    parties: false,
    tanzimat: false,
  });
  const versions = ["Gemini", "ChatGPT-Plus", "GPT-4O", "GPT-4"];
  const role = "admin"; // Assuming admin role for conditional rendering

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(userInput);
      setUserInput("");
    }
  };

  const handleSendMessage = () => {
    sendMessage(userInput);
    setUserInput("");
  };

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const closeMenu = () => {
    setShowMenu(false);
    setMobileSubmenu({
      asnad: false,
      receiveOrder: false,
      declarations: false,
      exportDeclarations: false,
      checks: false,
      representations: false,
      issueDocuments: false,
      parties: false,
      tanzimat: false,
    });
  };

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
      dir="rtl"
    >
      {/* Sidebar */}
      <ChatSidebar
        collapsedSidebar={collapsedSidebar}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setShowProfile={setShowProfile}
      />

      {/* Profile Dropdown */}
      <ProfileDropdown
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="overlay-menu fixed inset-0 bg-black bg-opacity-60 flex justify-end z-50 transition-opacity duration-300 ease-in-out font-vazir">
          <div className="bg-white w-full sm:w-80 h-full shadow-2xl p-6 flex flex-col gap-4">
            <button
              className="close-overlay self-end text-gray-600 text-2xl sm:text-3xl hover:text-red-500 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-colors duration-200"
              onClick={closeMenu}
            >
              <FaTimes />
            </button>

            <ul className="overlay-navbar flex flex-col gap-2">
              <li>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaHome className="text-blue-500" />
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <button
                  onClick={() => toggleMobileSubmenu("asnad")}
                  className="flex items-center justify-between w-full text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-blue-500" />
                    اسناد
                  </div>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      mobileSubmenu.asnad ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSubmenu.asnad && (
                  <ul className="flex flex-col gap-2 pr-4">
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("receive-order")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        ثبت سفارش ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu["receive-order"] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu["receive-order"] && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-order"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد ثبت سفارش
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/reged-orders"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست ثبت سفارش ها
                            </Link>
                          </li>
                          {role === "admin" && (
                            <li>
                              <Link
                                to="/import-prf"
                                onClick={closeMenu}
                                className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                              >
                                دریافت از سامانه
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        personally
                        onClick={() => toggleMobileSubmenu("declarations")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        اظهارنامه ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.declarations ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.declarations && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/expense-list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست هزینه ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/cottages"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اظهارنامه ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/cottage-goods-list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست کلی کالا ها
                            </Link>
                          </li>
                          {role === "admin" && (
                            <li>
                              <Link
                                to="/decl"
                                onClick={closeMenu}
                                className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                              >
                                دریافت از سامانه
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          toggleMobileSubmenu("exportDeclarations")
                        }
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        اظهارنامه های صادراتی
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.exportDeclarations ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.exportDeclarations && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-export"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد اظهارنمه
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/export-cottages"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اظهارنامه ها
                            </Link>
                          </li>
                          {role === "admin" && (
                            <li>
                              <Link
                                to="/export-decl"
                                onClick={closeMenu}
                                className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                              >
                                دریافت از سامانه
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("checks")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        چک ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.checks ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.checks && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-check"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد چک جدید
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/checks"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست چک ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/check-from-excel"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ورود چک
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("representations")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        وکالت نامه ها
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.representations ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.representations && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/add-representation"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد وکالتنامه
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/representations"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست وکالتنامه ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/rep-from-excel"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ورود وکالتنامه
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("issueDocuments")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        صدور اسناد
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.issueDocuments ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.issueDocuments && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/invoices/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد اینوویس/پکینگ/گواهی مبدا
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/invoices/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اینوویس/پکینگ/گواهی مبدا
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/proforma-invoices/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد پروفورما
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/proforma-invoices/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست پروفورما
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        onClick={() => toggleMobileSubmenu("parties")}
                        className="flex items-center justify-between w-full text-base bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                      >
                        طرفین
                        <FaChevronDown
                          className={`transition-transform duration-200 ${
                            mobileSubmenu.parties ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSubmenu.parties && (
                        <ul className="flex flex-col gap-1 pr-4">
                          <li>
                            <Link
                              to="/sellers/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد فروشنده
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/sellers/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست فروشنده ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/buyers/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد خریدار
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/buyers/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست خریدار ها
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/customers/new"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              ایجاد شخص جدید
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/customers/list"
                              onClick={closeMenu}
                              className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                            >
                              لیست اشخاص
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={() => toggleMobileSubmenu("tanzimat")}
                  className="flex items-center justify-between w-full text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <FaCog className="text-blue-500" />
                    گمرکی
                  </div>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      mobileSubmenu.tanzimat ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSubmenu.tanzimat && (
                  <ul className="flex flex-col gap-1 pr-4">
                    <li>
                      <Link
                        to="/hscode-list"
                        onClick={closeMenu}
                        className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                      >
                        جدول تعرفه ها
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/hscode-inf"
                        onClick={closeMenu}
                        className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                      >
                        لیست تعرفه ها
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tariff-calculator"
                        onClick={closeMenu}
                        className="block text-base text-gray-600 px-3 py-1 hover:bg-gray-200 rounded-md"
                      >
                        محاسبه گمرکی
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  to="/chatbot"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaRobot className="text-blue-500" />
                  مشاور هوش مصنوعی
                </Link>
              </li>
              <li>
                <Link
                  to="/user/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaUser className="text-blue-500" />
                  کاربر
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-lg sm:text-xl bg-blue-50 text-blue-600 px-4 py-2 rounded-lg duration-200 hover:text-blue-700 focus:text-blue-700"
                >
                  <FaBell className="text-blue-500" />
                  اعلان‌ها
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsedSidebar && !isMobile ? "mr-16" : "mr-64"
        } ${isMobile ? "mr-0" : ""}`}
      >
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto flex-wrap gap-2 md:pl-12 sm:pl-8 pl-4">
            <div className="flex items-center space-x-reverse space-x-3">
              <button
                onClick={() => setShowMenu(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaBars size={20} />
              </button>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <TbLayoutSidebarFilled size={20} />
              </button>
              {isMobile && (
                <VersionSelector
                  versions={versions}
                  selectedVersion={selectedVersion}
                  onSelectVersion={setSelectedVersion}
                  isMobile={true}
                  position="top"
                />
              )}
            </div>
            <div className="flex-1 flex justify-center lg:justify-start relative"></div>
            <div className="flex items-center space-x-reverse space-x-6 sm:space-x-4">
              <FaShareAlt className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" />
              <FaCog className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" />
              <div
                className="relative cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              >
                <FaUserCircle className="text-blue-500 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
        </header>

        {/* Chat container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 mt-16">
          <div className="max-w-3xl mx-auto">
            {messages.map((m, i) => (
              <ChatBubble key={i} sender={m.sender} text={m.text} />
            ))}
            {loading && (
              <div
                className="max-w-[70%] my-3 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center space-x-reverse space-x-3 animate-pulse shadow-sm"
                dir="rtl"
              >
                <FaRobot className="text-blue-500 text-xl flex-shrink-0" />
                <span className="text-sm">در حال بارگذاری...</span>
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10 px-4">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <input
              type="text"
              className="w-full rounded-full px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-0 focus:border-none border-none outline-none text-sm"
              placeholder="سوال خود را تایپ کنید..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-reverse space-x-2">
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 transition-colors"
                >
                  <FaPaperPlane size={16} />
                </button>
                {!isMobile && (
                  <VersionSelector
                    versions={versions}
                    selectedVersion={selectedVersion}
                    onSelectVersion={setSelectedVersion}
                  />
                )}
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2.5 transition-colors">
                  <FaMicrophone size={16} />
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2.5 transition-colors">
                  <FaFilter size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
