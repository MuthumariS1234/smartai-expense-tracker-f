import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chatbot from "./pages/Chatbot";

function App() {

return (
<Routes>

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<Login />} />

  <Route path="/signup" element={<Signup />} />

  {/* Layout Routes */}
  <Route
    path="/dashboard"
    element={
      <Layout>
        <Dashboard />
      </Layout>
    }
  />

  <Route
    path="/analytics"
    element={
      <Layout>
        <Analytics />
      </Layout>
    }
  />

  <Route
    path="/transactions"
    element={
      <Layout>
        <Transactions />
      </Layout>
    }
  />

  <Route
    path="/chatbot"
    element={
      <Layout>
        <Chatbot />
      </Layout>
    }
  />

</Routes>

);

}

export default App;
