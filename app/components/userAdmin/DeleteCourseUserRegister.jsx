import { useState } from 'react'

function DeleteCourseUserRegister({ dataCUserR, setDataCUserR, item }) {
  const [showConfirm, setShowConfirm] = useState(false)

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
        setDataCUserR(dataCUserR.filter((course) => course.id !== enrollmentId))
        setShowConfirm(false) // Hide confirmation dialog
      } else {
        console.error('Failed to delete enrollment')
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error)
    }
  }

  return (
    <div>
      <button onClick={() => setShowConfirm(true)} className="p-2 bg-red-400 rounded-lg m-2">
        delete
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate__animated animate__fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">تأیید حذف</h3>
            <p>آیا مطمئن هستید که می‌خواهید این دوره را لغو کنید؟</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDeleteCourse(item?.id)}
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
    </div>
  )
}

export default DeleteCourseUserRegister
