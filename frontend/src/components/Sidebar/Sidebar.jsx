import { LayoutDashboard, Briefcase, User, X, LogOut } from "lucide-react";
import { SidebarData } from "./Sidebar";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosClient } from "../../axios/axiosClient";
import useAuth from "../../store/useAuthStore";

function Sidebar({ setSideBarDisplay }) {
  const { setAuthUser } = useAuth();

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");

      setAuthUser(null);
      toast.success("Logout successfully");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div
      id="sidebar"
      className="w-56 h-screen fixed z-40 transition ease-in-out delay-150 bg-slate-900 text-white"
    >
      <div
        id="sidebar-header"
        className="flex items-end justify-between p-3 border-b-2 border-gray-800"
      >
        <div id="sidebar-logo-container" className="flex items-center gap-1">
          <div
            id="sidebar-logo"
            className="flex w-fit rounded-lg bg-blue-700 p-1"
          >
            <Briefcase />
          </div>
          <span className="text-lg font-semibold">JobFlow</span>
        </div>
        <span
          id="sidebar-close-btn"
          onClick={() => setSideBarDisplay((prev) => !prev)}
        >
          <button>
            <X size={20} />
          </button>
        </span>
      </div>
      <div className="flex flex-col justify-between h-[92vh]">
        <nav id="sidebar-nav" className="p-3">
          <ul>
            <li className="flex my-4 py-1 px-1 rounded-lg">
              <NavLink
                to={"/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full text-sm rounded-lg p-1 ${isActive ? "bg-blue-600" : ""}`
                }
              >
                <span>
                  <LayoutDashboard />
                </span>
                <span className="align-bottom">Dashboard</span>
              </NavLink>
            </li>
            <li className="flex my-4 py-1 px-1 rounded-lg">
              <NavLink
                to={"/jobs"}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full text-sm rounded-lg p-1 ${isActive ? "bg-blue-600" : ""}`
                }
              >
                <span>
                  <Briefcase />
                </span>
                <span className="align-bottom">Jobs</span>
              </NavLink>
            </li>
            <li className="flex my-4 py-1 px-1 rounded-lg">
              <NavLink
                to={"/profile"}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full text-sm rounded-lg p-1 ${isActive ? "bg-blue-600" : ""}`
                }
              >
                <span>
                  <User />
                </span>
                <span className="align-bottom">Profile</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-2">
          <button
            onClick={() => logout()}
            className="flex w-full bg-blue-700 p-1 rounded-lg"
          >
            <span>
              <LogOut size={20} />
            </span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
