'use client'
import { showToast } from '@/app/utils/alert'
import ConfirmDeleteModal from '@/app/utils/ConfirmDeleteModal'
import { checkAdminOrNo } from '@/app/utils/logFunction'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function AllCourses() {
  const [admin, setAdmin] = useState(false)
  const [dataCourses, setDataCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
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

  async function handleDataCours() {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/`)
      setDataCourses(response.data.data.courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleDataCours()
  }, [])

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      showToast('info', 'دوره با موفقیت حذف شد.')
      handleDataCours() // به‌روزرسانی لیست دوره‌ها
    } catch (error) {
      console.error('Error deleting course:', error)
      showToast('warning', 'حذف دوره با خطا مواجه شد.')
    }
  }

  const openModal = (id) => {
    setCourseToDelete(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCourseToDelete(null)
  }

  const confirmDelete = () => {
    if (courseToDelete) {
      handleDeleteCourse(courseToDelete)
      closeModal()
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">در حال بارگذاری دوره‌ها...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">دوره‌های آموزشی</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataCourses.map((item) => (
          <CourseCard key={item._id} course={item} onDelete={openModal} />
        ))}
      </div>

      {/* Modal for confirmation */}
      <ConfirmDeleteModal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </div>
  )
}

function CourseCard({ course, onDelete }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      {course.image && (
        <div className="relative h-40 overflow-hidden p-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/img/courses/${course.image}`}
            alt={course.title}
            layout="fill"
            objectFit="contain"
            className="w-full h-full object-cover transform transition duration-200 hover:scale-110"
          />
        </div>
      )}
      <div className="p-6 text-right">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.content}</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {/* <span className="text-sm text-gray-500 block">
              قیمت نفری: {changeToPersianNum(formatNumberWithComma(course?.price))} تومان
            </span> */}
            <div className="flex space-x-2">
              {/* دکمه ویرایش */}
              <Link
                href={`/addCourses/all/change/?id=${course._id}`} // مسیر ویرایش دوره
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
              >
                ویرایش
              </Link>
              {/* دکمه حذف */}
              <button
                onClick={() => onDelete(course._id)} // باز کردن مودال تأیید حذف
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div dir="rtl" className="flex items-center space-x-2 rtl:space-x-reverse">
      <span>{icon}</span>
      <span className="font-medium">{label}:</span>
      <span>{value != undefined ? value : 'مشخص نشده'}</span>
    </div>
  )
}

export default AllCourses
