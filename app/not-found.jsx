import Link from 'next/link'

function NotFound() {
  return (
    <div className="bg-orange-50 h-dvh flex items-center justify-center">
      <main className="container mx-auto px-4 text-center pt-12 md:pt-20">
        <h1 className="text-6xl lg:text-8xl font-bold text-orange-600 mb-6" aria-label="404 - Page not found">
          4<span className="inline-block">0</span>4
        </h1>
        <p className="text-xl lg:text-2xl text-orange-800 mb-8">صفحه مورد نظر یافت نشد</p>
        <Link
          href="/"
          className="inline-block py-3 px-6 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition duration-300 mb-12 focus:outline-none focus:ring-2 focus:ring-orange-300"
          aria-label="Go back to home page"
        >
          صفحه اصلی
        </Link>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto" aria-hidden="true">
          {/* Grid of animated squares */}
        </div>
      </main>
    </div>
  )
}

export default NotFound
