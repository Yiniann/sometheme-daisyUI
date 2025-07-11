import { useState, useEffect } from 'react'

const useViewportHeight = () => {
  const [vh, setVh] = useState(document.documentElement.clientHeight * 0.01)

  useEffect(() => {
    const vh = document.documentElement.clientHeight * 0.01
    setVh(vh)
  }, [])

  return vh
}

export default useViewportHeight