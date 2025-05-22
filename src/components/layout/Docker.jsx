import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, FileText, User, Store } from "lucide-react";

const navItemClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 text-xs h-full w-full rounded-lg ${
    isActive
      ? "bg-accent text-accent-content font-semibold"
      : "text-base-content hover:bg-base-200"
  }`;


const Docker = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-base-100 border-t border-base-300 flex justify-around items-center h-16  lg:hidden">
    <NavLink to="/" className={navItemClass}>
      <Home className="w-5 h-5" />
      <span>Home</span>
    </NavLink>

    <NavLink to="/dashboard" className={navItemClass}>
      <LayoutDashboard className="w-5 h-5" />
      <span>Dashboard</span>
    </NavLink>

    <NavLink to="/plan" className={navItemClass}>
      <Store className="w-5 h-5" />
      <span>Plan</span>
    </NavLink>

    <NavLink to="/ticket" className={navItemClass}>
      <FileText className="w-5 h-5" />
      <span>Ticket</span>
    </NavLink>

    <NavLink to="/profile" className={navItemClass}>
      <User className="w-5 h-5" />
      <span>Profile</span>
    </NavLink>
  </nav>
);

export default Docker;
