import React from "react";
import { FaRobot, FaUserCircle } from "react-icons/fa";

const ChatBubble = ({ sender, text }) => (
  <div
    className={`max-w-[70%] my-3 px-4 py-3 rounded-2xl  break-words flex items-start space-x-reverse space-x-3 ${
      sender === "user"
        ? "ml-auto bg-blue-600 text-white"
        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    } shadow-sm transition-all duration-200`}
    dir="rtl"
  >
    {sender === "bot" ? (
      <FaRobot className="text-blue-500 text-xl flex-shrink-0" />
    ) : (
      <FaUserCircle className="text-blue-500 text-xl flex-shrink-0" />
    )}
    <span className="leading-relaxed text-sm">{text}</span>
  </div>
);

export default ChatBubble;
