'use client'
import { checkAdminOrNo, checkToken } from '@/app/utils/logFunction'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const HeaderContent = dynamic(() => import('./HeaderContent'), { ssr: false })

export default function Header() {
  const [token, setToken] = useState('nothing')
  const [admin, setAdmin] = useState(false)
  const pathname = usePathname()

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

    if (token !== true) {
      if (pathname === '/' || pathname.startsWith('/logIn')) {
        // setToken('nothing')
        setTimeout(checkTokenAndSetState, 500)
      } else {
        setTimeout(checkTokenAndSetState, 500)
      }
    }
  }, [pathname])

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const logOrNo = await checkAdminOrNo()
        console.log('logOrNo', logOrNo)
        setAdmin(logOrNo)
      } catch (error) {
        console.error('Error checking token:', error)

        setAdmin(false)
      }
    }

    // Use setTimeout if you still want the delay

    if (pathname === '/' || pathname.startsWith('/logIn')) {
      // setToken('nothing')
      setTimeout(checkAdmin, 2000)
    } else {
      setTimeout(checkAdmin, 2000)
    }
  }, [pathname])

  return (
    <div className="w-full h-fit bg-gray-900 dark:bg-gray-200  top-0 z-40 ">
      <header className="lg:px-16 px-4 flex flex-wrap items-center py-4 shadow-lg">
        <div className="flex-1 flex justify-between items-center">
          <p className="sm:w-[10rem] xs:w-[7rem] touch-pan-down   text-white">تفکر‌ خلاق</p>
        </div>
        <label htmlFor="menu-toggle" className="pointer-cursor md:hidden block">
          <svg
            className="fill-current text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 20 20"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </label>
        <input className="hidden" type="checkbox" id="menu-toggle" />
        <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
          <HeaderContent token={token} setToken={setToken} pathname={pathname} admin={admin} />
        </div>
      </header>
    </div>
  )
}
