import { toast } from "sonner"
import LogoutButton from "../modals/LogoutButton";
import ResetPasswordModal from "../modals/ResetPasswordButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateUserSettings } from "../../redux/slices/userSlice";



const Infobar = () => {
  const info = useSelector((state) => state.user.info);
  const isLoading = useSelector((state)=> state.user.loading)
  const dispatch = useDispatch();
  const [remindExpire, setRemindExpire] = useState(false);
  const [remindTraffic, setRemindTraffic] = useState(false);

  useEffect(() => {
    if (info) {
      setRemindExpire(Boolean(info.remind_expire));
      setRemindTraffic(Boolean(info.remind_traffic));
    }
  }, [info]);

  const handleToggleExpire = () => {
    const newValue = remindExpire ? 0 : 1;
    dispatch(updateUserSettings({ remind_expire: newValue }));
    setRemindExpire(!remindExpire);
    toast.success(`到期提醒已${newValue ? "开启" : "关闭"}`);
  };

  const handleToggleTraffic = () => {
    const newValue = remindTraffic ? 0 : 1;
    dispatch(updateUserSettings({ remind_traffic: newValue }));
    setRemindTraffic(!remindTraffic);
    toast.success(`流量提醒已${newValue ? "开启" : "关闭"}`);
  };

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
    <div className="flex flex-col h-full p-2 bg-base-200 rounded-lg max-w-md mx-auto">
      {/* 顶部滚动内容 */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* 用户头像区域 */}
        <div className="flex p-2 items-center gap-5">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-4 overflow-hidden">                <img
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

        {/* 账户余额 */}
        <div className="relative w-full h-16 rounded-md p-4 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md">
          <span className="absolute top-2 left-4 font-semibold text-primary text-sm">
            账户余额
          </span>
          <span className="absolute bottom-2 right-4 font-bold text-primary text-lg">
            {(Number(info?.balance ?? 0) / 100).toFixed(2)} 元
          </span>
        </div>

        {/* 设置提醒选项 */}
        <div className="flex flex-col gap-2">
          <label className="label cursor-pointer justify-between">
            <span className="label-text text-sm">订阅到期邮件提醒</span>
            <input
              type="checkbox"
              className="toggle"
              checked={remindExpire}
              onChange={handleToggleExpire}
            />
          </label>
          <label className="label cursor-pointer justify-between">
            <span className="label-text text-sm">流量余量邮件提醒</span>
            <input
              type="checkbox"
              className="toggle"
              checked={remindTraffic}
              onChange={handleToggleTraffic}
            />
          </label>
        </div>
      </div>

      {/* 固定底部操作按钮 */}
      <div className="mt-4 py-5 flex flex-col gap-3">
        <ResetPasswordModal className="btn btn-outline btn-sm flex items-center justify-center gap-2" />
        <LogoutButton className="btn btn-outline btn-sm flex items-center justify-center gap-2" />
      </div>
    </div>
  );
};

Infobar.title = "用户信息"

export default Infobar;