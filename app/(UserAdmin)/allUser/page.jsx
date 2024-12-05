'use client'

import ChangeUser from '@/app/components/userAdmin/ChangeUser'
import DeleteUser from '@/app/components/userAdmin/DeleteUser'
import { ToastNotifications } from '@/app/utils/alert'
import axios from 'axios'
import { useEffect, useState } from 'react'

function AllUser({ limitNumber }) {
  const [dataUser, setDataUser] = useState([])
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
      setDataUser(response.data.data.users)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleDataCours()
  }, [])

  if (isLoading) {
    return <div>loading...</div>
  }

  if (!dataUser) {
    return <div>کاربری یافت نشد</div>
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-2 text-center">
        {dataUser.map((item) => (
          <div key={item?.id} className="flex flex-col p-2 bg-gray-100 gap-4">
            <p>name: {item?.name}</p>
            <p>age: {item?.age}</p>
            <p>phone: {item?.phoneNumber}</p>
            <p>role: {item?.role}</p>
            <DeleteUser dataUser={dataUser} setDataUser={setDataUser} id={item.id} />
            <ChangeUser id={item.id} setDataUser={setDataUser} item={item} />
          </div>
        ))}
      </div>
    </>
  )
}

export default AllUser
