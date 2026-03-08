import AIChatbot from "../components/AIchatbot";

function Chatbot() {
  const userId = localStorage.getItem("user_id");

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">AI Expense Chatbot</h1>
      <AIChatbot userId={userId} />
    </div>
  );
}

export default Chatbot;
