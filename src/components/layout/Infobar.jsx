// components/layout/Infobar.jsx
import { useDispatch } from "react-redux";
import { LogOut, Lock } from "lucide-react";
import {logout} from '../../redux/slices/passportSlice'

const Infobar = ({ onResetPasswordClick, openLogoutModal }) => {
  const dispatch = useDispatch();
  
   const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <div className="space-y-4">
      <div className="text-lg font-bold">账户信息</div>

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

        <button
          className="btn btn-error btn-sm w-full text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Infobar;
