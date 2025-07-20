import React from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // یادت نره ایمپورتش
import { logout } from "../../actions/authActions";
const ProfileDropdown = ({
  showProfile,
  setShowProfile,
  darkMode,
  toggleDarkMode,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  if (!showProfile) return null;

  return (
    <div className="fixed bottom-16 right-4 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-30 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-reverse space-x-2">
          <FaUserCircle className="text-blue-500 dark:text-blue-400 text-2xl flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              کاربر
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              کاربر عادی
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button
          className="w-full flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors space-x-reverse space-x-2"
          onClick={() => navigate("/user/profile")}
        >
          <FaUser className="text-lg" />
          <span className="text-sm">پروفایل</span>
        </button>
        <button
          className="w-full flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors space-x-reverse space-x-2"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <FaSun className="text-lg" />
          ) : (
            <FaMoon className="text-lg" />
          )}
          <span className="text-sm">
            {darkMode ? "حالت روشن" : "حالت تاریک"}
          </span>
        </button>
        <button
          className="w-full flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors space-x-reverse space-x-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm">خروج</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
