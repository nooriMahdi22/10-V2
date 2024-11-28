'use client'
import { showToast, ToastNotifications } from '@/app/utils/alert'
import { checkTokenInfo } from '@/app/utils/logFunction'
import axios from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function CourseRegistration() {
  const [dataCourses, setDataCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  //* start get course

  async function handleDataCours(id) {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`)
      setDataCourses(response.data.data.course)
      console.log(response.data.data.course)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }
  //! start  check log in or no
  const [tokenUser, setToken] = useState('nothing')
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkTokenAndSetState = async () => {
      console.log(searchParams.get('coursId'))
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

    setTimeout(() => handleDataCours(searchParams.get('coursId')), 100)
  }, [])

  //!finish  check log in or no

  function CourseRegistrationUser(params) {
    const registrUser = async () => {
      console.log(searchParams.get('coursId'))
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${searchParams.get('coursId')}/enroll`,
          { cache: 'no-store', credentials: 'include' },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('login')}`,
            },
          }
        )

        showToast('success', 'ثبت نام شد کامل شد')
        setTimeout(() => {
          router.push('/userInformation')
        }, 1000)
        console.log(response)
      } catch (error) {
        showToast('warning', error.response.data.message || 'خطایی رخ داده است')

        console.error('Error checking token:', error.response.data.message)
      }
    }
    registrUser()
    console.log('hi')
  }

  if (tokenUser == false) {
    return (
      <div className="w-full flex justify-center items-center ">
        <div className="p-10">
          <p>شما ثبت نام نکرده اید</p>
          <Link className="px-3 py-2 text-center mt-3 block mx-auto  w-fit bg-blue-400 rounded-lg" href={'/logIn'}>
            ثبت نام و ورود
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {<ToastNotifications />}
      <div>
        {/* {tokenUser.name} */}

        <div className=" bg-opacity-50 text-center space-y-5 rounded-lg shadow-2xl p-8 max-w-md w-full neon-border">
          <h2 className="text-3xl font-bold text-center  mb-2 neon-text">{tokenUser.name}</h2>
          <div className="border-t border-pink-500 pt-4 space-y-2">
            <p className="">
              <span className="font-semibold text-pink-300 ">شماره تماس:</span>
              {tokenUser.phoneNumber}
            </p>
            <p className="">
              <span className="font-semibold text-pink-300 ">سن:</span>
              {tokenUser.age}
            </p>
            <div>{dataCourses.title}</div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={CourseRegistrationUser}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600  font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 neon-border text-white"
            >
              تایید اطلاعات
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseRegistration
