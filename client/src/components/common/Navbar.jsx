import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out");
    navigate("/");
  };

  return (
    <div className="bg-[#343a40] text-white px-6 py-3 flex justify-between items-center shadow-md relative">

      {/* 🔹 LEFT → Logo + Name */}
      <div className="flex items-center gap-2">
       <img
  src="/favicon.jpg"
  alt="Hospital Logo"
  className="w-8 h-8"
/>
        <h1 className="text-lg font-semibold tracking-wide">
          MediCare Hospital
        </h1>
      </div>

      {/* 🔹 RIGHT → Profile */}
      <div className="relative">
        
        {/* Profile Icon */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:text-teal-400"
        >
          <MdAccountCircle size={28} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-lg shadow-lg py-2">

            {/* User Info */}
            <div className="px-4 py-2 text-sm border-b text-gray-600">
              {user?.username} ({user?.role})
            </div>

            {/* Change Password */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/change-password");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Change Password
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </div>
  );
}