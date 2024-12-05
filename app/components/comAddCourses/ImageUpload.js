// import { useState } from 'react'
// import Image from 'next/image'
// import heic2any from 'heic2any'

// const ImageUpload = ({ onChange, error }) => {
//   const [imagePreview, setImagePreview] = useState(null)
//   const [convertedImage, setConvertedImage] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedImage, setSelectedImage] = useState(null)

//   const handleImageChange = async (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       const isHeicOrHeif =
//         file.type === 'image/heic' ||
//         file.type === 'image/heif' ||
//         file.name.toLowerCase().endsWith('.heic') ||
//         file.name.toLowerCase().endsWith('.heif')

//       setIsLoading(true)
//       setSelectedImage(file)

//       if (isHeicOrHeif) {
//         // Convert .heic or .heif to PNG without resizing or compressing
//         const originalFileSize = file.size / (1024 * 1024).toFixed(2)
//         const convertedBlob = await heic2any({
//           blob: file,
//           format: 'image/png', // Convert to PNG
//           quality: 1, // Set quality to 1 to avoid compression
//         })

//         const convertedFile = new File([convertedBlob], 'image.png', {
//           type: 'image/png',
//         })

//         const convertedFileSize = convertedFile.size / (1024 * 1024).toFixed(2)

//         console.log('Original File Size:', originalFileSize, 'MB')
//         console.log('Converted File Size:', convertedFileSize, 'MB')

//         if (convertedFileSize > originalFileSize) {
//           console.log('File size increased after conversion.')
//         } else {
//           console.log('File size did not increase after conversion.')
//         }

//         setConvertedImage(convertedFile)
//         console.log('convertedFile', convertedFile)
//         setImagePreview(URL.createObjectURL(convertedFile))
//         onChange({ target: { name: 'image', value: convertedFile } })
//       } else {
//         setImagePreview(URL.createObjectURL(file))
//         console.log(file)
//         console.log('Original File Size:', file.size / (1024 * 1024).toFixed(2), 'MB')
//         onChange({ target: { name: 'image', value: file } })
//       }

//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-1">
//       <label htmlFor="image" className="block text-sm font-medium text-gray-700 text-right">
//         تصویر دوره
//       </label>
//       <div className="mt-1 flex flex-col items-center">
//         <div className="w-72 h-60 mb-4 relative rounded-lg overflow-hidden bg-gray-100">
//           {isLoading ? (
//             <div className="w-full h-full flex items-center justify-center">
//               <svg className="animate-spin h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 14l9-5-9-5-9 5 9 5z" />
//                 <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//               </svg>
//             </div>
//           ) : imagePreview ? (
//             <Image src={imagePreview} alt="پیش‌نمایش تصویر دوره" layout="fill" objectFit="cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <svg className="h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 14l9-5-9-5-9 5 9 5z" />
//                 <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//               </svg>
//             </div>
//           )}
//         </div>
//         <label
//           htmlFor="image-upload"
//           className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition duration-150 ease-in-out"
//         >
//           {isLoading ? 'در حال بارگذاری...' : 'انتخاب تصویر دوره'}
//         </label>
//         <input
//           id="image-upload"
//           name="image"
//           type="file"
//           className="sr-only"
//           accept="image/*"
//           onChange={handleImageChange}
//           disabled={isLoading}
//         />
//       </div>
//       {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
//     </div>
//   )
// }

// export default ImageUpload

import { useState } from 'react'
import Image from 'next/image'

const ImageUpload = ({ onChange, error }) => {
  const [imagePreview, setImagePreview] = useState(null)
  const [convertedImage, setConvertedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const isHeicOrHeif =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif')

      setIsLoading(true)
      setSelectedImage(file)

      if (isHeicOrHeif) {
        // Dynamically import heic2any on the client-side
        const heic2any = await import('heic2any')

        // Convert .heic or .heif to PNG without resizing or compressing
        const originalFileSize = file.size / (1024 * 1024).toFixed(2)
        const convertedBlob = await heic2any.default({
          blob: file,
          format: 'image/png', // Convert to PNG
          quality: 1, // Set quality to 1 to avoid compression
        })

        const convertedFile = new File([convertedBlob], 'image.png', {
          type: 'image/png',
        })

        const convertedFileSize = convertedFile.size / (1024 * 1024).toFixed(2)

        console.log('Original File Size:', originalFileSize, 'MB')
        console.log('Converted File Size:', convertedFileSize, 'MB')

        if (convertedFileSize > originalFileSize) {
          console.log('File size increased after conversion.')
        } else {
          console.log('File size did not increase after conversion.')
        }

        setConvertedImage(convertedFile)
        console.log('convertedFile', convertedFile)
        setImagePreview(URL.createObjectURL(convertedFile))
        onChange({ target: { name: 'image', value: convertedFile } })
      } else {
        setImagePreview(URL.createObjectURL(file))
        console.log(file)
        console.log('Original File Size:', file.size / (1024 * 1024).toFixed(2), 'MB')
        onChange({ target: { name: 'image', value: file } })
      }

      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor="image" className="block text-sm font-medium text-gray-700 text-right">
        تصویر دوره
      </label>
      <div className="mt-1 flex flex-col items-center">
        <div className="w-72 h-60 mb-4 relative rounded-lg overflow-hidden bg-gray-100">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="animate-spin h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          ) : imagePreview ? (
            <Image src={imagePreview} alt="پیش‌نمایش تصویر دوره" layout="fill" objectFit="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          )}
        </div>
        <label
          htmlFor="image-upload"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition duration-150 ease-in-out"
        >
          {isLoading ? 'در حال بارگذاری...' : 'انتخاب تصویر دوره'}
        </label>
        <input
          id="image-upload"
          name="image"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
    </div>
  )
}

export default ImageUpload
