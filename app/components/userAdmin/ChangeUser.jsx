'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { changeToEngNum } from '../Help'
import { showToast } from '@/app/utils/alert'

function ChangeUser({ id, item, setDataUser }) {
  const [loading, setLoading] = useState(false)

  const [hidden, sethidden] = useState(true)

  const [formData, setFormData] = useState({
    phoneNumber: item.phoneNumber,
    name: item.name,
    age: item.age,
    role: item.role,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value
    if (name === 'age' || name === 'phoneNumber') {
      newValue = changeToEngNum(value)
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    console.log(formData.phoneNumber)
    console.log(formData.name)
    console.log(formData.age)
    console.log(formData.role)

    if (!formData.phoneNumber || !formData.name || !formData.age || !formData.role) {
      showToast('warning', 'اطلاعات را کامل کنید')
      return
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${item.id}`,
        {
          phoneNumber: formData.phoneNumber,
          name: formData.name,
          age: formData.age,
          role: formData.role,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('login')}`,
          },
        }
      )
      console.log(response.data)
      setDataUser((prev) => prev.map((user) => (user.id === item.id ? response.data.data.user : user)))

      showToast('info', 'با موفقیت اپدیت شد')
    } catch (err) {
      const errorMessage = err.response.data.error.code == 11000 ? 'خطای اطلاعات تکراری' : 'hi'
      console.log('err', err.response.data)
      showToast('warning', ' خطایی پیش امده اطلاعات وارد شده را بررسی کنید')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="">
        <button className="bg-green-400 p-2 my-2 " onClick={() => sethidden(!hidden)}>
          ChangeUser
        </button>
        {hidden && (
          <form onSubmit={handleSubmit} dir="rtl" className="bg-blue-400 flex flex-col gap-3 p-4">
            <input className="border" name="name" value={formData.name} onChange={handleChange} />
            <input className="border" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            <input className="border" name="age" value={formData.age} onChange={handleChange} />
            <select name="role" onChange={handleChange}>
              <option value={item.role}>{item.role}</option>
              {item.role == 'admin' && (
                <>
                  <option value="instructor">instructor</option>
                  <option value="student">student</option>
                </>
              )}
              {item.role == 'student' && (
                <>
                  <option value="admin">admin</option>
                  <option value="instructor">instructor</option>
                </>
              )}
              {item.role == 'instructor' && (
                <>
                  <option value="admin">admin</option>
                  <option value="student">student</option>
                </>
              )}
            </select>
            <button type="submit">send</button>
          </form>
        )}
      </div>
    </>
  )
}

export default ChangeUser
