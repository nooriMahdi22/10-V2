'use client'
import { useEffect, useState } from 'react'
import Blog from './components/Blog/Blog'
import MyHomeInfo from './components/Home/MyHomeInfo'
import { checkToken } from './utils/logFunction'
import { useSearchParams } from 'next/navigation'
import 'animate.css'
import GetCourses from './components/courses/GetCourses'

export default function Home() {
  //! start  check log in or no
  const [token, setToken] = useState('nothing')
  const searchParams = useSearchParams()

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
    setTimeout(checkTokenAndSetState, 100)
  }, [searchParams.get('logIn')])
  //* finish  check log in or no

  return (
    <div className="  items-center justify-center  ">
      <MyHomeInfo token={token} />

      <Blog />
      <GetCourses />
      {/* <Slide /> */}
    </div>
  )
}
