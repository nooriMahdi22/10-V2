'use client'
import { showToast } from '@/app/utils/alert'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false) // State for confirmation dialog
  const [loading, setLoading] = useState(false) // State for loading status

  const router = useRouter()

  const handleLogOut = useCallback(() => {
    // const confirmLogout = window.confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')
    const confirmLogout = true
    if (confirmLogout) {
      localStorage.setItem('login', '')
      setTimeout(() => {
        router.push('/?logOut=true')
      }, 1000)
    }
  }, [])

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/deleteMe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })

      if (response.ok) {
        showToast('info', 'حساب شما با موفقیت حذف شد.')
        localStorage.setItem('login', '')
        setTimeout(() => {
          router.push('/?logOut=true')
        }, 500)
        // Optionally, redirect the user or perform other actions after deletion
      } else {
        console.error('Failed to delete account')
        showToast('info', 'حذف حساب ناموفق بود.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast('حذف حساب ناموفق بود.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mt-6 space-x-8">
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
        >
          حذف حساب کاربری
        </button>

        <button
          onClick={handleLogOut}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
        >
          خروج حساب کاربری
        </button>

        {/* Confirmation Dialog */}
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
      </div>
    </>
  )
}

export default DeleteAccount
