'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { CiUser } from 'react-icons/ci'
import { checkAdminOrNo, checkToken } from '@/app/utils/logFunction'

export default function HeaderContent() {
  const searchParams = useSearchParams()

  const [token, setToken] = useState('nothing')
  const [admin, setAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkTokenAndSetState = async () => {
      console.log('checkTokenAndSetState')
      try {
        const logOrNo = await checkToken()
        setToken(logOrNo)
      } catch (error) {
        console.error('Error checking token:', error)
        setToken(false)
      }
    }

    if (token !== true || searchParams.get('logOut')) {
      console.log('checkTokenAndSetState222')
      if (pathname == '/' || pathname.startsWith('/logIn')) {
        // setToken('nothing')
        setTimeout(checkTokenAndSetState, 500)
      } else {
        setTimeout(checkTokenAndSetState, 500)
      }
    }
  }, [searchParams.get('logIn'), pathname])

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const logOrNo = await checkAdminOrNo()
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
  }, [pathname, searchParams.get('logIn')])

  const isActive = useCallback(
    (path) => {
      if (path.startsWith('/logIn')) {
        return pathname === '/logIn' && path.includes(searchParams.get('isSign'))
      }
      return pathname === path
    },
    [pathname, searchParams]
  )

  const headerLinks = [
    { title: 'خانه', path: '/' },
    { title: 'درباره ما', path: '/about' },
    { title: 'دوره ها', path: '/allCourses' },
    { title: 'ورود', path: '/logIn?isSign=false', isLog: token },
    { title: 'ثبت نام', path: '/logIn?isSign=true', isLog: token },
  ]

  const [adminList, setAdminList] = useState(false)
  const [adminListHidden, setAdminListHidden] = useState(true)

  function handleCloseAdminList(params) {
    setAdminList(false)
    setTimeout(() => {
      setAdminListHidden(true)
    }, 500)
  }

  function handleOpenAdminList(params) {
    setAdminList(true)
    setTimeout(() => {
      setAdminListHidden(false)
    }, 100)
  }

  return (
    <nav>
      <ul ul className="md:flex items-center justify-between text-base text-gray-100 dark:text-gray-600 pt-4 md:pt-0">
        {admin == true && (
          <div className="relative" onMouseLeave={handleCloseAdminList}>
            <div
              className={`
            ${adminListHidden && 'hidden'}
            
            ${
              adminList ? 'animate__animated animate__fadeIn ' : 'animate__animated animate__fadeOutUp '
            } bg-gray-700 text-white absolute  mt-14  w-full     z-50 p-4 overflow-hidden rounded-lg `}
            >
              <div className="flex flex-col gap-y-3 justify-center items-center">
                <Link
                  href={'/addCourses'}
                  onClick={handleCloseAdminList}
                  className="bg-[#51657B] rounded-md p-1 py-2 text-sm w-full text-center hover:bg-white hover:text-[#51657B] transition-all duration-300 font-family-medium"
                >
                  اضافه کردن دوره
                </Link>
                <Link
                  onClick={handleCloseAdminList}
                  className="bg-[#51657B] rounded-md p-1 py-2 text-sm w-full text-center hover:bg-white hover:text-[#51657B] transition-all duration-300 font-family-medium"
                  href={'/addCourses/all'}
                >
                  همه‌ی دوره‌ها
                </Link>
                <Link
                  onClick={handleCloseAdminList}
                  className="bg-[#51657B] rounded-md p-1 py-2 text-sm w-full text-center hover:bg-white hover:text-[#51657B] transition-all duration-300 font-family-medium"
                  href={'/allUser'}
                >
                  همه‌ی کاربرها
                </Link>
                <button className="" onClick={handleCloseAdminList}>
                  <FaWindowClose />
                </button>
              </div>
            </div>
            <button
              onClick={handleOpenAdminList}
              className={`md:p-4 py-3 w-48 text-right animate__animated animate__fadeIn   px-0 block  ${
                isActive('addCourses') ? 'text-rose-500' : 'text-block'
              }`}
            >
              ادمین
            </button>
          </div>
        )}

        {headerLinks.map((item, index) => (
          <Link
            className={`md:p-4 py-3 px-0 block ${item.isLog && 'hidden'}  ${
              isActive(item.path) ? 'text-rose-500' : 'text-block'
            }`}
            key={`${index}-${item.path}`}
            href={item.path}
          >
            {item.title}
          </Link>
        ))}

        {token === 'nothing' ? (
          <p>در حال بارگذاری</p>
        ) : (
          token && (
            <div className="relative">
              <Link href={'/userInformation'}>
                <CiUser size={24} />
              </Link>
            </div>
          )
        )}

        {/* //* برای هدر استفاده کن */}
        {/* <div
          className={`
            ${adminListHidden && 'hidden'}
            
            ${
              adminList ? 'animate__animated  animate__fadeInRight ' : 'animate__animated animate__fadeOutRight '
            } bg-blue-700 fixed   right-0 inset-y-0 sm:w-3/12 w-1/3 z-50 p-10 overflow-hidden`}
        >
          <div>hi</div>
          <button
            onClick={() => {
              setAdminList(false)
              setTimeout(() => {
                setAdminListHidden(true)
              }, 500)
            }}
          >
            x
          </button>
        </div> */}
      </ul>
    </nav>
  )
}
