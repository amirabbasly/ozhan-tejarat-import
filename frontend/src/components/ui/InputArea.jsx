import React from "react";
import { FaPaperPlane, FaMicrophone, FaFilter } from "react-icons/fa";
import VersionSelector from "./VersionSelector";

const InputArea = ({
  isMobile,
  userInput,
  setUserInput,
  handleSendMessage,
  handleKeyPress,
  loading,
  versions,
  selectedVersion,
  setSelectedVersion,
}) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-reverse space-x-2">
          <input
            type="text"
            className="w-full rounded-full px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-0 focus:border-none border-none outline-none text-sm"
            placeholder="سوال خود را تایپ کنید..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 transition-colors"
            disabled={loading}
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-reverse space-x-2 mt-3">
          {!isMobile && (
            <VersionSelector
              versions={versions}
              selectedVersion={selectedVersion}
              onSelectVersion={setSelectedVersion}
            />
          )}
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2.5 transition-colors">
            <FaMicrophone size={16} />
          </button>
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2.5 transition-colors">
            <FaFilter size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;