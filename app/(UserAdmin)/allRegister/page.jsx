'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

function AllRegister() {
  const [dataRegister, setDataRegister] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [enrollmentIdToDelete, setEnrollmentIdToDelete] = useState(null)

  // Function to fetch enrollment data
  async function handleDataRegister() {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/all/byCourse`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      console.log('Response data:', response.data.data)
      setDataRegister(response.data.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to delete an enrollment
  async function handleDeleteEnrollment(enrollmentId) {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/${enrollmentId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      // Update the local state by refetching the data
      handleDataRegister()
    } catch (error) {
      console.error('Error deleting enrollment:', error)
    }
  }

  // Function to show confirmation dialog
  function handleShowConfirm(enrollmentId) {
    setEnrollmentIdToDelete(enrollmentId)
    setShowConfirm(true)
  }

  // Function to hide confirmation dialog
  function handleHideConfirm() {
    setShowConfirm(false)
    setEnrollmentIdToDelete(null)
  }

  // Function to confirm deletion
  function handleConfirmDelete() {
    handleDeleteEnrollment(enrollmentIdToDelete)
    handleHideConfirm()
  }

  // Fetch data on component mount
  useEffect(() => {
    handleDataRegister()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  // No data found state
  if (!dataRegister || dataRegister.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold">ثبت نامی یافت نشد</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 mt-4">
      <h1 className="text-3xl font-bold mb-4">All Enrollments</h1>
      <div className="grid grid-cols-3 gap-4">
        {dataRegister.map((course) => (
          <div key={course.course} className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{course.course}</h2>
            <ul>
              {course.enrollments.map((enrollment) => (
                <li key={enrollment.student._id} className="mb-2">
                  <span className="mr-2">
                    {enrollment.student.name} - {enrollment.student.phoneNumber}
                  </span>
                  <button
                    onClick={() => handleShowConfirm(enrollment._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleHideConfirm}
        >
          <div
            className="bg-white shadow-md p-4 rounded-lg w-1/2 md:w-1/3 lg:w-1/4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this enrollment?</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleHideConfirm}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllRegister
