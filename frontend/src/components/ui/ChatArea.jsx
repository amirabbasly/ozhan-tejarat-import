import React from "react";
import { FaRobot } from "react-icons/fa";
import ChatBubble from "./ChatBubble";

const ChatArea = ({ messages, loading }) => {
  return (
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
  );
};

export default ChatArea;