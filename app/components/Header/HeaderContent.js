'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

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

  return (
    <nav>
      <ul className="md:flex items-center justify-between text-base text-gray-100 dark:text-gray-600 pt-4 md:pt-0">
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

        {admin == true && (
          <Link
            onClick={() => {
              setAdminList(true)
              setTimeout(() => {
                setAdminListHidden(false)
              }, 1000)
            }}
            className={`md:p-4 py-3 px-0 block  ${isActive('addCourses') ? 'text-rose-500' : 'text-block'}`}
            // href={'/addCourses'}
            href={'/'}
          >
            اضافه کردن دوره
          </Link>
        )}

        <div
          className={`
            ${adminListHidden && 'hidden'}
            
            ${
              adminList ? 'animate__animated  animate__fadeInRight' : 'animate__animated animate__fadeOutRight '
            } bg-blue-700 absolute  right-0 inset-y-0 sm:w-3/12 w-1/3 z-50 p-10 overflow-hidden`}
        >
          <div>hi</div>
          <button
            onClick={() => {
              setAdminList(false)
              setTimeout(() => {
                setAdminListHidden(true)
              }, 1000)
            }}
          >
            x
          </button>
        </div>
      </ul>
    </nav>
  )
}
