'use client'
import { useEffect, useState } from 'react'
import { checkAdminOrNo } from '../utils/logFunction'

export default function AddCourses() {
  const [admin, setAdmin] = useState(false)
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
    phoneNumber: '',
    verificationCode: '',
    name: '',
    age: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value
    if (name === 'age' || name === 'phoneNumber') {
      newValue = changeToEngNum(value)
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }))
    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }))
    }
  }

  return <div className="mt-40">addCourses {admin && <p>welcome admin</p>}</div>
}
