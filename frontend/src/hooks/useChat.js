// import { useState } from "react";
// import axiosInstance from "../utils/axiosInstance";

// export const useChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async (userInput) => {
//     if (!userInput.trim()) return;

//     setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
//     setLoading(true);

//     try {
//       const { data } = await axiosInstance.post("/chatbot/", {
//         message: userInput,
//       });
//       setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "متأسفم، مشکلی پیش آمد." },
//       ]);
//     }
//     setLoading(false);
//   };

//   return { messages, loading, sendMessage };
// };

import axiosInstance from "../utils/axiosInstance";

export const useChat = (selectedVersion = "Ozhan Ai") => {
  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return null;

    try {
      const apiEndpoint =
        selectedVersion === "Ozhan Ai" ? "/chatbot/" : "/chatbot-o4/";
      const { data } = await axiosInstance.post(apiEndpoint, {
        message: userInput,
      });

      // برای نسخه‌ی معمولی (Ozhan Ai)
      if (selectedVersion === "Ozhan Ai" && data.reply) {
        return data.reply;
      }

      // برای پاسخ‌های ساختار جدید (o4)
      const candidate = data.candidates?.[0];
      const text =
        candidate?.content?.parts?.[0]?.text ?? candidate?.text ?? data.reply;

      return text || "متأسفم، مشکلی پیش آمد.";
    } catch {
      return "متأسفم، مشکلی پیش آمد.";
    }
  };

  return { sendMessage };
};
