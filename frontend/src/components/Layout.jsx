import Sidebar from "./sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

return (

<div className="flex h-screen bg-gray-100 dark:bg-gray-900">

  <Sidebar />

  <div className="flex-1 flex flex-col">

    <Navbar />

    <div className="p-6 overflow-y-auto flex-1">

      {children}

    </div>

  </div>

</div>

);

}

export default Layout;
