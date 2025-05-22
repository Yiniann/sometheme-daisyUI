import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import { Menu, Settings, IdCard } from "lucide-react"
import Infobar from '../components/layout/Infobar'
import Settingsbar from "../components/layout/Settingsbar" 

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)//sidebar抽屉状态
  const [activeRightPanel, setActiveRightPanel] = useState(null); //右侧栏状态


  return (
    <div className="flex flex-col h-screen">
      {/* 顶栏（小屏显示） */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 w-full bg-primary text-primary-content flex items-center px-4 shadow-md lg:hidden">
        <button
          className="btn btn-square btn-ghost mr-2"
          onClick={() => setDrawerOpen(true)}
          aria-label="打开菜单"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="flex-grow text-center text-xl font-bold select-none text-base-content">
          🚀 Shuttle
        </span>

      </header>


      {/* 抽屉遮罩层（小屏） */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 pt-14 lg:pt-0">
        {/* 左侧导航栏（大屏） */}
        <aside className="hidden lg:flex lg:flex-col w-auto bg-base-200 border-r border-base-300">
          {/* 居中logo */}
          <div className="m-4 mb-10 p-5 text-xl font-bold text-black sm:text-2xl lg:text-2xl 2xl:text-3xl dark:text-white flex  items-center w-full">
            <span className="mr-2 text-3xl">🚀</span> 
            Shuttle
          </div>
          <Sidebar />
        </aside>


        {/* 抽屉导航栏（小屏） */}
        <aside
          className={`fixed top-14 left-0 bottom-0 z-50 w-64 transform bg-base-200 border-r rounded-r-lg border-base-300 transition-transform duration-300 lg:hidden ${
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
         <button
          className="btn btn-ghost btn-sm p-2"
          onClick={() =>
            setActiveRightPanel(activeRightPanel === "info" ? null : "info")
          }
        >
          <IdCard className="w-5 h-5" />
        </button>

        <button
          className="btn btn-ghost btn-sm p-2"
          onClick={() =>
            setActiveRightPanel(activeRightPanel === "settings" ? null : "settings")
          }
        >
          <Settings className="w-5 h-5" />
        </button>
        </aside>

        {/* 右侧抽屉：大屏显示 */}
        {activeRightPanel && (
          <div className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-base-100 border-l border-base-300 shadow-xl hidden lg:block">
            <div className="flex items-center justify-between border-b border-base-300 p-4">
              <h2 className="font-bold text-base">
                {activeRightPanel === "info" ? "用户信息" : "设置"}
              </h2>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setActiveRightPanel(null)}
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              {activeRightPanel === "info" && <Infobar />}
              {activeRightPanel === "settings" && <Settingsbar />}
            </div>
          </div>
        )}

          </div>
      
    </div>
  )
}

export default AppLayout
