import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import { Menu } from "lucide-react"
import Infobar from '../components/layout/Infobar'
import Settingsbar from "../components/layout/Settingsbar" 
import Docker from "../components/layout/Docker"
import RightPanelWrapper from "../components/layout/RightPanelWrapper";
import RightPanelToggleButtons from "../components/layout/RightPanelToggleButtons";
import { getValue } from "../config/runtimeConfig"

import { useDispatch} from "react-redux";
import {
  fetchInfo,
  fetchSubscription,
  getStat,
  fetchNotice,
} from "../redux/slices/userSlice";
import { fetchAccountConfig, checkLogin } from "../redux/slices/passportSlice";

const AppLayout = () => {
  const dispatch = useDispatch()
  const [drawerOpen, setDrawerOpen] = useState(false)//sidebar抽屉状态
  const [activeRightPanel, setActiveRightPanel] = useState(null); //右侧栏状态
  const siteName = getValue("siteName", "App")
  const appLogo = getValue("appLogo","")
  
  //右侧panel标题
  const panelMap = {
      info: {
        component: Infobar,
        title: "账户信息",
      },
      settings: {
        component: Settingsbar,
        title: "设置",
      },
    };


   useEffect(() => {
    // 只有在首次进入应用且没有检查过登录状态时才触发 checkLogin
    if (!sessionStorage.getItem("hasCheckedLogin")) {
      const fetchLoginStatus = async () => {
        try {
          await dispatch(checkLogin()).unwrap();
          sessionStorage.setItem("hasCheckedLogin", "true");
        } catch (error) {
          console.error("登录状态检查失败", error);
        }
      };
      fetchLoginStatus();
    }
  }, [dispatch]);

  //获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchInfo()).unwrap(),
          dispatch(fetchSubscription()).unwrap(),
          dispatch(getStat()).unwrap(),
          dispatch(fetchNotice()).unwrap(),
          dispatch(fetchAccountConfig()).unwrap(),
        ]);
      } catch (error) {
        console.error("数据请求失败", error);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen">
      {/* 顶栏（小屏显示） */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 w-full bg-neutral text-neutral-content flex items-center px-4 shadow-md lg:hidden">
        {/* 左侧菜单按钮 */}
        <button
          className="btn btn-square btn-ghost mr-2"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="打开菜单"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 中间 LOGO */}
        <span className="flex-grow text-center text-xl font-bold select-none">
          {appLogo} {siteName}
        </span>

        <RightPanelToggleButtons
          active={activeRightPanel}
          setActive={setActiveRightPanel}
        />
      </header>



      {/* 抽屉遮罩层（小屏） */}
      {drawerOpen && (
        <div
          className="fixed z-40 left-0 right-0 top-14 bottom-16 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 pt-14 lg:pt-0">
        {/* 左侧导航栏（大屏） */}
        <aside className="hidden lg:flex lg:flex-col w-auto bg-base-200 border-r border-base-300">
          {/* 居中logo */}
          <div className="m-4 mb-10 p-5 text-xl font-bold  sm:text-2xl lg:text-2xl 2xl:text-3xl flex  items-center w-full">
            <span className="mr-2 text-3xl">{appLogo}</span> 
            {siteName}
          </div>
          <Sidebar />
        </aside>


        {/* 抽屉导航栏（小屏） */}
        <aside
          className={`fixed top-14 left-0 bottom-16 lg:top-0 lg:bottom-0 z-50 w-64 transform bg-base-200 border-r rounded-r-lg border-base-300 transition-transform duration-300 shadow-xl lg:hidden ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!drawerOpen}
        >
          <Sidebar onLinkClick={() => setDrawerOpen(false)} />
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 overflow-auto bg-base-100 px-4 pt-4">
          <Outlet />
        </main>

        {/* 右侧栏（仅大屏显示） */}
        <aside className="hidden lg:flex flex-col items-center w-16 bg-base-200 border-l border-base-300 py-4 space-y-4">
          <RightPanelToggleButtons
            active={activeRightPanel}
            setActive={setActiveRightPanel}
          />
        </aside>


        {/* 右侧抽屉组件 */}
     <RightPanelWrapper
        panelKey={activeRightPanel}
        onClose={() => setActiveRightPanel(null)}
        panelMap={panelMap}
      />



      
      </div>
    <Docker />
    </div>
  
  )
}

export default AppLayout
