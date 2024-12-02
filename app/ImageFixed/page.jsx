import Image from 'next/image'

function ImageFixed() {
  return (
    <>
      <div className="relative">
        <div className="w-full h-[300px] absolute z-10 top-0 bg-blue-400">1</div>
        <div className="">
          <Image alt="hi" src="/2147874105.jpg" className="-z-10 absolute " width={1000} height={1000}></Image>
        </div>
        <div className="w-full h-[300px] absolute z-10 bottom-0 bg-blue-400">1</div>
      </div>
      <div className=" w-full h-[400px] bg-red-500">hi</div>
    </>
  )
}

export default ImageFixed
