import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import UserControls from "../components/layout/Usercontrols"
import Infobar from "../components/layout/Infobar"
import Settingsbar from "../components/layout/Settingsbar"
import Docker from "../components/layout/Docker"
import RightPanelWrapper from "../components/layout/RightPanelWrapper"
import { getValue } from "../config/runtimeConfig"

import { useDispatch } from "react-redux"
import {
  fetchInfo,
  fetchSubscription,
  getStat,
  fetchNotice,
} from "../redux/slices/userSlice"
import { fetchAccountConfig, checkLogin } from "../redux/slices/passportSlice"

const AppLayout = () => {
  const dispatch = useDispatch()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeRightPanel, setActiveRightPanel] = useState(null)
  const siteName = getValue("siteName", "App")
  const appLogo = getValue("appLogo", "")

  const panelMap = {
    info: { component: Infobar, title: "账户信息" },
    settings: { component: Settingsbar, title: "设置" },
  }

  useEffect(() => {
    if (!sessionStorage.getItem("hasCheckedLogin")) {
      const fetchLoginStatus = async () => {
        try {
          await dispatch(checkLogin()).unwrap()
          sessionStorage.setItem("hasCheckedLogin", "true")
        } catch (error) {
          console.error("登录状态检查失败", error)
        }
      }
      fetchLoginStatus()
    }
  }, [dispatch])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchInfo()).unwrap(),
          dispatch(fetchSubscription()).unwrap(),
          dispatch(getStat()).unwrap(),
          dispatch(fetchNotice()).unwrap(),
          dispatch(fetchAccountConfig()).unwrap(),
        ])
      } catch (error) {
        console.error("数据请求失败", error)
      }
    }
    fetchData()
  }, [dispatch])

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 顶栏（仅小屏） */}
      <Topbar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        activeRightPanel={activeRightPanel}
        setActiveRightPanel={setActiveRightPanel}
      />


      {/* 遮罩层（小屏） */}
      {drawerOpen && (
        <div
          className="fixed z-40 left-0 right-0 top-14 bottom-16 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* 主区域（高度 = 屏幕高度 - 底部高度） */}
      <div className="pt-14 lg:pt-0 h-full flex">
        {/* 左侧栏（大屏） */}
        <aside className="hidden lg:flex lg:flex-col w-auto bg-base-200 border-r border-base-300 justify-between">
          <div>
            <div className="m-4 mb-10 p-5 text-xl font-bold sm:text-2xl lg:text-2xl 2xl:text-3xl flex items-center w-full">
              <span className="mr-2 text-3xl">{appLogo}</span>
              {siteName}
            </div>
            <Sidebar />
          </div>
          <UserControls
            onInfoClick={() => setActiveRightPanel("info")}
            onSettingsClick={() => setActiveRightPanel("settings")}
          />
        </aside>


        {/* 抽屉栏（小屏） */}
        <aside
          className={`fixed top-14 bottom-16 z-50 w-64 transform bg-base-200 border-r rounded-r-lg border-base-300 transition-transform duration-300 shadow-xl lg:hidden ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onLinkClick={() => setDrawerOpen(false)} />
        </aside>

        {/* 中间内容 */}
        <main className="flex-1 min-h-0 bg-base-100 px-4 pt-4  pb-20 lg:pb-0 overflow-y-auto">
          <Outlet />
        </main>





        {/* 右侧抽屉面板 */}
        <RightPanelWrapper
          panelKey={activeRightPanel}
          onClose={() => setActiveRightPanel(null)}
          panelMap={panelMap}
        />
      </div>

      {/* 底部栏 */}
      <div className="fixed bottom-0 left-0 right-0 h-16 z-50 lg:hidden">
        <Docker />
      </div>
    </div>
  )
}

export default AppLayout
