'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { convertToShamsi } from '../convertDate/ConvertDate'
import DeleteCourseUserRegister from './DeleteCourseUserRegister'

function CourseUserRegister({ item }) {
  const [dataCUserR, setDataCUserR] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [hiddenR, setHiddenR] = useState(false)

  async function handleDataUser() {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${item.id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      })
      console.log('response dataCUserR', response.data.data.user.enrollments)
      setDataCUserR(response.data.data.user.enrollments)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (hiddenR) {
      handleDataUser()
    }
  }, [hiddenR])

  function handleHiddenR(params) {
    setIsLoading(true)
    setHiddenR(true)
  }

  if (isLoading) {
    return (
      <div>
        <button className="bg-blue-400 text-white p-2 rounded-lg">
          <p>loading...</p>
        </button>
      </div>
    )
  }

  if (!hiddenR) {
    return (
      <div>
        <button onClick={handleHiddenR} className="bg-blue-400 text-white p-2 rounded-lg">
          <button>show register</button>
        </button>
      </div>
    )
  }

  if (dataCUserR.length > 0) {
    return (
      <>
        {hiddenR && (
          <div className={`grid grid-cols-2 gap-2 `}>
            {dataCUserR.map((item) => (
              <ul className="bg-blue-200 text-gray-900 p-2 rounded-lg" key={item?.id}>
                <li>{item?.course?.title}</li>
                <li>{convertToShamsi(item?.course?.startDate)}</li>

                <DeleteCourseUserRegister item={item} dataCUserR={dataCUserR} setDataCUserR={setDataCUserR} />
              </ul>
            ))}
          </div>
        )}
      </>
    )
  }

  if (!isLoading && hiddenR) {
    return <div>do not have register</div>
  }

  return <div></div>
}

export default CourseUserRegister
