import Image from 'next/image'
import TypedComponent from './TypedComponent'
import Link from 'next/link'

function MyHomeInfo({ token }) {
  return (
    <div className="w-full h-full  bg-gray-900 dark:bg-gray-200">
      <div className="sm:h-screen overflow-hidden w-full mx-auto py-20 px-4 text-center xl:px-16 xs:px-8 grid sm:flex md:flex-row xs:flex-col gap-4 justify-center items-center pb-10 pt-4">
        <div className="w-full flex justify-center">
          <div className="relative lg:h-[500px] lg:w-[500px] md:h-[300px] md:w-[300px] sm:h-[400px] sm:w-[200px] h-[300px] w-[200px]   mx-auto">
            <Image
              className="rounded-full object-cover"
              src="/2147874105.jpg"
              alt="My Image"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
            />
          </div>
        </div>
        <div className="w-full flex flex-col justify-center gap-7 text-white dark:text-gray-800 md:mt-0 sm:mt-8 xs:mt-4">
          <h1 className="text-4xl font-family-semibold font-">آموزشگاه تفکر خلاق بهترین آموزشگاه سال </h1>
          <h3 className="capitalize text-rose-400 flex items-center justify-center gap-1">
            <span className="text-green-500 dark:text-green-700 inline-block ml-2 typed-container">
              <TypedComponent />
            </span>
            ما
          </h3>

          <p className="text-lg font-family-light leading-7 text-gray-100   mx-auto max-w-4xl  ">
            آموزشگاه فنی و حرفه ای حسابدار به عنوان موسسه های آموزش حسابداری در شهر اصفهان فعالیت میکند و معرفی بکار قوی
            کاراموزان از ویژگی های برتر بودن این موسسه می باشد. آموزشگاه سرای حسابدار به عنوان یکی از بهترین
          </p>

          <div className="sm:mt-4 xs:mt-2">
            <button
              className={`${
                token == 'nothing' ? 'h-0 opacity-0' : 'h-11 opacity-100'
              } px-6 py-2 bg-[#A4FF26] text-black text-lg font-family-bold rounded-sm transition-all duration-700`}
            >
              {token ? <Link href={'/cours'}>ثبت نام دوره </Link> : <Link href={'/logIn'}>ثبت نام و ورود</Link>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyHomeInfo
