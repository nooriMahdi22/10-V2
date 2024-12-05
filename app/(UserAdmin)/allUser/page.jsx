'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

function AllUser({ limitNumber }) {
  const [dataCourses, setDataCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function handleDataCours() {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/?${limitNumber ? `limit=${limitNumber}` : ''}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        }
      )
      console.log('response', response.data.data.users)
      setDataCourses(response.data.data.users)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleDataCours()
  }, [])
  return <div></div>
}

export default AllUser
