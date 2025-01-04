import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Store chat history
    const [userInput, setUserInput] = useState(""); // Store user input

    // Function to handle sending messages
    const sendMessage = async () => {
        if (!userInput.trim()) return; // Prevent empty messages

        const userMessage = { sender: "user", text: userInput };
        setMessages((prev) => [...prev, userMessage]); // Add user message to chat history

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

        setUserInput(""); // Clear user input
    };

    // Function to handle user pressing Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    // Chat bubble component
    const ChatBubble = ({ sender, text }) => (
<>

        <div
            style={{
                textAlign: sender === "user" ? "right" : "left",
                margin: "10px 0",
            }}
        >
            <span
                style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "12px",
                    background: sender === "user" ? "#007bff" : "#e0e0e0",
                    color: sender === "user" ? "white" : "black",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                }}
            >
                {text}
            </span>
        </div>
</>
    );

    return (
        <div style={styles.container}>
                        <h2>هوش مصنوعی اوژن</h2>

            <div style={styles.chatWindow}>
            <h2>چطور میتوانم به شما کمک کنم؟</h2>
                {messages.map((msg, index) => (
                    <ChatBubble key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="پیام خود را بنویسید..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.button}>
                    Send
                </button>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    chatWindow: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        height: "400px",
        overflowY: "auto",
        background: "#f9f9f9",
    },
    inputContainer: {
        display: "flex",
        marginTop: "10px",
    },
    input: {
        flex: "1",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginRight: "10px",
    },
    button: {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        background: "#007bff",
        color: "white",
        cursor: "pointer",
    },
};

export default Chatbot;
