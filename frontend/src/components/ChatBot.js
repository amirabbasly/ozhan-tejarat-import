import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import './Chatbot.css'; // Import the CSS file

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store chat history
  const [userInput, setUserInput] = useState(""); // Store user input
  const [loading, setLoading] = useState(false); // Track loading state

  // Function to handle sending messages
  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent empty messages

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]); // Add user message to chat history
    setUserInput(""); // Clear the input immediately after sending

    setLoading(true); // Set loading state to true while waiting for response

    try {
      const response = await axiosInstance.post("/chatbot/", { message: userInput });
      const botMessage = { sender: "bot", text: response.data.reply };

      // Add bot response to chat history
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error:", error.response ? error.response.data : error.message);
    }

    setLoading(false); // Reset loading state when response is received
  };

  // Function to handle user pressing Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Chat bubble component
  const ChatBubble = ({ sender, text }) => (
    <div className={`chat-bubble ${sender}`}>
      <span>{text}</span>
    </div>
  );

  return (
    <div className="container">
      <h2>هوش مصنوعی اوژن</h2>

      <div className="chatWindow">
        <h2>چطور میتوانم به شما کمک کنم؟</h2>
        {messages.map((msg, index) => (
          <ChatBubble key={index} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <div className="chat-bubble bot">
            <span>Loading...</span>
            <div className="loading-indicator"></div>
          </div>
        )}
      </div>

      <div className="inputContainer">
        <button className="btn-grad" onClick={sendMessage}>
          Send
        </button>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="پیام خود را بنویسید..."
          className="input"
        />
      </div>
    </div>
  );
};

export default Chatbot;
