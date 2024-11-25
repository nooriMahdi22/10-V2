'use client'
import { useEffect, useState } from 'react'
import { checkAdminOrNo } from '../../utils/logFunction'
import axios from 'axios'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import InstructorSelect from '../../components/comAddCourses/InstructorSelect'
import ImageUpload from '../../components/comAddCourses/ImageUpload'
import TitleInput from '../../components/comAddCourses/TitleInput'
import DescriptionInput from '../../components/comAddCourses/DescriptionInput'
import DateRangeInput from '../../components/comAddCourses/DateRangeInput'
import CapacityPriceInput from '../../components/comAddCourses/CapacityPriceInput'
import { showToast, ToastNotifications } from '../../utils/alert'
import DurationInput from '../../components/comAddCourses/DurationInput'
import { useRouter } from 'next/navigation'
import heic2any from 'heic2any'
// وارد کردن Animate.css

export default function AddCourses() {
  const [admin, setAdmin] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const logOrNo = await checkAdminOrNo()
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
    duration: '',
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

    if (!startDate) {
      return 'تاریخ شروع الزامی است'
    } else if (startDate.toDate() < today) {
      return 'تاریخ شروع باید امروز یا بعد از آن باشد'
    }
    return ''
  }

  const validateEndDate = (endDate, startDate) => {
    if (!endDate) {
      return 'تاریخ پایان الزامی است'
    } else if (endDate.toDate() <= startDate.toDate()) {
      return 'تاریخ پایان باید بعد از تاریخ شروع باشد'
    }
    return ''
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
  const validateForm = async () => {
    let isValid = true
    let newErrors = {}

    newErrors.title = validateTitle(formData.title)
    newErrors.description = validateDescription(formData.description)
    newErrors.instructor = validateInstructor(formData.instructor)

    newErrors.startDate = validateStartDate(formData.startDate)

    newErrors.endDate = validateEndDate(formData.endDate, formData.startDate)

    newErrors.image = validateImage(formData.image)
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

    if (!validateForm()) {
      setMessage('')
      showToast('warning', 'لطفاً خطاها را اصلاح کنید.', { theme: 'dark' })
      return
    }

    setLoading(true) // شروع بارگذاری

    const data = new FormData()
    for (const key in formData) {
      if (key === 'startDate' || key === 'endDate') {
        // Convert to gregorian date
        const gregorianDate = formData[key].convert(gregorian, gregorian_en).format('YYYY-MM-DD')
        data.append(key, gregorianDate)
      } else if (key === 'image' && formData[key] instanceof File) {
        // اگر image یک فایل است، آن را با نام فایل اضافه کنید
        data.append(key, formData[key], formData[key].name)
      } else {
        data.append(key, formData[key])
      }
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      router.push('/addCourses/all')
      showToast('success', 'دوره با موفقیت اضافه شد!')
    } catch (error) {
      console.error('Error adding course:', error)
      showToast('error', 'افزودن دوره با خطا مواجه شد. لطفاً دوباره تلاش کنید.')
    } finally {
      setLoading(false) // پایان بارگذاری
    }
  }

  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!admin) {
    return (
      <>
        <ToastNotifications />
        {/* <AnimatePresence> */}
        <div className="mt-40 text-center text-red-500 ">
          <h1 className="animate__lightSpeedOutLeft">شما باید ادمین باشید تا بتوانید دوره اضافه کنید.</h1>
        </div>
        {/* </AnimatePresence> */}
      </>
    )
  }

  return (
    <>
      <ToastNotifications />

      <div
        dir="rtl"
        className="mt-16 animate__lightSpeedInLeft sm:mt-24 md:mt-32 max-w-xl sm:max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl lg:shadow-2xl rtl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">افزودن دوره جدید</h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <TitleInput value={formData.title} onChange={handleChange} error={errors.title} />
          <DescriptionInput value={formData.description} onChange={handleChange} error={errors.description} />
          <InstructorSelect value={formData.instructor} onChange={handleChange} error={errors.instructor} />
          <DateRangeInput
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartChange={(date) => handleDateChange(date, 'startDate')}
            onEndChange={(date) => handleDateChange(date, 'endDate')}
            errors={errors}
          />
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
            value={formData.duration}
            onChange={() => {}} // این تابع خالی است چون ما مستقیماً setFormData را در DurationInput استفاده می‌کنیم
            error={errors.duration}
            setFormData={setFormData}
            setErrors={setErrors}
          />
          <ImageUpload onChange={handleChange} error={errors.image} />
          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            افزودن دوره
          </button>
        </form>
      </div>
    </>
  )
}
