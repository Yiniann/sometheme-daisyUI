import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, FileText, User, Rss } from "lucide-react";
import Subscriber from "../dashboard/Subscriber"; 

const navItemClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 text-xs h-full w-full rounded-lg ${
    isActive
      ? "bg-neutral text-neutral-content font-semibold"
      : "text-base-content hover:bg-base-200"
  }`;

const Docker = () => {
  const [showSubscriber, setShowSubscriber] = useState(false);

  return (
    <>
      <Subscriber isOpen={showSubscriber} onClose={() => setShowSubscriber(false)} />

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-base-100 border-t border-base-300 flex justify-around items-center h-16 lg:hidden">
        <NavLink to="/" className={navItemClass}>
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard" className={navItemClass}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        {/* 订阅按钮 */}
<button
  onClick={() => setShowSubscriber(true)}
  className="
    cursor-pointer 
    flex flex-col items-center justify-center gap-1 text-xs 
    h-full w-full rounded-lg 
    bg-gradient-to-r from-primary-content via-base to-neutral-content
    font-semibold
    shadow-lg
    transform transition-transform duration-200 hover:scale-105
  "
  aria-label="打开订阅面板"
>
  <Rss className="w-6 h-6" />
  <span>订阅</span>
</button>


        <NavLink to="/ticket" className={navItemClass}>
          <FileText className="w-5 h-5" />
          <span>Ticket</span>
        </NavLink>

        <NavLink to="/profile" className={navItemClass}>
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Docker;
