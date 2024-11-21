'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const API_URL = 'http://localhost:3001/api/blogs/?limit=3'

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_URL)
      setBlogs(response.data.data.blogs)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setErrorMessage('خطا در بارگذاری بلاگ‌ها')
    }
  }

  return (
    <div>
      <section className="bg-white dark:bg-gray-900 py-10">
        {/* Title Section */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">Discover New Adventures</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore, discover, and find inspiration through these exciting journeys.
          </p>
        </div>
        {/* Content Section */}
        <div className="px-8 py-10 mx-auto lg:max-w-screen-xl sm:max-w-xl md:max-w-full sm:px-12 md:px-16 lg:py-20 sm:py-16">
          <div className="grid gap-x-8 gap-y-12 sm:gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="relative">
                  <Link href={`/blog/${blog._id}`} className="block overflow-hidden group rounded-xl shadow-lg">
                    <Image
                      src={blog.image} // استفاده از تصویر بلاگ
                      className="object-cover w-full h-56 transition-all duration-300 ease-out sm:h-64 group-hover:scale-110"
                      alt={blog.title}
                      width={400} // عرض تصویر
                      height={300} // ارتفاع تصویر
                    />
                  </Link>
                  <div className="relative mt-5">
                    <p className="uppercase font-semibold text-xs mb-2.5 text-purple-600">
                      تاریخ: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/blog/${blog._id}`} className="block mb-3 hover:underline">
                      <h2 className="text-2xl font-bold leading-5 text-black dark:text-white transition-colors duration-200 hover:text-purple-700 dark:hover:text-purple-400">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">{blog.content}</p>
                    <Link
                      href={`/blog/${blog._id}`}
                      className="font-medium underline text-purple-600 dark:text-purple-400"
                    >
                      ادامه مطلب
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">{errorMessage || 'بلاگی وجود ندارد.'}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog
