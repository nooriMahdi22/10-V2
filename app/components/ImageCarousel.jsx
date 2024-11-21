'use client'

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

// start install with =>  npm install embla-carousel-react

const ImageCarousel = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    // in this code we can change width and padding
    <div className="relative max-w-md mx-auto p-4 ">
      <div className="overflow-hidden " ref={emblaRef}>
        <div className="flex ">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] min-w-0 " key={index}>
              {/* in this code we can change height  */}
              <div className="relative h-64 m-1">
                <Image cla src={src} alt={`Slide ${index + 1}`} fill className="object-cover rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={scrollPrev}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={scrollNext}
      >
        &#10095;
      </button>
    </div>
  )
}

export default ImageCarousel
