import React, { useState } from "react";
import ChatSidebar from "./ui/ChatSidebar";
import ProfileDropdown from "./ui/ProfileDropdown";
import { useChat } from "../hooks/useChat";
import { useDarkMode } from "../hooks/useDarkMode";
import { useResponsive } from "../hooks/useResponsive";
import { useSidebar } from "../hooks/useSidebar";
import Header from "./ui/ChatHeader";
import OverlayMenu from "./ui/OverlayMenu";
import ChatArea from "./ui/ChatArea";
import InputArea from "./ui/InputArea";

const Chatbot = () => {
  const { isMobile } = useResponsive();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { sidebarOpen, collapsedSidebar, toggleSidebar } = useSidebar(isMobile);
  const [showProfile, setShowProfile] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("Ozhan Ai");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sendMessage } = useChat(selectedVersion);
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
  const versions = ["Ozhan Ai", "Ozhan-O1", "Ozhan-4O", "Ozhan-Co"];
  const role = "admin";

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setLoading(true);

    try {
      const reply = await sendMessage(userInput);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "متأسفم، مشکلی پیش آمد." },
      ]);
    }

    setUserInput("");
    setLoading(false);
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
      <ChatSidebar
        collapsedSidebar={collapsedSidebar}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setShowProfile={setShowProfile}
      />

      <ProfileDropdown
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      <OverlayMenu
        showMenu={showMenu}
        closeMenu={closeMenu}
        mobileSubmenu={mobileSubmenu}
        toggleMobileSubmenu={toggleMobileSubmenu}
        role={role}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsedSidebar && !isMobile ? "mr-16" : "mr-64"
        } ${isMobile ? "mr-0" : ""}`}
      >
        <Header
          isMobile={isMobile}
          setShowMenu={setShowMenu}
          toggleSidebar={toggleSidebar}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          versions={versions}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
        />

        <ChatArea messages={messages} loading={loading} />

        <InputArea
          isMobile={isMobile}
          userInput={userInput}
          setUserInput={setUserInput}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          loading={loading}
          versions={versions}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
        />
      </div>
    </div>
  );
};

export default Chatbot;
