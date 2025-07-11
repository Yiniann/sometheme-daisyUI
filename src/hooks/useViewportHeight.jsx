import { useState, useEffect } from 'react'

const useViewportHeight = () => {
  const [vh, setVh] = useState(window.innerHeight * 0.01)

  useEffect(() => {
    const updateVh = () => {
      setVh(window.innerHeight * 0.01)
    }

    window.addEventListener('resize', updateVh)
    window.addEventListener('orientationchange', updateVh)

    // 初始化
    updateVh()

    return () => {
      window.removeEventListener('resize', updateVh)
      window.removeEventListener('orientationchange', updateVh)
    }
  }, [])

  return vh
}

export default useViewportHeight