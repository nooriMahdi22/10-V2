'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

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
            className={`md:p-4 py-3 px-0 block  ${isActive('addCourses') ? 'text-rose-500' : 'text-block'}`}
            href={'/addCourses'}
          >
            اضافه کردن دوره
          </Link>
        )}
      </ul>
    </nav>
  )
}
