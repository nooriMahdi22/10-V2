'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import TitleInput from '@/app/components/comAddCourses/TitleInput'
import DescriptionInput from '@/app/components/comAddCourses/DescriptionInput'
import InstructorSelect from '@/app/components/comAddCourses/InstructorSelect'
import DateRangeInput from '@/app/components/comAddCourses/DateRangeInput'
import CapacityPriceInput from '@/app/components/comAddCourses/CapacityPriceInput'
import DurationInput from '@/app/components/comAddCourses/DurationInput'
import ConfirmDeleteModal from '@/app/utils/ConfirmDeleteModal'
import { showToast, ToastNotifications } from '@/app/utils/alert'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import ImageUpload from '@/app/components/comAddCourses/ImageUpload'

function EditCourse2() {
  const router = useRouter()
  const { id } = useParams() // دریافت شناسه دوره با استفاده از useParams
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
    // image: null,
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

      const course = response.data.data.course
      setCourseData(course)
      setFormData({
        title: course.title,
        description: course.description,
        startDate: null,
        endDate: null,
        instructor: course.instructor._id,
        capacity: course.capacity,
        price: String(course.price),
        duration: course.duration,
        // image: null, // تصویر را به صورت جداگانه مدیریت می‌کنیم
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

  const handleDateChange = (date, name) => {
    console.log('formData.startDate', formData.startDate)

    setFormData((prev) => ({ ...prev, [name]: date }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // * شروع اعتبار سنجی به صورت دونه ای
  const validateTitle = (title) => {
    if (!title.trim()) {
      return 'عنوان دوره الزامی است'
    } else if (title.length > 100) {
      return 'عنوان دوره نباید بیشتر از 100 کاراکتر باشد'
    }
    return ''
  }

  const validateDescription = (description) => {
    if (!description.trim()) {
      return 'توضیحات دوره الزامی است'
    }
    return ''
  }

  const validateInstructor = (instructor) => {
    if (!instructor.trim()) {
      return 'شناسه مدرس الزامی است'
    }
    return ''
  }

  const validateStartDate = (startDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate == null && endDate == null) {
      return ''
    }

    if (startDate != null && endDate != null) {
      if (!startDate) {
        console.log('hiiiiiii3333')
        return 'تاریخ شروع الزامی است'
      } else if (startDate.toDate() < today) {
        return 'تاریخ شروع باید امروز یا بعد از آن باشد'
      }
      return ''
    }
  }

  const validateEndDate = (endDate, startDate) => {
    console.log(startDate, endDate)
    if (startDate == null && endDate == null) {
      console.log('hhiiiii')
      return ''
    }

    if (!endDate) {
      console.log('hhiiiii 2222')
      return 'تاریخ پایان الزامی است'
    } else if (endDate.toDate() <= startDate.toDate()) {
      return 'تاریخ پایان باید بعد از تاریخ شروع باشد'
    }
    return ''
  }

  // const validateImage = (image) => {
  //   if (!image || !(image instanceof File)) {
  //     return 'تصویر دوره الزامی است'
  //   }

  //   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  //   if (!allowedTypes.includes(image.type)) {
  //     return 'لطفاً یک تصویر معتبر (JPEG، PNG یا GIF) انتخاب کنید'
  //   }

  //   return ''
  // }

  const validateCapacity = (capacity) => {
    if (!capacity) {
      return 'ظرفیت دوره الزامی است'
    } else if (isNaN(capacity) || parseInt(capacity) <= 0) {
      return 'ظرفیت دوره باید عددی مثبت باشد'
    }
    return ''
  }

  const validatePrice = (price) => {
    if (!price) {
      return 'قیمت دوره الزامی است'
    } else if (isNaN(price) || parseFloat(price) < 0) {
      return 'قیمت دوره باید عددی غیرمنفی باشد'
    }
    return ''
  }
  // * اعتبار سنجی مدت زمان دوره
  // * اعتبار سنجی مدت زمان دوره
  const validateDuration = (duration) => {
    if (!duration) {
      return 'مدت زمان دوره الزامی است'
    } else if (isNaN(duration) || parseInt(duration) <= 0) {
      return 'مدت زمان دوره باید عددی مثبت باشد'
    }
    return ''
  }

  // * پایان اعتبار سنجی به صورت دونه ای

  // به‌روزرسانی تابع validateForm
  // * اعتبار سنجی همه در یک جا
  const validateForm = () => {
    let isValid = true
    let newErrors = {}
    console.log('Image before submission:', formData.image)

    newErrors.title = validateTitle(formData.title)
    newErrors.description = validateDescription(formData.description)
    newErrors.instructor = validateInstructor(formData.instructor)

    newErrors.startDate = validateStartDate(formData.startDate)

    newErrors.endDate = validateEndDate(formData.endDate, formData.startDate)

    // newErrors.image = validateImage(formData.image)

    newErrors.capacity = validateCapacity(formData.capacity)

    newErrors.price = validatePrice(formData.price)

    newErrors.duration = validateDuration(formData.duration) // اضافه کردن اعتبارسنجی مدت زمان دوره

    // بررسی اینکه آیا خطایی وجود دارد
    for (const key in newErrors) {
      if (newErrors[key]) {
        isValid = false
        break
      }
    }

    setErrors(newErrors)

    return isValid
  }
  // * اعتبار سنجی همه در یک جا پایان

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateForm()

    if (!validation) {
      showToast('warning', 'لطفاً خطاها را اصلاح کنید.', { theme: 'dark' })
      return
    }

    setLoading(true)

    const data = new FormData()
    for (const key in formData) {
      if (key === 'startDate' || key === 'endDate') {
        // Convert to gregorian date
        console.log(startDate, endDate)
        console.log(formData.startDate, formData.endDate)
        if ((key === 'startDate' && formData.startDate != null) || (key === 'endDate' && formData.endDate != null)) {
          const gregorianDate = formData[key].convert(gregorian, gregorian_en).format('YYYY-MM-DD')
          data.append(key, gregorianDate)
        }
      } else if (key === 'image' && formData[key] instanceof File) {
        // اگر image یک فایل است، آن را با نام فایل اضافه کنید
        data.append(key, formData[key], formData[key].name)
      } else {
        data.append(key, formData[key])
      }
    }

    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      showToast('success', 'دوره با موفقیت ویرایش شد!')
      router.push('/addCourses/all')
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
      router.push('/addCourses/all') // هدایت به صفحه لیست دوره‌ها پس از حذف
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

  const validateImage = (image) => {
    if (!image || !(image instanceof File)) {
      return 'تصویر دوره الزامی است'
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(image.type)) {
      return 'لطفاً یک تصویر معتبر (JPEG، PNG یا GIF) انتخاب کنید'
    }

    return ''
  }

  const [imageHidden, setImageHidden] = useState(false)
  async function handleChangeImage(params) {
    console.log(formData.image)

    let newErrors = validateImage(formData.image)
    if (newErrors) {
      showToast('warning', newErrors)
    } else {
      const data = new FormData()

      data.append('image', formData.image)
      console.log('data', data)

      try {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        })
        setImageHidden(true)
        showToast('success', 'عکس دوره با موفقیت تغییر کرد!')
      } catch (error) {
        console.error('Error adding course:', error)
        showToast('error', 'افزودن دوره با خطا مواجه شد. لطفاً دوباره تلاش کنید.')
      }
    }
  }

  return (
    <>
      <ToastNotifications />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-right">ویرایش دوره</h1>

        {loading ? (
          <div className="text-center py-10">در حال بارگذاری اطلاعات دوره...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TitleInput value={formData.title} onChange={handleChange} error={errors.title} />
            <DescriptionInput value={formData.description} onChange={handleChange} error={errors.description} />
            <InstructorSelect value={formData.instructor} onChange={handleChange} error={errors.instructor} />
            <div className="" dir="rtl">
              <DateRangeInput
                startDate={formData.startDate}
                endDate={formData.endDate}
                onStartChange={(date) => handleDateChange(date, 'startDate')}
                onEndChange={(date) => handleDateChange(date, 'endDate')}
                errors={errors}
              />
            </div>

            <CapacityPriceInput
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
            />
            <DurationInput
              setFormData={setFormData}
              setErrors={setErrors}
              value={formData.duration}
              onChange={handleChange}
              error={errors.duration}
            />

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              ویرایش دوره
            </button>
          </form>
        )}

        <div className={`${imageHidden && 'hidden'}`}>
          <div className="hi">
            <ImageUpload onChange={handleChange} error={errors.image} />
          </div>
          <button
            onClick={handleChangeImage}
            className="mt-4 w-full py-3 px-4 border border-blue-500 rounded-md text-sm font-medium text-blue-900 hover:bg-green-600 hover:text-white transition-colors duration-200"
          >
            تغییر عکس دوره
          </button>
        </div>

        {/* دکمه حذف */}
        <button
          onClick={openModalDeleteConfirmation}
          className="mt-4 w-full py-3 px-4 border border-red-500 rounded-md text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          حذف دوره
        </button>

        {/* Modal for confirmation */}
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={closeModalDeleteConfirmation}
          onConfirm={handleDeleteCourse}
        />
      </div>
    </>
  )
}

export default EditCourse2
