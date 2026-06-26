import Navbar from "../common/Navbar";
import Sidebar from "../common/SideBar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-bgSoft">

      {/* 🔹 Sidebar */}
      <Sidebar />

      {/* 🔹 Right Section */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  );
}