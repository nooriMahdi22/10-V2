'use client'
import { checkToken } from '@/app/utils/logFunction'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function LogOrCourse() {
  //! start  check log in or no
  const [token, setToken] = useState('nothing')
  const searchParams = useSearchParams()

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
  }, [searchParams.get('logIn')])
  //* finish  check log in or no
  return (
    <div>
      <Link
        href={`${token ? '/CourseRegistration' : '/logIn?isSign=course'}`}
        className="animate__animated animate__flipInX   w-full block text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4 font-semibold"
      >
        {token ? 'ثبت نام دوره' : 'ورود و ثبت نام'}
      </Link>
    </div>
  )
}

export default LogOrCourse
