'use client'

import ChangeUser from '@/app/components/userAdmin/ChangeUser'
import CourseUserRegister from '@/app/components/userAdmin/CourseUserRegister'
import DeleteUser from '@/app/components/userAdmin/DeleteUser'
import axios from 'axios'
import { useEffect, useState } from 'react'

function AllUser() {
  const [dataUser, setDataUser] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function handleDataUser() {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      console.log('response response.data.', response.data.data.users)
      setDataUser(response.data.data.users)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleDataUser()
  }, [])

  if (isLoading) {
    return <div>loading...</div>
  }

  if (!dataUser) {
    return <div>کاربری یافت نشد</div>
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4 text-center p-5">
        {dataUser.map((item) => (
          <div key={item?.id} className="flex flex-col p-2 bg-gray-100 gap-4 rounded-lg ">
            <p>name: {item?.name}</p>
            <p>age: {item?.age}</p>
            <p>phone: {item?.phoneNumber}</p>
            <p>role: {item?.role}</p>
            <DeleteUser dataUser={dataUser} setDataUser={setDataUser} id={item.id} />
            <ChangeUser id={item.id} setDataUser={setDataUser} item={item} />
            <CourseUserRegister item={item} />
          </div>
        ))}
      </div>
    </>
  )
}

export default AllUser
