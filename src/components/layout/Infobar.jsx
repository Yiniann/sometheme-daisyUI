import LogoutButton from "../modals/LogoutButton";
import ResetPasswordModal from "../modals/ResetPasswordButton";
import { useSelector } from "react-redux";



const Infobar = () => {
  const info = useSelector((state) => state.user.info);
  const isLoading = useSelector((state)=> state.user.loading)

  if (isLoading.fetchInfo) {
    return (
      <div className="space-y-6 p-4 bg-base-200 rounded-lg max-w-md mx-auto animate-pulse">
        {/* 头像区域骨架 */}
        <div className="flex items-center gap-5">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full bg-base-300" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-20 bg-base-300 rounded" />
            <div className="h-3 w-32 bg-base-300 rounded" />
          </div>
        </div>

        {/* 余额区域骨架 */}
        <div className="w-full h-16 rounded-md bg-base-300" />

        {/* 按钮骨架 */}
        <div className="flex flex-col gap-3">
          <div className="h-10 bg-base-300 rounded" />
          <div className="h-10 bg-base-300 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-base-200 rounded-lg max-w-md mx-auto">
      {/* 用户头像区域 */}
      <div className="flex items-center gap-5">
        <div className="avatar">
          <div className="w-16 h-16 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-4 overflow-hidden">
            <img
              src={info?.avatar_url || "/default-avatar.png"}
              alt="用户头像"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div>
          <div className="font-semibold text-lg text-base-content">您好</div>
          <div className="text-sm text-base-content/70 mt-1">{info?.email || "未绑定邮箱"}</div>
        </div>
      </div>

      {/* 显示余额 */}
      <div className="relative w-full h-16 rounded-md p-4 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md">
        <span className="absolute top-2 left-4 font-semibold text-primary text-sm">
          账户余额
        </span>
        <span className="absolute bottom-2 right-4 font-bold text-primary text-lg">
          {(Number(info?.balance ?? 0) / 100).toFixed(2)} 元
        </span>
      </div>




      {/* 操作按钮 */}
      <div className="flex flex-col gap-3">
        <ResetPasswordModal className="btn btn-outline btn-sm flex items-center justify-center gap-2" />

        <LogoutButton className="btn btn-outline btn-sm flex items-center justify-center gap-2" />
      </div>
    </div>
  );
};

Infobar.title = "用户信息"

export default Infobar;
