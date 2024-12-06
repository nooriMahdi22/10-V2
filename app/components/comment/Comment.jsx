'use client'
import { showToast } from '@/app/utils/alert'
import axios from 'axios'
import { useState } from 'react'

function Comment() {
  const [formData, setFormData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const userId = localStorage.getItem('userId') // Assuming you have the user ID stored in local storage

  async function handleSendSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/`,
        { content: formData, user: userId }, // Include the user ID
        {
          headers: {
            'Content-Type': 'application/json', // Change to application/json
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        }
      )

      showToast('info', 'پیغام با موفقیت ارسال شد.')
      setFormData('')
      setIsLoading(false)
    } catch (err) {
      showToast('warning', 'اتصال اینترنت خود را بررسی کنید پیام ارسال نشد.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-blue-500 p-10">
      <form onSubmit={handleSendSubmit} className="flex flex-col gap-y-3 items-center justify-center">
        <textarea
          dir="rtl"
          onChange={(e) => setFormData(e.target.value)}
          value={formData}
          className="border rounded-sm"
          type="text"
        />
        <button disabled={isLoading} type="submit" className="p-2 bg-green-500 rounded-lg text-white">
          {isLoading ? 'loading' : 'send comment'}
        </button>
      </form>
    </div>
  )
}

export default Comment
