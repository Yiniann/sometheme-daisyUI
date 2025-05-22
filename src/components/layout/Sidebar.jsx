// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Send, LayoutDashboard, MessagesSquare, IdCard, Store, ShoppingCart, } from "lucide-react";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-md hover:bg-base-300 w-full ${
    isActive ? "bg-primary text-primary-content font-semibold" : "text-base-content"
  }`;

const Sidebar = ({ onLinkClick }) => {
  return (
    <nav className="flex flex-col p-4 space-y-2 w-full">
      <NavLink to="/home" className={navItemClass} onClick={onLinkClick}>
        <Send className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">首页</span>
      </NavLink>
      <NavLink to="/dashboard" className={navItemClass} onClick={onLinkClick}>
        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Dashboard</span>
      </NavLink>
      <NavLink to="/plan" className={navItemClass} onClick={onLinkClick}>
        <Store className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Plan</span>
      </NavLink>
      <NavLink to="/order" className={navItemClass} onClick={onLinkClick}>
        <ShoppingCart className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Order</span>
      </NavLink>
      <NavLink to="/ticket" className={navItemClass} onClick={onLinkClick}>
        <MessagesSquare className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">工单</span>
      </NavLink>
      <NavLink to="/profile" className={navItemClass} onClick={onLinkClick}>
        <IdCard className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Profile</span>
      </NavLink>

    </nav>
  );
};

export default Sidebar;
