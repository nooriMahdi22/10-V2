'use client'
import axios from 'axios'
import { showToast } from '@/app/utils/alert'
import { useState } from 'react'

function UpdateUserInfo({ currentUser, onUpdate }) {
  const [name, setName] = useState(currentUser.name || '')
  const [age, setAge] = useState(currentUser.age || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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

      if (updatedUser.name && updatedUser.age) {
        onUpdate(updatedUser) // Call the parent function to update user info
        setName(updatedUser.name)
        setAge(updatedUser.age)
      } else if (updatedUser.data && updatedUser.data.user) {
        onUpdate(updatedUser.data.user) // Call the parent function to update user info
        setName(updatedUser.data.user.name)
        setAge(updatedUser.data.user.age)
      } else {
        throw new Error('Invalid response structure')
      }

      // showToast('success', 'اطلاعات با موفقیت به روز شد')
      alert('اطلسیبمیسبتم')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
      showToast('warning', `${error.message || 'مشکلی پیش امده اینترنت خود را بررسی کنید'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">به‌روزرسانی اطلاعات:</h2>
        {error && <p className="text-red-500">{error}</p>}
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
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی اطلاعات'}
          </button>
        </form>
      </div>
    </>
  )
}

export default UpdateUserInfo
