import { showToast } from '@/app/utils/alert'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function DeleteUser({ id, setDataUser, dataUser }) {
  const [showConfirm, setShowConfirm] = useState(false) // State for confirmation dialog
  const [loading, setLoading] = useState(false) // State for loading status

  const router = useRouter()

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`, {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })

      if (response.ok) {
        showToast('info', 'حساب کاربر انتخاب شده با موفقیت حذف شد.')
        setShowConfirm(false)
        setDataUser(dataUser.filter((user) => user.id !== id))
      } else {
        console.error('Failed to delete account')
        showToast('info', 'حذف حساب ناموفق بود.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast('حذف حساب ناموفق بود.')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }
  return (
    <>
      <div>
        <button onClick={() => setShowConfirm(true)}>delete</button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">تأیید حذف حساب</h3>
            <p>آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عمل غیرقابل بازگشت است.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDeleteAccount}
                className={`bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700 transition duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'در حال حذف...' : 'بله، حذف کن'}
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
    </>
  )
}

export default DeleteUser
