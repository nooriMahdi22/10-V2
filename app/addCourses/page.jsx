'use client'
import { useEffect, useState } from 'react'
import { checkAdminOrNo } from '../utils/logFunction'
import axios from 'axios'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import InstructorSelect from '../components/InstructorSelect'

export default function AddCourses() {
  const [admin, setAdmin] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const logOrNo = await checkAdminOrNo()
        console.log('logOrNo', logOrNo)
        setAdmin(logOrNo)
      } catch (error) {
        console.error('Error checking token:', error)
        setAdmin(false)
      }
    }

    setTimeout(checkAdmin, 2000)
  }, [])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    startDate: null,
    endDate: null,
    capacity: '',
    price: '',
    image: null,
  })

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    let isValid = true
    let newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان دوره الزامی است'
      isValid = false
    } else if (formData.title.length > 100) {
      newErrors.title = 'عنوان دوره نباید بیشتر از 100 کاراکتر باشد'
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'توضیحات دوره الزامی است'
      isValid = false
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'شناسه مدرس الزامی است'
      isValid = false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!formData.startDate) {
      newErrors.startDate = 'تاریخ شروع الزامی است'
      isValid = false
    } else if (formData.startDate.toDate() < today) {
      newErrors.startDate = 'تاریخ شروع باید امروز یا بعد از آن باشد'
      isValid = false
    }

    if (!formData.endDate) {
      newErrors.endDate = 'تاریخ پایان الزامی است'
      isValid = false
    } else if (formData.endDate.toDate() <= formData.startDate.toDate()) {
      newErrors.endDate = 'تاریخ پایان باید بعد از تاریخ شروع باشد'
      isValid = false
    }

    if (formData.image == null) {
      newErrors.image = 'تصویر دوره الزامی است'
      isValid = false
    }

    if (!formData.capacity) {
      newErrors.capacity = 'ظرفیت دوره الزامی است'
      isValid = false
    } else if (parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'ظرفیت دوره باید عددی مثبت باشد'
      isValid = false
    }

    if (!formData.price) {
      newErrors.price = 'قیمت دوره الزامی است'
      isValid = false
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'قیمت دوره نمی‌تواند منفی باشد'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage('لطفاً خطاها را قبل از ارسال اصلاح کنید.')
      return
    }

    const data = new FormData()
    for (const key in formData) {
      if (key === 'startDate' || key === 'endDate') {
        // Convert to gregorian date
        const gregorianDate = formData[key].convert(gregorian, gregorian_en).format('YYYY-MM-DD')
        data.append(key, gregorianDate)
      } else {
        data.append(key, formData[key])
      }
    }

    try {
      const response = await axios.post('http://localhost:3001/api/v1/courses/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      setMessage('دوره با موفقیت اضافه شد!')
    } catch (error) {
      console.error('Error adding course:', error)
      setMessage('افزودن دوره با خطا مواجه شد. لطفاً دوباره تلاش کنید.')
    }
  }

  if (!admin) {
    return <div className="mt-40 text-center text-red-500">شما باید ادمین باشید تا بتوانید دوره اضافه کنید.</div>
  }

  return (
    <div className="mt-40 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">افزودن دوره جدید</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            عنوان
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان دوره"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            توضیحات
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات دوره"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
        {/* <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
            شناسه مدرس
          </label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            placeholder="شناسه مدرس"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.instructor ? 'border-red-500' : ''
            }`}
          />
          {errors.instructor && <p className="mt-1 text-sm text-red-500">{errors.instructor}</p>}
        </div> */}
        <InstructorSelect value={formData.instructor} onChange={handleChange} error={errors.instructor} />

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            تاریخ شروع
          </label>
          <DatePicker
            id="startDate"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            value={formData.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            format="YYYY/MM/DD"
            inputClass={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.startDate ? 'border-red-500' : ''
            }`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            تاریخ پایان
          </label>
          <DatePicker
            id="endDate"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            value={formData.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            format="YYYY/MM/DD"
            inputClass={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.endDate ? 'border-red-500' : ''
            }`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            ظرفیت
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="ظرفیت"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.capacity ? 'border-red-500' : ''
            }`}
          />
          {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            قیمت
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="قیمت"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.price ? 'border-red-500' : ''
            }`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            تصویر دوره
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          افزودن دوره
        </button>
      </form>
    </div>
  )
}
