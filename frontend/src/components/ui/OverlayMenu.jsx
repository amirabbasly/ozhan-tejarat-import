import React from "react";
import { FaHome, FaFileAlt, FaChevronDown, FaTimes, FaRobot, FaUser, FaBell, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

const OverlayMenu = ({ showMenu, closeMenu, mobileSubmenu, toggleMobileSubmenu, role }) => {
  return showMenu ? (
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
                    onClick={() => toggleMobileSubmenu("exportDeclarations")}
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
  ) : null;
};

export default OverlayMenu;