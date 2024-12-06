'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { showToast } from '@/app/utils/alert'
import ImageUpload from '@/app/components/comAddCourses/ImageUpload'

function Bloggg() {
  const [blogs, setBlogs] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: undefined,
  })
  const [editId, setEditId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState({})

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    let isValid = true
    let newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان بلاگ الزامی است'
      isValid = false
    }

    if (!formData.content.trim()) {
      newErrors.content = 'محتوای بلاگ الزامی است'
      isValid = false
    }

    if (!formData.image) {
      newErrors.image = 'تصویر بلاگ الزامی است'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setErrorMessage('لطفاً خطاها را اصلاح کنید.')
      showToast('warning', 'لطفاً خطاها را اصلاح کنید.')
      return
    }

    const formDataToSend = new FormData()
    for (const key in formData) {
      formDataToSend.append(key, formData[key])
    }

    try {
      if (editId) {
        await axios.patch(`${API_URL}/${editId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        })
        showToast('success', 'بلاگ با موفقیت تغییر کرد')
      } else {
        await axios.post(API_URL, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        })
        showToast('success', 'بلاگ با موفقیت اضافه شد')
      }
      fetchBlogs()
      resetForm()
      setErrorMessage('')
    } catch (error) {
      console.error('Error saving blog:', error)
      setErrorMessage('خطا در ذخیره بلاگ')
    }
  }

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      image: undefined,
    })

    if (window) {
      window.scrollTo(0, 0)
    }
    setEditId(blog._id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      fetchBlogs()
      showToast('success', 'بلاگ با موفقیت حذف شد')
    } catch (error) {
      console.error('Error deleting blog:', error)
      setErrorMessage('خطا در حذف بلاگ')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: undefined,
    })
    setEditId(null)
  }

  return (
    <div className="flex items-center justify-center h-full mt-10 flex-col bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">مدیریت بلاگ‌ها</h1>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            عنوان بلاگ
          </label>
          <input
            type="text"
            name="title"
            placeholder="عنوان بلاگ"
            value={formData.title}
            onChange={handleChange}
            required
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            محتوای بلاگ
          </label>
          <textarea
            name="content"
            placeholder="محتوای بلاگ"
            value={formData.content}
            onChange={handleChange}
            required
            rows="4"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.content ? 'border-red-500' : ''
            }`}
          />
          {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
        </div>
        <ImageUpload isBlog={true} formData={formData} onChange={handleChange} error={errors.image} />

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
            <p dir="rtl" className="mb-4 text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis line-clamp-3">
              {blog.content}
            </p>{' '}
            {blog.image && (
              <Image
                width={400}
                height={300}
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${blog.image}`}
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
