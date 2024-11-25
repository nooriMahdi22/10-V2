'use client'
import { checkTokenInfo } from '@/app/utils/logFunction'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function CourseRegistration() {
  //! start  check log in or no
  const [tokenUser, setToken] = useState('nothing')
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkTokenAndSetState = async () => {
      try {
        const logOrNo = await checkTokenInfo()
        setToken(logOrNo)
      } catch (error) {
        console.error('Error checking token:', error)

        setToken(false)
      }
    }

    // Use setTimeout if you still want the delay
    setTimeout(checkTokenAndSetState, 100)
  }, [searchParams.get('logIn')])

  if (tokenUser == false) {
    return (
      <div className="w-full flex justify-center items-center ">
        <div className="p-10">
          <p>شما ثبت نام نکرده اید</p>
          <Link
            className="px-3 py-2 text-center mt-3 block mx-auto text-white w-fit bg-blue-400 rounded-lg"
            href={'/logIn'}
          >
            ثبت نام و ورود
          </Link>
        </div>
      </div>
    )
  }

  return <div>{tokenUser.name}</div>
}

export default CourseRegistration
