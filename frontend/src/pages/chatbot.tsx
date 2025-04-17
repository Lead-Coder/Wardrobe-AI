import React, { useState } from "react";
import DashboardLayout from "../components/dashboard";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
    }
    setInput("");
  };

  return (
    <DashboardLayout>
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
      <div className="w-80 bg-white border border-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-purple-600 text-white p-3 font-bold text-center">🧥 Wardrobe Chatbot</div>
        <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-purple-100 text-right ml-auto max-w-[80%]"
                  : "bg-gray-100 text-left mr-auto max-w-[80%]"}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center border-t border-gray-300">
          <input
            className="flex-1 p-2 text-sm outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-purple-500 text-white px-4 my-1 text-sm hover:bg-purple-600"
            onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Chatbot;
