'use client'
import { convertToShamsi } from '@/app/components/convertDate/ConvertDate'
import DeleteAccount from '@/app/components/user/DeleteAccount'
import { getInfoWithToken } from '@/app/utils/logFunction'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { showToast, ToastNotifications } from '@/app/utils/alert'
import { IoIosArrowUp } from 'react-icons/io'

function UserInformation() {
  const [user, setUser] = useState('nothing')
  const [loading, setLoading] = useState(true)
  const [dataCourses, setDataCourses] = useState([])
  const [showConfirm, setShowConfirm] = useState(false) // State for confirmation dialog
  const [courseToDelete, setCourseToDelete] = useState(null) // Store course ID to delete
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [hiddenChange, setHiddenChange] = useState(true)

  const searchParams = useSearchParams()

  useEffect(() => {
    const checkTokenAndSetState = async () => {
      setLoading(true)
      try {
        const logOrNo = await getInfoWithToken()
        setUser(logOrNo)
        setDataCourses(logOrNo.enrollments)
        setName(logOrNo.name)
        setAge(logOrNo.age)
      } catch (error) {
        console.error('Error checking token:', error)
        setUser(false)
      } finally {
        setLoading(false)
      }
    }

    // Use setTimeout if you still want the delay
    setTimeout(checkTokenAndSetState, 100)
  }, [])

  const handleDeleteCourse = async (enrollmentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      if (response.ok) {
        // Refresh data after successful deletion
        setDataCourses(dataCourses.filter((course) => course.id !== enrollmentId))
        setShowConfirm(false) // Hide confirmation dialog
      } else {
        console.error('Failed to delete enrollment')
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateLoading(true)
    setUpdateError(null)

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/updateMe`,
        {
          name,
          age,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        }
      )

      if (response.status !== 200) {
        throw new Error('Failed to update user information')
      }

      const updatedUser = response.data
      console.log(updatedUser) // Log the response to check its structure
      setHiddenChange(true)
      if (updatedUser.name && updatedUser.age) {
        setUser(updatedUser) // Call the parent function to update user info
        setName(updatedUser.name)
        setAge(updatedUser.age)
      } else if (updatedUser.data && updatedUser.data.user) {
        setUser(updatedUser.data.user) // Call the parent function to update user info
        setName(updatedUser.data.user.name)
        setAge(updatedUser.data.user.age)
      } else {
        throw new Error('Invalid response structure')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setUpdateError(error.message)
      } else {
        setUpdateError('An unknown error occurred')
      }
      showToast('warning', `${error.message || 'مشکلی پیش امده اینترنت خود را بررسی کنید'}`)
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-lg">در حال بارگذاری...</div>
  }

  if (user === false) {
    return <div className="text-center text-lg">شما ثبت نام نکرده اید</div>
  }
  if (user === 'error') {
    return <div className="text-center text-lg">خطایی پیش آمده اینتنرت خود را بررسی کنید </div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md animate__animated animate__fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-center">اطلاعات کاربر</h1>

      <h2 className="text-2xl font-semibold mb-4">دوره هایی که ثبت نام کرده اید:</h2>
      {dataCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCourses.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition duration-200 animate__animated animate__fadeInUp"
            >
              <h3 className="text-xl font-bold">{item.course.title}</h3>
              <p className="text-gray-600">تاریخ شروع دوره: {convertToShamsi(item.course?.startDate)}</p>
              <button
                onClick={() => {
                  setShowConfirm(true)
                  setCourseToDelete(item.id)
                }}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                لغو ثبت نام
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">شما هیچ دوره‌ای ثبت نام نکرده‌اید.</p>
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">اطلاعات شخصی:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <p className="font-semibold">نام:</p>
            <p className="text-gray-700">{user.name}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">شماره تماس:</p>
            <p className="text-gray-700">{user.phoneNumber}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">سن شما:</p>
            <p className="text-gray-700">{user.age}</p>
          </div>
        </div>
      </div>

      <button
        className="bg-blue-400 text-white flex items-center p-4 rounded-lg hover:bg-blue-500 transition duration-200"
        onClick={() => setHiddenChange(!hiddenChange)}
      >
        تغییر اطلاعات
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ml-2 ${hiddenChange ? 'rotate-180' : ''} transition-all duration-500`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {!hiddenChange && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md animate__animated animate__fadeInUp">
          <h2 className="text-xl font-semibold mb-4">به‌روزرسانی اطلاعات:</h2>
          {updateError && <p className="text-red-500">{updateError}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold">
                نام جدید:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="نام جدید را وارد کنید"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="age" className="block text-sm font-semibold">
                سن جدید:
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="سن جدید را وارد کنید"
                required
              />
            </div>

            <button
              type="submit"
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 ${
                updateLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={updateLoading}
            >
              {updateLoading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی اطلاعات'}
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate__animated animate__fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">تأیید حذف</h3>
            <p>آیا مطمئن هستید که می‌خواهید این دوره را لغو کنید؟</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDeleteCourse(courseToDelete)}
                className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700 transition duration-200"
              >
                بله، لغو کن
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Component */}
      <DeleteAccount />
      <ToastNotifications />
    </div>
  )
}

export default UserInformation
