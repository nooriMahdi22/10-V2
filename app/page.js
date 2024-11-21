'use client'
import { useEffect, useState } from 'react'
import Blog from './components/Blog/Blog'
import MyHomeInfo from './components/Home/MyHomeInfo'
import { checkToken } from './utils/logFunction'

export default function Home() {
  //! start  check log in or no
  const [token, setToken] = useState('nothing')
  useEffect(() => {
    const checkTokenAndSetState = async () => {
      try {
        const logOrNo = await checkToken()
        console.log('logOrNo', logOrNo)
        setToken(logOrNo)
      } catch (error) {
        console.error('Error checking token:', error)

        setToken(false)
      }
    }

    // Use setTimeout if you still want the delay
    setTimeout(checkTokenAndSetState, 1000)
  }, [])
  //* finish  check log in or no

  //!start for log out
  function handleLogOut() {
    const confirmLogout = window.confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')

    if (confirmLogout) {
      localStorage.setItem('login', '')
      setToken(false)
    }
  }
  //* finish for log out
  return (
    <div className="bg-stone-200   items-center justify-center  ">
      <MyHomeInfo token={token} />

      <Blog />
      {/* <Slide /> */}
    </div>
  )
}
