import { Menu, X } from "lucide-react"
import RightPanelToggleButtons from "./RightPanelToggleButtons"
import { getValue } from "../../config/runtimeConfig"

const Topbar = ({ drawerOpen, setDrawerOpen, activeRightPanel, setActiveRightPanel }) => {
  const siteName = getValue("siteName", "App")
  const appLogo = getValue("appLogo", "")

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-neutral text-neutral-content flex items-center px-4 shadow-md lg:hidden">
      <label
        className="btn btn-circle btn-neutral swap swap-rotate mr-2"
        aria-label={drawerOpen ? "关闭菜单" : "打开菜单"}
      >
        <input
          type="checkbox"
          checked={drawerOpen}
          onChange={() => setDrawerOpen(!drawerOpen)}
          aria-hidden="true"
        />

        <Menu className="swap-off w-6 h-6" />
        <X className="swap-on w-6 h-6" />
      </label>
      

      <span className="flex-grow text-center text-lg sm:text-xl font-bold select-none flex items-center justify-center gap-2">
        {appLogo && (appLogo.startsWith("http") || appLogo.endsWith(".png")) ? (
          <img src={appLogo} alt="logo" className="h-6 object-contain" />
        ) : (
          <span className="text-3xl">{appLogo}</span>
        )}
        {siteName}
      </span>

      <RightPanelToggleButtons
        active={activeRightPanel}
        setActive={setActiveRightPanel}
      />
    </header>
  )
}

export default Topbar
