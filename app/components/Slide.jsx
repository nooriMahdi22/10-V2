import ImageCarousel from './ImageCarousel'

function Slide() {
  const images = [
    '/programmer_04__Converted__generated.jpg',
    '/logog.png',
    '/pingPong.gif',
    // Add more image URLs as needed
  ]

  return (
    <div className="container mx-auto p-4 ">
      <p>hello world</p>
      <ImageCarousel images={images} />
    </div>
  )
}

export default Slide
