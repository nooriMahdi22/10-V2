'use client'
import { useEffect, useState } from 'react'
import Blog from './components/Blog/Blog'
import MyHomeInfo from './components/Home/MyHomeInfo'
import { checkToken } from './utils/logFunction'
import 'animate.css'
import GetCourses from './components/courses/GetCourses'

export default function Home() {
  //! start  check log in or no
  const [token, setToken] = useState('nothing')

  useEffect(() => {
    const checkTokenAndSetState = async () => {
      try {
        const logOrNo = await checkToken()
        setToken(logOrNo)
      } catch (error) {
        console.error('Error checking token:', error)

        setToken(false)
      }
    }

    // Use setTimeout if you still want the delay
    setTimeout(checkTokenAndSetState, 100)
  }, [])
  //* finish  check log in or no

  return (
    <div className="  items-center justify-center animate__animated   ">
      <MyHomeInfo token={token} />
      <GetCourses limitNumber="4" />

      <Blog />
      {/* <Slide /> */}
      <div className="">footer</div>
    </div>
  )
}
