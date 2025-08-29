import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { SearchX } from "lucide-react"

const NotFound = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(7)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/")
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 text-center bg-[url('/background.svg')] bg-repeat"
    >
      <div className="bg-base-100 rounded-xl shadow-md p-10 flex flex-col items-center">
        <SearchX className="mb-6 h-24 w-24 text-base-content/40" />
        <p className="text-4xl font-extrabold text-base-content">404</p>
        <p className="text-2xl font-bold text-base-content mt-2">页面未找到</p>
        <p className="text-base mt-2">
          你访问的页面不存在或已被移除，将在 <span className="font-bold text-primary">{countdown}</span> 秒后自动回到首页。
        </p>
        <p className="text-base mt-2">
          如果不想等待，你也可以
          <button type="button" onClick={() => navigate(-1)} className="link link-primary mx-1">立即返回</button>
          或
          <button type="button" onClick={() => navigate("/")} className="link mx-1">回到首页</button>。
        </p>
      </div>
    </div>
  )
}

export default NotFound
