import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/chatbot/", {
        message: userInput,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "متأسفم، مشکلی پیش آمد." },
      ]);
    }
    setLoading(false);
  };

  return { messages, loading, sendMessage };
};
