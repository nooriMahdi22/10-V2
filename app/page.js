'use client'
import { useEffect, useState } from 'react'
import Blog from './components/Blog/Blog'
import MyHomeInfo from './components/Home/MyHomeInfo'
import { checkToken } from './utils/logFunction'
import 'animate.css'
import GetCourses from './components/courses/GetCourses'
import Comment from './components/comment/Comment'
import dynamic from 'next/dynamic'

export default function Home() {
  // for map location
  const DynamicMap = dynamic(async () => await import('./components/MapLoaction/Map.jsx'), {
    ssr: false,
  })

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

      {token == true && <Comment />}
      <div className="grid grid-cols-2">
        footer
        <div className="p-10">
          <div className="relative">
            <DynamicMap
              // if you want to use neshan you can use this
              linkMap="https://neshan.org/maps/places/bf0ce0389824120c711bc13eae59011d#c32.478-51.782-20z-0p"
              witchMap="neshan"
              locationClient={[32.47787927101944, 51.7815195778292]}
              zoomClient={16}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
