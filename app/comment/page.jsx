'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { showToast } from '@/app/utils/alert'
import { useRouter } from 'next/navigation'

function CommentList() {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [newContent, setNewContent] = useState('')
  const router = useRouter()

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      setComments(response.data.data.comments)
    } catch (err) {
      setError('Unable to fetch comments.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      showToast('info', 'نظر با موفقیت حذف شد.')
      fetchComments()
    } catch (err) {
      showToast('warning', 'Unable to delete comment.')
    }
  }

  const handleUpdateComment = async (commentId) => {
    if (!newContent) return
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/${commentId}`,
        { content: newContent },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        }
      )
      showToast('info', 'نظر با موفقیت به روز شد.')
      setEditingComment(null)
      setNewContent('')
      fetchComments()
    } catch (err) {
      showToast('warning', 'Unable to update comment.')
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment)
    setNewContent(comment.content)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="bg-blue-500 p-10 rounded-lg shadow-md">
      <h2 className="text-white text-2xl mb-4">لیست نظرات</h2>
      <div className="grid grid-cols-2">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <p>{comment.content}</p>
            <div className="flex justify-between mt-2">
              <span className="text-gray-500">{comment.user.name}</span>
              <div className="flex gap-x-2">
                {editingComment && editingComment._id === comment._id ? (
                  <div>
                    <textarea
                      type="text"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="border rounded-sm p-2 w-full"
                    />
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="p-2 bg-green-500 rounded-lg text-white"
                    >
                      به روز رسانی
                    </button>
                    <button onClick={() => setEditingComment(null)} className="p-2 bg-red-500 rounded-lg text-white">
                      انصراف
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditComment(comment)}
                    className="p-2 bg-yellow-500 rounded-lg text-white"
                  >
                    ویرایش
                  </button>
                )}
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="p-2 bg-red-500 rounded-lg text-white"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentList
