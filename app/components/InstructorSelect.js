'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const InstructorSelect = ({ value, onChange, error }) => {
  const [instructors, setInstructors] = useState([])

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/users/instructors', {
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
    <div>
      <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
        مدرس
      </label>
      <select
        id="instructor"
        name="instructor"
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
          error ? 'border-red-500' : ''
        }`}
      >
        <option value="">انتخاب مدرس</option>
        {instructors.map((instructor) => (
          <option key={instructor._id} value={instructor._id}>
            {instructor.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InstructorSelect
