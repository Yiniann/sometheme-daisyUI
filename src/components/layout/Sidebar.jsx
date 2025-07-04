// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Send, LayoutDashboard, MessagesSquare,  Store, ShoppingCart, BookOpen,Wallet } from "lucide-react";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-md hover:bg-neutral/30 w-full ${
    isActive ? "bg-neutral text-neutral-content font-semibold " : "text-base-content"
  }`;

const Sidebar = ({ onLinkClick }) => {
  return (
    <nav className="flex flex-col p-4 space-y-2 w-full">
      <NavLink to="/home" className={navItemClass} onClick={onLinkClick}>
        <Send className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Home</span>
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
        <span className="truncate">Ticket</span>
      </NavLink>
       <NavLink to="/knowledge" className={navItemClass} onClick={onLinkClick}>
        <BookOpen className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Knowledge</span>
      </NavLink>
      <NavLink to="/wallet" className={navItemClass} onClick={onLinkClick}>
        <Wallet className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Wallet</span>
      </NavLink>

    </nav>
  );
};

export default Sidebar;
