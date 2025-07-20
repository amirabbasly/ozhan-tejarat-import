import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const VersionSelector = ({ 
  versions, 
  selectedVersion, 
  onSelectVersion,
  isMobile = false,
  position = "bottom"
}) => {
  const [showVersions, setShowVersions] = useState(false);

  const handleSelectVersion = (v) => {
    onSelectVersion(v);
    setShowVersions(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowVersions(!showVersions)}
        className={`flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          isMobile ? "w-full justify-between" : ""
        }`}
      >
        {selectedVersion}
        {showVersions ? (
          <FaChevronUp className="mr-1 text-xs" />
        ) : (
          <FaChevronDown className="mr-1 text-xs" />
        )}
      </button>
      {showVersions && (
        <ul
          className={`absolute ${
            position === "bottom" ? "right-0 bottom-full mb-2" : "right-0 top-full mt-2"
          } w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 text-sm`}
        >
          {versions.map((v) => (
            <li key={v}>
              <button
                onClick={() => handleSelectVersion(v)}
                className="w-full text-right px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
              >
                {v}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VersionSelector;