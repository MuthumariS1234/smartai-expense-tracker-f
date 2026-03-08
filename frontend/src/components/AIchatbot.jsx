import { useState, useRef, useEffect } from "react";
import axios from "axios";

function AIChatbot({ userId }) {

const [message, setMessage] = useState("");
const [chat, setChat] = useState([]);
const chatEndRef = useRef(null);

useEffect(() => {
chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat]);

const sendMessage = async (e) => {

e.preventDefault();

if (!message.trim()) return;

const userMessage = message;

setChat(prev => [
  ...prev,
  { sender: "user", text: userMessage }
]);

setMessage("");

try {

  const res = await axios.post(
    "http://localhost:5000/api/chatbot",
    {
      message: userMessage,
      user_id: userId
    }
  );

  setChat(prev => [
    ...prev,
    { sender: "bot", text: res.data.reply }
  ]);

} catch {

  setChat(prev => [
    ...prev,
    { sender: "bot", text: "Server error" }
  ]);

}

};

return (
<div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl flex flex-col h-[500px]">

  {/* Header */}
  <div className="bg-indigo-600 text-white p-4 font-semibold rounded-t-xl">
    🤖 AI Expense Assistant
  </div>

  {/* Chat messages */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-700">

    {chat.map((msg, index) => (

      <div
        key={index}
        className={`max-w-xs px-4 py-2 rounded-lg text-sm
        ${msg.sender === "user"
          ? "bg-indigo-600 text-white ml-auto"
          : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
        }`}
      >
        {msg.text}
      </div>

    ))}

    <div ref={chatEndRef}></div>

  </div>

  {/* Input */}
  <form
    onSubmit={sendMessage}
    className="flex items-center border-t dark:border-gray-600 p-3 gap-2 bg-white dark:bg-gray-800"
  >

    <input
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      placeholder="Ask about your expenses..."
      className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <button
      type="submit"
      className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
    >
      Send
    </button>

  </form>

</div>


);

}

export default AIChatbot;
