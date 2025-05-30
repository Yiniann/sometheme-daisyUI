import { Outlet } from "react-router-dom";
import { getValue } from "../config/runtimeConfig";

const LoginLayout = () => {
  const loginPageImage = getValue("loginPageImage","")
  return (
    <div className="relative min-h-screen w-full">
  {/* 背景图：全屏显示 */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${loginPageImage})` }}
  />

  {/* 登录框区域 */}
  <div className="relative z-10 flex min-h-screen">
    <div className="w-full  lg:w-[550px] backdrop-blur-sm  rounded-none lg:rounded-xl shadow-xl">
      <Outlet />
    </div>
  </div>
</div>

  );
};

export default LoginLayout;
