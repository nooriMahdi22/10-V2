import { convertToShamsi } from '@/app/components/convertDate/ConvertDate'
import { changeToPersianNum, formatNumberWithComma } from '@/app/components/Help'
import axios from 'axios'
import Image from 'next/image'

async function getDataCourse(id) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${id}`, {
    next: { revalidate: 3600 },
  })

  if (!response.data) {
    throw new Error('چیزی اشتباه است')
  }
  return response.data.data.course
}

async function ItemCourses({ params }) {
  const { id } = params
  const data = await getDataCourse(id)

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col lg:flex-row lg:space-x-8 rtl:space-x-reverse">
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-right">{data.title}</h1>
          <p className="text-gray-600 mb-6 text-right leading-relaxed">{data.content}</p>

          <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-right">جزئیات دوره</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon="👥" label="ظرفیت" value={`${changeToPersianNum(data?.capacity)} نفر`} />
              <InfoItem icon="🕒" label="مدت زمان" value={`${changeToPersianNum(data?.duration)} ساعت`} />{' '}
              {/* اضافه کردن مدت زمان */}
              <InfoItem icon="👨‍🏫" label="مدرس" value={data?.instructor?.name || 'مشخص نشده'} />
              <InfoItem icon="🗓️" label="شروع دوره" value={convertToShamsi(data?.startDate)} />
              <InfoItem icon="🏁" label="پایان دوره" value={convertToShamsi(data?.endDate)} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2 text-right">توضیحات دوره:</h2>
            <p className="text-gray-600 text-right leading-relaxed">{data?.description}</p>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-6 space-y-6">
            {data.image && (
              <Image
                width={400}
                height={300}
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/img/courses/${data.image}`}
                alt={data.title}
                className="rounded-lg shadow-md w-full object-cover"
              />
            )}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <PriceInfo formattedPrice={changeToPersianNum(formatNumberWithComma(data?.price))} />
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4 font-semibold">
                ثبت نام در دوره
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
    <div dir="rtl" className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium text-gray-700">{label}:</span>
      </div>
      <span className="text-gray-600">{value}</span>
    </div>
  )
}

function PriceInfo({ formattedPrice }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-600 mb-2">{formattedPrice} تومان</div>
      <div className="text-sm text-gray-500">قیمت دوره</div>
    </div>
  )
}

export default ItemCourses
