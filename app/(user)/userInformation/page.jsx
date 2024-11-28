'use client'
import { convertToShamsi } from '@/app/components/convertDate/ConvertDate'
import DeleteAccount from '@/app/components/user/DeleteAccount'
import UpdateUserInfo from '@/app/components/user/UpdateUserInfo'
import { getInfoWithToken } from '@/app/utils/logFunction'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function UserInformation() {
  const [tokenUser, setToken] = useState('nothing')
  const [loading, setLoading] = useState(true)
  const [dataCourses, setDataCourses] = useState([])
  const [showConfirm, setShowConfirm] = useState(false) // State for confirmation dialog
  const [courseToDelete, setCourseToDelete] = useState(null) // Store course ID to delete

  const searchParams = useSearchParams()

  useEffect(() => {
    const checkTokenAndSetState = async () => {
      setLoading(true)
      try {
        const logOrNo = await getInfoWithToken()
        setToken(logOrNo)
        setDataCourses(logOrNo.enrollments)
      } catch (error) {
        console.error('Error checking token:', error)
        setToken(false)
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

  if (loading) {
    return <div className="text-center text-lg">در حال بارگذاری...</div>
  }

  if (tokenUser === false) {
    return <div className="text-center text-lg">شما ثبت نام نکرده اید</div>
  }
  if (tokenUser === 'error') {
    return <div className="text-center text-lg">خطایی پیش آمده اینتنرت خود را بررسی کنید </div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">اطلاعات کاربر</h1>
      <UpdateUserInfo currentUser={tokenUser} onUpdate={setToken} />
      <div className="mb-4">
        <p className="font-semibold">نام:</p>
        <p className="text-gray-700">{tokenUser.name}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">شماره تماس:</p>
        <p className="text-gray-700">{tokenUser.phoneNumber}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">سن شما:</p>
        <p className="text-gray-700">{tokenUser.age}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">دوره هایی که ثبت نام کرده اید:</h2>
      {dataCourses.length > 0 ? (
        dataCourses.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm mb-4 bg-white hover:bg-gray-100 transition duration-200"
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
        ))
      ) : (
        <p className="text-gray-500">شما هیچ دوره‌ای ثبت نام نکرده‌اید.</p>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
    </div>
  )
}

export default UserInformation
