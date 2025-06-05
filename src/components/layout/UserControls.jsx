import { Settings } from "lucide-react"
import { useSelector } from "react-redux"

const UserControls = ({ onInfoClick, onSettingsClick }) => {
  const info = useSelector((state) => state.user.info)
  const loading = useSelector((state) => state.user.loading.fetchInfo)

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-t border-base-300">
      {/* 头像按钮 or skeleton */}
      {loading ? (
        <div className="skeleton w-10 h-10 rounded-full" />
      ) : (
        <img
          src={info?.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          title="账户信息"
          onClick={onInfoClick}
          className="w-10 h-10 rounded-full border border-base-300 cursor-pointer hover:brightness-110 transition"
        />
      )}

      {/* 邮箱和余额 */}
      <div className="flex flex-col flex-1">
        {loading ? (
          <>
            <div className="skeleton h-4 w-24 mb-1 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </>
        ) : (
          <>
            <span className="text-sm font-bold text-base-content truncate">
              {info?.email}
            </span>
            <span className="text-xs text-muted">
               ¥{(Number(info?.balance ?? 0) / 100).toFixed(2)}
            </span>
          </>
        )}
      </div>

      <button
        onClick={onSettingsClick}
        title="设置"
        className="btn btn-square btn-ghost"
      >
        <Settings className="h-6 w-6" />
      </button>
    </div>
  )
}

export default UserControls
