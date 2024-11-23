'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import ImageUpload from '@/app/components/comAddCourses/ImageUpload'
import TitleInput from '@/app/components/comAddCourses/TitleInput'
import DescriptionInput from '@/app/components/comAddCourses/DescriptionInput'
import InstructorSelect from '@/app/components/comAddCourses/InstructorSelect'
import DateRangeInput from '@/app/components/comAddCourses/DateRangeInput'
import CapacityPriceInput from '@/app/components/comAddCourses/CapacityPriceInput'
import DurationInput from '@/app/components/comAddCourses/DurationInput'
import ConfirmDeleteModal from '@/app/utils/ConfirmDeleteModal'
import { showToast } from '@/app/utils/alert'

function EditCourse2() {
  const router = useRouter()
  const { id } = useParams() // دریافت شناسه دوره با استفاده از useParams
  console.log('id', id)
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    startDate: null,
    endDate: null,
    capacity: '',
    price: '',
    duration: '',
    image: null,
  })
  const [errors, setErrors] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCourseData(id)
    }
  }, [id])

  const fetchCourseData = async (courseId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${courseId}`)
      console.log('response response', response)

      const course = response.data.data.course
      setCourseData(course)
      setFormData({
        title: course.title,
        description: course.description,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate),
        instructor: course.instructor._id,
        capacity: course.capacity,
        price: course.price,
        duration: course.duration,
        image: null, // تصویر را به صورت جداگانه مدیریت می‌کنیم
      })
    } catch (error) {
      console.error('Error fetching course data:', error)
      showToast('error', 'خطا در بارگذاری اطلاعات دوره.')
    } finally {
      setLoading(false)
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
      newErrors.title = 'عنوان دوره الزامی است'
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

    if (!formData.startDate) {
      newErrors.startDate = 'تاریخ شروع الزامی است'
      isValid = false
    }

    if (!formData.endDate) {
      newErrors.endDate = 'تاریخ پایان الزامی است'
      isValid = false
    }

    if (!formData.capacity || isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'ظرفیت دوره باید عددی مثبت باشد'
      isValid = false
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'قیمت دوره باید عددی غیرمنفی باشد'
      isValid = false
    }

    if (!formData.duration || isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'مدت زمان دوره باید عددی مثبت باشد'
      isValid = false
    }

    if (!formData.image) {
      newErrors.image = 'تصویر دوره الزامی است'
      isValid = false
    }

    setErrors(newErrors)

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const data = new FormData()

    for (const key in formData) {
      data.append(key, formData[key])
    }

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })

      showToast('success', 'دوره با موفقیت ویرایش شد!')
      router.push('/all-courses') // هدایت به صفحه لیست دوره‌ها پس از موفقیت
    } catch (error) {
      console.error('Error updating course:', error)
      showToast('error', 'ویرایش دوره با خطا مواجه شد.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      showToast('success', 'دوره با موفقیت حذف شد!')
      router.push('/all-courses') // هدایت به صفحه لیست دوره‌ها پس از حذف
    } catch (error) {
      console.error('Error deleting course:', error)
      showToast('error', 'حذف دوره با خطا مواجه شد.')
    }
  }

  const openModalDeleteConfirmation = () => {
    setIsModalOpen(true)
  }

  const closeModalDeleteConfirmation = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-right">ویرایش دوره</h1>

      {loading ? (
        <div className="text-center py-10">در حال بارگذاری اطلاعات دوره...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <TitleInput value={formData.title} onChange={handleChange} error={errors.title} />
          <DescriptionInput value={formData.description} onChange={handleChange} error={errors.description} />
          <InstructorSelect value={formData.instructor} onChange={handleChange} error={errors.instructor} />
          <DateRangeInput
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartChange={(date) => handleChange({ target: { name: 'startDate', value: date } })}
            onEndChange={(date) => handleChange({ target: { name: 'endDate', value: date } })}
            errors={errors}
          />
          {/* <CapacityPriceInput
            capacity={formData.capacity}
            price={formData.price}
            onCapacityChange={(e) => {
              const value = e.target.value
              if (value === '' || /^[0-9]+$/.test(value)) {
                setFormData((prev) => ({
                  ...prev,
                  capacity: value,
                }))
                // اعتبارسنجی فیلد ظرفیت
                if (value === '' || isNaN(value) || parseInt(value) <= 0) {
                  setErrors((prev) => ({
                    ...prev,
                    capacity: 'ظرفیت دوره باید عددی مثبت باشد',
                  }))
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    capacity: '',
                  }))
                }
              }
            }}
            onPriceChange={(e) => {
              const value = e.target.value.replace(/,/g, '')
              if (value === '' || /^[0-9]+$/.test(value)) {
                setFormData((prev) => ({
                  ...prev,
                  price: value,
                }))
                // اعتبارسنجی فیلد قیمت
                if (value === '' || isNaN(value) || parseFloat(value) < 0) {
                  setErrors((prev) => ({
                    ...prev,
                    price: 'قیمت دوره باید عددی غیرمنفی باشد',
                  }))
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    price: '',
                  }))
                }
              }
            }}
            errors={errors}
            setFormData={setFormData} // ارسال تابع setFormData
            setErrors={setErrors} // ارسال تابع setErrors
          /> */}
          <DurationInput
            setFormData={setFormData}
            setErrors={setErrors}
            value={formData.duration}
            onChange={handleChange}
            error={errors.duration}
          />
          <ImageUpload onChange={handleChange} error={errors.image} />

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            ویرایش دوره
          </button>
        </form>
      )}

      {/* دکمه حذف */}
      <button
        onClick={openModalDeleteConfirmation}
        className="mt-4 w-full py-3 px-4 border border-red-500 rounded-md text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
      >
        حذف دوره
      </button>

      {/* Modal for confirmation */}
      <ConfirmDeleteModal isOpen={isModalOpen} onClose={closeModalDeleteConfirmation} onConfirm={handleDeleteCourse} />
    </div>
  )
}

export default EditCourse2
