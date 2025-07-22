import React from "react";
import { FaBars, FaShareAlt, FaCog, FaUserCircle } from "react-icons/fa";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import VersionSelector from "./VersionSelector";

const Header = ({
  isMobile,
  setShowMenu,
  toggleSidebar,
  showProfile,
  setShowProfile,
  versions,
  selectedVersion,
  setSelectedVersion,
}) => {
  return (
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
  );
};

export default Header;