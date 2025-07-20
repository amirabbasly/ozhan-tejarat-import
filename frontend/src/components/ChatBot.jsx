// import React, { useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import '../style/Chatbot.css'; // Import the CSS file

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]); // Store chat history
//   const [userInput, setUserInput] = useState(""); // Store user input
//   const [loading, setLoading] = useState(false); // Track loading state

//   // Function to handle sending messages
//   const sendMessage = async () => {
//     if (!userInput.trim()) return; // Prevent empty messages

//     const userMessage = { sender: "user", text: userInput };
//     setMessages((prev) => [...prev, userMessage]); // Add user message to chat history
//     setUserInput(""); // Clear the input immediately after sending

//     setLoading(true); // Set loading state to true while waiting for response

//     try {
//       const response = await axiosInstance.post("/chatbot/", { message: userInput });
//       const botMessage = { sender: "bot", text: response.data.reply };

//       // Add bot response to chat history
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = { sender: "bot", text: "Sorry, something went wrong." };
//       setMessages((prev) => [...prev, errorMessage]);
//       console.error("Error:", error.response ? error.response.data : error.message);
//     }

//     setLoading(false); // Reset loading state when response is received
//   };

//   // Function to handle user pressing Enter
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   // Chat bubble component
//   const ChatBubble = ({ sender, text }) => (
//     <div className={`chat-bubble ${sender}`} style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>
//       <span>{text}</span>
//     </div>
//   );

//   return (
//     <div className="container">
//       <h2>هوش مصنوعی اوژن</h2>

//       <div className="chatWindow">
//         <h2>چطور میتوانم به شما کمک کنم؟</h2>
//         {messages.map((msg, index) => (
//           <ChatBubble key={index} sender={msg.sender} text={msg.text} />
//         ))}
//         {loading && (
//           <div className="chat-bubble bot">
//             <span>Loading...</span>
//             <div className="loading-indicator"></div>
//           </div>
//         )}
//       </div>

//       <div className="inputContainer">
//         <button className="btn-grad1" onClick={sendMessage}>
//           Send
//         </button>
//         <input
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="پیام خود را بنویسید..."
//           className="input"
//         />
//       </div>
//     </div>
//   );
// };

// export default Chatbot;




import React, { useState } from "react";
import { FaBars, FaShareAlt, FaCog, FaUserCircle, FaPaperPlane, FaMicrophone, FaFilter, FaRobot } from "react-icons/fa";
import ChatBubble from "./ui/ChatBubble";
import ChatSidebar from "./ui/ChatSidebar";
import ProfileDropdown from "./ui/ProfileDropdown";
import VersionSelector from "./ui/VersionSelector";
import { useChat } from "../hooks/useChat";
import { useDarkMode } from "../hooks/useDarkMode";
import { useResponsive } from "../hooks/useResponsive";
import { useSidebar } from "../hooks/useSidebar";

const Chatbot = () => {
  const { isMobile } = useResponsive();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { sidebarOpen, collapsedSidebar, toggleSidebar } = useSidebar(isMobile);
  const { messages, loading, sendMessage } = useChat();
  const [showProfile, setShowProfile] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("GPT-4");
  const versions = ["GPT-4", "ChatGPT-Plus", "GPT-4O", "o3"];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(userInput);
  };

  const handleSendMessage = () => {
    sendMessage(userInput);
    setUserInput("");
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`} dir="rtl">
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
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaBars size={20} />
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
              className="w-full rounded-full px-4 py-2.5 border-0 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
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