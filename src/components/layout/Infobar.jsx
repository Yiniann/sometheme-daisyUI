// components/layout/Infobar.jsx
import { Lock } from "lucide-react";
import LogoutButton from "../modals/LogoutButton";

const Infobar = ({ onResetPasswordClick, openLogoutModal }) => {

  
  return (
    <div className="space-y-4">
      

      <div className="text-sm text-base-content/70">
        这里展示一些用户信息，如邮箱、状态等。
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="btn btn-outline btn-sm w-full"
          onClick={onResetPasswordClick}
        >
          <Lock className="w-4 h-4 mr-2" />
          修改密码
        </button>
          <LogoutButton className="w-4 h-4 mr-2" />

      </div>
    </div>
  );
};

export default Infobar;
