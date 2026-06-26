import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Pill,
  FlaskConical,
  CreditCard,
  Stethoscope,
  UsersRound,
} from "lucide-react";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const menus = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Patients", path: "/admin/patients", icon: Users },
      { name: "Doctors", path: "/admin/doctors", icon: UserCog },
      { name: "Staff", path:"/admin/staff",icon: Users},
      { name: "Visits", path: "/admin/visits", icon: FileText },
      { name: "Medicines", path: "/admin/medicines", icon: Pill },
      { name: "Tests", path: "/admin/tests", icon: FlaskConical },
      { name: "Revenue", path: "/admin/revenue", icon: CreditCard },
    ],

    doctor: [
  { name: "Dashboard",path: "/doctor/dashboard", icon: LayoutDashboard, },
  { name: "Pending Visits", path: "/doctor/patients",  icon: Stethoscope,},
  {name: "Patient History",path: "/doctor/all-patients",icon: Users, },
  ],

    reception: [
      { name: "Dashboard", path: "/reception/dashboard", icon: LayoutDashboard },
      { name: "Patients", path: "/reception/patients", icon: Users },
      { name: "Doctors", path: "/reception/doctors", icon: UserCog },
      { name: "Create Visit", path: "/reception/visits/create", icon: FileText },
      { name: "Billing", path: "/reception/billing", icon: CreditCard },
    ],
  };

  const menuItems = menus[role] || [];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#1f2a30] to-[#2f3e46] text-white p-4 shadow-xl">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-xl  capitalize">{role} Portal</h1>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative
                ${
                  isActive
                    ? "bg-[#17a2b8]/20 text-white"
                    : "text-gray-300 hover:bg-white/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-all
                      ${isActive ? "bg-[#17a2b8]" : "bg-transparent"}`}
                  />

                  {/* Icon */}
                  <Icon size={18} />

                  {/* Label */}
                  <span className="text-sm font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}