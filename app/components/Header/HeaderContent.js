'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { FaWindowClose } from 'react-icons/fa'

export default function HeaderContent({ token, setToken, pathname, admin }) {
  const searchParams = useSearchParams()

  const router = useRouter()

  const handleLogOut = useCallback(() => {
    const confirmLogout = window.confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')
    if (confirmLogout) {
      localStorage.setItem('login', '')
      setToken(false)
      router.push('/?logIn=true')
    }
  }, [])

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

        {token === 'nothing' ? <p>در حال بارگذاری</p> : token && <button onClick={handleLogOut}>خروج</button>}

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
