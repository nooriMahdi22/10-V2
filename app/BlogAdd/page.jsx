'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

function Bloggg() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [editId, setEditId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const API_URL = 'http://localhost:3001/api/blogs'

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_URL)
      setBlogs(response.data.data.blogs)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setErrorMessage('خطا در بارگذاری بلاگ‌ها')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    if (image) {
      formData.append('image', image)
    }

    try {
      if (editId) {
        // Update blog
        await axios.patch(`${API_URL}/${editId}`, formData)
      } else {
        // Create new blog
        await axios.post(API_URL, formData)
      }
      fetchBlogs()
      resetForm()
      setErrorMessage('') // Reset error message on success
    } catch (error) {
      console.error('Error saving blog:', error)
      setErrorMessage('خطا در ذخیره بلاگ')
    }
  }

  const handleEdit = (blog) => {
    setTitle(blog.title)
    setContent(blog.content)
    setEditId(blog._id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
      setErrorMessage('خطا در حذف بلاگ')
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setImage(null)
    setEditId(null)
  }

  return (
    <div className="flex items-center justify-center h- mt-10 flex-col bg-gray-100 p-4  ">
      <h1 className="text-3xl font-bold mb-6">مدیریت بلاگ‌ها</h1>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            عنوان بلاگ
          </label>
          <input
            type="text"
            placeholder="عنوان بلاگ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            محتوای بلاگ
          </label>
          <textarea
            placeholder="محتوای بلاگ"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            عکس بلاگ
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 hover:file:bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editId ? 'ویرایش بلاگ' : 'اضافه کردن بلاگ'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8">لیست بلاگ‌ها</h2>
      <ul className="mt-4 w-full max-w-lg">
        {blogs.map((blog) => (
          <li key={blog._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-bold">{blog.title}</h3>
            <p>{blog.content}</p>
            {blog.image && (
              <Image
                width={400}
                height={300}
                src={blog.image}
                alt={blog.title}
                className="mt-2 w-full h-auto rounded-md"
              />
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(blog)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
              >
                ویرایش
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Bloggg
