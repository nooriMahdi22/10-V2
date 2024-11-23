'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const InstructorSelect = ({ value, onChange, error }) => {
  const [instructors, setInstructors] = useState([])

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/instructors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        })
        setInstructors(response.data.data.instructors)
      } catch (error) {
        console.error('Error fetching instructors:', error)
      }
    }

    fetchInstructors()
  }, [])

  return (
    <div className="space-y-1">
      <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 text-right">
        مدرس
      </label>
      <div className="relative">
        <select
          id="instructor"
          name="instructor"
          value={value}
          onChange={onChange}
          className={`block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm appearance-none text-right
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
        `}
        >
          <option value="">انتخاب مدرس</option>
          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
    </div>
  )
}

export default InstructorSelect
