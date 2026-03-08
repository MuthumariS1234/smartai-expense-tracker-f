import { Link } from "react-router-dom";

function Sidebar() {

  const email = localStorage.getItem("email");   // get email from login
  const name = localStorage.getItem("name") || "User";

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white p-6 flex flex-col justify-between">

      {/* Logo */}
      <div>
        <h1 className="text-xl font-bold mb-10">
          AI Expense Tracker
        </h1>

        {/* Navigation */}
        <ul className="space-y-4">

          <li className="hover:text-gray-200 dark:hover:text-gray-300 cursor-pointer">
            <Link to="/">Dashboard</Link>
          </li>

          <li className="hover:text-gray-200 dark:hover:text-gray-300 cursor-pointer">
            <Link to="/analytics">Analytics</Link>
          </li>

          <li className="hover:text-gray-200 dark:hover:text-gray-300 cursor-pointer">
            <Link to="/transactions">Transactions</Link>
          </li>

          <li className="hover:text-gray-200 dark:hover:text-gray-300 cursor-pointer">
            <Link to="/chatbot">AI Chatbot</Link>
          </li>

        </ul>
      </div>

      {/* User Info */}
      

    </div>
  );
}

export default Sidebar;